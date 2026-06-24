"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { findMenuItem } from "@/lib/menu";

const CartContext = createContext(null);

function storageKey(tableNumber) {
  return `rto_cart_${tableNumber}`;
}

export function CartProvider({ tableNumber, children }) {
  const [lines, setLines] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(storageKey(tableNumber));
      setLines(raw ? JSON.parse(raw) : []);
    } catch {
      setLines([]);
    }
    setLoaded(true);
  }, [tableNumber]);

  useEffect(() => {
    if (!loaded || typeof window === "undefined") return;
    window.localStorage.setItem(storageKey(tableNumber), JSON.stringify(lines));
  }, [lines, loaded, tableNumber]);

  function addItem(menuItemId) {
    const menuItem = findMenuItem(menuItemId);
    if (!menuItem) return;
    setLines((current) => {
      const existing = current.find((line) => line.menuItemId === menuItemId);
      if (existing) {
        return current.map((line) =>
          line.menuItemId === menuItemId
            ? { ...line, quantity: line.quantity + 1 }
            : line
        );
      }
      return [...current, { menuItemId, quantity: 1, notes: "" }];
    });
  }

  function setQuantity(menuItemId, quantity) {
    setLines((current) => {
      if (quantity <= 0) {
        return current.filter((line) => line.menuItemId !== menuItemId);
      }
      return current.map((line) =>
        line.menuItemId === menuItemId ? { ...line, quantity } : line
      );
    });
  }

  function setNotes(menuItemId, notes) {
    setLines((current) =>
      current.map((line) => (line.menuItemId === menuItemId ? { ...line, notes } : line))
    );
  }

  function clearCart() {
    setLines([]);
  }

  const enriched = useMemo(
    () =>
      lines
        .map((line) => {
          const menuItem = findMenuItem(line.menuItemId);
          if (!menuItem) return null;
          return { ...line, menuItem };
        })
        .filter(Boolean),
    [lines]
  );

  const itemCount = enriched.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = enriched.reduce(
    (sum, line) => sum + line.quantity * line.menuItem.price,
    0
  );

  const value = {
    lines: enriched,
    itemCount,
    subtotal,
    addItem,
    setQuantity,
    setNotes,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside a CartProvider");
  return ctx;
}
