import { useState, useEffect, useCallback } from "react";
import { SuperadminService } from "@/services/superadmin.service";
import type { SuperadminOverview } from "@/types/superadmin.types";

export function useSuperadminDashboard() {
  const [overview, setOverview] = useState<SuperadminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await SuperadminService.getOverview();
      setOverview(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch superadmin overview");
      console.error("Error fetching superadmin overview:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return {
    overview,
    loading,
    error,
    refresh: fetchOverview,
  };
}
