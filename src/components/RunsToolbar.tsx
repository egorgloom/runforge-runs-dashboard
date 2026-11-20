import type { StatusFilter, SortOption } from "../model/types";
import styles from "./RunsToolbar.module.css";

type RunsToolbarProps = {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: StatusFilter;
  onStatusChange: (val: StatusFilter) => void;
  sortBy: SortOption;
  onSortChange: (val: SortOption) => void;
};

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "queued", label: "Queued" },
  { value: "running", label: "Running" },
  { value: "succeeded", label: "Succeeded" },
  { value: "failed", label: "Failed" },
];

export function RunsToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
}: RunsToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.searchWrap}>
        <label htmlFor="search-runs" className="sr-only">
          Launch search
        </label>
        <input
          id="search-runs"
          type="search"
          placeholder="Search for launches or the repository..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.filtersWrap}>
        <div className={styles.tabs} role="group" aria-label="Filter by status">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => onStatusChange(f.value)}
              className={`${styles.tab} ${statusFilter === f.value ? styles.activeTab : ""}`}
              aria-pressed={statusFilter === f.value}
            >
              {f.label}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className={styles.sortSelect}
          aria-label="Sort runs"
        >
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="duration-desc">Longest first</option>
          <option value="duration-asc">Shortest first</option>
        </select>
      </div>
    </div>
  );
}
