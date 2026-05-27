import { LayoutDashboard, Database, Upload, ClipboardCheck, History, Settings, LogOut, ChevronDown, Building2, Leaf } from "lucide-react";

type Page = "dashboard"|"sources"|"ingestion"|"review"|"audit"|"settings";
interface Props { current: Page; onNav: (p: Page) => void; onLogout: () => void; userName: string; userRole: string; orgName: string; }

const NAV: { id: Page; label: string; Icon: any; badge?: number }[] = [
  { id: "dashboard", label: "Dashboard",    Icon: LayoutDashboard },
  { id: "sources",   label: "Data Sources", Icon: Database },
  { id: "ingestion", label: "Ingestion",    Icon: Upload },
  { id: "review",    label: "Review",       Icon: ClipboardCheck, badge: 3 },
  { id: "audit",     label: "Audit Log",    Icon: History },
  { id: "settings",  label: "Settings",     Icon: Settings },
];

export function Sidebar({ current, onNav, onLogout, userName, userRole, orgName }: Props) {
  const initials = userName.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();
  return (
    <aside style={{ width: 220, background: "#FFFFFF", borderRight: "1px solid #E5E7EB", display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid #F3F4F6" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 29, height: 29, borderRadius: 7, background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Leaf size={15} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#111827", letterSpacing: "-0.2px" }}>CarbonTrace</span>
        </div>
      </div>
      {/* Org */}
      <div style={{ padding: "10px 10px 6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 9px", borderRadius: 8, background: "#F9FAFB", border: "1px solid #F3F4F6", cursor: "pointer" }}>
          <div style={{ width: 22, height: 22, borderRadius: 5, background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Building2 size={12} color="#2563EB" />
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{orgName}</span>
          <ChevronDown size={12} color="#9CA3AF" />
        </div>
      </div>
      {/* Nav */}
      <nav style={{ flex: 1, padding: "4px 8px", overflowY: "auto" }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#D1D5DB", letterSpacing: "0.08em", textTransform: "uppercase", padding: "8px 8px 4px" }}>MAIN</p>
        {NAV.map(item => {
          const active = current === item.id;
          return (
            <button key={item.id} onClick={() => onNav(item.id)} style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "8px 9px", borderRadius: 7, border: "none", cursor: "pointer", background: active ? "#EFF6FF" : "transparent", color: active ? "#2563EB" : "#6B7280", fontSize: 13, fontWeight: active ? 700 : 500, fontFamily: "inherit", marginBottom: 1, textAlign: "left", transition: "all .1s" }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "#F9FAFB"; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              <item.Icon size={15} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && <span style={{ background: "#2563EB", color: "white", borderRadius: 100, fontSize: 10, fontWeight: 700, padding: "1px 6px" }}>{item.badge}</span>}
            </button>
          );
        })}
      </nav>
      {/* User */}
      <div style={{ padding: "10px 12px", borderTop: "1px solid #F3F4F6" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#2563EB", flexShrink: 0 }}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName}</div>
            <div style={{ fontSize: 11, color: "#9CA3AF", textTransform: "capitalize" }}>{userRole}</div>
          </div>
          <button onClick={onLogout} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 4, display: "flex", color: "#9CA3AF" }} title="Logout">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
