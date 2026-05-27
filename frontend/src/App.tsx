import { useState } from "react";
import { LoginPage }      from "./pages/LoginPage";
import { DashboardPage }  from "./pages/DashboardPage";
import { DataSourcesPage }from "./pages/DataSourcesPage";
import { IngestionPage }  from "./pages/IngestionPage";
import { ReviewPage }     from "./pages/ReviewPage";
import { AuditLogPage }   from "./pages/AuditLogPage";
import { SettingsPage }   from "./pages/SettingsPage";
import { Layout }         from "./components/layout/Layout";
import { ToastContainer } from "./components/ui/Toast";
import { useToast }       from "./hooks/useToast";

type Page = "dashboard"|"sources"|"ingestion"|"review"|"audit"|"settings";

interface AuthUser { name: string; role: string; org: string; }

// Inject global styles + font once
(function injectGlobal() {
  if (document.getElementById("ct-globals")) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";
  document.head.appendChild(link);
  const s = document.createElement("style");
  s.id = "ct-globals";
  s.textContent = `
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html,body,#root{height:100%}
    body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:#F4F4F0;color:#111827;-webkit-font-smoothing:antialiased}
    ::-webkit-scrollbar{width:5px;height:5px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:#D1D5DB;border-radius:10px}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
    input:focus,select:focus,textarea:focus{outline:none}
  `;
  document.head.appendChild(s);
})();

export default function App() {
  const [user, setUser]   = useState<AuthUser | null>(null);
  const [page, setPage]   = useState<Page>("dashboard");
  const { toasts, removeToast, toast } = useToast();

  const handleLogin = async (email: string, _password: string) => {
    // In production this calls authApi.login() and stores JWT tokens
    await new Promise(r => setTimeout(r, 1000));
    const nameMap: Record<string, string> = {
      "sarah.chen@acme.com":  "Sarah Chen",
      "anna.weber@acme.com":  "Anna Weber",
      "marco.rossi@acme.com": "Marco Rossi",
      "admin@acme.com":       "Admin User",
    };
    setUser({
      name: nameMap[email] ?? email.split("@")[0],
      role: email.includes("admin") ? "admin" : "analyst",
      org:  "ACME Corporation",
    });
    toast.success("Welcome back!", `Signed in as ${nameMap[email] ?? email}`);
  };

  const handleLogout = () => {
    setUser(null);
    setPage("dashboard");
    toast.info("Signed out", "See you next time.");
  };

  if (!user) return (
    <>
      <LoginPage onLogin={handleLogin} />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );

  const pages: Record<Page, JSX.Element> = {
    dashboard: <DashboardPage />,
    sources:   <DataSourcesPage />,
    ingestion: <IngestionPage />,
    review:    <ReviewPage />,
    audit:     <AuditLogPage />,
    settings:  <SettingsPage />,
  };

  return (
    <>
      <Layout
        page={page}
        onNav={setPage}
        onLogout={handleLogout}
        userName={user.name}
        userRole={user.role}
        orgName={user.org}
      >
        {pages[page]}
      </Layout>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
