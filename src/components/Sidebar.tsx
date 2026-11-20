import type { MouseEvent } from "react";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  { label: "Runs", active: true },
  { label: "Projects", active: false },
  { label: "Devboxes", active: false },
  { label: "Previews", active: false },
  { label: "Snapshots", active: false },
];

export function Sidebar() {
  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.logo}>WORKSPACE</span>
      </div>

      <nav className={styles.nav} aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href="#"
            onClick={handleLinkClick}
            className={`${styles.navItem} ${item.active ? styles.active : ""}`}
            aria-current={item.active ? "page" : undefined}
          >
            {item.label}
          </a>
        ))}

        <div className={styles.spacer} />

        <a href="#" onClick={handleLinkClick} className={styles.navItem}>
          Settings
        </a>
      </nav>
    </aside>
  );
}
