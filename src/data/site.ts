/**
 * Site-wide configuration and content that isn't a collection entry.
 * Edit here for nav labels, contact details, footer links, the promo banner,
 * and the shop / currency settings.
 */

export const site = {
  name: 'בוטניקה',
  tagline: 'טיפול מהטבע',
  // Used for <title> suffix, OG, canonical. Update before the DNS cutover.
  url: 'https://www.botanicanature.com',
  defaultDescription:
    'קליניקה וחנות אינטרנטית לרפואה משלימה בחדרה. טיפול בפרחי באך, ארומתרפיה, צמחי מרפא, סדנאות ומגדיר צמחים.',
  ogImage: '/images/site/og.jpg',
  locale: 'he_IL',
  currency: 'ILS',
  year: new Date().getFullYear(),
  // Google Analytics 4 Measurement ID (G-XXXXXXXXXX). Set PUBLIC_GA_ID.
  gaId: import.meta.env.PUBLIC_GA_ID ?? '',
  // Approx coords for אפיקי מים 1, חדרה — used in LocalBusiness structured data.
  // TODO: fine-tune from Google Maps if needed.
  geo: { lat: 32.4408, lng: 34.9196 },
};

export const contact = {
  phoneDisplay: '052-8717501',
  phoneHref: '+972528717501',
  address: 'אפיקי מים 1, חדרה',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=אפיקי+מים+1+חדרה',
  hours: 'א׳–ה׳ 9:00–15:00',
  instagram: 'https://www.instagram.com/pazit_harnoy_cohen/',
  facebook: 'https://www.facebook.com/profile.php?id=61585424797847',
  email: 'hello@botanicanature.com',
  /**
   * The contact form posts to Web3Forms (free, no server needed — works on GitHub Pages).
   * Get a key: https://web3forms.com → enter hello@botanicanature.com → confirm the email.
   * Put it in PUBLIC_WEB3FORMS_KEY (.env locally, repo Actions secret for deploys).
   * Until it's set, the form shows a "email us directly" fallback.
   */
  web3formsKey: import.meta.env.PUBLIC_WEB3FORMS_KEY ?? '',
};

export const nav = [
  { label: 'מגדיר צמחים', href: '/flora-index' },
  { label: 'על הקליניקה', href: '/the-clinic' },
  { label: 'חנות', href: '/store' },
  { label: 'סדנאות', href: '/workshops' },
  { label: 'צרו קשר', href: '/contact' },
];

export const categories = [
  { slug: 'bach', label: 'פרחי באך' },
  { slug: 'ceramic', label: 'קרמיקה' },
  { slug: 'oils', label: 'שמנים' },
] as const;

export type CategorySlug = (typeof categories)[number]['slug'];

export const categoryLabel = (slug: string) =>
  categories.find((c) => c.slug === slug)?.label ?? slug;

export const footer = {
  columns: {
    site: 'מפת האתר',
    shop: 'מוצרים בחנות',
    follow: 'עיקבו אחרינו',
  },
  siteLinks: [
    { label: 'בית', href: '/' },
    { label: 'על הקליניקה', href: '/the-clinic' },
    { label: 'חנות', href: '/store' },
    { label: 'סדנאות', href: '/workshops' },
    { label: 'צרו קשר', href: '/contact' },
  ],
  shopLinks: [
    { label: 'פרחי באך', href: '/store/bach' },
    { label: 'קרמיקה', href: '/store/ceramic' },
    { label: 'שמנים', href: '/store/oils' },
  ],
};

/**
 * Seasonal promo banner shown on the home page (the live site ran a
 * "30% off for Hanukkah" banner). Set `enabled: false` to hide it.
 */
export const promo = {
  enabled: false,
  title: 'מגוון תמציות פרחי באך עכשיו בבוטניקה',
  subtitle: '30% הנחה לרגל חג החנוכה',
  ctaLabel: 'יאללה נו, תנו לראות!',
  ctaHref: '/store',
  image: '/images/site/promo-bach.jpg',
};

/**
 * Shop / checkout.
 *
 * Cart lives in the browser (localStorage); checkout is handled by PayPal's
 * JS SDK — no server, no monthly fee. Set the PayPal REST app **Client ID**
 * in PUBLIC_PAYPAL_CLIENT_ID (sandbox while testing, live at launch).
 * Until it's set, product pages show a "contact to order" button instead.
 */
export const shop = {
  paypalClientId: import.meta.env.PUBLIC_PAYPAL_CLIENT_ID ?? '',
  currency: 'ILS',
  // Web3Forms key (same as the contact form) — a copy of each order is
  // emailed to hello@botanicanature.com after checkout.
  orderEmailKey: import.meta.env.PUBLIC_WEB3FORMS_KEY ?? '',
  // Fulfilment. Pickup only for now — no shipping fee, no address collected.
  fulfilment: 'pickup' as 'pickup' | 'shipping',
  // Used only when fulfilment === 'shipping'.
  shipping: { fee: 30, freeOver: 300 },
  // Pazit is עוסק פטור — prices are final, no VAT line.
  vat: false,
};
