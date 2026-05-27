import { useState } from "react";
import { Leaf, Mail, Lock, Shield, Globe, Activity, BarChart3 } from "lucide-react";

interface Props { onLogin: (email: string, password: string) => Promise<void>; }

export function LoginPage({ onLogin }: Props) {
  const [email,   setEmail]   = useState("sarah.chen@acme.com");
  const [pass,    setPass]    = useState("demo1234");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const submit = async () => {
    if (!email || !pass) { setError("Please enter your email and password."); return; }
    setLoading(true); setError("");
    try { await onLogin(email, pass); }
    catch (e: any) { setError(e?.message ?? "Invalid credentials."); }
    finally { setLoading(false); }
  };

  const inp = (extra = {}) => ({
    width: "100%", padding: "10px 12px 10px 38px", border: "1px solid #E5E7EB",
    borderRadius: 8, fontSize: 14, fontFamily: "inherit", color: "#111827",
    background: "#FFFFFF", outline: "none", ...extra,
  } as React.CSSProperties);

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      {/* Left brand panel */}
      <div style={{ width: "44%", background: "#0D1117", padding: 52, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
        <svg style={{ position: "absolute", inset: 0, opacity: 0.04, pointerEvents: "none" }} width="100%" height="100%">
          <defs><pattern id="dot" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="white" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#dot)" />
        </svg>
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 72 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}><Leaf size={18} color="white" /></div>
            <span style={{ color: "#FFF", fontWeight: 700, fontSize: 17, letterSpacing: "-0.3px" }}>CarbonTrace</span>
          </div>
          <h1 style={{ color: "#FFF", fontSize: 32, fontWeight: 700, lineHeight: 1.25, marginBottom: 14, letterSpacing: "-0.5px" }}>Enterprise ESG<br />Intelligence Platform</h1>
          <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.75 }}>Ingest, normalize, and audit Scope 1, 2, and 3 emissions data with enterprise-grade controls and real-time anomaly detection.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 36 }}>
            {[{ Icon: Shield, label: "SOC 2 Type II" }, { Icon: Globe, label: "GHG Protocol" }, { Icon: Activity, label: "Anomaly Detection" }, { Icon: BarChart3, label: "Real-time Analytics" }].map(({ Icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 12px", borderRadius: 8, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)" }}>
                <Icon size={14} color="#475569" /><span style={{ color: "#475569", fontSize: 12, fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#1E3A5F", position: "relative" }}>© 2024 CarbonTrace Inc. · SOC 2 Certified</div>
      </div>

      {/* Right form */}
      <div style={{ flex: 1, background: "#F4F4F0", display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 5, letterSpacing: "-0.3px" }}>Sign in</h2>
          <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 28 }}>Access your ESG workspace</p>

          {error && <div style={{ padding: "10px 12px", background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: 8, fontSize: 13, color: "#B91C1C", marginBottom: 16 }}>{error}</div>}

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email address</label>
            <div style={{ position: "relative" }}>
              <Mail size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inp()} onKeyDown={e => e.key === "Enter" && submit()} />
            </div>
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} style={inp()} onKeyDown={e => e.key === "Enter" && submit()} />
            </div>
          </div>

          <button onClick={submit} disabled={loading} style={{ width: "100%", padding: "11px", background: loading ? "#93C5FD" : "#2563EB", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", letterSpacing: "0.01em" }}>
            {loading ? "Authenticating…" : "Sign in →"}
          </button>

          <div style={{ marginTop: 20, padding: "12px 14px", background: "#F0F9FF", borderRadius: 8, border: "1px solid #BAE6FD" }}>
            <p style={{ fontSize: 12, color: "#0369A1", fontWeight: 600, marginBottom: 3 }}>Demo credentials</p>
            <p style={{ fontSize: 12, color: "#0284C7" }}>sarah.chen@acme.com · demo1234</p>
          </div>
        </div>
      </div>
    </div>
  );
}
