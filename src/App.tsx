import { useState } from "react";
import { useRuns } from "./model/useRuns";
import { RunsToolbar } from "./components/RunsToolbar";
import { RunCard } from "./components/RunCard";
import { RunDetails } from "./components/RunDetails";
import { Sidebar } from "./components/Sidebar";
import { Skeleton } from "./shared/ui/Skeleton";
import { ErrorState } from "./shared/ui/ErrorState";
import { EmptyState } from "./shared/ui/EmptyState";
import type { Run } from "./model/types";
import styles from "./App.module.css";

function App() {
  const {
    runs,
    totalCount,
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
  } = useRuns();

  const [selectedRun, setSelectedRun] = useState<Run | null>(null);

  const hasFilters = statusFilter !== "all" || searchQuery.trim().length > 0;

  return (
    <div className={styles.layout}>
      <Sidebar />

      <div className={styles.contentArea}>
        <header className={styles.topBar}>
          <span className={styles.breadcrumb}>PROJECT / web-platform</span>
          <span className={styles.liveBadge}>LIVE</span>
        </header>

        <main className={styles.main}>
          <div className={styles.titleArea}>
            <h1 className={styles.pageTitle}>RECENT RUNS</h1>
            {!isLoading && !error && (
              <span className={styles.count}>{totalCount} runs</span>
            )}
          </div>

          <RunsToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {isLoading && <Skeleton />}
          {error && <ErrorState message={error} onRetry={retry} />}

          {!isLoading && !error && runs.length === 0 && (
            <EmptyState onReset={resetFilters} hasFilters={hasFilters} />
          )}

          {!isLoading && !error && runs.length > 0 && (
            <div className={styles.list}>
              {runs.map((run) => (
                <RunCard key={run.id} run={run} onClick={setSelectedRun} />
              ))}
            </div>
          )}
        </main>
      </div>

      <RunDetails run={selectedRun} onClose={() => setSelectedRun(null)} />
    </div>
  );
}

export default App;
