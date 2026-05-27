import client from "./client";

export interface EmissionRecord {
  id: string; organization: string; source_type: string;
  category: string; category_label: string;
  scope: 1 | 2 | 3; scope_label: string;
  activity_date: string; facility: string;
  department: string; cost_center: string;
  activity_value: number; unit: string;
  normalized_value: number | null; normalized_unit: string;
  emission_factor: number | null; emission_factor_source: string;
  co2e: number | null;
  status: "pending" | "approved" | "rejected" | "flagged"; status_label: string;
  risk_score: number; risk_level: "low" | "medium" | "high"; risk_label: string;
  anomaly_flags: string[];
  reviewer: string | null; reviewer_name: string | null;
  reviewed_at: string | null; review_note: string;
  created_at: string; updated_at: string;
}

export interface DashboardStats {
  total_records: number; pending_count: number; approved_count: number;
  rejected_count: number; flagged_count: number;
  total_co2e: number; scope1_co2e: number; scope2_co2e: number; scope3_co2e: number;
  monthly_trend: MonthlyTrend[]; source_breakdown: SourceBreakdown[];
}

export interface MonthlyTrend  { month: string; year: number; scope1: number; scope2: number; scope3: number; }
export interface SourceBreakdown { source_type: string; co2e: number; count: number; }

export interface PaginatedResponse<T> {
  count: number; next: string | null; previous: string | null;
  total_pages: number; current_page: number; results: T[];
}

export interface RecordFilters {
  status?: string; scope?: number; risk_level?: string;
  date_from?: string; date_to?: string; facility?: string;
  search?: string; page?: number; page_size?: number; ordering?: string;
}

export const emissionsApi = {
  list: (filters: RecordFilters = {}) =>
    client.get<PaginatedResponse<EmissionRecord>>("/emissions/records/", { params: filters }).then((r) => r.data),

  get: (id: string) =>
    client.get<EmissionRecord>(`/emissions/records/${id}/`).then((r) => r.data),

  review: (id: string, data: { status: string; review_note?: string }) =>
    client.post<EmissionRecord>(`/emissions/records/${id}/review/`, data).then((r) => r.data),

  bulkReview: (ids: string[], action: string, note?: string) =>
    client.post("/emissions/records/bulk-review/", { ids, action, note }).then((r) => r.data),

  dashboard: () =>
    client.get<DashboardStats>("/emissions/dashboard/").then((r) => r.data),
};
