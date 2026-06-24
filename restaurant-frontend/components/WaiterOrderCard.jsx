"use client";

import { Soup } from "lucide-react";
import Ticket from "@/components/Ticket";
import Stamp from "@/components/Stamp";
import { ORDER_STATUS } from "@/lib/orderStatus";

export default function WaiterOrderCard({ order, onServe, busy }) {
  const isReady = order.status === ORDER_STATUS.READY;

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
        <Stamp status={order.status} />
      </div>

      <ul className="space-y-1 border-t border-ink-100 pt-3 text-sm text-ink-600">
        {order.items.map((item, index) => (
          <li key={index}>
            <span className="font-display font-extrabold">{item.quantity}×</span>{" "}
            {item.name}
          </li>
        ))}
      </ul>

      {isReady ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => onServe(order)}
          className="mt-1 w-full rounded-xl py-3 font-display font-extrabold text-sm text-paper bg-brass disabled:opacity-60 flex items-center justify-center gap-2"
        >
          <Soup size={16} />
          {busy ? "Serving…" : "Mark served"}
        </button>
      ) : (
        <p className="text-xs text-ink-300 text-center pt-1">
          Bill sent to the table automatically.
        </p>
      )}
    </Ticket>
  );
}
