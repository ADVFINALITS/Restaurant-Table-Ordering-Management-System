import { MENU, findMenuItem } from "./menu";
import { ORDER_STATUS } from "./orderStatus";

const STORAGE_KEY = "rto_demo_orders_v1";
const CHANNEL_NAME = "rto_demo_channel";
const SERVICE_CHARGE_RATE = 0.1; // 10% service charge
const TAX_RATE = 0.15; // 15% VAT

let channel = null;
function getChannel() {
  if (typeof window === "undefined") return null;
  if (!channel && "BroadcastChannel" in window) {
    channel = new BroadcastChannel(CHANNEL_NAME);
  }
  return channel;
}

function announce() {
  const ch = getChannel();
  if (ch) ch.postMessage({ type: "orders-changed", at: Date.now() });
}

// Lets components subscribe to both same-browser-other-tab updates
// (storage event + BroadcastChannel) and is paired with simple polling
// as a safety net.
export function subscribeToDemoChanges(callback) {
  if (typeof window === "undefined") return () => {};

  const onStorage = (event) => {
    if (event.key === STORAGE_KEY) callback();
  };
  const ch = getChannel();
  const onMessage = () => callback();

  window.addEventListener("storage", onStorage);
  if (ch) ch.addEventListener("message", onMessage);

  return () => {
    window.removeEventListener("storage", onStorage);
    if (ch) ch.removeEventListener("message", onMessage);
  };
}

function readAll() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(orders) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  announce();
}

function nowIso() {
  return new Date().toISOString();
}

function computeBill(order) {
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const serviceCharge = Math.round(subtotal * SERVICE_CHARGE_RATE);
  const tax = Math.round((subtotal + serviceCharge) * TAX_RATE);
  const total = subtotal + serviceCharge + tax;
  return {
    subtotal,
    service_charge_rate: SERVICE_CHARGE_RATE,
    service_charge: serviceCharge,
    tax_rate: TAX_RATE,
    tax,
    total,
    currency: "ETB",
  };
}

export async function demoGetMenu() {
  return MENU;
}

export async function demoCreateOrder({ tableNumber, items, note }) {
  const orders = readAll();
  const id = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const resolvedItems = items.map((line) => {
    const menuItem = findMenuItem(line.menuItemId);
    return {
      menu_item_id: line.menuItemId,
      name: menuItem ? menuItem.name : "Item",
      price: menuItem ? menuItem.price : 0,
      quantity: line.quantity,
      notes: line.notes || "",
    };
  });

  const order = {
    id,
    table_number: String(tableNumber),
    status: ORDER_STATUS.PLACED,
    items: resolvedItems,
    note: note || "",
    timestamps: {
      placed: nowIso(),
      preparing: null,
      ready: null,
      served: null,
      billed: null,
      paid: null,
    },
    bill: null,
    payment_method: null,
  };

  orders.push(order);
  writeAll(orders);
  return order;
}

export async function demoGetOrder(orderId) {
  const orders = readAll();
  return orders.find((order) => order.id === orderId) || null;
}

export async function demoGetActiveOrderForTable(tableNumber) {
  const orders = readAll().filter(
    (order) => order.table_number === String(tableNumber)
  );
  if (orders.length === 0) return null;
  const active = orders
    .filter((order) => order.status !== ORDER_STATUS.PAID)
    .sort((a, b) => new Date(b.timestamps.placed) - new Date(a.timestamps.placed));
  if (active.length > 0) return active[0];
  return orders.sort(
    (a, b) => new Date(b.timestamps.placed) - new Date(a.timestamps.placed)
  )[0];
}

export async function demoListKitchenOrders() {
  const orders = readAll().filter((order) =>
    [ORDER_STATUS.PLACED, ORDER_STATUS.PREPARING].includes(order.status)
  );
  return orders.sort(
    (a, b) => new Date(a.timestamps.placed) - new Date(b.timestamps.placed)
  );
}

export async function demoListWaiterOrders() {
  const orders = readAll().filter((order) =>
    [ORDER_STATUS.READY, ORDER_STATUS.SERVED].includes(order.status)
  );
  return orders.sort((a, b) => {
    const aTime = new Date(a.timestamps.ready || a.timestamps.placed);
    const bTime = new Date(b.timestamps.ready || b.timestamps.placed);
    return aTime - bTime;
  });
}

export async function demoSetOrderStatus(orderId, status) {
  const orders = readAll();
  const index = orders.findIndex((order) => order.id === orderId);
  if (index === -1) throw new Error("Order not found");

  const order = orders[index];
  order.status = status;
  order.timestamps[status] = nowIso();

  // The system automatically generates and "sends" the bill the
  // moment a ticket is served — no extra manual step.
  if (status === ORDER_STATUS.SERVED) {
    order.bill = computeBill(order);
    order.status = ORDER_STATUS.BILLED;
    order.timestamps.billed = nowIso();
  }

  orders[index] = order;
  writeAll(orders);
  return order;
}

export async function demoPayOrder(orderId, paymentMethod) {
  const orders = readAll();
  const index = orders.findIndex((order) => order.id === orderId);
  if (index === -1) throw new Error("Order not found");

  const order = orders[index];
  order.status = ORDER_STATUS.PAID;
  order.payment_method = paymentMethod;
  order.timestamps.paid = nowIso();

  orders[index] = order;
  writeAll(orders);
  return order;
}
