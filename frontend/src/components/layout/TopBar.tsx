import { Bell, Search } from "lucide-react";
import { useState } from "react";

interface Props { title: string; subtitle?: string; }

export function TopBar({ title, subtitle }: Props) {
  const [q, setQ] = useState("");
  return (
    <header style={{ background: "#FFFFFF", borderBottom: "1px solid #E5E7EB", padding: "0 26px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 20 }}>
      <div>
        <h1 style={{ fontSize: 15, fontWeight: 700, color: "#111827", letterSpacing: "-0.1px" }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>{subtitle}</p>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", border: "1px solid #E5E7EB", borderRadius: 8, background: "#F9FAFB" }}>
          <Search size={13} color="#9CA3AF" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search records…" style={{ border: "none", background: "transparent", fontSize: 13, color: "#374151", outline: "none", width: 170, fontFamily: "inherit" }} />
        </div>
        <div style={{ position: "relative" }}>
          <button style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid #E5E7EB", background: "#F9FAFB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bell size={14} color="#6B7280" />
          </button>
          <div style={{ position: "absolute", top: 8, right: 8, width: 6, height: 6, borderRadius: "50%", background: "#EF4444", border: "1.5px solid white" }} />
        </div>
      </div>
    </header>
  );
}
