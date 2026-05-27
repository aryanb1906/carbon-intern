/**
 * Shared formatting utilities for ESG data display.
 */

/** Format tCO2e values with appropriate precision */
export function formatCO2e(value: number | null | undefined, unit = "tCO₂e"): string {
  if (value == null) return "—";
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k ${unit}`;
  if (value >= 10)   return `${value.toFixed(1)} ${unit}`;
  return `${value.toFixed(3)} ${unit}`;
}

/** Format large numbers with locale separators */
export function formatNumber(n: number | null | undefined): string {
  if (n == null) return "—";
  return n.toLocaleString("en-US");
}

/** Format bytes to KB/MB/GB */
export function formatBytes(bytes: number): string {
  if (bytes < 1024)         return `${bytes} B`;
  if (bytes < 1024 ** 2)    return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3)    return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

/** "2024-01-15" → "Jan 15, 2024" */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

/** ISO datetime → "2 hours ago" */
export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1)    return "just now";
  if (mins < 60)   return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs  < 24)   return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7)    return `${days}d ago`;
  return formatDate(iso);
}

/** Risk score 0-1 → percentage string */
export function formatRisk(score: number): string {
  return `${Math.round(score * 100)}%`;
}

export const SCOPE_COLOR: Record<number, string> = {
  1: "#2563EB", 2: "#7C3AED", 3: "#059669",
};
export const SCOPE_BG: Record<number, string> = {
  1: "#EFF6FF", 2: "#F5F3FF", 3: "#ECFDF5",
};
export const STATUS_COLOR = {
  approved: { bg: "#DCFCE7", text: "#15803D" },
  pending:  { bg: "#FEF3C7", text: "#B45309" },
  rejected: { bg: "#FEE2E2", text: "#B91C1C" },
  flagged:  { bg: "#FED7AA", text: "#C2410C" },
} as const;
export const RISK_COLOR = {
  low:    { bg: "#DCFCE7", text: "#16A34A" },
  medium: { bg: "#FEF3C7", text: "#D97706" },
  high:   { bg: "#FEE2E2", text: "#DC2626" },
} as const;
