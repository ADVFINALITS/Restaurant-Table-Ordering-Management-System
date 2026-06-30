"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as api from "./api";
import * as demo from "./demoStore";

export function isDemoMode() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") return true;
  return !process.env.NEXT_PUBLIC_API_BASE_URL;
}

export const getMenu = () => (isDemoMode() ? demo.demoGetMenu() : api.apiGetMenu());

export const createOrder = (payload) =>
  isDemoMode() ? demo.demoCreateOrder(payload) : api.apiCreateOrder(payload);

export const getOrder = (orderId) =>
  isDemoMode() ? demo.demoGetOrder(orderId) : api.apiGetOrder(orderId);

export const getActiveOrderForTable = (tableNumber) =>
  isDemoMode()
    ? demo.demoGetActiveOrderForTable(tableNumber)
    : api.apiGetActiveOrderForTable(tableNumber);

export const listKitchenOrders = () =>
  isDemoMode() ? demo.demoListKitchenOrders() : api.apiListKitchenOrders();

export const listWaiterOrders = () =>
  isDemoMode() ? demo.demoListWaiterOrders() : api.apiListWaiterOrders();

export const setOrderStatus = (orderId, status) =>
  isDemoMode()
    ? demo.demoSetOrderStatus(orderId, status)
    : api.apiSetOrderStatus(orderId, status);

export const payOrder = (orderId, paymentMethod) =>
  isDemoMode() ? demo.demoPayOrder(orderId, paymentMethod) : api.apiPayOrder(orderId, paymentMethod);

// Polls `fetcher` on an interval and re-runs instantly when the demo
// store changes in another tab (kitchen tab updates the moment the
// customer tab places an order, etc). In real mode this is plain
// polling, which a Rails app can satisfy with no extra work; it can
// be swapped for ActionCable / websockets later without touching
// any component that calls this hook.
export function useLiveQuery(fetcher, { intervalMs = 4000, deps = [] } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const reload = useCallback(async () => {
    try {
      const result = await fetcherRef.current();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let intervalId = null;

    const run = async () => {
      if (cancelled) return;
      await reload();
    };

    run();
    intervalId = setInterval(run, intervalMs);

    const unsubscribe = isDemoMode() ? demo.subscribeToDemoChanges(run) : () => {};

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, loading, reload };
}
