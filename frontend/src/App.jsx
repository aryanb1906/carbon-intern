import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  LayoutDashboard, Database, Upload, ClipboardCheck, History,
  Settings, LogOut, Bell, Search, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, XCircle, Clock, MoreHorizontal,
  Eye, RefreshCw, Plus, ArrowUpRight, Leaf, Zap, Plane,
  FileText, Shield, Users, Key, ChevronDown, X, Check,
  Activity, Download, FileUp, Building2, Globe, Lock, Mail,
  ChevronRight, Cpu, BarChart3
} from "lucide-react";

// ── Font & global style injection ────────────────────────────────────────────
(function () {
  if (!document.getElementById("ct-font")) {
    const l = document.createElement("link");
    l.id = "ct-font";
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";
    document.head.appendChild(l);
  }
  if (!document.getElementById("ct-style")) {
    const s = document.createElement("style");
    s.id = "ct-style";
    s.textContent = `
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      html,body,#root{height:100%}
      body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:#F4F4F0;color:#111827;-webkit-font-smoothing:antialiased}
      ::-webkit-scrollbar{width:5px;height:5px}
      ::-webkit-scrollbar-track{background:transparent}
      ::-webkit-scrollbar-thumb{background:#D1D5DB;border-radius:10px}
      .mono{font-family:'JetBrains Mono',monospace !important}
      @keyframes spin{to{transform:rotate(360deg)}}
      @keyframes pulse2{0%,100%{opacity:1}50%{opacity:0.4}}
      .spin{animation:spin 1s linear infinite}
      .pulse{animation:pulse2 1.5s ease-in-out infinite}
    `;
    document.head.appendChild(s);
  }
})();

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════

const emissionsMonthly = [
  { month: "Jan", scope1: 380, scope2: 220, scope3: 540 },
  { month: "Feb", scope1: 420, scope2: 198, scope3: 610 },
  { month: "Mar", scope1: 395, scope2: 240, scope3: 580 },
  { month: "Apr", scope1: 450, scope2: 210, scope3: 620 },
  { month: "May", scope1: 410, scope2: 230, scope3: 590 },
  { month: "Jun", scope1: 480, scope2: 255, scope3: 670 },
  { month: "Jul", scope1: 460, scope2: 235, scope3: 640 },
  { month: "Aug", scope1: 440, scope2: 215, scope3: 615 },
  { month: "Sep", scope1: 395, scope2: 205, scope3: 572 },
  { month: "Oct", scope1: 420, scope2: 225, scope3: 600 },
  { month: "Nov", scope1: 435, scope2: 240, scope3: 632 },
  { month: "Dec", scope1: 470, scope2: 260, scope3: 680 },
];

const scopeDistribution = [
  { name: "Scope 1 · Direct", value: 35, color: "#2563EB" },
  { name: "Scope 2 · Electricity", value: 22, color: "#7C3AED" },
  { name: "Scope 3 · Value Chain", value: 43, color: "#059669" },
];

const records = [
  { id: "REC-001", source: "SAP Fuel", category: "Natural Gas", date: "2024-01-15", facility: "Berlin HQ", amount: 12500, unit: "kWh", normalized: 4.21, scope: 1, status: "approved", risk: "low", co2e: 2.28 },
  { id: "REC-002", source: "Utility Bills", category: "Electricity", date: "2024-01-16", facility: "Munich Plant", amount: 45000, unit: "kWh", normalized: 45.0, scope: 2, status: "pending", risk: "medium", co2e: 18.45 },
  { id: "REC-003", source: "Travel Data", category: "Air Travel", date: "2024-01-17", facility: "Corporate", amount: 8, unit: "flights", normalized: 12400, scope: 3, status: "flagged", risk: "high", co2e: 7.44 },
  { id: "REC-004", source: "SAP Fuel", category: "Diesel", date: "2024-01-18", facility: "Hamburg Depot", amount: 3200, unit: "liters", normalized: 3.2, scope: 1, status: "approved", risk: "low", co2e: 8.54 },
  { id: "REC-005", source: "Utility Bills", category: "Natural Gas", date: "2024-01-19", facility: "Frankfurt Office", amount: 9800, unit: "kWh", normalized: 9.8, scope: 2, status: "rejected", risk: "high", co2e: 0 },
  { id: "REC-006", source: "Travel Data", category: "Hotel", date: "2024-01-20", facility: "Corporate", amount: 24, unit: "nights", normalized: 24.0, scope: 3, status: "pending", risk: "low", co2e: 2.88 },
  { id: "REC-007", source: "SAP Fuel", category: "Petrol", date: "2024-01-21", facility: "Berlin HQ", amount: 1800, unit: "liters", normalized: 1.8, scope: 1, status: "approved", risk: "low", co2e: 4.23 },
  { id: "REC-008", source: "Utility Bills", category: "Electricity", date: "2024-01-22", facility: "Munich Plant", amount: 67000, unit: "kWh", normalized: 67.0, scope: 2, status: "flagged", risk: "high", co2e: 27.47 },
  { id: "REC-009", source: "Travel Data", category: "Rail", date: "2024-01-23", facility: "Corporate", amount: 14, unit: "trips", normalized: 8200, scope: 3, status: "approved", risk: "low", co2e: 0.41 },
  { id: "REC-010", source: "SAP Fuel", category: "LPG", date: "2024-01-24", facility: "Stuttgart Lab", amount: 520, unit: "kg", normalized: 0.52, scope: 1, status: "pending", risk: "medium", co2e: 1.56 },
];

