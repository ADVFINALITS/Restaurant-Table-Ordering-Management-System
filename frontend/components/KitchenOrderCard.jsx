"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import Ticket from "@/components/Ticket";
import { minutesSince } from "@/lib/format";
import { ORDER_STATUS } from "@/lib/orderStatus";

export default function KitchenOrderCard({ order, onAdvance, busy }) {
  const [minutes, setMinutes] = useState(minutesSince(order.timestamps.placed));

  useEffect(() => {
    const id = setInterval(
      () => setMinutes(minutesSince(order.timestamps.placed)),
      15000
    );
    return () => clearInterval(id);
  }, [order.timestamps.placed]);

  const urgent = minutes >= 10;
  const isPlaced = order.status === ORDER_STATUS.PLACED;

  return (
    <Ticket className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-300">
            Table
          </p>
          <p className="font-display font-black text-3xl leading-none">
            {order.table_number}
          </p>
        </div>
        <span
          className={`flex items-center gap-1 font-mono text-xs font-semibold px-2 py-1 rounded-full ${
            urgent ? "bg-flame-light text-flame-dark" : "bg-ink-50 text-ink-400"
          }`}
        >
          <Clock size={12} />
          {minutes}m
        </span>
      </div>

      <ul className="space-y-1.5 border-t border-ink-100 pt-3">
        {order.items.map((item, index) => (
          <li key={index} className="text-sm">
            <span className="font-display font-extrabold">{item.quantity}×</span>{" "}
            <span className="text-ink-700">{item.name}</span>
            {item.notes && (
              <span className="block text-xs text-flame-dark pl-5">↳ {item.notes}</span>
            )}
          </li>
        ))}
      </ul>
      {order.note && (
        <p className="text-xs text-ink-400 italic border-t border-ink-100 pt-2">
          Table note: {order.note}
        </p>
      )}

      <button
        type="button"
        disabled={busy}
        onClick={() => onAdvance(order)}
        className={`mt-1 w-full rounded-xl py-3 font-display font-extrabold text-sm text-paper disabled:opacity-60 ${
          isPlaced ? "bg-flame" : "bg-sage"
        }`}
      >
        {busy ? "Updating…" : isPlaced ? "Start preparing" : "Mark ready"}
      </button>
    </Ticket>
  );
}
