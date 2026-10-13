/**
 * prerender.js — runs after `vite build` and `vite build --ssr`.
 *
 * For every public route it writes a static HTML file into dist/ containing
 * the fully rendered page plus route-specific SEO tags, then generates
 * dist/sitemap.xml. Vercel serves these files first (cleanUrls maps
 * /about -> about.html); anything else falls back to dist/app-shell.html.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const serverEntry = path.join(root, 'dist-server', 'entry-server.js');

// The app caches Supabase data in localStorage; give Node an in-memory one
// so the render uses the data fetched by loadData().
const memoryStore = new Map();
globalThis.localStorage = {
  getItem: (key) => (memoryStore.has(key) ? memoryStore.get(key) : null),
  setItem: (key, value) => memoryStore.set(key, String(value)),
  removeItem: (key) => memoryStore.delete(key),
  clear: () => memoryStore.clear(),
  key: (i) => [...memoryStore.keys()][i] ?? null,
  get length() {
    return memoryStore.size;
  },
};

const {
  render,
  loadData,
  STATIC_ROUTES,
  SITE_URL,
  getSeo,
  getHeadTags,
  headTagsToHtml,
  absoluteUrl,
} = await import(pathToFileURL(serverEntry).href);

const SEO_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;
const ROOT_DIV = '<div id="root"></div>';

const template = await fs.readFile(path.join(distDir, 'index.html'), 'utf8');
if (!SEO_BLOCK.test(template) || !template.includes(ROOT_DIV)) {
  throw new Error('dist/index.html is missing the <!--seo:start/end--> markers or the root div.');
}

// SPA fallback for routes that are not prerendered (admin, unknown URLs,
// products added after the last deploy).
await fs.writeFile(
  path.join(distDir, 'app-shell.html'),
  template.replace(/<!--seo:(start|end)-->\n?\s*/g, '')
);

const products = await loadData();
const productRoutes = products.map((p) => `/products/${p.id}`);
const routes = [...STATIC_ROUTES, ...productRoutes];

function outputFile(route) {
  return route === '/' ? 'index.html' : `${route.slice(1)}.html`;
}

let failures = 0;
for (const route of routes) {
  const tags = getHeadTags(getSeo(route, products));
  tags[0][1]['data-seo-path'] = route; // lets SeoManager skip its first run
  const head = headTagsToHtml(tags);

  let appHtml = '';
  try {
    appHtml = render(route);
  } catch (err) {
    failures++;
    console.warn(`[prerender] ${route}: render failed, serving head tags only –`, err.message);
  }

  const html = template
    .replace(SEO_BLOCK, () => head)
    .replace(ROOT_DIV, () => `<div id="root">${appHtml}</div>`);

  const file = path.join(distDir, outputFile(route));
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, html);
}

// --- sitemap.xml ---------------------------------------------------------
const xmlEscape = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const urlEntry = (loc, { lastmod, images = [] } = {}) => {
  const parts = [`    <loc>${xmlEscape(loc)}</loc>`];
  if (lastmod) parts.push(`    <lastmod>${lastmod}</lastmod>`);
  for (const img of images) {
    parts.push(`    <image:image><image:loc>${xmlEscape(absoluteUrl(img))}</image:loc></image:image>`);
  }
  return `  <url>\n${parts.join('\n')}\n  </url>`;
};

const entries = [
  ...STATIC_ROUTES.map((route) => urlEntry(route === '/' ? `${SITE_URL}/` : SITE_URL + route)),
  ...products.map((p) => {
    const images = [p.mainImage, ...(p.categoryImages || []).map((c) => c.src)].filter(Boolean);
    const lastmod = p.updatedAt ? new Date(p.updatedAt).toISOString().slice(0, 10) : undefined;
    return urlEntry(`${SITE_URL}/products/${encodeURIComponent(p.id)}`, {
      lastmod,
      images: [...new Set(images)],
    });
  }),
];

await fs.writeFile(
  path.join(distDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join('\n')}
</urlset>
`
);

console.log(
  `[prerender] ${routes.length - failures}/${routes.length} pages prerendered, sitemap.xml has ${entries.length} URLs.`
);
// The Supabase client can keep timers alive; we're done.
process.exit(0);
