# בוטניקה — botanicanature.com

A rebuild of the Botanica (Pazit Harnoy Cohen) website off Webflow, as a static
[Astro](https://astro.build) site. RTL Hebrew. Cart + PayPal checkout via
[Snipcart](https://snipcart.com). Hosted on Netlify; contact form via Netlify Forms.

## Local development

```bash
npm install
cp .env.example .env    # then paste your Snipcart TEST key into it
npm run dev             # http://localhost:4321
npm run build           # static output in dist/
```

Astro 7's `npm run dev` runs as a background daemon. Manage it with
`npx astro dev stop` / `npx astro dev status` / `npx astro dev logs`.

## Where content lives

| What | Where |
|---|---|
| Products | `src/content/products/*.md` (one file per product) |
| Flora index entries | `src/content/flora/*.md` |
| Workshops | `src/content/workshops/*.md` |
| Nav, footer, contact details, promo banner, categories | `src/data/site.ts` |
| Clinic page copy | `src/pages/the-clinic.astro` (inline) |
| Product / flora images | `public/images/` (kept out of the build pipeline so Snipcart can crawl product images at stable URLs) |

Product `id` (filename) = the URL slug, and matches the original Webflow slugs so old
links keep working. `src/content.config.ts` defines the schema for each collection.

## Snipcart (cart + PayPal)

1. Create a Snipcart account. In **Account → API Keys**, copy the **public** key.
2. Put it in `PUBLIC_SNIPCART_KEY` — `.env` locally, and as an env var in Netlify.
   Use the **TEST** key until launch, then swap to the **LIVE** key.
3. In the Snipcart dashboard:
   - **Payment gateway:** connect PayPal (needs a PayPal **Business** account).
   - **Currency:** ILS.
   - **Shipping:** add the rate(s) Pazit charges.
   - **Domains:** add `www.botanicanature.com` (and the Netlify preview domain) to the
     allowed list before going live.
   - **Discounts:** re-create the seasonal "30% off" as a discount code if wanted.
4. Snipcart crawls each `data-item-url` (`/product/<slug>`) to validate the price, so the
   product pages must be publicly reachable before a live purchase works.

Without a key set, the store still renders and product pages show a
"contact to order" button instead of add-to-cart.

## Contact form

Uses Netlify Forms (`name="contact"`, `data-netlify="true"`). After deploy, in Netlify:
**Forms → contact → Settings → Notifications** — add the email address that should
receive submissions (set this in `src/data/site.ts` `contact.email` for reference too),
and optionally an autoresponder. Submissions redirect to `/thank-you`.

## Deploy (Netlify)

- `netlify.toml` is set up (`npm run build` → `dist/`, plus 301s for old Webflow paths).
- Connect this repo in Netlify → deploys to a `*.netlify.app` URL for review.
- **Launch / DNS cutover** (do last, together):
  1. Set `site` in `astro.config.mjs` and `site.url` in `src/data/site.ts` to the final URL (already `https://www.botanicanature.com`).
  2. Netlify → Domain settings → add `botanicanature.com` + `www`.
  3. At the domain registrar, point DNS from Webflow to Netlify (Netlify shows the exact records). Netlify issues TLS automatically.
  4. Add the live domain in Snipcart; switch `PUBLIC_SNIPCART_KEY` to the live key.
  5. Keep the Webflow site published until DNS has propagated, then unpublish.

## Still to confirm with Pazit

- Real product photos / copy / volumes / stock (current data was reconstructed from the
  live site). Search the repo for `TODO`.
- The age-variant dropdown on some oils (currently on `hdy-stdy`, `st-rb-tslkhvt-mvqvt`,
  `easy-breezy`, `tummy-calmy`).
- Facebook page URL (`src/data/site.ts`).
- Flora index — only 3 plants exist; add more `.md` files as written.
