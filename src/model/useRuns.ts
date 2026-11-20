import { useState, useEffect, useMemo, useCallback } from "react";
import type { Run, StatusFilter, SortOption } from "./types";
import { fetchRuns } from "../api/mockRunsApi";

const VALID_STATUSES: StatusFilter[] = [
  "all",
  "queued",
  "running",
  "succeeded",
  "failed",
];

const isValidStatus = (value: string | null): value is StatusFilter => {
  return value !== null && VALID_STATUSES.some((status) => status === value);
};

export function useRuns() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>(() => {
    const statusParam = new URLSearchParams(window.location.search).get(
      "status",
    );
    return isValidStatus(statusParam) ? statusParam : "all";
  });

  const [searchQuery, setSearchQuery] = useState(() => {
    return new URLSearchParams(window.location.search).get("q") || "";
  });

  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  useEffect(() => {
    let isCancelled = false;

    const loadInitialRuns = async () => {
      try {
        const data = await fetchRuns();
        if (!isCancelled) {
          setRuns(data);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadInitialRuns();

    return () => {
      isCancelled = true;
    };
  }, []);

  const retry = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchRuns();
      setRuns(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetFilters = useCallback(() => {
    setStatusFilter("all");
    setSearchQuery("");
    setSortBy("date-desc");
  }, []);

  const filteredRuns = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return runs
      .filter((run) => {
        const matchesStatus =
          statusFilter === "all" || run.status === statusFilter;

        const matchesSearch =
          !query ||
          run.name.toLowerCase().includes(query) ||
          run.repository.toLowerCase().includes(query);

        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "date-desc") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        if (sortBy === "date-asc") {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }
        if (sortBy === "duration-desc") {
          if (a.durationSeconds == null) return 1;
          if (b.durationSeconds == null) return -1;
          return b.durationSeconds - a.durationSeconds;
        }
        if (sortBy === "duration-asc") {
          if (a.durationSeconds == null) return 1;
          if (b.durationSeconds == null) return -1;
          return a.durationSeconds - b.durationSeconds;
        }
        return 0;
      });
  }, [runs, statusFilter, searchQuery, sortBy]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (statusFilter === "all") params.delete("status");
    else params.set("status", statusFilter);

    if (!searchQuery.trim()) params.delete("q");
    else params.set("q", searchQuery);

    const newUrl = `${window.location.pathname}${params.toString() ? "?" + params.toString() : ""}`;
    window.history.replaceState(null, "", newUrl);
  }, [statusFilter, searchQuery]);

  return {
    runs: filteredRuns,
    totalCount: runs.length,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    resetFilters,
    retry,
  };
}
