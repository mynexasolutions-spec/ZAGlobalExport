import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getSeo, getHeadTags } from '../seo/seo';
import { getProducts } from '../services/productsService';

/**
 * Keeps <head> (title, description, canonical, Open Graph, JSON-LD) in sync
 * with the current route. Prerendered pages already ship the correct tags,
 * so the first run is skipped when the head was rendered for this path.
 */
function SeoManager() {
  const { pathname } = useLocation();
  const isFirstRun = useRef(true);

  useEffect(() => {
    const prerenderedPath = document.querySelector('title[data-seo-path]')?.getAttribute('data-seo-path');
    if (isFirstRun.current) {
      isFirstRun.current = false;
      if (prerenderedPath === pathname) return;
    }

    const tags = getHeadTags(getSeo(pathname, getProducts()));
    document.head.querySelectorAll('[data-seo]').forEach((el) => el.remove());

    for (const [tag, attrs, text] of tags) {
      const el = document.createElement(tag);
      for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
      if (text) el.textContent = text;
      document.head.appendChild(el);
    }
  }, [pathname]);

  return null;
}

export default SeoManager;
