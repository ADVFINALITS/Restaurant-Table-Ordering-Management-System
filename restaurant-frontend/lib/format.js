export function formatMoney(amount, currency = "ETB") {
  const value = Number(amount || 0);
  try {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

export function formatClock(isoString) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function minutesSince(isoString) {
  if (!isoString) return 0;
  const diffMs = Date.now() - new Date(isoString).getTime();
  return Math.max(0, Math.floor(diffMs / 60000));
}

export function shortOrderCode(orderId) {
  if (!orderId) return "------";
  return orderId.slice(-6).toUpperCase();
}
