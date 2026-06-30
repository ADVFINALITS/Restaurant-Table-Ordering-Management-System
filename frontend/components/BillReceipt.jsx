"use client";

import { useState } from "react";
import { Banknote, CreditCard, Smartphone, CheckCircle2 } from "lucide-react";
import { formatMoney, formatClock } from "@/lib/format";
import Ticket from "@/components/Ticket";

const PAYMENT_METHODS = [
  { id: "cash", label: "Cash", icon: Banknote },
  { id: "card", label: "Card", icon: CreditCard },
  { id: "telebirr", label: "Telebirr", icon: Smartphone },
];

export default function BillReceipt({ order, onPay, paying }) {
  const [method, setMethod] = useState("cash");
  const paid = order.status === "paid";

  return (
    <Ticket torn className="font-mono">
      <p className="text-center font-display font-extrabold text-base tracking-wide mb-1">
        THE BILL
      </p>
      <p className="text-center text-xs text-ink-400 mb-4">
        Table {order.table_number} · Order #{order.id.slice(-6).toUpperCase()}
      </p>

      <div className="dash-rule mb-3" />

      <ul className="space-y-1.5 text-sm">
        {order.items.map((item, index) => (
          <li key={index} className="flex justify-between gap-3">
            <span className="text-ink-700">
              {item.quantity} × {item.name}
            </span>
            <span className="text-ink-700">{formatMoney(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="dash-rule my-3" />

      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between text-ink-500">
          <span>Subtotal</span>
          <span>{formatMoney(order.bill.subtotal)}</span>
        </div>
        <div className="flex justify-between text-ink-500">
          <span>Service charge ({Math.round(order.bill.service_charge_rate * 100)}%)</span>
          <span>{formatMoney(order.bill.service_charge)}</span>
        </div>
        <div className="flex justify-between text-ink-500">
          <span>VAT ({Math.round(order.bill.tax_rate * 100)}%)</span>
          <span>{formatMoney(order.bill.tax)}</span>
        </div>
      </div>

      <div className="dash-rule my-3" />

      <div className="flex justify-between font-display font-extrabold text-lg">
        <span>Total</span>
        <span>{formatMoney(order.bill.total)}</span>
      </div>

      {paid ? (
        <div className="mt-5 flex items-center justify-center gap-2 text-sage-dark bg-sage-light rounded-lg py-3">
          <CheckCircle2 size={18} />
          <span className="font-display font-extrabold text-sm">
            Paid by {order.payment_method} at {formatClock(order.timestamps.paid)}
          </span>
        </div>
      ) : (
        <div className="mt-5">
          <p className="font-display font-bold text-xs uppercase tracking-wide text-ink-400 mb-2">
            Pay with
          </p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {PAYMENT_METHODS.map((option) => {
              const Icon = option.icon;
              const active = method === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setMethod(option.id)}
                  className={`flex flex-col items-center gap-1 rounded-xl border-2 py-3 font-body text-xs font-semibold ${
                    active
                      ? "border-flame bg-flame-light text-flame-dark"
                      : "border-ink-100 text-ink-500"
                  }`}
                >
                  <Icon size={18} />
                  {option.label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            disabled={paying}
            onClick={() => onPay(method)}
            className="w-full bg-sage disabled:bg-ink-200 text-paper font-display font-extrabold rounded-xl py-4 font-body"
          >
            {paying ? "Confirming payment…" : `Pay ${formatMoney(order.bill.total)}`}
          </button>
        </div>
      )}
    </Ticket>
  );
}