const auditLogs = [
  { id: 1, user: "Sarah Chen", action: "approved", record: "REC-001", field: "status", old: "pending", next: "approved", time: "2 hours ago", avatar: "SC" },
  { id: 2, user: "Marco Rossi", action: "flagged", record: "REC-003", field: "risk_score", old: "medium", next: "high", time: "4 hours ago", avatar: "MR" },
  { id: 3, user: "AI System", action: "detected", record: "REC-008", field: "anomaly", old: null, next: "Consumption 3.2σ above facility baseline", time: "6 hours ago", avatar: "AI" },
  { id: 4, user: "Anna Weber", action: "rejected", record: "REC-005", field: "status", old: "pending", next: "rejected", time: "1 day ago", avatar: "AW" },
  { id: 5, user: "James Liu", action: "uploaded", record: "FILE-012", field: "file", old: null, next: "utility_jan_2024.csv (2.4 MB, 1,847 rows)", time: "1 day ago", avatar: "JL" },
  { id: 6, user: "Sarah Chen", action: "edited", record: "REC-004", field: "amount", old: "3100", next: "3200", time: "2 days ago", avatar: "SC" },
  { id: 7, user: "Anna Weber", action: "approved", record: "REC-007", field: "status", old: "pending", next: "approved", time: "2 days ago", avatar: "AW" },
  { id: 8, user: "AI System", action: "detected", record: "REC-005", field: "anomaly", old: null, next: "Duplicate entry suspected — same facility, overlapping billing period", time: "3 days ago", avatar: "AI" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS & CONFIGS
// ═══════════════════════════════════════════════════════════════════════════════

const STATUS = {
  approved: { label: "Approved", bg: "#DCFCE7", text: "#15803D" },
  pending:  { label: "Pending",  bg: "#FEF3C7", text: "#B45309" },
  rejected: { label: "Rejected", bg: "#FEE2E2", text: "#B91C1C" },
  flagged:  { label: "Flagged",  bg: "#FED7AA", text: "#C2410C" },
};

const RISK = {
  low:    { label: "Low",    bg: "#DCFCE7", text: "#16A34A" },
  medium: { label: "Medium", bg: "#FEF3C7", text: "#D97706" },
  high:   { label: "High",   bg: "#FEE2E2", text: "#DC2626" },
};

const SCOPE_COLOR = { 1: "#2563EB", 2: "#7C3AED", 3: "#059669" };
const SCOPE_BG    = { 1: "#EFF6FF", 2: "#F5F3FF", 3: "#ECFDF5" };

const ACTION_STYLE = {
  approved: { bg: "#DCFCE7", text: "#15803D" },
  flagged:  { bg: "#FED7AA", text: "#C2410C" },
  detected: { bg: "#F5F3FF", text: "#7C3AED" },
  rejected: { bg: "#FEE2E2", text: "#B91C1C" },
  uploaded: { bg: "#EFF6FF", text: "#1D4ED8" },
  edited:   { bg: "#FEF3C7", text: "#B45309" },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRIMITIVE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const Pill = ({ label, bg, text }) => (
  <span style={{
    display: "inline-flex", alignItems: "center",
    padding: "2px 9px", borderRadius: 100,
    fontSize: 11, fontWeight: 600,
    background: bg, color: text,
    whiteSpace: "nowrap",
  }}>{label}</span>
);

const StatusBadge = ({ s }) => { const c = STATUS[s] || STATUS.pending; return <Pill label={c.label} bg={c.bg} text={c.text} />; };
const RiskBadge   = ({ r }) => {
  const c = RISK[r] || RISK.low;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      padding: "2px 8px", borderRadius: 5,
      fontSize: 11, fontWeight: 700,
      background: c.bg, color: c.text,
    }}>
      {r === "high" && <AlertTriangle size={10} />}
      {c.label}
    </span>
  );
};
const ScopeBadge  = ({ scope }) => (
  <span style={{
    display: "inline-flex", padding: "2px 8px", borderRadius: 100,
    fontSize: 11, fontWeight: 600,
    background: SCOPE_BG[scope], color: SCOPE_COLOR[scope],
  }}>S{scope}</span>
);

const Card = ({ children, style, noPad }) => (
  <div style={{
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: 12,
    padding: noPad ? 0 : 20,
    ...style,
  }}>{children}</div>
);

const Metric = ({ label, value, change, Icon, icolor, ibg }) => (
  <Card style={{ flex: 1, minWidth: 0 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
      <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>{label}</span>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: ibg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={15} color={icolor} />
      </div>
    </div>
    <div style={{ fontSize: 26, fontWeight: 700, color: "#111827", marginBottom: 5, letterSpacing: "-0.5px" }}>{value}</div>
    {change != null && (
      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: change >= 0 ? "#16A34A" : "#DC2626" }}>
        {change >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
        <span>{Math.abs(change)}% vs last month</span>
      </div>
    )}
  </Card>
);

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1F2937", borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      <p style={{ color: "#9CA3AF", marginBottom: 6 }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, color: "#F9FAFB" }}>
          <div style={{ width: 7, height: 7, borderRadius: 2, background: p.color }} />
          <span>{p.name}: <strong>{p.value}</strong> tCO₂e</span>
        </div>
      ))}
    </div>
  );
};

const SectionHead = ({ title, sub, action }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
    <div>
      <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827", marginBottom: 2 }}>{title}</h2>
      {sub && <p style={{ fontSize: 13, color: "#9CA3AF" }}>{sub}</p>}
    </div>
    {action}
  </div>
);

