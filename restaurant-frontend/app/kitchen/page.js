"use client";

import { useState } from "react";
import { ChefHat, Flame } from "lucide-react";
import { useLiveQuery, listKitchenOrders, setOrderStatus } from "@/lib/dataLayer";
import { ORDER_STATUS } from "@/lib/orderStatus";
import KitchenOrderCard from "@/components/KitchenOrderCard";
import EmptyState from "@/components/EmptyState";

export default function KitchenPage() {
  const { data: orders, loading, reload } = useLiveQuery(listKitchenOrders, {
    intervalMs: 3000,
  });
  const [busyId, setBusyId] = useState(null);

  async function handleAdvance(order) {
    setBusyId(order.id);
    const nextStatus =
      order.status === ORDER_STATUS.PLACED ? ORDER_STATUS.PREPARING : ORDER_STATUS.READY;
    try {
      await setOrderStatus(order.id, nextStatus);
      await reload();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="min-h-screen bg-ink-800 text-paper">
      <header className="px-6 pt-8 pb-6 flex items-center gap-3 border-b border-ink-600">
        <Flame className="text-flame" size={28} />
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper/50">
            Kitchen pass
          </p>
          <h1 className="font-display text-2xl font-black">Tickets on the rail</h1>
        </div>
      </header>

      <main className="px-6 py-6">
        {!loading && (!orders || orders.length === 0) && (
          <EmptyState
            icon={ChefHat}
            title="The pass is clear"
            message="New orders will land here the moment a table sends one."
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {orders?.map((order) => (
            <KitchenOrderCard
              key={order.id}
              order={order}
              onAdvance={handleAdvance}
              busy={busyId === order.id}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
