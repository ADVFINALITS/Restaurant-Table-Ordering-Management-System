# Restaurant Table Ordering — full stack

A QR-code table-ordering system. A diner scans a code on their table,
orders from the menu, the order goes to the kitchen, the chef preps
it, a waiter is notified the moment it's ready and serves it, the
system generates the bill automatically, and the diner pays from
their phone.

```
restaurant-table-ordering/
  backend/    Rails 8 API (Ruby) - see backend/README.md
  frontend/   Next.js app (React) - see frontend/README.md
```

The two talk over a plain REST/JSON API - no shared code, no shared
process. The exact contract between them is documented in
`frontend/README.md` ("API contract") and implemented in
`backend/app/controllers/api/`.

## Quick start

Two terminals:

```bash
# Terminal 1 - the API
cd backend
bundle install
bin/rails db:setup
bin/rails server          # http://localhost:3000

# Terminal 2 - the frontend
cd frontend
npm install
npm run dev                # http://localhost:3001
```

Then open:

| URL | Who | What |
|---|---|---|
| `http://localhost:3001/table/1` | Diner | Browse the menu, order |
| `http://localhost:3001/kitchen` | Chef | Live ticket board |
| `http://localhost:3001/waiter` | Waiter | Tickets ready to serve |
| `http://localhost:3001/admin/tables` | Manager | Print QR codes per table |

`db:setup` seeds a demo menu and an admin login
(`admin@restaurant.test` / `changeme123`) for
`http://localhost:3000/login`, used by the menu-management API at
`/api/admin/menu_items` (see `backend/README.md`).

## How an order flows through the system

1. **Diner scans a QR code** at their table → opens `/table/<number>`
   in their phone's browser (no app install). They browse the menu
   and send an order. `POST /api/orders` creates it with status
   `placed`.
2. **Chef sees it instantly** on `/kitchen` (polls every 3s) and taps
   to move it to `preparing`, then `ready` when the food's done.
   `Order#advance_to!` enforces this can only move forward.
3. **Waiter is notified** the moment a ticket goes `ready` (currently
   logs to the Rails console via `NotificationService` - swap in real
   push/SMS there if you want an actual phone buzz) and sees it on
   `/waiter`.
4. **Waiter serves the food** and taps "served" - in that same
   request, the backend computes the bill (subtotal + service charge
   + tax) and the order becomes `billed`. No separate "send the bill"
   step.
5. **Diner sees the bill appear automatically** on their order page
   (still polling, no refresh needed) and pays with cash, card, or
   Telebirr. `POST /api/orders/:id/pay` marks it `paid` and shows a
   receipt with a thank-you confirmation.

Every status change happens through a single shared lifecycle both
sides agree on:

```
placed → preparing → ready → served → billed → paid
```

See `backend/README.md` for the bill formula and how to change the
rates, and `frontend/README.md` for the full page-by-page breakdown
and design notes (the "torn ticket" / "ink stamp" visual language).

## Git workflow note

Both folders carry their own `.gitignore` (Ruby's `vendor/`, `log/`,
`storage/`, `tmp/`; Node's `node_modules/`, `.next/`). If you and your
friend are pushing this as one combined repo, `git add .` from this
top-level folder will respect both automatically - just don't `cd`
into either subfolder and run `git init` separately, or you'll end up
with nested repos instead of one.
