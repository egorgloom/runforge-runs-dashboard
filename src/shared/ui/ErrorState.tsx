import styles from "./ErrorState.module.css";

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className={styles.wrap} role="alert">
      <h2 className={styles.title}>Something went wrong</h2>
      <p className={styles.message}>{message}</p>
      <button type="button" onClick={onRetry} className={styles.button}>
        Retry
      </button>
    </div>
  );
}
