import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Update `site` to the final production URL before the DNS cutover.
export default defineConfig({
  site: 'https://www.botanicanature.com',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
});
