import { type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

type Page = "dashboard"|"sources"|"ingestion"|"review"|"audit"|"settings";

const META: Record<Page, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard",    subtitle: "FY 2024 · ACME Corporation" },
  sources:   { title: "Data Sources", subtitle: "Manage integrations" },
  ingestion: { title: "Ingestion",    subtitle: "Upload & parse files" },
  review:    { title: "Review Queue", subtitle: "Analyze and approve records" },
  audit:     { title: "Audit Log",    subtitle: "Complete activity history" },
  settings:  { title: "Settings",     subtitle: "Workspace configuration" },
};

interface Props {
  page: Page;
  onNav: (p: Page) => void;
  onLogout: () => void;
  userName: string;
  userRole: string;
  orgName: string;
  children: ReactNode;
}

export function Layout({ page, onNav, onLogout, userName, userRole, orgName, children }: Props) {
  const meta = META[page];
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F4F4F0", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <Sidebar current={page} onNav={onNav} onLogout={onLogout} userName={userName} userRole={userRole} orgName={orgName} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100vh", overflowY: "auto" }}>
        <TopBar title={meta.title} subtitle={meta.subtitle} />
        <main style={{ flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}
