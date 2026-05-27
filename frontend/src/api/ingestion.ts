import client from "./client";

export interface DataSource {
  id: string; name: string; source_type: string;
  sync_status: "active" | "syncing" | "error" | "inactive";
  last_sync_at: string | null; config: Record<string, unknown>;
  error_count: number; record_count: number;
  created_at: string; updated_at: string;
}

export interface UploadedFile {
  id: string; original_name: string; file_size: number; mime_type: string;
  source: string | null; source_name: string | null;
  parse_status: "pending" | "processing" | "done" | "error";
  parse_log: string; row_count: number; error_count: number;
  uploaded_by: string | null; uploaded_by_name: string | null;
  created_at: string; updated_at: string;
}

export const ingestionApi = {
  listSources: () =>
    client.get<DataSource[]>("/ingestion/sources/").then((r) => r.data),

  syncSource: (id: string) =>
    client.post(`/ingestion/sources/${id}/sync/`).then((r) => r.data),

  listFiles: () =>
    client.get<{ results: UploadedFile[] }>("/ingestion/files/").then((r) => r.data.results),

  uploadFile: (file: File, sourceId?: string) => {
    const form = new FormData();
    form.append("file_path", file);
    if (sourceId) form.append("source", sourceId);
    return client.post<UploadedFile>("/ingestion/files/", form, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => Math.round((e.loaded * 100) / (e.total ?? 1)),
    }).then((r) => r.data);
  },
};
