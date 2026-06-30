"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLiveQuery, getOrder, payOrder } from "@/lib/dataLayer";
import Ticket from "@/components/Ticket";
import Stamp from "@/components/Stamp";
import OrderTimeline from "@/components/OrderTimeline";
import BillReceipt from "@/components/BillReceipt";
import { formatMoney } from "@/lib/format";

export default function OrderTrackingPage({ params }) {
  const orderId = params.orderId;
  const [paying, setPaying] = useState(false);

  const { data: order, loading, reload } = useLiveQuery(() => getOrder(orderId), {
    deps: [orderId],
    intervalMs: 4000,
  });

  async function handlePay(method) {
    setPaying(true);
    try {
      await payOrder(orderId, method);
      await reload();
    } finally {
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-sm text-ink-300 animate-pulse">Finding your ticket…</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-3">
        <p className="font-display font-extrabold text-xl">We can&apos;t find that order.</p>
        <p className="text-ink-400 text-sm">
          Scan the QR code on your table again to start a new order.
        </p>
      </div>
    );
  }

  const itemSubtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const showBill = order.bill && ["billed", "paid"].includes(order.status);

  return (
    <div className="min-h-screen pb-16">
      <header className="px-5 pt-8 pb-5 bg-ink-800 text-paper rounded-b-[2rem] flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper/60 mb-1">
            Table {order.table_number}
          </p>
          <h1 className="font-display text-2xl font-black">
            Order #{order.id.slice(-6).toUpperCase()}
          </h1>
        </div>
        <Stamp status={order.status} className="bg-paper" />
      </header>

      <main className="px-5 pt-6 space-y-6 max-w-md mx-auto">
        <Ticket>
          <p className="font-display font-extrabold text-sm uppercase tracking-wide text-ink-400 mb-3">
            Your ticket
          </p>
          <ul className="space-y-2">
            {order.items.map((item, index) => (
              <li key={index} className="flex justify-between text-sm">
                <span className="text-ink-700">
                  {item.quantity} × {item.name}
                  {item.notes && (
                    <span className="block text-xs text-ink-300">{item.notes}</span>
                  )}
                </span>
                <span className="font-mono text-ink-600">
                  {formatMoney(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          {order.note && (
            <p className="text-xs text-ink-400 mt-3 italic">Note: {order.note}</p>
          )}
          <div className="dash-rule my-3" />
          <div className="flex justify-between font-display font-extrabold">
            <span>Subtotal</span>
            <span className="font-mono">{formatMoney(itemSubtotal)}</span>
          </div>
        </Ticket>

        <Ticket>
          <p className="font-display font-extrabold text-sm uppercase tracking-wide text-ink-400 mb-4">
            Status
          </p>
          <OrderTimeline order={order} />
          {!showBill && (
            <p className="text-sm text-ink-400">
              We&apos;ll send your bill automatically as soon as the waiter serves your
              food. This page updates on its own — no need to refresh.
            </p>
          )}
        </Ticket>

        {showBill && <BillReceipt order={order} onPay={handlePay} paying={paying} />}

        {order.status === "paid" && (
          <Link
            href={`/table/${order.table_number}`}
            className="flex items-center justify-center gap-2 text-flame-dark font-display font-extrabold text-sm py-3"
          >
            <ArrowLeft size={16} />
            Order something else
          </Link>
        )}
      </main>
    </div>
  );
}
