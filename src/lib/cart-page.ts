/**
 * Runs on /cart. Renders the line items + totals and mounts the PayPal buttons.
 * Config (product map, currency, fulfilment) is injected as a JSON <script> tag;
 * the PayPal SDK is loaded by the page and exposes `window.paypal`.
 */
import { getCart, setLineQty, removeLine, clearCart, subscribe } from './cart';

declare const paypal: any;

interface Product {
  name: string;
  price: number;
  image: string;
  variantName: string | null;
  inStock: boolean;
}
interface Config {
  productMap: Record<string, Product>;
  currency: string;
  fulfilment: 'pickup' | 'shipping';
  shipping: { fee: number; freeOver: number };
  orderEmailKey: string;
}

const cfg: Config = JSON.parse(
  document.getElementById('cart-config')?.textContent || '{}',
);

const money = (n: number) => `₪ ${n.toFixed(2)}`;

function lines() {
  return getCart()
    .map((l) => ({ ...l, p: cfg.productMap[l.id] as Product | undefined }))
    .filter((l): l is typeof l & { p: Product } => Boolean(l.p));
}

function totals(ls: ReturnType<typeof lines>) {
  const items = ls.reduce((s, l) => s + l.p.price * l.qty, 0);
  let ship = 0;
  if (cfg.fulfilment === 'shipping' && ls.length) {
    ship =
      cfg.shipping.freeOver && items >= cfg.shipping.freeOver ? 0 : cfg.shipping.fee;
  }
  return { items, ship, total: items + ship };
}

