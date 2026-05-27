import { type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface BadgeProps { bg: string; text: string; children: ReactNode; }

export function Badge({ bg, text, children }: BadgeProps) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 9px", borderRadius: 100,
      fontSize: 11, fontWeight: 600,
      background: bg, color: text, whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

const STATUS_CFG = {
  approved: { bg: "#DCFCE7", text: "#15803D", label: "Approved" },
  pending:  { bg: "#FEF3C7", text: "#B45309", label: "Pending"  },
  rejected: { bg: "#FEE2E2", text: "#B91C1C", label: "Rejected" },
  flagged:  { bg: "#FED7AA", text: "#C2410C", label: "Flagged"  },
} as const;

const RISK_CFG = {
  low:    { bg: "#DCFCE7", text: "#16A34A", label: "Low"    },
  medium: { bg: "#FEF3C7", text: "#D97706", label: "Medium" },
  high:   { bg: "#FEE2E2", text: "#DC2626", label: "High"   },
} as const;

const SCOPE_CFG = {
  1: { bg: "#EFF6FF", text: "#2563EB" },
  2: { bg: "#F5F3FF", text: "#7C3AED" },
  3: { bg: "#ECFDF5", text: "#059669" },
} as const;

export function StatusBadge({ status }: { status: string }) {
  const c = STATUS_CFG[status as keyof typeof STATUS_CFG] ?? STATUS_CFG.pending;
  return <Badge bg={c.bg} text={c.text}>{c.label}</Badge>;
}

export function RiskBadge({ risk }: { risk: string }) {
  const c = RISK_CFG[risk as keyof typeof RISK_CFG] ?? RISK_CFG.low;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      padding: "2px 8px", borderRadius: 5,
      fontSize: 11, fontWeight: 700,
      background: c.bg, color: c.text,
    }}>
      {risk === "high" && <AlertTriangle size={10} />}
      {c.label}
    </span>
  );
}

export function ScopeBadge({ scope }: { scope: number }) {
  const c = SCOPE_CFG[scope as keyof typeof SCOPE_CFG] ?? SCOPE_CFG[1];
  return <Badge bg={c.bg} text={c.text}>S{scope}</Badge>;
}

export function SourceTypeBadge({ type }: { type: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    sap:     { bg: "#EFF6FF", text: "#1D4ED8", label: "SAP"     },
    utility: { bg: "#F5F3FF", text: "#6D28D9", label: "Utility" },
    travel:  { bg: "#ECFDF5", text: "#065F46", label: "Travel"  },
    custom:  { bg: "#F3F4F6", text: "#374151", label: "Custom"  },
  };
  const c = map[type] ?? map.custom;
  return <Badge bg={c.bg} text={c.text}>{c.label}</Badge>;
}
