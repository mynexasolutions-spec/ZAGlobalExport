/**
 * seo.js
 *
 * Single source of truth for page-level SEO (title, description, canonical,
 * Open Graph, structured data). Used in two places:
 *  - <SeoManager /> updates <head> on client-side navigation
 *  - scripts/prerender.js bakes the same tags into each prerendered HTML file
 *
 * Keep this file free of browser-only APIs so it can run in Node.
 */

export const SITE_URL = 'https://www.zaglobalimpex.com';
export const SITE_NAME = 'ZA Global Exports';
export const DEFAULT_IMAGE = '/og-image.jpg';

// Public routes that are prerendered and listed in sitemap.xml.
// Product detail routes (/products/:id) are added from the product list.
export const STATIC_ROUTES = [
  '/',
  '/about',
  '/products',
  '/quality-food-safety',
  '/markets',
  '/export-logistics',
  '/contact',
];

const PAGES = {
  '/': {
    title: 'ZA Global Exports | Indian Rice, Spices & Food Products Exporter',
    description:
      'ZA Global Exports (ZA Global Impex) is an Indian food export company supplying basmati rice, pulses, spices, edible oils and fresh produce to buyers in the GCC, Europe and Africa.',
  },
  '/about': {
    title: 'About Us – Indian Food Export Company | ZA Global Exports',
    description:
      'ZA Global Exports is an ISO-certified Indian food export company supplying rice, pulses, spices and fresh produce to importers, distributors and foodservice buyers worldwide.',
    crumb: 'About Us',
  },
  '/products': {
    title: 'Export Products: Rice, Pulses, Spices & Edible Oils | ZA Global Exports',
    description:
      'Indian food products for export: basmati and non-basmati rice, pulses and lentils, whole and ground spices, refined edible oils, bananas and fresh produce. Bulk and private label.',
    crumb: 'Products',
  },
  '/quality-food-safety': {
    title: 'Quality & Food Safety Standards | ZA Global Exports',
    description:
      'How ZA Global Exports manages quality and food safety: supplier selection, specification checks, FSSAI, APEDA, ISO 22000 and HACCP compliant sourcing for Indian food exports.',
    crumb: 'Quality & Food Safety',
  },
  '/markets': {
    title: 'Export Markets – Saudi Arabia, UAE, GCC, Europe & Africa | ZA Global Exports',
    description:
      'We export Indian food products to Saudi Arabia, UAE, Qatar, Kuwait, Oman, Bahrain, Europe, Africa and the Americas, with sourcing, documentation and logistics support.',
    crumb: 'Markets',
  },
  '/export-logistics': {
    title: 'Export & Logistics Support from India | ZA Global Exports',
    description:
      'From procurement and quality checks to export documentation, container loading and shipping – how ZA Global Exports coordinates food exports from India to your port.',
    crumb: 'Export & Logistics',
  },
  '/contact': {
    title: 'Contact Us & Request a Quote | ZA Global Exports',
    description:
      'Request a quote for Indian rice, pulses, spices, edible oils or fresh produce. Call or WhatsApp +91 99456 36964 or email info@zaglobalimpex.com.',
    crumb: 'Contact',
  },
};

// Keyword-focused titles for the known product categories. Products added
// later from the admin panel fall back to a title built from product.title.
const PRODUCT_TITLES = {
  rice: 'Basmati & Non-Basmati Rice Exporter from India | ZA Global Exports',
  'pulses-legumes': 'Pulses, Lentils & Chickpeas Exporter from India | ZA Global Exports',
  'fresh-produce': 'Cavendish Banana & Fresh Produce Exporter India | ZA Global Exports',
  spices: 'Indian Spices Exporter – Whole & Ground Spices | ZA Global Exports',
  'edible-oils': 'Refined Edible Oil Exporter from India | ZA Global Exports',
  'other-food-products': 'Indian Food Commodities Sourcing & Export | ZA Global Exports',
};

export function absoluteUrl(path) {
  if (!path) return SITE_URL + '/';
  if (/^https?:\/\//i.test(path)) return path;
  return SITE_URL + encodeURI(path.startsWith('/') ? path : '/' + path);
}

function clip(text, max = 160) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
}

