import { useEffect, useRef } from "react";
import type { Run } from "../model/types";
import { StatusBadge } from "./StatusBadge";
import { formatDate } from "../shared/lib/formatDate";
import { formatDuration } from "../shared/lib/formatDuration";
import styles from "./RunDetails.module.css";

type RunDetailsProps = {
  run: Run | null;
  onClose: () => void;
};

export function RunDetails({ run, onClose }: RunDetailsProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!run) return;

    previousFocusRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";

    const focusTimer = setTimeout(() => {
      backButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusableElements =
          drawerRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
    };
  }, [run, onClose]);

  if (!run) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={drawerRef}
        className={styles.drawer}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className={styles.header}>
          <button
            ref={backButtonRef}
            type="button"
            onClick={onClose}
            className={styles.backBtn}
          >
            ← Back to list
          </button>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeBtn}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.titleRow}>
            <h2 id="drawer-title" className={styles.title}>
              {run.name}
            </h2>
            <StatusBadge status={run.status} />
          </div>

          <div className={styles.grid}>
            <div>
              <span className={styles.label}>Repository</span>
              <span className={styles.value}>{run.repository}</span>
            </div>
            <div>
              <span className={styles.label}>Branch</span>
              <span className={styles.value}>{run.branch}</span>
            </div>
            <div>
              <span className={styles.label}>Created</span>
              <span className={styles.value}>{formatDate(run.createdAt)}</span>
            </div>
            <div>
              <span className={styles.label}>Duration</span>
              <span className={styles.value}>
                {formatDuration(run.durationSeconds)}
              </span>
            </div>
          </div>

          {run.result && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Result</h3>
              <div
                className={
                  run.status === "failed"
                    ? styles.resultError
                    : styles.resultBox
                }
              >
                {run.result}
              </div>
            </div>
          )}

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Logs</h3>
            <div className={styles.logsBox}>
              {run.logs.map((log, i) => (
                <div key={i} className={styles.logLine}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
