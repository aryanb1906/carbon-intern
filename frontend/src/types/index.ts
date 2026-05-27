export * from "../api/auth";
export * from "../api/emissions";
export * from "../api/ingestion";
export * from "../api/audits";

export type PageId = "dashboard" | "sources" | "ingestion" | "review" | "audit" | "settings";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
}

export interface SidebarItem {
  id: PageId;
  label: string;
  badge?: number;
}