function init(el: HTMLElement) {
  // one-time skeleton — the PayPal container is never re-rendered
  el.innerHTML = `
    <p id="cart-empty" class="cart-empty" hidden>העגלה ריקה. <a href="/store">חזרה לחנות</a></p>
    <div id="cart-items"></div>
    <div id="cart-checkout" hidden>
      <div id="cart-summary" class="cart-summary"></div>
      <div id="paypal-buttons"></div>
      <p class="cart-error" id="cart-error" hidden></p>
    </div>
    <p class="cart-actions" id="cart-actions"><a href="/store">המשך בקנייה</a></p>
  `;
  const emptyEl = el.querySelector<HTMLElement>('#cart-empty')!;
  const itemsEl = el.querySelector<HTMLElement>('#cart-items')!;
  const checkoutEl = el.querySelector<HTMLElement>('#cart-checkout')!;
  const summaryEl = el.querySelector<HTMLElement>('#cart-summary')!;
  const actionsEl = el.querySelector<HTMLElement>('#cart-actions')!;
  let paypalMounted = false;

  const render = () => {
    const ls = lines();
    const empty = ls.length === 0;
    emptyEl.hidden = !empty;
    checkoutEl.hidden = empty;
    actionsEl.hidden = empty;

    itemsEl.innerHTML = empty
      ? ''
      : `<ul class="cart-list">${ls
          .map(
            (l, i) => `
          <li class="cart-row">
            <img class="cart-row__img" src="${l.p.image}" alt="" />
            <div class="cart-row__info">
              <span class="cart-row__name">${escape(l.p.name)}</span>
              ${
                l.variant
                  ? `<span class="cart-row__variant">${escape(
                      l.p.variantName ?? '',
                    )}: ${escape(l.variant)}</span>`
                  : ''
              }
              <span class="cart-row__unit">${money(l.p.price)} ליחידה</span>
            </div>
            <input class="cart-row__qty" type="number" min="1" value="${l.qty}"
                   data-i="${i}" aria-label="כמות" />
            <span class="cart-row__line">${money(l.p.price * l.qty)}</span>
            <button class="cart-row__remove" data-i="${i}" aria-label="הסרה" title="הסרה">✕</button>
          </li>`,
          )
          .join('')}</ul>`;

    itemsEl.querySelectorAll<HTMLInputElement>('.cart-row__qty').forEach((input) => {
      input.addEventListener('change', () => {
        const line = getCart()[Number(input.dataset.i)];
        if (line) setLineQty(line.id, line.variant, Number(input.value));
      });
    });
    itemsEl.querySelectorAll<HTMLButtonElement>('.cart-row__remove').forEach((btn) => {
      btn.addEventListener('click', () => {
        const line = getCart()[Number(btn.dataset.i)];
        if (line) removeLine(line.id, line.variant);
      });
    });

    if (empty) return;
    const t = totals(ls);
    summaryEl.innerHTML = `
      <div class="cart-summary__line"><span>סכום ביניים</span><span>${money(t.items)}</span></div>
      ${
        cfg.fulfilment === 'shipping'
          ? `<div class="cart-summary__line"><span>משלוח</span><span>${
              t.ship === 0 ? 'חינם' : money(t.ship)
            }</span></div>`
          : `<div class="cart-summary__line"><span>איסוף עצמי</span><span>ללא עלות</span></div>`
      }
      <div class="cart-summary__total"><span>סה״כ לתשלום</span><span>${money(t.total)}</span></div>
      <p class="cart-note">${
        cfg.fulfilment === 'shipping'
          ? 'המחיר סופי. פרטי משלוח ייאספו בתשלום.'
          : 'המחיר סופי. איסוף עצמי מהקליניקה בחדרה — יש לתאם מועד מראש בטלפון 052-8717501.'
      }</p>`;

    if (!paypalMounted && !checkoutEl.hidden) {
      whenPayPalReady(() => {
        if (!paypalMounted) paypalMounted = mountPayPal();
      });
    }
  };

  function mountPayPal(): boolean {
    const holder = document.getElementById('paypal-buttons');
    if (!holder || typeof paypal === 'undefined') return false;

    paypal
      .Buttons({
        style: { layout: 'vertical', shape: 'rect', label: 'pay' },
        createOrder: (_data: unknown, actions: any) => {
          const ls = lines();
          const t = totals(ls);
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: cfg.currency,
                  value: t.total.toFixed(2),
                  breakdown: {
                    item_total: {
                      currency_code: cfg.currency,
                      value: t.items.toFixed(2),
                    },
                    shipping: {
                      currency_code: cfg.currency,
                      value: t.ship.toFixed(2),
                    },
                  },
                },
                items: ls.map((l) => ({
                  name: `${l.p.name}${l.variant ? ` (${l.variant})` : ''}`.slice(
                    0,
                    127,
                  ),
                  quantity: String(l.qty),
                  unit_amount: {
                    currency_code: cfg.currency,
                    value: l.p.price.toFixed(2),
                  },
                })),
              },
            ],
            application_context: {
              shipping_preference:
                cfg.fulfilment === 'shipping' ? 'GET_FROM_FILE' : 'NO_SHIPPING',
            },
          });
        },
        onApprove: (_data: unknown, actions: any) =>
          actions.order.capture().then((details: any) => {
            const ls = lines();
            const t = totals(ls);
            emailOrder(details, ls, t).catch(() => {});
            clearCart();
            const ref = shortRef(details.id || '');
            location.href = `/order-confirmation?n=${ref}&id=${encodeURIComponent(
              details.id || '',
            )}`;
          }),
        onError: () => showError('משהו השתבש בתשלום. נסו שוב או צרו קשר.'),
      })
      .render('#paypal-buttons');
    return true;
  }

  function showError(msg: string) {
    const e = document.getElementById('cart-error');
    if (e) {
      e.textContent = msg;
      (e as HTMLElement).hidden = false;
    }
  }

  async function emailOrder(
    details: any,
    ls: ReturnType<typeof lines>,
    t: ReturnType<typeof totals>,
  ) {
    if (!cfg.orderEmailKey) return;
    const buyer = details?.payer?.name
      ? `${details.payer.name.given_name ?? ''} ${details.payer.name.surname ?? ''}`.trim()
      : '';
    const buyerEmail = details?.payer?.email_address || '';
    const ref = shortRef(details.id || '');
    const fulfilment =
      cfg.fulfilment === 'pickup'
        ? 'איסוף עצמי מהקליניקה בחדרה'
        : `משלוח (${money(t.ship)})`;

    const items = ls
      .map(
        (l) =>
          `• ${l.p.name}${l.variant ? ` (${l.variant})` : ''} — ${l.qty} × ${money(
            l.p.price,
          )} = ${money(l.p.price * l.qty)}`,
      )
      .join('\n');

    // Written to read as a customer confirmation (Web3Forms autoresponder
    // sends this same text to the buyer). Everything goes in one `message`
    // field because Web3Forms mangles non-ASCII field names.
    const message = [
      `שלום${buyer ? ` ${buyer}` : ''},`,
      '',
      'תודה על הזמנתך מבוטניקה 🌿 התשלום התקבל.',
      '',
      `מספר הזמנה: ${ref}`,
      '',
      'פריטים:',
      items,
      '',
      `סה״כ ששולם: ${money(t.total)}`,
      `אופן מסירה: ${fulfilment} (אפיקי מים 1, חדרה)`,
      '',
      'חשוב: יש לתאם מועד איסוף מראש —',
      'טלפון 052-8717501 או hello@botanicanature.com (ציינו את מספר ההזמנה).',
      'הקבלה תימסר באיסוף.',
      '',
      `אסמכתת PayPal: ${details.id || '—'}`,
    ].join('\n');

    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: cfg.orderEmailKey,
        subject: `הזמנה ${ref} — ${money(t.total)}`,
        from_name: 'בוטניקה',
        name: buyer || 'לקוח/ה',
        // reply-to for the shop notification; recipient for the autoresponder
        email: buyerEmail || 'noreply@botanicanature.com',
        message,
      }),
    });
  }

  subscribe(render);
}

/** Short, phone-friendly order number derived deterministically from the PayPal id. */
function shortRef(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
  return String((Math.abs(h) % 900000) + 100000); // 6 digits, 100000–999999
}

function whenPayPalReady(cb: () => void) {
  if (typeof paypal !== 'undefined') return cb();
  let tries = 0;
  const iv = setInterval(() => {
    if (typeof paypal !== 'undefined') {
      clearInterval(iv);
      cb();
    } else if (++tries > 40) {
      clearInterval(iv);
    }
  }, 150);
}

function escape(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!),
  );
}

const root = document.getElementById('cart-root');
if (root) init(root);
