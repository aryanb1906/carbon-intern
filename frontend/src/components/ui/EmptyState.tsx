import { type ReactNode } from "react";
import { Inbox } from "lucide-react";
interface EmptyStateProps { icon?: ReactNode; title: string; description?: string; action?: ReactNode; }
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "52px 24px", gap: 12, textAlign: "center" }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF" }}>
        {icon ?? <Inbox size={24} />}
      </div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 4 }}>{title}</p>
        {description && <p style={{ fontSize: 13, color: "#9CA3AF", maxWidth: 320 }}>{description}</p>}
      </div>
      {action}
    </div>
  );
}
