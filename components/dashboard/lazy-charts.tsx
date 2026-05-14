"use client";

import dynamic from "next/dynamic";

// Lazy-load the recharts bundle. Charts are only used inside dashboard pages,
// so they should never ship in the initial entry bundle. SSR is disabled
// because recharts measures DOM dimensions on mount.
function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div
      className="w-full animate-pulse rounded-md bg-muted/50"
      style={{ height }}
    />
  );
}

export const AppointmentsByBranchChart = dynamic(
  () =>
    import("./charts").then((m) => ({ default: m.AppointmentsByBranchChart })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export const AppointmentsTrendChart = dynamic(
  () =>
    import("./charts").then((m) => ({ default: m.AppointmentsTrendChart })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export const SalesTrendChart = dynamic(
  () => import("./charts").then((m) => ({ default: m.SalesTrendChart })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);
