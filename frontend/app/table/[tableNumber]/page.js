"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CartProvider, useCart } from "@/context/CartProvider";
import { getMenu, createOrder, getActiveOrderForTable } from "@/lib/dataLayer";
import CategoryTabs from "@/components/CategoryTabs";
import MenuItemCard from "@/components/MenuItemCard";
import CartBar from "@/components/CartBar";
import CartReviewSheet from "@/components/CartReviewSheet";
import Brand from "@/components/Brand";

export default function TablePage({ params }) {
  const tableNumber = decodeURIComponent(params.tableNumber);

  return (
    <CartProvider tableNumber={tableNumber}>
      <TableOrderingScreen tableNumber={tableNumber} />
    </CartProvider>
  );
}

function TableOrderingScreen({ tableNumber }) {
  const router = useRouter();
  const cart = useCart();

  const [menu, setMenu] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      const [menuResult, activeOrder] = await Promise.all([
        getMenu(),
        getActiveOrderForTable(tableNumber),
      ]);
      if (!active) return;

      if (activeOrder && activeOrder.status !== "paid") {
        router.replace(`/order/${activeOrder.id}`);
        return;
      }

      setMenu(menuResult);
      setActiveCategoryId(menuResult[0]?.id ?? null);
      setCheckingSession(false);
    }

    bootstrap().catch(() => setCheckingSession(false));

    return () => {
      active = false;
    };
  }, [tableNumber, router]);

  async function handlePlaceOrder() {
    setPlacing(true);
    setError(null);
    try {
      const order = await createOrder({
        tableNumber,
        items: cart.lines.map((line) => ({
          menuItemId: line.menuItemId,
          quantity: line.quantity,
          notes: line.notes,
        })),
        note,
      });
      cart.clearCart();
      router.push(`/order/${order.id}`);
    } catch (err) {
      setError(err.message || "Could not send the order. Please try again.");
      setPlacing(false);
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-sm text-ink-300 animate-pulse">Opening table {tableNumber}…</p>
      </div>
    );
  }

  const activeCategory = menu.find((category) => category.id === activeCategoryId);

  return (
    <div className="min-h-screen pb-28">
      <header className="px-5 pt-8 pb-5 bg-ink-800 text-paper rounded-b-[2rem]">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper/60 mb-1">
          Table
        </p>
        <div className="flex items-end justify-between">
          <h1 className="font-display text-4xl font-black">{tableNumber}</h1>
          <p className="font-display font-extrabold text-sm text-paper/80">
            Scan · Order · Eat
          </p>
        </div>
      </header>

      <main className="px-5 pt-5">
        <div className="mb-4">
          <Brand eyebrow="Menu" title="What looks good?" />
        </div>

        <CategoryTabs
          categories={menu}
          activeId={activeCategoryId}
          onChange={setActiveCategoryId}
        />

        <div className="mt-2">
          {activeCategory?.items.map((item) => {
            const line = cart.lines.find((l) => l.menuItemId === item.id);
            return (
              <MenuItemCard
                key={item.id}
                item={item}
                quantity={line?.quantity ?? 0}
                onAdd={cart.addItem}
                onSetQuantity={cart.setQuantity}
              />
            );
          })}
        </div>

        {error && (
          <p className="text-sm text-flame-dark bg-flame-light rounded-lg px-3 py-2 mt-4">
            {error}
          </p>
        )}
      </main>

      <CartBar
        itemCount={cart.itemCount}
        subtotal={cart.subtotal}
        onOpen={() => setSheetOpen(true)}
      />

      <CartReviewSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        tableNumber={tableNumber}
        lines={cart.lines}
        subtotal={cart.subtotal}
        onSetQuantity={cart.setQuantity}
        onSetNotes={cart.setNotes}
        note={note}
        onNoteChange={setNote}
        onPlaceOrder={handlePlaceOrder}
        placing={placing}
      />
    </div>
  );
}
