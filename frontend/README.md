# Table Order — frontend (Next.js)

A QR-code table-ordering system. A diner scans a code on their table, orders
from the menu, the order goes to the kitchen, the chef preps it, a waiter
serves it, the system sends the bill automatically, and the diner pays — all
from their phone.

This repo is **only the frontend** (Next.js / React). It's built to talk to a
separate **Ruby** backend over a REST JSON API. The exact contract it expects
is below, so you can build the Rails (or Sinatra) side to match.

## Pages

| Route | Who uses it | What it does |
|---|---|---|
| `/table/[tableNumber]` | Diner (via QR code) | Browse the menu, build an order, send it |
| `/order/[orderId]` | Diner | Live order status, then the bill, then pay |
| `/kitchen` | Chef | Live board of incoming tickets, by table |
| `/waiter` | Waiter | Live board of tickets ready to serve |
| `/admin/tables` | Manager | Generates and prints one QR code per table |
| `/` | Anyone | Links to the three staff pages above |

Each QR code simply points to `https://yourdomain.com/table/<number>` — the
table number is in the URL, so every order is automatically tied to the
right table with no extra step.

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. **You don't need the Ruby backend yet** — if
`NEXT_PUBLIC_API_BASE_URL` isn't set, the app runs in **demo mode**: every
order, status change, and payment is stored in your browser
(`localStorage` + `BroadcastChannel`) instead of a server. Open `/table/1`,
`/kitchen` and `/waiter` in three separate tabs in the same browser to watch
an order flow live from one to the next, exactly like it will with the real
backend.

## Connecting your Ruby backend

Copy `.env.local.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000   # your Rails app
NEXT_PUBLIC_DEMO_MODE=false
```

Once `NEXT_PUBLIC_API_BASE_URL` is set, the frontend stops touching
`localStorage` entirely and calls your API for everything (see
`lib/api.js`). `lib/dataLayer.js` is the single switch between the two —
no component ever calls `lib/api.js` or `lib/demoStore.js` directly.

## API contract

All responses are JSON. All requests that send a body send
`Content-Type: application/json`. Errors should return a non-2xx status with
`{ "error": "human readable message" }`.

### Order lifecycle

A ticket only ever moves forward through these statuses (see
`lib/orderStatus.js`):

```
placed → preparing → ready → served → billed → paid
```

**Important:** when the frontend sets a ticket to `served`, your backend
should, in the same request, compute the bill and respond with the order
already in `billed` status with `bill` populated. The frontend does not make
a separate "send the bill" call — serving the food and sending the bill is
one action, triggered by the waiter.

### Data shapes

**MenuItem**
```json
{ "id": "doro-wat", "name": "Doro Wat", "description": "...", "price": 420, "veg": false, "spicy": true, "available": true }
```

**Menu** — `GET /api/menu` returns an array of categories, each with nested items:
```json
[
  { "id": "mains", "name": "Mains", "items": [ /* MenuItem[] */ ] }
]
```

**Order**
```json
{
  "id": "ord_123",
  "table_number": "7",
  "status": "preparing",
  "items": [
    { "menu_item_id": "doro-wat", "name": "Doro Wat", "price": 420, "quantity": 2, "notes": "no egg" }
  ],
  "note": "birthday, bring a candle if you have one",
  "timestamps": {
    "placed": "2026-06-24T10:00:00Z",
    "preparing": "2026-06-24T10:01:30Z",
    "ready": null,
    "served": null,
    "billed": null,
    "paid": null
  },
  "bill": null,
  "payment_method": null
}
```

Once billed, `bill` looks like this (numbers, not strings):
```json
{
  "subtotal": 840,
  "service_charge_rate": 0.10,
  "service_charge": 84,
  "tax_rate": 0.15,
  "tax": 139,
  "total": 1063,
  "currency": "ETB"
}
```

### Endpoints

| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/api/menu` | — | `Category[]` |
| POST | `/api/orders` | `{ table_number, note, items: [{ menu_item_id, quantity, notes }] }` | `Order` (status `placed`) |
| GET | `/api/orders/:id` | — | `Order` |
| GET | `/api/tables/:table_number/active_order` | — | `Order` of the table's current open ticket, or `404` if none |
| GET | `/api/kitchen/orders` | — | `Order[]` with status `placed` or `preparing`, oldest first |
| GET | `/api/waiter/orders` | — | `Order[]` with status `ready` (or recently `served`), oldest first |
| PATCH | `/api/orders/:id/status` | `{ status }` | Updated `Order` |
| POST | `/api/orders/:id/pay` | `{ payment_method }` | `Order` (status `paid`) |

`payment_method` is a free-text value the frontend currently sends as one of
`"cash"`, `"card"`, `"telebirr"` — adjust `components/BillReceipt.jsx` if you
want different methods.

### Real-time updates

The frontend polls every 3–4 seconds (`lib/dataLayer.js`'s `useLiveQuery`
hook) — your Rails API doesn't need websockets to work. If you later add
Action Cable for instant push updates, you only need to change
`useLiveQuery`; no page or component needs to change.

## Project structure

```
app/
  page.js                     landing page
  table/[tableNumber]/page.js diner: menu + cart + place order
  order/[orderId]/page.js     diner: live status + bill + pay
  kitchen/page.js             chef board
  waiter/page.js              waiter board
  admin/tables/page.js        QR code generator
components/                   Ticket, Stamp, menu/cart/board UI pieces
context/CartProvider.jsx      per-table cart state
lib/
  api.js                      real Ruby API calls
  demoStore.js                localStorage-backed demo implementation
  dataLayer.js                picks one of the above + live polling hook
  menu.js                     demo menu data
  orderStatus.js              shared status constants
  format.js                   money/time formatting
```

## Design notes

The visual language borrows from the restaurant floor itself: every order is
a torn paper **ticket**, and every status change is an **ink stamp** —
`PLACED`, `PREPARING`, `READY`, `SERVED`. The kitchen board is dark like a
pass-through window under hot lights; the diner and waiter pages stay on
warm ticket paper. Colors: ink (`#1C1916`), paper (`#F7F1E3`), flame
(`#FF5722`, firing/cooking), sage (`#4F7A52`, ready/paid), brass (`#B8862E`,
service). Type: Archivo for stamps and headings, Inter for body copy,
JetBrains Mono for order codes and prices.
