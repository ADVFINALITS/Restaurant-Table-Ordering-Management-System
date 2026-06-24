// Single source of truth for the order lifecycle. The Ruby backend
// should use these exact string values in its `status` field so the
// frontend and backend never disagree about state names.

export const ORDER_STATUS = {
  PLACED: "placed", // customer submitted the order from the table page
  PREPARING: "preparing", // chef accepted it, kitchen is cooking
  READY: "ready", // chef marked it done, waiting for a waiter
  SERVED: "served", // waiter delivered it to the table
  BILLED: "billed", // system generated the bill and sent it to the table
  PAID: "paid", // customer paid
  CANCELLED: "cancelled",
};

export const ORDER_STATUS_SEQUENCE = [
  ORDER_STATUS.PLACED,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.READY,
  ORDER_STATUS.SERVED,
  ORDER_STATUS.BILLED,
  ORDER_STATUS.PAID,
];

export const STATUS_LABEL = {
  [ORDER_STATUS.PLACED]: "Placed",
  [ORDER_STATUS.PREPARING]: "Preparing",
  [ORDER_STATUS.READY]: "Ready",
  [ORDER_STATUS.SERVED]: "Served",
  [ORDER_STATUS.BILLED]: "Bill sent",
  [ORDER_STATUS.PAID]: "Paid",
  [ORDER_STATUS.CANCELLED]: "Cancelled",
};

export const STATUS_COLOR = {
  [ORDER_STATUS.PLACED]: "ink",
  [ORDER_STATUS.PREPARING]: "flame",
  [ORDER_STATUS.READY]: "sage",
  [ORDER_STATUS.SERVED]: "brass",
  [ORDER_STATUS.BILLED]: "brass",
  [ORDER_STATUS.PAID]: "sage",
  [ORDER_STATUS.CANCELLED]: "ink",
};

export function statusIndex(status) {
  return ORDER_STATUS_SEQUENCE.indexOf(status);
}
