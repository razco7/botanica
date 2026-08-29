/**
 * Site-wide configuration and content that isn't a collection entry.
 * Edit here for nav labels, contact details, footer links, the promo banner,
 * and the Snipcart / currency settings.
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
    help: 'עזרה',
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
  helpLinks: [
    { label: 'משלוח', href: '/contact' },
    { label: 'החזרות והחלפות', href: '/contact' },
    { label: 'שמירה על חיי המוצר', href: '/contact' },
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
 * Snipcart powers the cart + PayPal checkout.
 * Put the PUBLIC API key in an env var: PUBLIC_SNIPCART_KEY
 * (test key while developing, live key at launch). Until it's set the
 * store still renders; the add-to-cart buttons just won't do anything.
 */
export const snipcart = {
  apiKey: import.meta.env.PUBLIC_SNIPCART_KEY ?? '',
  version: '3.7.1',
};
