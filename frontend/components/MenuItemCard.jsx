"use client";

import { Flame, Leaf, Minus, Plus } from "lucide-react";
import { formatMoney } from "@/lib/format";

export default function MenuItemCard({ item, quantity, onAdd, onSetQuantity }) {
  return (
    <div className="flex gap-4 py-4 border-b border-ink-100 last:border-b-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-display font-extrabold text-base text-ink-800">
            {item.name}
          </h3>
          {item.veg && <Leaf size={14} className="text-sage shrink-0" aria-label="Vegetarian" />}
          {item.spicy && <Flame size={14} className="text-flame shrink-0" aria-label="Spicy" />}
        </div>
        <p className="text-sm text-ink-400 mt-1 leading-snug">{item.description}</p>
        <p className="font-mono text-sm font-semibold text-ink-700 mt-2">
          {formatMoney(item.price)}
        </p>
      </div>

      <div className="shrink-0 self-center">
        {quantity > 0 ? (
          <div className="flex items-center gap-2 bg-ink-800 rounded-full px-1 py-1">
            <button
              type="button"
              aria-label={`Remove one ${item.name}`}
              onClick={() => onSetQuantity(item.id, quantity - 1)}
              className="w-7 h-7 flex items-center justify-center rounded-full text-paper hover:bg-ink-600"
            >
              <Minus size={14} />
            </button>
            <span className="w-5 text-center font-mono text-sm text-paper">{quantity}</span>
            <button
              type="button"
              aria-label={`Add one more ${item.name}`}
              onClick={() => onSetQuantity(item.id, quantity + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-full text-paper hover:bg-ink-600"
            >
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onAdd(item.id)}
            className="rounded-full border-2 border-flame text-flame-dark font-display font-extrabold text-sm px-4 py-2 hover:bg-flame hover:text-paper transition-colors"
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
}
