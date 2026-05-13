"use client";

import { useSyncExternalStore } from "react";

// Stable no-op subscription — the value never changes after mount,
// so we don't actually need to fire any updates.
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Returns `true` once the component has mounted on the client.
 * Use this instead of the `useState`/`useEffect` "mounted" idiom
 * to avoid the cascading-render warning from `react-hooks/set-state-in-effect`
 * while still rendering deterministic markup during SSR.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
