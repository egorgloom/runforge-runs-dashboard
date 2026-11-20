import styles from "./EmptyState.module.css";

type EmptyStateProps = {
  onReset: () => void;
  hasFilters: boolean;
};

export function EmptyState({ onReset, hasFilters }: EmptyStateProps) {
  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>Nothing found.</h2>
      <p className={styles.message}>
        {hasFilters
          ? "There are no launches based on your request or the selected filter."
          : "The list of launches is currently empty."}
      </p>
      {hasFilters && (
        <button type="button" onClick={onReset} className={styles.button}>
          Reset the filters
        </button>
      )}
    </div>
  );
}
