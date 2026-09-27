// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

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
      filter: (page) => !page.includes('/success'),
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
