"use client";

import { ShoppingBag } from "lucide-react";
import { formatMoney } from "@/lib/format";

export default function CartBar({ itemCount, subtotal, onOpen }) {
  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
      <button
        type="button"
        onClick={onOpen}
        className="w-full max-w-md mx-auto flex items-center justify-between bg-flame text-paper font-display font-extrabold rounded-2xl shadow-ticket px-5 py-4"
      >
        <span className="flex items-center gap-2">
          <ShoppingBag size={20} />
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
        <span className="flex items-center gap-2">
          View order
          <span className="font-mono">{formatMoney(subtotal)}</span>
        </span>
      </button>
    </div>
  );
}
