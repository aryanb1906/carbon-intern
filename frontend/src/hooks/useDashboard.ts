import { useState, useEffect } from "react";
import { emissionsApi, DashboardStats } from "../api/emissions";

export function useDashboard() {
  const [stats,   setStats]   = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    emissionsApi.dashboard()
      .then(setStats)
      .catch((e) => setError(e?.message ?? "Failed to load dashboard."))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading, error };
}
