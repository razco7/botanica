import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Served at the apex/www domain via GitHub Pages (public/CNAME).
// No `base` needed because it's a custom domain, not a project path.
export default defineConfig({
  site: 'https://www.botanicanature.com',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // keep transactional / thin pages out of the sitemap (they're noindex too)
      filter: (page) =>
        !['/cart/', '/thank-you/', '/order-confirmation/'].some((p) =>
          page.endsWith(p),
        ),
    }),
  ],

  // Static redirects for old Webflow URLs. Astro emits a small HTML redirect
  // page for each in the static build (GitHub Pages has no server-side redirects).
  redirects: {
    '/category/bach': '/store/bach',
    '/category/ceramic': '/store/ceramic',
    '/category/oils': '/store/oils',
    '/flora/levander': '/flora/lavender',
    '/checkout': '/store',
  },
});
