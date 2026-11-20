import styles from "./Skeleton.module.css";

export function Skeleton() {
  return (
    <div
      className={styles.list}
      role="status"
      aria-busy="true"
      aria-label="Loading launches"
    >
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={styles.card} aria-hidden="true">
          <div className={styles.title} />
          <div className={styles.subtitle} />
          <div className={styles.meta} />
        </div>
      ))}
    </div>
  );
}
