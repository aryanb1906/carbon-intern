import { type ReactNode, type CSSProperties } from "react";

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  noPad?: boolean;
  hover?: boolean;
  className?: string;
}

export function Card({ children, style, noPad, hover }: CardProps) {
  const base: CSSProperties = {
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: 12,
    padding: noPad ? 0 : 20,
    transition: hover ? "box-shadow .15s, transform .15s" : undefined,
    ...style,
  };
  return (
    <div
      style={base}
      onMouseEnter={e => hover && Object.assign((e.currentTarget as HTMLDivElement).style, { boxShadow: "0 4px 16px rgba(0,0,0,.08)", transform: "translateY(-1px)" })}
      onMouseLeave={e => hover && Object.assign((e.currentTarget as HTMLDivElement).style, { boxShadow: "none", transform: "none" })}
    >
      {children}
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number | null;
  icon: ReactNode;
  iconColor: string;
  iconBg: string;
  suffix?: string;
}

export function MetricCard({ label, value, change, icon, iconColor, iconBg, suffix }: MetricCardProps) {
  return (
    <Card style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>{label}</span>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", color: iconColor, flexShrink: 0 }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: "#111827", letterSpacing: "-0.5px", marginBottom: 5 }}>
        {value}{suffix && <span style={{ fontSize: 14, fontWeight: 500, color: "#9CA3AF", marginLeft: 4 }}>{suffix}</span>}
      </div>
      {change != null && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: change >= 0 ? "#16A34A" : "#DC2626" }}>
          <span>{change >= 0 ? "↑" : "↓"} {Math.abs(change)}%</span>
          <span style={{ color: "#9CA3AF" }}>vs last month</span>
        </div>
      )}
    </Card>
  );
}

export function SectionCard({ title, subtitle, action, children, noPad }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode; noPad?: boolean }) {
  return (
    <Card noPad>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{title}</h3>
          {subtitle && <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{subtitle}</p>}
        </div>
        {action}
      </div>
      <div style={noPad ? undefined : { padding: 20 }}>{children}</div>
    </Card>
  );
}
