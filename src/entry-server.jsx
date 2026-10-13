/**
 * Server entry used only at build time by scripts/prerender.js to render each
 * public route to static HTML, so search engines get real content without
 * having to run JavaScript.
 */
/* eslint-disable react/only-export-components -- build-time module, never hot reloaded */
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { refreshProductsFromSupabase } from './services/productsService';
import { refreshHomepageSettings } from './services/homepageService';

export { STATIC_ROUTES, SITE_URL, getSeo, getHeadTags, headTagsToHtml, absoluteUrl } from './seo/seo';

/**
 * Loads the latest products and homepage settings from Supabase into the
 * (shimmed) localStorage cache so the render below uses live content.
 * Falls back to the bundled static data when Supabase is unreachable.
 */
export async function loadData() {
  const products = await refreshProductsFromSupabase();
  await refreshHomepageSettings().catch(() => {});
  return products;
}

export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
}
