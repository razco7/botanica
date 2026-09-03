# CLAUDE.md — project context

Context for AI assistants working in this repo. Human setup/deploy docs are in
[`README.md`](./README.md); don't duplicate them here.

## What this is

A **static [Astro](https://astro.build) site** for **בוטניקה / Botanica** — Pazit Harnoy
Cohen's natural-healing practice in Hadera (herbal medicine, Bach flowers, aromatherapy,
handmade oils, ceramics, workshops, a plant guide, and a small shop). It's a rebuild of
her old Webflow site, live at **https://www.botanicanature.com**.

- **RTL Hebrew.** `<html lang="he" dir="rtl">`. All UI copy is Hebrew. Use logical CSS
  properties (`margin-inline-start`, `inset-inline-end`, flex `order`) — never `left`/`right`.
- **No backend.** No server, no database, no CMS, no admin. Everything the site renders is
  a flat file in this repo. The cart is `localStorage`; checkout is PayPal's JS SDK;
  the contact form and order emails go through Web3Forms.
- **Owner won't edit content** — the user (Raz) asks Claude to make content/design changes.
- Hosted on **GitHub Pages** (`razco7/botanica`, public), auto-deployed by
  `.github/workflows/deploy.yml` on every push to `main`.

## Where things live

| Change this… | …here |
|---|---|
| Product (name, price, summary, image, stock, variant) | `src/content/products/<slug>.md` |
| Plant-guide entry | `src/content/flora/<slug>.md` |
| Workshop | `src/content/workshops/<slug>.md` |
| Nav, footer links, contact details, categories, promo banner, shop config | `src/data/site.ts` |
| Collection schemas | `src/content.config.ts` (**not** `src/content/config.ts`) |
| Clinic page copy + treatment methods | `src/pages/the-clinic.astro` (inline frontmatter) |
| Global design tokens & base styles | `src/styles/global.css` |
| `<head>`, JSON-LD, GA, layout shell | `src/layouts/Base.astro` |
| Old-Webflow-URL redirects | `redirects` in `astro.config.mjs` |
| Images | `public/images/…` (plain files — stable URLs needed for PayPal line items) |
| Fonts | `public/fonts/…` (self-hosted Rubik woff2) |

A product/flora/workshop file's **filename is its URL slug**, matched to the original
Webflow slugs so inbound links keep working.

## Conventions

- **Astro 7 content collections** use the glob loader: `entry.id` (not `.slug`),
  `render(entry)` from `astro:content` (not `entry.render()`).
- **Font is Rubik** (self-hosted, Hebrew+Latin, weights 400/500/700). No `letter-spacing`
  anywhere — it was deliberately removed site-wide.
- Design tokens: `--ink:#1a1b1f` on `--bg:#fff`, rose accent `--accent:#db4b68`,
  `--dim:0.6` for secondary text. Buttons `--radius-btn:4px`, cards `--radius-card:16px`.
- Styling was rebuilt against the **real Webflow CSS** saved at
  `reference/original-webflow.css` — match that, not guesses. Reference HTML snapshots
  are in `reference/` too.
- **JSX whitespace trap:** Astro drops whitespace between text and an inline element when
  they're on separate lines. Put a space before a line-ending link with `{' '}`
  (e.g. `…דרך{' '}\n<a>…</a>`). This has bitten us repeatedly.
- Transactional pages (`/cart`, `/thank-you`, `/order-confirmation`) pass `noindex` to
  `<Base>` and are excluded from the sitemap in `astro.config.mjs`.
- Commits: author `Raz Cohen <razco7@gmail.com>`, message ends with
  `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`. Push to `main` = deploy.

## Shop specifics

- **Pickup only.** No shipping fee, no address collected. `shop.fulfilment: 'pickup'` in
  `src/data/site.ts`. No VAT (עוסק פטור), `shop.vat: false`.
- Cart logic: `src/lib/cart.ts` (storage + pub/sub). Cart page + PayPal mount:
  `src/lib/cart-page.ts`. The PayPal buttons must be mounted **once** — `render()` only
  rewrites `#cart-items` + `#cart-summary`, never `#paypal-buttons`.
- Order number: 6-digit code derived deterministically from the PayPal order id
  (`shortRef()` in `cart-page.ts`).
- Each order is emailed to `hello@botanicanature.com` via Web3Forms as a single Hebrew
  `message` field. **Web3Forms mangles non-ASCII field _names_** — keep field keys ASCII
  (`access_key`, `subject`, `name`, `message`…), put Hebrew only in values.

## Environment / secrets

`.env` (gitignored) for local dev, GitHub Actions secrets for deploys:
`PUBLIC_WEB3FORMS_KEY`, `PUBLIC_PAYPAL_CLIENT_ID`, `PUBLIC_GA_ID` (`G-412MH2MDCV`).

⚠️ **Local `.env` uses the PayPal _sandbox_ client ID. The Actions secret is the _live_
one — the deployed site takes real money.** Never put the live key in `.env`.

## Do not touch without asking

- **DNS / email records** at the IONOS registrar — MX/SPF/DKIM/DMARC keep
  `hello@botanicanature.com` working. Only the apex `A` records and `www` `CNAME` point at
  GitHub Pages.
- The **live PayPal client ID**.
- `public/CNAME` and `site:` in `astro.config.mjs` (both must stay `www.botanicanature.com`).

## Verify changes

Run the dev server (`npm run dev -- --port 4333`; 4321 is taken by another project) and
check the affected pages in the browser before committing. `npm run build` must be clean.
PageSpeed is 100 across the board on mobile + desktop — keep it that way (self-hosted
fonts, AVIF hero, inlined CSS, lazy-loaded GA are what get us there).