const Btn = ({ children, variant = "primary", onClick, icon: Icon, small }) => {
  const styles = {
    primary:   { bg: "#2563EB", color: "#FFFFFF", border: "none" },
    secondary: { bg: "#FFFFFF", color: "#374151", border: "1px solid #E5E7EB" },
    ghost:     { bg: "transparent", color: "#6B7280", border: "none" },
    danger:    { bg: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA" },
    success:   { bg: "#16A34A", color: "#FFFFFF", border: "none" },
  };
  const s = styles[variant];
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: small ? "6px 12px" : "8px 16px",
        background: s.bg, color: s.color, border: s.border,
        borderRadius: 7, fontSize: small ? 12 : 13, fontWeight: 600,
        cursor: "pointer", fontFamily: "inherit", transition: "opacity .1s",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
    >
      {Icon && <Icon size={small ? 12 : 14} />}
      {children}
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("analyst@acme-corp.com");
  const [pass,  setPass]  = useState("demo1234");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1100));
    setLoading(false);
    onLogin();
  };

  const inp = {
    width: "100%", padding: "10px 12px 10px 38px",
    border: "1px solid #E5E7EB", borderRadius: 8,
    fontSize: 14, fontFamily: "inherit", color: "#111827",
    background: "#FFFFFF", outline: "none",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      {/* Left brand panel */}
      <div style={{
        width: "44%", background: "#0D1117",
        padding: 52, display: "flex", flexDirection: "column",
        justifyContent: "space-between", position: "relative", overflow: "hidden",
      }}>
        <svg style={{ position: "absolute", inset: 0, opacity: 0.04 }} width="100%" height="100%">
          <defs>
            <pattern id="dot" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot)" />
        </svg>

        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 72 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Leaf size={18} color="white" />
            </div>
            <span style={{ color: "#FFFFFF", fontWeight: 700, fontSize: 17, letterSpacing: "-0.3px" }}>CarbonTrace</span>
          </div>

          <h1 style={{ color: "#FFFFFF", fontSize: 34, fontWeight: 700, lineHeight: 1.2, marginBottom: 14, letterSpacing: "-0.5px" }}>
            Enterprise ESG<br />Intelligence Platform
          </h1>
          <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.75 }}>
            Ingest, normalize, and audit Scope 1, 2, and 3 emissions data with enterprise-grade controls and real-time anomaly detection.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 36 }}>
            {[
              { icon: Shield, label: "SOC 2 Type II" },
              { icon: Globe, label: "GHG Protocol" },
              { icon: Activity, label: "Anomaly Detection" },
              { icon: BarChart3, label: "Real-time Analytics" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: 9, padding: "10px 12px",
                borderRadius: 8, background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}>
                <Icon size={14} color="#475569" />
                <span style={{ color: "#475569", fontSize: 12, fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 12, color: "#1E3A5F" }}>© 2024 CarbonTrace Inc. · SOC 2 Certified</div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ flex: 1, background: "#F4F4F0", display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 5, letterSpacing: "-0.3px" }}>Sign in</h2>
            <p style={{ fontSize: 14, color: "#6B7280" }}>Access your ESG workspace</p>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email address</label>
            <div style={{ position: "relative" }}>
              <Mail size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inp} />
            </div>
          </div>

          <div style={{ marginBottom: 22 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} style={inp} />
            </div>
          </div>

          <button
            onClick={submit}
            disabled={loading}
            style={{
              width: "100%", padding: "11px",
              background: loading ? "#93C5FD" : "#2563EB",
              color: "white", border: "none", borderRadius: 8,
              fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit", letterSpacing: "0.01em", transition: "background .15s",
            }}
          >
            {loading ? "Authenticating…" : "Sign in →"}
          </button>

          <div style={{
            marginTop: 20, padding: "12px 14px", background: "#F0F9FF",
            borderRadius: 8, border: "1px solid #BAE6FD",
          }}>
            <p style={{ fontSize: 12, color: "#0369A1", fontWeight: 500, marginBottom: 2 }}>Demo credentials</p>
            <p style={{ fontSize: 12, color: "#0284C7" }}>Any email/password will authenticate</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════════

const NAV = [
  { id: "dashboard", label: "Dashboard",    Icon: LayoutDashboard },
  { id: "sources",   label: "Data Sources", Icon: Database },
  { id: "ingestion", label: "Ingestion",    Icon: Upload },
  { id: "review",    label: "Review",       Icon: ClipboardCheck, badge: 3 },
  { id: "audit",     label: "Audit Log",    Icon: History },
  { id: "settings",  label: "Settings",     Icon: Settings },
];

function Sidebar({ cur, onNav, onLogout }) {
  return (
    <div style={{
      width: 216, background: "#FFFFFF", borderRight: "1px solid #E5E7EB",
      display: "flex", flexDirection: "column", height: "100vh",
      position: "sticky", top: 0, flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid #F3F4F6" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 29, height: 29, borderRadius: 7, background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Leaf size={15} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", letterSpacing: "-0.2px" }}>CarbonTrace</div>
          </div>
        </div>
      </div>

      {/* Org pill */}
      <div style={{ padding: "10px 10px 6px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, padding: "7px 9px",
          borderRadius: 8, background: "#F9FAFB", cursor: "pointer",
          border: "1px solid #F3F4F6",
        }}>
          <div style={{ width: 22, height: 22, borderRadius: 5, background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Building2 size={12} color="#2563EB" />
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>ACME Corporation</span>
          <ChevronDown size={12} color="#9CA3AF" />
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "4px 8px", overflowY: "auto" }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#C4C4C0", letterSpacing: "0.08em", textTransform: "uppercase", padding: "8px 8px 4px" }}>Main</p>
        {NAV.map(item => {
          const active = cur === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 9, width: "100%",
                padding: "8px 9px", borderRadius: 7, border: "none", cursor: "pointer",
                background: active ? "#EFF6FF" : "transparent",
                color: active ? "#2563EB" : "#6B7280",
                fontSize: 13, fontWeight: active ? 700 : 500,
                fontFamily: "inherit", marginBottom: 1,
                transition: "background .1s, color .1s", textAlign: "left",
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#F9FAFB"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <item.Icon size={15} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{ background: "#2563EB", color: "white", borderRadius: 100, fontSize: 10, fontWeight: 700, padding: "1px 6px" }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding: "10px 12px", borderTop: "1px solid #F3F4F6" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", background: "#DBEAFE",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 700, color: "#2563EB", flexShrink: 0,
          }}>SC</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>Sarah Chen</div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>ESG Analyst</div>
          </div>
          <button onClick={onLogout} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 4 }}>
            <LogOut size={14} color="#9CA3AF" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOPBAR
// ═══════════════════════════════════════════════════════════════════════════════

function TopBar({ title, sub }) {
  return (
    <div style={{
      background: "#FFFFFF", borderBottom: "1px solid #E5E7EB",
      padding: "0 26px", height: 54,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      position: "sticky", top: 0, zIndex: 20,
    }}>
      <div>
        <h1 style={{ fontSize: 15, fontWeight: 700, color: "#111827", letterSpacing: "-0.1px" }}>{title}</h1>
        {sub && <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>{sub}</p>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, padding: "6px 12px",
          border: "1px solid #E5E7EB", borderRadius: 8, background: "#F9FAFB",
        }}>
          <Search size={13} color="#9CA3AF" />
          <input placeholder="Search records…" style={{ border: "none", background: "transparent", fontSize: 13, color: "#374151", outline: "none", width: 170, fontFamily: "inherit" }} />
        </div>
        <div style={{ position: "relative" }}>
          <button style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid #E5E7EB", background: "#F9FAFB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bell size={14} color="#6B7280" />
          </button>
          <div style={{ position: "absolute", top: 8, right: 8, width: 6, height: 6, borderRadius: "50%", background: "#EF4444", border: "1.5px solid white" }} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD PAGE
// ═══════════════════════════════════════════════════════════════════════════════

function DashboardPage() {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 50); return () => clearTimeout(t); }, []);

  const metrics = [
    { label: "Total Records",       value: "8,432", change: 12.4,  Icon: FileText,      icolor: "#2563EB", ibg: "#EFF6FF" },
    { label: "Pending Review",      value: "147",   change: -8.2,  Icon: Clock,         icolor: "#D97706", ibg: "#FEF3C7" },
    { label: "Approved",            value: "7,981", change: 14.1,  Icon: CheckCircle,   icolor: "#16A34A", ibg: "#DCFCE7" },
    { label: "Flagged / Rejected",  value: "304",   change: -3.5,  Icon: AlertTriangle, icolor: "#DC2626", ibg: "#FEE2E2" },
  ];

  return (
    <div style={{ padding: 26, transition: "opacity .3s", opacity: animated ? 1 : 0 }}>
      {/* Metrics */}
      <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
        {metrics.map(m => <Metric key={m.label} {...m} />)}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 14, marginBottom: 20 }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Emissions Over Time</h3>
              <p style={{ fontSize: 12, color: "#9CA3AF" }}>Monthly tCO₂e — FY 2024</p>
            </div>
            <div style={{ display: "flex", gap: 14, fontSize: 11 }}>
              {[["Scope 1","#2563EB"],["Scope 2","#7C3AED"],["Scope 3","#059669"]].map(([l,c]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
                  <span style={{ color: "#6B7280" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={emissionsMonthly}>
              <defs>
                {[["g1","#2563EB"],["g2","#7C3AED"],["g3","#059669"]].map(([id,c]) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={c} stopOpacity={0.12} />
                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="scope1" name="Scope 1" stroke="#2563EB" strokeWidth={2} fill="url(#g1)" dot={false} />
              <Area type="monotone" dataKey="scope2" name="Scope 2" stroke="#7C3AED" strokeWidth={2} fill="url(#g2)" dot={false} />
              <Area type="monotone" dataKey="scope3" name="Scope 3" stroke="#059669" strokeWidth={2} fill="url(#g3)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 3 }}>Scope Distribution</h3>
          <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 14 }}>FY 2024 breakdown</p>
          <ResponsiveContainer width="100%" height={168}>
            <PieChart>
              <Pie data={scopeDistribution} cx="50%" cy="50%" innerRadius={52} outerRadius={76} paddingAngle={3} dataKey="value" strokeWidth={0}>
                {scopeDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={v => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 10 }}>
            {scopeDistribution.map(s => (
              <div key={s.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
                  <span style={{ fontSize: 12, color: "#6B7280" }}>{s.name}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{s.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bar chart + activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 14, marginBottom: 20 }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18, alignItems: "flex-start" }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Monthly Ingestion Volume</h3>
              <p style={{ fontSize: 12, color: "#9CA3AF" }}>Records by data source · Last 6 months</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={emissionsMonthly.slice(-6)} barSize={14} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="scope1" name="SAP"     fill="#2563EB" radius={[4,4,0,0]} />
              <Bar dataKey="scope2" name="Utility" fill="#7C3AED" radius={[4,4,0,0]} />
              <Bar dataKey="scope3" name="Travel"  fill="#059669" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 14 }}>Activity Feed</h3>
          {auditLogs.slice(0,5).map((log,i) => {
            const s = ACTION_STYLE[log.action] || ACTION_STYLE.edited;
            return (
              <div key={log.id} style={{ display: "flex", gap: 10, marginBottom: i < 4 ? 12 : 0 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  background: log.user === "AI System" ? "#F5F3FF" : "#F3F4F6",
                  border: `1.5px solid ${log.user === "AI System" ? "#DDD6FE" : "#E5E7EB"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 700,
                  color: log.user === "AI System" ? "#7C3AED" : "#374151",
                }}>{log.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{log.user}</span>
                    <span style={{ fontSize: 11, padding: "1px 6px", borderRadius: 100, fontWeight: 600, background: s.bg, color: s.text }}>{log.action}</span>
                    <span className="mono" style={{ fontSize: 10, color: "#9CA3AF" }}>{log.record}</span>
                  </div>
                  <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{log.time}</p>
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Recent records table */}
      <Card noPad>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Recent Records</h3>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>Showing latest 5</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
              {["Source","Category","Facility","Amount","Scope","CO₂e","Status"].map(h => (
                <th key={h} style={{ padding: "9px 18px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.slice(0,5).map((r,i) => (
              <tr key={r.id}
                style={{ borderBottom: i < 4 ? "1px solid #F9FAFB" : "none" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#FAFAFA")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "11px 18px", fontSize: 13, color: "#374151", fontWeight: 600 }}>{r.source}</td>
                <td style={{ padding: "11px 18px", fontSize: 13, color: "#6B7280" }}>{r.category}</td>
                <td style={{ padding: "11px 18px", fontSize: 13, color: "#6B7280" }}>{r.facility}</td>
                <td className="mono" style={{ padding: "11px 18px", fontSize: 12, color: "#374151" }}>{r.amount.toLocaleString()} {r.unit}</td>
                <td style={{ padding: "11px 18px" }}><ScopeBadge scope={r.scope} /></td>
                <td className="mono" style={{ padding: "11px 18px", fontSize: 12, color: "#374151" }}>{r.co2e} t</td>
                <td style={{ padding: "11px 18px" }}><StatusBadge s={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATA SOURCES PAGE
// ═══════════════════════════════════════════════════════════════════════════════

function DataSourcesPage() {
  const sources = [
    {
      id: "sap", name: "SAP ERP Integration", type: "SAP / Procurement", Icon: Cpu,
      color: "#2563EB", bg: "#EFF6FF",
      status: "active", lastSync: "14 min ago", records: 4218, errors: 0,
      desc: "Fuel consumption, procurement, logistics — SAP S/4HANA export connector",
      scope: 1,
    },
    {
      id: "utility", name: "Utility Billing API", type: "Electricity & Gas", Icon: Zap,
      color: "#7C3AED", bg: "#F5F3FF",
      status: "active", lastSync: "2 hours ago", records: 1840, errors: 3,
      desc: "Electricity, gas, and water consumption via facility meter API integration",
      scope: 2,
    },
    {
      id: "travel", name: "Corporate Travel Data", type: "Travel & Transport", Icon: Plane,
      color: "#059669", bg: "#ECFDF5",
      status: "syncing", lastSync: "Syncing…", records: 374, errors: 1,
      desc: "Flights, hotels, ground transport from Concur and TripActions connectors",
      scope: 3,
    },
  ];

  return (
    <div style={{ padding: 26 }}>
      <SectionHead
        title="Data Sources"
        sub={`${sources.length} active integrations · Last updated 14 min ago`}
        action={<Btn icon={Plus}>Add Source</Btn>}
      />

      <div style={{ display: "grid", gap: 14, marginBottom: 20 }}>
        {sources.map(src => (
          <Card key={src.id} style={{ display: "flex", alignItems: "flex-start", gap: 18 }}>
            <div style={{ width: 46, height: 46, borderRadius: 11, background: src.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <src.Icon size={21} color={src.color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 3, flexWrap: "wrap" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{src.name}</h3>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "2px 9px", borderRadius: 100, fontSize: 11, fontWeight: 600,
                  background: src.status === "active" ? "#DCFCE7" : "#FEF3C7",
                  color: src.status === "active" ? "#15803D" : "#B45309",
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: src.status === "active" ? "#16A34A" : "#D97706" }} className={src.status === "syncing" ? "pulse" : ""} />
                  {src.status === "active" ? "Active" : "Syncing"}
                </span>
                <ScopeBadge scope={src.scope} />
              </div>
              <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>{src.desc}</p>
              <div style={{ display: "flex", gap: 22 }}>
                {[
                  { label: "Last sync", value: src.lastSync },
                  { label: "Records", value: src.records.toLocaleString() },
                  { label: "Parse errors", value: String(src.errors), danger: src.errors > 0 },
                ].map(stat => (
                  <div key={stat.label}>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>{stat.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: stat.danger ? "#DC2626" : "#111827" }}>{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              <Btn variant="secondary" icon={RefreshCw} small>Sync</Btn>
              <Btn variant="secondary" icon={FileUp} small>Upload</Btn>
              <button style={{ width: 32, height: 32, border: "1px solid #E5E7EB", borderRadius: 7, background: "#F9FAFB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MoreHorizontal size={14} color="#6B7280" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Source volume chart */}
      <Card>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 3 }}>Ingestion Volume by Source</h3>
        <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 18 }}>Records processed per month</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={emissionsMonthly.slice(-6)} barSize={16} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTip />} />
            <Bar dataKey="scope1" name="SAP"     fill="#2563EB" radius={[4,4,0,0]} />
            <Bar dataKey="scope2" name="Utility" fill="#7C3AED" radius={[4,4,0,0]} />
            <Bar dataKey="scope3" name="Travel"  fill="#059669" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// INGESTION PAGE
// ═══════════════════════════════════════════════════════════════════════════════

function IngestionPage() {
  const [over, setOver] = useState(false);
  const uploads = [
    { name: "sap_fuel_jan2024.csv",     size: "2.4 MB", status: "done",       records: 1847, time: "10 min ago" },
    { name: "utility_bills_q4.xlsx",   size: "1.1 MB", status: "done",       records: 234,  time: "2 hours ago" },
    { name: "travel_report_2024.csv",   size: "856 KB", status: "processing", records: null, time: "Processing…" },
    { name: "sap_export_dec23.csv",    size: "3.2 MB", status: "error",      records: null, time: "Failed" },
  ];

  const iconForStatus = s =>
    s === "done"       ? <CheckCircle size={14} color="#16A34A" /> :
    s === "processing" ? <RefreshCw   size={14} color="#D97706" className="spin" /> :
                         <XCircle     size={14} color="#DC2626" />;

  return (
    <div style={{ padding: 26 }}>
      <SectionHead title="Data Ingestion" sub="Upload and parse ESG data files" />

      {/* Drop zone */}
      <Card style={{ marginBottom: 20 }}>
        <div
          onDragOver={e => { e.preventDefault(); setOver(true); }}
          onDragLeave={() => setOver(false)}
          onDrop={e => { e.preventDefault(); setOver(false); }}
          style={{
            border: `2px dashed ${over ? "#2563EB" : "#E5E7EB"}`,
            borderRadius: 10, padding: "44px 20px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
            background: over ? "#F0F9FF" : "#FAFAFA",
            cursor: "pointer", transition: "all .15s",
          }}
        >
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Upload size={24} color="#2563EB" />
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Drop files here to upload</p>
            <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 5 }}>Supports CSV, XLSX, and PDF · Max 50 MB per file</p>
          </div>
          <Btn>Browse Files</Btn>
          <div style={{ display: "flex", gap: 8 }}>
            {["SAP Export","Utility Bills","Travel Data","Custom CSV"].map(tag => (
              <span key={tag} style={{ padding: "3px 10px", border: "1px solid #E5E7EB", borderRadius: 100, fontSize: 11, color: "#6B7280" }}>{tag}</span>
            ))}
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        {/* Upload history */}
        <Card noPad>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Upload History</h3>
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>{uploads.length} files</span>
          </div>
          {uploads.map((f, i) => (
            <div key={f.name} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 18px",
              borderBottom: i < uploads.length - 1 ? "1px solid #F9FAFB" : "none",
            }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FileText size={15} color="#6B7280" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>{f.size} · {f.time}</div>
              </div>
              {f.records && <span className="mono" style={{ fontSize: 11, color: "#6B7280", flexShrink: 0 }}>{f.records.toLocaleString()} rows</span>}
              {iconForStatus(f.status)}
            </div>
          ))}
        </Card>

        {/* Parsing logs */}
        <Card noPad>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #F3F4F6" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Parse Log</h3>
          </div>
          <div style={{ padding: "14px 18px", background: "#0D1117", borderRadius: "0 0 12px 12px", minHeight: 200 }}>
            {[
              { time: "10:24:01", level: "info",  msg: "Started parsing sap_fuel_jan2024.csv" },
              { time: "10:24:02", level: "info",  msg: "Detected 12 columns, 1,847 rows" },
              { time: "10:24:03", level: "warn",  msg: "Mapped 'Qty_Base' → 'activity_value' (fuzzy)" },
              { time: "10:24:03", level: "info",  msg: "Normalized units: L → m³ for 34 rows" },
              { time: "10:24:04", level: "info",  msg: "Emission factors applied (IPCC AR6)" },
              { time: "10:24:05", level: "error", msg: "Row 892: invalid facility code 'PLT-XX'" },
              { time: "10:24:05", level: "info",  msg: "Completed: 1,846 ok, 1 flagged" },
            ].map((l, i) => (
              <div key={i} className="mono" style={{ display: "flex", gap: 12, marginBottom: 5, fontSize: 11 }}>
                <span style={{ color: "#4B5563", flexShrink: 0 }}>{l.time}</span>
                <span style={{ color: l.level === "error" ? "#F87171" : l.level === "warn" ? "#FCD34D" : "#6EE7B7", flexShrink: 0 }}>[{l.level.toUpperCase()}]</span>
                <span style={{ color: "#9CA3AF" }}>{l.msg}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Format guides */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {[
          { Icon: Cpu,   color: "#2563EB", bg: "#EFF6FF", title: "SAP Export Format",    desc: "Required: Material, Plant, Quantity, Base_Unit, Cost_Center, Posting_Date. Auto-maps SAP column aliases." },
          { Icon: Zap,   color: "#7C3AED", bg: "#F5F3FF", title: "Utility Bill Format",  desc: "Required: Meter_ID, Billing_Period, kWh, Facility_Code, Tariff. Handles multi-month billing periods." },
          { Icon: Plane, color: "#059669", bg: "#ECFDF5", title: "Travel Data Format",   desc: "Required: Traveler_ID, Origin, Destination, Transport_Type, Date. Calculates distance from IATA codes." },
        ].map(f => (
          <Card key={f.title}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <f.Icon size={16} color={f.color} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{f.title}</span>
            </div>
            <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.65 }}>{f.desc}</p>
            <button style={{
              marginTop: 12, fontSize: 12, color: "#2563EB", fontWeight: 600,
              background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit"
            }}>Download template →</button>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// REVIEW PAGE  (★ most important page)
// ═══════════════════════════════════════════════════════════════════════════════

function ReviewPage() {
  const [sel, setSel]     = useState(null);
  const [tab, setTab]     = useState("all");
  const [q,   setQ]       = useState("");
  const [data, setData]   = useState(records);

  const filtered = data.filter(r => {
    if (tab !== "all" && r.status !== tab) return false;
    const s = q.toLowerCase();
    return !s || [r.source, r.category, r.facility, r.id].some(v => v.toLowerCase().includes(s));
  });

  const tabs = [
    { id: "all",      label: "All",      count: data.length },
    { id: "pending",  label: "Pending",  count: data.filter(r => r.status === "pending").length },
    { id: "flagged",  label: "Flagged",  count: data.filter(r => r.status === "flagged").length },
    { id: "approved", label: "Approved", count: data.filter(r => r.status === "approved").length },
    { id: "rejected", label: "Rejected", count: data.filter(r => r.status === "rejected").length },
  ];

  const approve = (id, e) => {
    e?.stopPropagation();
    setData(prev => prev.map(r => r.id === id ? { ...r, status: "approved", risk: "low" } : r));
    if (sel?.id === id) setSel(prev => ({ ...prev, status: "approved" }));
  };
  const reject = (id, e) => {
    e?.stopPropagation();
    setData(prev => prev.map(r => r.id === id ? { ...r, status: "rejected" } : r));
    if (sel?.id === id) setSel(prev => ({ ...prev, status: "rejected" }));
  };

  const COLS = ["ID","Source","Category","Date","Facility","Amount","Scope","CO₂e","Status","Risk",""];

  return (
    <div style={{ padding: 26 }}>
      {/* Filter bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 16, borderBottom: "1px solid #E5E7EB", paddingBottom: 12 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: "flex", alignItems: "center", gap: 5, padding: "6px 12px",
            borderRadius: 7, border: "none", cursor: "pointer", fontFamily: "inherit",
            background: tab === t.id ? "#111827" : "transparent",
            color: tab === t.id ? "white" : "#6B7280",
            fontSize: 13, fontWeight: tab === t.id ? 700 : 500, transition: "all .1s",
          }}>
            {t.label}
            <span style={{
              padding: "0 5px", borderRadius: 100, fontSize: 11, fontWeight: 700,
              background: tab === t.id ? "rgba(255,255,255,.2)" : "#F3F4F6",
              color: tab === t.id ? "white" : "#6B7280",
            }}>{t.count}</span>
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 12px", border: "1px solid #E5E7EB", borderRadius: 7, background: "#FFFFFF" }}>
          <Search size={13} color="#9CA3AF" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Filter…"
            style={{ border: "none", outline: "none", fontSize: 13, fontFamily: "inherit", color: "#374151", width: 140 }} />
          {q && <button onClick={() => setQ("")} style={{ border: "none", background: "none", cursor: "pointer", padding: 0 }}><X size={12} color="#9CA3AF" /></button>}
        </div>
        <Btn variant="secondary" icon={Download} small>Export</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: sel ? "1fr 340px" : "1fr", gap: 14 }}>
        {/* Table */}
        <Card noPad>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #F3F4F6", background: "#FAFAFA" }}>
                  {COLS.map(h => (
                    <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={11} style={{ padding: "40px 20px", textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>No records match your filters.</td></tr>
                )}
                {filtered.map((r, i) => {
                  const isSelected = sel?.id === r.id;
                  return (
                    <tr key={r.id}
                      onClick={() => setSel(isSelected ? null : r)}
                      style={{
                        borderBottom: i < filtered.length - 1 ? "1px solid #F9FAFB" : "none",
                        background: isSelected ? "#EFF6FF" : r.risk === "high" ? "#FFFBF5" : "transparent",
                        cursor: "pointer", transition: "background .1s",
                      }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#FAFAFA"; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = r.risk === "high" ? "#FFFBF5" : "transparent"; }}
                    >
                      <td className="mono" style={{ padding: "11px 14px", fontSize: 11, color: "#9CA3AF" }}>{r.id}</td>
                      <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>{r.source}</td>
                      <td style={{ padding: "11px 14px", fontSize: 13, color: "#6B7280" }}>{r.category}</td>
                      <td className="mono" style={{ padding: "11px 14px", fontSize: 11, color: "#6B7280" }}>{r.date}</td>
                      <td style={{ padding: "11px 14px", fontSize: 12, color: "#6B7280" }}>{r.facility}</td>
                      <td className="mono" style={{ padding: "11px 14px", fontSize: 11, color: "#374151", whiteSpace: "nowrap" }}>{r.amount.toLocaleString()} {r.unit}</td>
                      <td style={{ padding: "11px 14px" }}><ScopeBadge scope={r.scope} /></td>
                      <td className="mono" style={{ padding: "11px 14px", fontSize: 11, color: "#374151" }}>{r.co2e}t</td>
                      <td style={{ padding: "11px 14px" }}><StatusBadge s={r.status} /></td>
                      <td style={{ padding: "11px 14px" }}><RiskBadge r={r.risk} /></td>
                      <td style={{ padding: "11px 14px" }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          {(r.status === "pending" || r.status === "flagged") ? (
                            <>
                              <button onClick={e => approve(r.id, e)} style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid #DCFCE7", background: "#F0FDF4", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Check size={11} color="#16A34A" />
                              </button>
                              <button onClick={e => reject(r.id, e)} style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid #FEE2E2", background: "#FEF2F2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <X size={11} color="#DC2626" />
                              </button>
                            </>
                          ) : (
                            <button onClick={e => { e.stopPropagation(); setSel(r); }} style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid #E5E7EB", background: "#F9FAFB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Eye size={11} color="#6B7280" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "10px 18px", borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>Showing {filtered.length} of {data.length} records</span>
            <div style={{ display: "flex", gap: 4 }}>
              {[1,2,3].map(n => (
                <button key={n} style={{ width: 28, height: 28, borderRadius: 6, border: n === 1 ? "1px solid #2563EB" : "1px solid #E5E7EB", background: n === 1 ? "#EFF6FF" : "transparent", color: n === 1 ? "#2563EB" : "#6B7280", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{n}</button>
              ))}
            </div>
          </div>
        </Card>

        {/* Detail drawer */}
        {sel && (
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Record Detail</span>
              <button onClick={() => setSel(null)} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 4 }}>
                <X size={15} color="#9CA3AF" />
              </button>
            </div>

            <span className="mono" style={{ fontSize: 11, color: "#9CA3AF", display: "block", marginBottom: 8 }}>{sel.id}</span>

            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
              <StatusBadge s={sel.status} />
              <ScopeBadge scope={sel.scope} />
              <RiskBadge r={sel.risk} />
            </div>

            {/* Fields grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {[
                ["Source", sel.source], ["Category", sel.category],
                ["Date", sel.date],     ["Facility", sel.facility],
                ["Amount", `${sel.amount.toLocaleString()} ${sel.unit}`],
                ["CO₂e", `${sel.co2e} tCO₂e`],
                ["Norm. value", sel.normalized],
                ["Emission factor", "0.000182 kg/kWh"],
              ].map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 3 }}>{l}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Anomaly alert */}
            {sel.risk === "high" && (
              <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 8, padding: "11px 13px", marginBottom: 14 }}>
                <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                  <AlertTriangle size={14} color="#EA580C" style={{ marginTop: 1, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#9A3412", marginBottom: 3 }}>AI Anomaly Detected</div>
                    <div style={{ fontSize: 12, color: "#C2410C", lineHeight: 1.55 }}>Value exceeds 3σ from facility baseline. Manual review required before approval.</div>
                  </div>
                </div>
              </div>
            )}

            {/* Audit mini-timeline */}
            <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "12px 14px", marginBottom: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Audit Trail</p>
              {[
                { user: "System", action: "Ingested", time: "Jan 15, 10:24" },
                { user: "AI",     action: "Risk scored", time: "Jan 15, 10:24" },
                { user: "Queue",  action: "Assigned for review", time: "Jan 15, 10:25" },
              ].map((ev, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, fontSize: 12 }}>
                  <span style={{ color: "#374151" }}><strong>{ev.user}</strong> · {ev.action}</span>
                  <span style={{ color: "#9CA3AF" }}>{ev.time}</span>
                </div>
              ))}
            </div>

            {(sel.status === "pending" || sel.status === "flagged") && (
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => approve(sel.id)} style={{ flex: 1, padding: "9px", background: "#16A34A", color: "white", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <Check size={14} /> Approve
                </button>
                <button onClick={() => reject(sel.id)} style={{ flex: 1, padding: "9px", background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <X size={14} /> Reject
                </button>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUDIT LOG PAGE
// ═══════════════════════════════════════════════════════════════════════════════

function AuditLogPage() {
  return (
    <div style={{ padding: 26 }}>
      <SectionHead
        title="Audit Log"
        sub="Complete immutable activity history"
        action={<Btn variant="secondary" icon={Download} small>Export CSV</Btn>}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 256px", gap: 18 }}>
        {/* Timeline */}
        <div>
          {auditLogs.map((log, i) => {
            const s = ACTION_STYLE[log.action] || ACTION_STYLE.edited;
            return (
              <div key={log.id} style={{ display: "flex", gap: 14, marginBottom: i < auditLogs.length - 1 ? 0 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 36, flexShrink: 0 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                    background: log.user === "AI System" ? "#F5F3FF" : "#F3F4F6",
                    border: `2px solid ${log.user === "AI System" ? "#DDD6FE" : "#E5E7EB"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 700,
                    color: log.user === "AI System" ? "#7C3AED" : "#374151",
                  }}>{log.avatar}</div>
                  {i < auditLogs.length - 1 && <div style={{ width: 1, height: "100%", background: "#E5E7EB", margin: "4px 0", minHeight: 20 }} />}
                </div>
                <Card style={{ flex: 1, marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{log.user}</span>
                      <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: s.bg, color: s.text }}>{log.action}</span>
                      <span className="mono" style={{ fontSize: 11, color: "#9CA3AF" }}>{log.record}</span>
                    </div>
                    <span style={{ fontSize: 11, color: "#9CA3AF", whiteSpace: "nowrap" }}>{log.time}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>
                    {log.old ? (
                      <>
                        Changed <strong style={{ color: "#374151" }}>{log.field}</strong> from{" "}
                        <span style={{ padding: "1px 6px", background: "#FEE2E2", borderRadius: 4, fontSize: 12, fontFamily: "JetBrains Mono,monospace", color: "#B91C1C" }}>{log.old}</span>
                        {" "}to{" "}
                        <span style={{ padding: "1px 6px", background: "#DCFCE7", borderRadius: 4, fontSize: 12, fontFamily: "JetBrains Mono,monospace", color: "#15803D" }}>{log.next}</span>
                      </>
                    ) : log.next}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Side stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Card>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 13 }}>30-Day Summary</h3>
            {[
              { label: "Approvals",     value: 42, color: "#16A34A" },
              { label: "Rejections",    value: 8,  color: "#DC2626" },
              { label: "Flags raised",  value: 15, color: "#EA580C" },
              { label: "AI detections", value: 23, color: "#7C3AED" },
              { label: "File uploads",  value: 11, color: "#2563EB" },
              { label: "Edits made",    value: 19, color: "#D97706" },
            ].map(stat => (
              <div key={stat.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 7, height: 7, borderRadius: 2, background: stat.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "#6B7280" }}>{stat.label}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{stat.value}</span>
              </div>
            ))}
          </Card>

          <Card>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 13 }}>Top Reviewers</h3>
            {[
              { name: "Sarah Chen",  reviews: 28, avatar: "SC" },
              { name: "Anna Weber",  reviews: 19, avatar: "AW" },
              { name: "Marco Rossi", reviews: 14, avatar: "MR" },
              { name: "James Liu",   reviews: 7,  avatar: "JL" },
            ].map(u => (
              <div key={u.name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#2563EB", flexShrink: 0 }}>{u.avatar}</div>
                <span style={{ flex: 1, fontSize: 12, color: "#374151", fontWeight: 500 }}>{u.name}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF" }}>{u.reviews}</span>
              </div>
            ))}
          </Card>

          <Card>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 13 }}>AI Detections</h3>
            <div style={{ background: "#F5F3FF", borderRadius: 8, padding: "11px 13px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#7C3AED", marginBottom: 5 }}>23 anomalies · Last 30 days</div>
              <div style={{ fontSize: 12, color: "#6D28D9", lineHeight: 1.6 }}>
                14 resolved · 9 pending review<br />
                3.2σ avg deviation on flagged records
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS PAGE
// ═══════════════════════════════════════════════════════════════════════════════

function SettingsPage() {
  const [tab, setTab] = useState("organization");

  const TABS = [
    { id: "organization", label: "Organization", Icon: Building2 },
    { id: "users",        label: "Users",         Icon: Users },
    { id: "api",          label: "API Keys",       Icon: Key },
    { id: "emissions",    label: "Emission Factors", Icon: Leaf },
    { id: "notifications", label: "Notifications", Icon: Bell },
  ];

  const inp = {
    width: "100%", padding: "9px 12px",
    border: "1px solid #E5E7EB", borderRadius: 7,
    fontSize: 13, color: "#374151", fontFamily: "inherit",
    outline: "none", background: "#FAFAFA",
  };

  return (
    <div style={{ padding: 26 }}>
      <SectionHead title="Settings" sub="Manage your workspace and integrations" />

      <div style={{ display: "grid", gridTemplateColumns: "196px 1fr", gap: 18 }}>
        {/* Tab nav */}
        <div>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: "flex", alignItems: "center", gap: 9, width: "100%",
              padding: "9px 11px", borderRadius: 7, border: "none", cursor: "pointer",
              background: tab === t.id ? "#EFF6FF" : "transparent",
              color: tab === t.id ? "#2563EB" : "#6B7280",
              fontSize: 13, fontWeight: tab === t.id ? 700 : 500,
              fontFamily: "inherit", marginBottom: 2, textAlign: "left", transition: "all .1s",
            }}>
              <t.Icon size={14} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div>
          {tab === "organization" && (
            <Card>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 20 }}>Organization Settings</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                {[
                  ["Organization Name", "ACME Corporation"],
                  ["Industry", "Manufacturing & Logistics"],
                  ["Country", "Germany"],
                  ["Reporting Currency", "EUR"],
                  ["Base Year (GHG)", "2020"],
                  ["Fiscal Year End", "December 31"],
                ].map(([l, v]) => (
                  <div key={l}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{l}</label>
                    <input defaultValue={v} style={inp} />
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 16, display: "flex", gap: 8 }}>
                <Btn>Save Changes</Btn>
                <Btn variant="secondary">Discard</Btn>
              </div>
            </Card>
          )}

          {tab === "users" && (
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Team Members</h3>
                <Btn icon={Plus} small>Invite Member</Btn>
              </div>
              {[
                { name: "Sarah Chen",  email: "sarah.chen@acme.com",  role: "ESG Analyst",   av: "SC", status: "active" },
                { name: "Anna Weber",  email: "anna.weber@acme.com",  role: "ESG Manager",   av: "AW", status: "active" },
                { name: "Marco Rossi", email: "marco.rossi@acme.com", role: "Data Engineer", av: "MR", status: "active" },
                { name: "James Liu",   email: "james.liu@acme.com",   role: "Analyst",       av: "JL", status: "invited" },
              ].map(u => (
                <div key={u.email} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #F3F4F6" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#2563EB", flexShrink: 0 }}>{u.av}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>{u.email}</div>
                  </div>
                  <span style={{ fontSize: 12, color: "#6B7280" }}>{u.role}</span>
                  <Pill label={u.status} bg={u.status === "active" ? "#DCFCE7" : "#F3F4F6"} text={u.status === "active" ? "#15803D" : "#9CA3AF"} />
                  <button style={{ border: "none", background: "transparent", cursor: "pointer" }}><MoreHorizontal size={15} color="#9CA3AF" /></button>
                </div>
              ))}
            </Card>
          )}

          {tab === "api" && (
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>API Keys</h3>
                <Btn icon={Plus} small>Generate Key</Btn>
              </div>
              {[
                { name: "Production API",  key: "ct_live_sk_••••••••••••••••••••8f2a", created: "Jan 1, 2024",  lastUsed: "2 min ago",  env: "production" },
                { name: "Staging API",     key: "ct_test_sk_••••••••••••••••••••3b1c", created: "Dec 15, 2023", lastUsed: "3 days ago", env: "staging" },
              ].map(k => (
                <div key={k.name} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: "1px solid #F3F4F6" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 9, background: k.env === "production" ? "#ECFDF5" : "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Key size={16} color={k.env === "production" ? "#059669" : "#6B7280"} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{k.name}</span>
                      <Pill label={k.env} bg={k.env === "production" ? "#DCFCE7" : "#F3F4F6"} text={k.env === "production" ? "#15803D" : "#6B7280"} />
                    </div>
                    <span className="mono" style={{ fontSize: 11, color: "#9CA3AF" }}>{k.key}</span>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>Last used</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{k.lastUsed}</div>
                  </div>
                  <Btn variant="danger" small>Revoke</Btn>
                </div>
              ))}
            </Card>
          )}

          {(tab === "emissions" || tab === "notifications") && (
            <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 280, gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 13, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {tab === "emissions" ? <Leaf size={24} color="#9CA3AF" /> : <Bell size={24} color="#9CA3AF" />}
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#374151" }}>
                  {tab === "emissions" ? "Emission Factor Library" : "Notification Preferences"}
                </p>
                <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 5 }}>
                  {tab === "emissions"
                    ? "Configure IPCC emission factors, custom factors, and regional overrides."
                    : "Set up email, Slack, and webhook alerts for ingestion and review events."}
                </p>
              </div>
              <Btn variant="secondary">Coming soon</Btn>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════════

const PAGE_META = {
  dashboard: { title: "Dashboard",      sub: "FY 2024 · ACME Corporation" },
  sources:   { title: "Data Sources",   sub: "Manage integrations" },
  ingestion: { title: "Ingestion",      sub: "Upload & parse files" },
  review:    { title: "Review Queue",   sub: "Analyze and approve records" },
  audit:     { title: "Audit Log",      sub: "Complete activity history" },
  settings:  { title: "Settings",       sub: "Workspace configuration" },
};

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [page,   setPage]   = useState("dashboard");

  if (!authed) return <LoginPage onLogin={() => setAuthed(true)} />;

  const meta = PAGE_META[page] || PAGE_META.dashboard;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F4F4F0", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <Sidebar cur={page} onNav={setPage} onLogout={() => setAuthed(false)} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowY: "auto", height: "100vh" }}>
        <TopBar title={meta.title} sub={meta.sub} />
        <div style={{ flex: 1 }}>
          {page === "dashboard" && <DashboardPage />}
          {page === "sources"   && <DataSourcesPage />}
          {page === "ingestion" && <IngestionPage />}
          {page === "review"    && <ReviewPage />}
          {page === "audit"     && <AuditLogPage />}
          {page === "settings"  && <SettingsPage />}
        </div>
      </div>
    </div>
  );
}
