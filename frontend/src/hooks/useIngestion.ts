import { useState, useEffect, useCallback } from "react";
import { ingestionApi, DataSource, UploadedFile } from "../api/ingestion";

export function useIngestion() {
  const [sources,  setSources]  = useState<DataSource[]>([]);
  const [files,    setFiles]    = useState<UploadedFile[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [uploading,setUploading]= useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [s, f] = await Promise.all([ingestionApi.listSources(), ingestionApi.listFiles()]);
      setSources(s); setFiles(f);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load ingestion data");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, []);

  const uploadFile = async (file: File, sourceId?: string) => {
    setUploading(true);
    try {
      const uploaded = await ingestionApi.uploadFile(file, sourceId);
      setFiles(prev => [uploaded, ...prev]);
      return uploaded;
    } finally { setUploading(false); }
  };

  const syncSource = async (id: string) => {
    await ingestionApi.syncSource(id);
    setSources(prev => prev.map(s => s.id === id ? { ...s, sync_status: "syncing" } : s));
    setTimeout(fetchAll, 3000);
  };

  return { sources, files, loading, uploading, error, uploadFile, syncSource, refresh: fetchAll };
}
