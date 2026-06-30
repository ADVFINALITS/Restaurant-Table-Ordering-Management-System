# Table Order — backend (Rails API)

A Rails 8 API-only app for the QR-code table-ordering system: a diner
scans a code at their table, orders from the menu, the kitchen sees it
live, a waiter is notified the moment it's ready, the bill is
generated automatically the moment the food is served, and the diner
pays from their phone.

This is the API counterpart to `../frontend` (Next.js). See that
project's README for the full request/response contract this app
implements - the two are written to match exactly.

## Setup

```bash
bundle install
bin/rails db:setup     # creates the db, loads schema.rb, runs db/seeds.rb
bin/rails server        # runs on http://localhost:3000 by default
```

`db:setup` seeds a demo menu (the same items the frontend's demo mode
ships with) and one admin account:

```
admin@restaurant.test / changeme123
```

Change that password before deploying anywhere real.

## Connecting the frontend

The frontend expects this API at `http://localhost:3000` by default
(see `../frontend/.env.local`). CORS is open to `localhost:3000` and
`localhost:3001` out of the box (`config/initializers/cors.rb`); set
`FRONTEND_ORIGINS` (comma-separated) in production to whatever domain
the frontend is actually served from.

## What's here

```
app/
  controllers/
    auth_controller.rb              POST /register, POST /login (staff accounts)
    application_controller.rb       shared JWT auth helpers (opt-in per controller)
    api/
      menu_controller.rb            GET  /api/menu
      orders_controller.rb          POST /api/orders, GET /api/orders/:id,
                                     PATCH /api/orders/:id/status, POST /api/orders/:id/pay
      tables_controller.rb          GET  /api/tables/:table_number/active_order
      kitchen_controller.rb         GET  /api/kitchen/orders
      waiter_controller.rb          GET  /api/waiter/orders
      admin/
        menu_items_controller.rb    GET/POST/PATCH/DELETE /api/admin/menu_items (JWT, admin-only)
  models/
    menu_category.rb, menu_item.rb  the menu
    order.rb, order_item.rb         orders, their lifecycle, and bill math
    user.rb                        staff accounts (admin / waiter roles)
  services/
    json_web_token.rb              encode/decode auth tokens
    notification_service.rb        chef / waiter / customer notification hooks
                                    (currently logs to the Rails console -
                                    see "Real notifications" below)
```

### Order lifecycle

A ticket moves forward through exactly these statuses, matching
`../frontend/lib/orderStatus.js`:

```
placed → preparing → ready → served → billed → paid
```

`Order#advance_to!` enforces this. Setting a ticket to `served`
computes the bill and saves the order as `billed` in the same call -
see `Order#advance_to!` and `Order#compute_bill`. The bill formula:

```
service_charge = round(subtotal * 10%)
tax            = round((subtotal + service_charge) * 15%)
total          = subtotal + service_charge + tax
```

Adjust `SERVICE_CHARGE_RATE` / `TAX_RATE` in `app/models/order.rb` if
your actual rates differ.

### Real notifications

`NotificationService` currently just logs to the Rails console
(`notify_chef`, `notify_waiter`, `notify_customer` - called
automatically from `Order` at the right points in the lifecycle). The
frontend doesn't need push notifications to work - it polls every
3-4 seconds (see `useLiveQuery` in the frontend's `lib/dataLayer.js`),
so a chef/waiter/customer will see a status change within a few
seconds with zero extra backend work.

If you want actual push notifications (e.g. a phone buzz when food's
ready), the natural places to add them are inside
`NotificationService`'s three methods - swap the `puts` calls for
whatever you're using (web push, SMS via Twilio, email, etc).

### Admin menu management

`/api/admin/menu_items` is protected by the existing JWT auth
(`POST /login` to get a token, then send
`Authorization: Bearer <token>` on admin requests). Only users with
`role: admin` can use it; `role: waiter` accounts get a 403. The diner
/ kitchen / waiter pages never send this header - none of them
require an account.

### Tests

```bash
bin/rails test
```

Covers the full order lifecycle end-to-end (place → prepare → ready →
serve/bill → pay), the bill math against the documented example
numbers, menu/kitchen/waiter listing filters, and admin auth.
