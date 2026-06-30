"use client";

import { Minus, Plus, X } from "lucide-react";
import { formatMoney } from "@/lib/format";

export default function CartReviewSheet({
  open,
  onClose,
  tableNumber,
  lines,
  subtotal,
  onSetQuantity,
  onSetNotes,
  note,
  onNoteChange,
  onPlaceOrder,
  placing,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close order review"
        onClick={onClose}
        className="absolute inset-0 bg-ink-900/60"
      />

      <div className="relative bg-paper rounded-t-3xl shadow-ticket max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-ink-100">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-300">
              Table {tableNumber}
            </p>
            <h2 className="font-display font-extrabold text-xl">Your order</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-ink-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 divide-y divide-ink-100">
          {lines.length === 0 && (
            <p className="text-ink-400 py-8 text-center">Your order is empty.</p>
          )}
          {lines.map((line) => (
            <div key={line.menuItemId} className="py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display font-extrabold text-ink-800">
                    {line.menuItem.name}
                  </p>
                  <p className="font-mono text-sm text-ink-500 mt-0.5">
                    {formatMoney(line.menuItem.price)} each
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-ink-800 rounded-full px-1 py-1 shrink-0">
                  <button
                    type="button"
                    aria-label={`Remove one ${line.menuItem.name}`}
                    onClick={() => onSetQuantity(line.menuItemId, line.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-full text-paper hover:bg-ink-600"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-5 text-center font-mono text-sm text-paper">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label={`Add one more ${line.menuItem.name}`}
                    onClick={() => onSetQuantity(line.menuItemId, line.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-full text-paper hover:bg-ink-600"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={line.notes}
                onChange={(event) => onSetNotes(line.menuItemId, event.target.value)}
                placeholder="Add a note (e.g. no onions)"
                className="mt-2 w-full text-sm bg-ink-50 rounded-lg px-3 py-2 placeholder:text-ink-300"
              />
            </div>
          ))}
        </div>

        {lines.length > 0 && (
          <div className="px-5 pt-3">
            <textarea
              value={note}
              onChange={(event) => onNoteChange(event.target.value)}
              placeholder="Note for the whole table (optional)"
              rows={2}
              className="w-full text-sm bg-ink-50 rounded-lg px-3 py-2 placeholder:text-ink-300 resize-none"
            />
          </div>
        )}

        <div className="px-5 py-5 border-t border-ink-100 bg-paper">
          <div className="flex items-center justify-between mb-4">
            <span className="font-display font-bold text-ink-600">Subtotal</span>
            <span className="font-mono font-bold text-lg">{formatMoney(subtotal)}</span>
          </div>
          <button
            type="button"
            disabled={lines.length === 0 || placing}
            onClick={onPlaceOrder}
            className="w-full bg-flame disabled:bg-ink-200 disabled:text-ink-400 text-paper font-display font-extrabold rounded-xl py-4 text-base shadow-ticket"
          >
            {placing ? "Sending to the kitchen…" : "Place order"}
          </button>
          <p className="text-xs text-ink-300 text-center mt-2">
            Prices include service charge and VAT on the final bill.
          </p>
        </div>
      </div>
    </div>
  );
}
