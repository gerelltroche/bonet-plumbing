// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

// <lastmod> for the sitemap: the later of the page file's last commit and the
// last reviews refresh (every page shows the Reviews section). A date that
// only moves when the page really changes is one Google keeps trusting.
const reviewsFetchedAt = JSON.parse(readFileSync('./src/data/reviews.json', 'utf-8')).fetchedAt;
function lastmod(url) {
  const path = new URL(url).pathname.replace(/\/$/, '');
  const file = [`src/pages${path}.astro`, `src/pages${path}/index.astro`].find(existsSync);
  let committed = '';
  if (file) {
    try {
      committed = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], { encoding: 'utf-8' }).trim();
    } catch {}
  }
  return committed > reviewsFetchedAt ? committed : reviewsFetchedAt;
}

// https://astro.build/config
export default defineConfig({
  site: 'https://bonetplumbing.com',
  // Netlify serves /repiping/index.html at /repiping/ and 301s the slash-less
  // variant to it (see netlify.toml). Declaring it here makes canonicals,
  // the sitemap, and the dev server all agree on the trailing-slash form.
  trailingSlash: 'always',
  // English is unprefixed, Spanish lives under /es/ with the same slugs
  // (src/pages/es/*). Shared components pick their strings from the URL via
  // src/i18n, and Layout emits hreflang alternates for every page.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      // Conversion pages are noindexed; keep them out of the sitemap too.
      filter: (page) => !page.includes('/success') && !page.includes('/quote/'),
      serialize: (item) => ({ ...item, lastmod: lastmod(item.url) }),
      // Adds <xhtml:link rel="alternate" hreflang> entries so the Spanish
      // pages are listed as translations of their English twins.
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-US', es: 'es-US' },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
