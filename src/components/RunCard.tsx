import type { Run } from "../model/types";
import { StatusBadge } from "./StatusBadge";
import { formatDate } from "../shared/lib/formatDate";
import { formatDuration } from "../shared/lib/formatDuration";
import styles from "./RunCard.module.css";

type RunCardProps = {
  run: Run;
  onClick: (run: Run) => void;
};

export function RunCard({ run, onClick }: RunCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(run);
    }
  };

  return (
    <div
      className={styles.card}
      onClick={() => onClick(run)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Open launch details ${run.name}`}
    >
      <div className={styles.mainInfo}>
        <h3 className={styles.name}>{run.name}</h3>
        <div className={styles.repoInfo}>
          <span>{run.repository}</span>
          <span className={styles.separator}>/</span>
          <span className={styles.branch}>{run.branch}</span>
        </div>
      </div>

      <div className={styles.meta}>
        <StatusBadge status={run.status} />
        <div className={styles.timeInfo}>
          <span>{formatDate(run.createdAt)}</span>
          <span className={styles.duration}>
            {formatDuration(run.durationSeconds)}
          </span>
        </div>
      </div>
    </div>
  );
}
