import client from "./client";

export interface AuditLog {
  id: string; action: string; content_type: string; object_id: string;
  field_name: string; old_value: string | null; new_value: string | null;
  metadata: Record<string, unknown>;
  user: string | null; user_name: string | null;
  user_email: string | null; user_role: string | null;
  ip_address: string | null; timestamp: string;
}

export interface AuditFilters {
  action?: string; content_type?: string; search?: string;
  page?: number; page_size?: number;
}

export const auditsApi = {
  list: (filters: AuditFilters = {}) =>
    client.get<{ count: number; results: AuditLog[] }>("/audits/logs/", { params: filters })
      .then((r) => r.data),
};
