"use client";

import { useState } from "react";
import { Bell, UtensilsCrossed } from "lucide-react";
import { useLiveQuery, listWaiterOrders, setOrderStatus } from "@/lib/dataLayer";
import { ORDER_STATUS } from "@/lib/orderStatus";
import WaiterOrderCard from "@/components/WaiterOrderCard";
import EmptyState from "@/components/EmptyState";

export default function WaiterPage() {
  const { data: orders, loading, reload } = useLiveQuery(listWaiterOrders, {
    intervalMs: 3000,
  });
  const [busyId, setBusyId] = useState(null);

  async function handleServe(order) {
    setBusyId(order.id);
    try {
      await setOrderStatus(order.id, ORDER_STATUS.SERVED);
      await reload();
    } finally {
      setBusyId(null);
    }
  }

  const readyCount = orders?.filter((o) => o.status === ORDER_STATUS.READY).length ?? 0;

  return (
    <div className="min-h-screen bg-paper">
      <header className="px-6 pt-8 pb-6 flex items-center gap-3 border-b border-ink-100">
        <Bell className="text-brass" size={28} />
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-300">
            Floor
          </p>
          <h1 className="font-display text-2xl font-black text-ink-800">
            {readyCount > 0 ? `${readyCount} ticket${readyCount === 1 ? "" : "s"} ready` : "Service board"}
          </h1>
        </div>
      </header>

      <main className="px-6 py-6">
        {!loading && (!orders || orders.length === 0) && (
          <EmptyState
            icon={UtensilsCrossed}
            title="Nothing waiting to go out"
            message="Tickets show up here as soon as the kitchen marks them ready."
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {orders?.map((order) => (
            <WaiterOrderCard
              key={order.id}
              order={order}
              onServe={handleServe}
              busy={busyId === order.id}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
