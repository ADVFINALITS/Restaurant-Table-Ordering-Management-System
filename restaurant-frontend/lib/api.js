// Real REST client for the Ruby backend. Every function here has an
// identical signature and return shape to its counterpart in
// demoStore.js — see lib/dataLayer.js for how the two are switched
// between. See README.md for the full API contract the Ruby app
// needs to implement (routes, JSON shapes, status codes).

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = `Request to ${path} failed with ${response.status}`;
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // response had no JSON body, keep the default message
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

export async function apiGetMenu() {
  return request("/api/menu");
}

export async function apiCreateOrder({ tableNumber, items, note }) {
  return request("/api/orders", {
    method: "POST",
    body: JSON.stringify({
      table_number: tableNumber,
      note: note || "",
      items: items.map((line) => ({
        menu_item_id: line.menuItemId,
        quantity: line.quantity,
        notes: line.notes || "",
      })),
    }),
  });
}

export async function apiGetOrder(orderId) {
  return request(`/api/orders/${orderId}`);
}

export async function apiGetActiveOrderForTable(tableNumber) {
  try {
    return await request(`/api/tables/${tableNumber}/active_order`);
  } catch {
    return null;
  }
}

export async function apiListKitchenOrders() {
  return request("/api/kitchen/orders");
}

export async function apiListWaiterOrders() {
  return request("/api/waiter/orders");
}

export async function apiSetOrderStatus(orderId, status) {
  return request(`/api/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function apiPayOrder(orderId, paymentMethod) {
  return request(`/api/orders/${orderId}/pay`, {
    method: "POST",
    body: JSON.stringify({ payment_method: paymentMethod }),
  });
}
