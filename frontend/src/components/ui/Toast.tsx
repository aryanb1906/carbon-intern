import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";
export interface ToastItem { id: string; type: ToastType; title: string; message?: string; }

const ICONS = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info };
const COLORS = {
  success: { bg: "#DCFCE7", border: "#86EFAC", icon: "#16A34A", text: "#15803D" },
  error:   { bg: "#FEE2E2", border: "#FCA5A5", icon: "#DC2626", text: "#B91C1C" },
  warning: { bg: "#FEF3C7", border: "#FCD34D", icon: "#D97706", text: "#B45309" },
  info:    { bg: "#EFF6FF", border: "#BFDBFE", icon: "#2563EB", text: "#1D4ED8" },
};

function Toast({ toast, onRemove }: { toast: ToastItem; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false);
  const c = COLORS[toast.type];
  const Icon = ICONS[toast.type];
  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
    const t = setTimeout(() => { setVisible(false); setTimeout(() => onRemove(toast.id), 300); }, 4000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, maxWidth: 360, boxShadow: "0 4px 12px rgba(0,0,0,.08)", transition: "all .3s", opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(20px)" }}>
      <Icon size={16} color={c.icon} style={{ marginTop: 1, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{toast.title}</p>
        {toast.message && <p style={{ fontSize: 12, color: c.text, opacity: 0.8, marginTop: 2 }}>{toast.message}</p>}
      </div>
      <button onClick={() => onRemove(toast.id)} style={{ border: "none", background: "transparent", cursor: "pointer", color: c.icon, padding: 0, display: "flex" }}>
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onRemove }: { toasts: ToastItem[]; onRemove: (id: string) => void }) {
  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map(t => <Toast key={t.id} toast={t} onRemove={onRemove} />)}
    </div>
  );
}
