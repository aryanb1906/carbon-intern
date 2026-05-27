import { type ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps { open: boolean; onClose: () => void; title: string; subtitle?: string; children: ReactNode; width?: number; }

export function Modal({ open, onClose, title, subtitle, children, width = 520 }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.35)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 14, width: "100%", maxWidth: width, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,.18)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "18px 20px", borderBottom: "1px solid #F3F4F6" }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{title}</h3>
            {subtitle && <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#9CA3AF", padding: 4, display: "flex", borderRadius: 6 }}>
            <X size={16} />
          </button>
        </div>
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
}
