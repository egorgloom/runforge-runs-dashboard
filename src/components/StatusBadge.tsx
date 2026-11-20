import type { RunStatus } from "../model/types";
import styles from "./StatusBadge.module.css";

const STATUS_META: Record<RunStatus, { label: string; tone: string }> = {
  queued: { label: "Queued", tone: "queued" },
  running: { label: "Running", tone: "running" },
  succeeded: { label: "Succeeded", tone: "succeeded" },
  failed: { label: "Failed", tone: "failed" },
};

export function StatusBadge({ status }: { status: RunStatus }) {
  const meta = STATUS_META[status];

  return (
    <span className={`${styles.badge} ${styles[meta.tone]}`}>
      <span className={styles.dot} aria-hidden="true" />
      {meta.label}
    </span>
  );
}