function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function normalizePath(pathname) {
  const path = (pathname || '/').split(/[?#]/)[0];
  return path.length > 1 ? path.replace(/\/+$/, '') : '/';
}

/**
 * Returns SEO data for a pathname.
 * @param {string} pathname
 * @param {Array} products  product list (same shape as productsService)
 */
export function getSeo(pathname, products = []) {
  const path = normalizePath(pathname);

  if (path === '/admin' || path.startsWith('/admin/')) {
    return { title: `Admin | ${SITE_NAME}`, description: '', robots: 'noindex, nofollow' };
  }

  const page = PAGES[path];
  if (page) {
    return {
      title: page.title,
      description: page.description,
      canonical: absoluteUrl(path),
      image: DEFAULT_IMAGE,
      jsonLd: page.crumb
        ? [breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: page.crumb, path }])]
        : [],
    };
  }

  const productMatch = path.match(/^\/products\/([^/]+)$/);
  if (productMatch) {
    const id = decodeURIComponent(productMatch[1]).toLowerCase();
    const product = products.find((p) => String(p.id).toLowerCase() === id);
    if (!product) {
      return {
        title: `Products | ${SITE_NAME}`,
        description: PAGES['/products'].description,
        canonical: absoluteUrl(path),
        image: DEFAULT_IMAGE,
      };
    }
    const productPath = `/products/${product.id}`;
    return {
      title: PRODUCT_TITLES[product.id] || `${product.title} – Export from India | ${SITE_NAME}`,
      description: clip(
        `${product.summary || product.title} Export from India by ${SITE_NAME}. Bulk and private label supply.`
      ),
      canonical: absoluteUrl(productPath),
      image: product.mainImage || product.cardImage || DEFAULT_IMAGE,
      type: 'product',
      jsonLd: [
        breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Products', path: '/products' },
          { name: product.title, path: productPath },
        ]),
      ],
    };
  }

  return {
    title: `Page Not Found | ${SITE_NAME}`,
    description: '',
    robots: 'noindex, follow',
  };
}

/**
 * Converts SEO data into a list of head tags: [tagName, attributes, text?].
 * Every tag carries data-seo so the client can replace them on navigation.
 */
export function getHeadTags(seo) {
  const tags = [['title', {}, seo.title]];
  const meta = (key, name, content) => {
    if (content) tags.push(['meta', { [key]: name, content }]);
  };

  meta('name', 'description', seo.description);
  meta('name', 'robots', seo.robots || 'index, follow, max-image-preview:large');
  if (seo.canonical) tags.push(['link', { rel: 'canonical', href: seo.canonical }]);

  if (!seo.robots?.startsWith('noindex')) {
    const image = absoluteUrl(seo.image || DEFAULT_IMAGE);
    meta('property', 'og:type', seo.type === 'product' ? 'product' : 'website');
    meta('property', 'og:site_name', SITE_NAME);
    meta('property', 'og:locale', 'en_US');
    meta('property', 'og:title', seo.title);
    meta('property', 'og:description', seo.description);
    meta('property', 'og:url', seo.canonical);
    meta('property', 'og:image', image);
    meta('name', 'twitter:card', 'summary_large_image');
    meta('name', 'twitter:title', seo.title);
    meta('name', 'twitter:description', seo.description);
    meta('name', 'twitter:image', image);
  }

  for (const data of seo.jsonLd || []) {
    tags.push(['script', { type: 'application/ld+json' }, JSON.stringify(data)]);
  }

  return tags.map(([tag, attrs, text]) => [tag, { 'data-seo': '', ...attrs }, text]);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Serializes head tags to an HTML string (used at build time). */
export function headTagsToHtml(tags) {
  return tags
    .map(([tag, attrs, text]) => {
      const attrString = Object.entries(attrs)
        .map(([k, v]) => (v === '' ? ` ${k}` : ` ${k}="${escapeHtml(v)}"`))
        .join('');
      if (tag === 'meta' || tag === 'link') return `<${tag}${attrString} />`;
      // JSON-LD must not be HTML-escaped, only guarded against "</script>".
      const body = tag === 'script' ? text.replace(/</g, '\\u003c') : escapeHtml(text);
      return `<${tag}${attrString}>${body}</${tag}>`;
    })
    .join('\n    ');
}
