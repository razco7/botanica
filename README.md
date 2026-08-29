# בוטניקה — botanicanature.com

A rebuild of the Botanica (Pazit Harnoy Cohen) website off Webflow, as a static
[Astro](https://astro.build) site. RTL Hebrew. Hosted on **GitHub Pages**. Contact form
via [Web3Forms](https://web3forms.com). Shop cart is browser-side (localStorage) with
**PayPal** JS-SDK checkout — no server, no monthly fee.

Repo: `github.com/razco7/botanica` (public).

## Local development

```bash
npm install
cp .env.example .env    # optional — Web3Forms + PayPal keys for the form/shop
npm run dev             # http://localhost:4321 (or next free port)
npm run build           # static output in dist/
```

Astro's `npm run dev` runs as a background daemon. Manage it with
`npx astro dev stop` / `npx astro dev status` / `npx astro dev logs`.

## Where content lives

| What | Where |
|---|---|
| Products | `src/content/products/*.md` (one file per product) |
| Flora index entries | `src/content/flora/*.md` |
| Workshops | `src/content/workshops/*.md` |
| Nav, footer, contact details, promo banner, categories, keys | `src/data/site.ts` |
| Clinic page copy | `src/pages/the-clinic.astro` (inline) |
| Images | `public/images/` (plain files, stable URLs for PayPal line items) |
| Old-URL redirects | `redirects` in `astro.config.mjs` (Astro emits a redirect page for each) |

Product `id` (filename) = the URL slug, matching the original Webflow slugs so old links
keep working. `src/content.config.ts` defines the schema for each collection.

## Hosting — GitHub Pages

`.github/workflows/deploy.yml` builds the site and deploys it on every push to `main`.
`public/CNAME` pins the custom domain `www.botanicanature.com`.

**One-time setup (GitHub repo → Settings):**

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. **Settings → Secrets and variables → Actions** — add:
   - `PUBLIC_WEB3FORMS_KEY` — contact-form + order-email key (see below)
   - `PUBLIC_PAYPAL_CLIENT_ID` — shop checkout (see below)
3. Push to `main` → the Action builds and publishes.

Until DNS is switched, the deployed site isn't reachable at the custom domain. To preview
it earlier without touching the live site, add a DNS record at the registrar:
`preview  CNAME  razco7.github.io`, set that subdomain in Settings → Pages, and change
`public/CNAME` + `site` in `astro.config.mjs` to match — then switch both back to `www`
at launch.

**Launch / DNS cutover (do last):**

1. GitHub → Settings → Pages → Custom domain: `www.botanicanature.com`.
2. At the domain registrar, point DNS to GitHub Pages:
   - `A` records for the apex `botanicanature.com` → `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`
   - `CNAME` for `www` → `razco7.github.io`
3. Tick **Enforce HTTPS** once the cert is issued.
4. Keep the Webflow site published until DNS has propagated, then unpublish it.

## Contact form (Web3Forms)

GitHub Pages can't process form posts, so the form submits to Web3Forms (free, no
server, no account beyond an email confirmation).

1. Go to <https://web3forms.com>, enter `hello@botanicanature.com`, confirm the email.
2. Copy the **access key** into `PUBLIC_WEB3FORMS_KEY` (`.env` locally, Actions secret for
   deploys).
3. Submissions e-mail to `hello@botanicanature.com` and the user is redirected to
   `/thank-you`.

Without the key, the form renders but shows an "email us directly" note instead.

## Shop — cart + PayPal checkout

The cart lives in `localStorage` (`src/lib/cart.ts`). `/cart` renders the line items and
mounts PayPal's JS-SDK Smart Buttons (`src/lib/cart-page.ts`). No server, no platform fee
— you only pay PayPal's per-transaction fee.

**Setup:**

1. Open a **PayPal Business** account. At [developer.paypal.com](https://developer.paypal.com)
   → **Apps & Credentials** → create a Merchant app → copy the **Client ID**.
2. Put it in `PUBLIC_PAYPAL_CLIENT_ID` — `.env` for local dev, Actions secret for deploys.
   Sandbox client ID while testing, **Live** client ID at launch.
3. Config in `src/data/site.ts` → `shop`: `currency` (ILS), `fulfilment` (`'pickup'` —
   no shipping fee, no address collected; switch to `'shipping'` + set `shipping.fee` /
   `freeOver` when she ships), `vat` (false — עוסק פטור).
4. Each completed order is also emailed to `hello@botanicanature.com` via Web3Forms
   (reuses `PUBLIC_WEB3FORMS_KEY`), plus PayPal's own receipt to buyer + seller.

Without a client ID: the store still renders, product pages show a "contact to order"
button, and the header cart icon is hidden.

**Testing:** use a PayPal **sandbox** buyer account (developer.paypal.com → Sandbox →
Accounts) to run a full fake checkout.

**Price integrity:** totals are computed in the browser, so a determined user could
tamper with them before paying. Acceptable for a small handmade shop (same risk as
PayPal's own button generator); revisit with a serverless order-verify function if
volume grows.

## Data provenance

All product names, prices, summaries, descriptions, volumes, stock, categories and photos
were pulled directly from the live Webflow site (product JSON-LD + rendered CMS content +
the CDN originals — 1400×1400 for oils/Bach, 1106×1325 for ceramics; that's the source
resolution). Clinic-page method images are 1024×526 on the live site; the hero is 1536×857.

## Confirmed

- Facebook: `https://www.facebook.com/profile.php?id=61585424797847`
- Contact email: `hello@botanicanature.com`
- Checkout: PayPal JS SDK + browser cart, **pickup only**, no VAT (עוסק פטור).
  **LIVE** client ID is set as the GitHub Actions secret (real money on the deployed
  site); local `.env` keeps the **sandbox** key so `npm run dev` never charges.
  Order number = a 6-digit code derived from the PayPal order id.

## Still to confirm

- Whether higher-resolution photo originals exist (Webflow CDN maxes at 1400px).
- Age-variant dropdown wording — captured as
  `תינוקות (חצי שנה עד שנתיים) / ילדים (2-6 שנים) / ילדים בוגרים (6-10 שנים) / בוגרים (גילאי 10 ומעלה)`,
  on `hdy-stdy`, `st-rb-tslkhvt-mvqvt`, `easy-breezy`, `tummy-calmy`.
- Flora index — only 3 plants exist; add more `.md` files as needed.
- Consultation & ceramic products have no long description on the live site; short blurbs
  here fill the gap — reword freely.
