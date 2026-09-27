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
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/success'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
