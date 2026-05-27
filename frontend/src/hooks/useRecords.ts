import { useState, useEffect, useCallback } from "react";
import { emissionsApi, EmissionRecord, RecordFilters } from "../api/emissions";

export function useRecords(initialFilters: RecordFilters = {}) {
  const [records,  setRecords]  = useState<EmissionRecord[]>([]);
  const [total,    setTotal]    = useState(0);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [filters,  setFilters]  = useState<RecordFilters>(initialFilters);

  const fetch = useCallback(async (f: RecordFilters = filters) => {
    setLoading(true); setError(null);
    try {
      const data = await emissionsApi.list(f);
      setRecords(data.results);
      setTotal(data.count);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load records.");
    } finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetch(); }, []);

  const updateFilter = (update: Partial<RecordFilters>) => {
    const next = { ...filters, ...update, page: 1 };
    setFilters(next);
    fetch(next);
  };

  const reviewRecord = async (id: string, status: string, note?: string) => {
    const updated = await emissionsApi.review(id, { status, review_note: note });
    setRecords((prev) => prev.map((r) => (r.id === id ? updated : r)));
    return updated;
  };

  return { records, total, loading, error, filters, updateFilter, reviewRecord, refetch: fetch };
}
