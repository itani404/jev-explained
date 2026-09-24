'use client';

import { useId, useState, type ReactNode } from 'react';
import styles from './Disclosure.module.css';

type Props = {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

export function Disclosure({ title, children, defaultOpen = false, className }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className={`${styles.item} ${open ? styles.open : ''} ${className ?? ''}`}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{title}</span>
        <span className={styles.icon} aria-hidden />
      </button>
      <div id={id} className={styles.panel} role="region" inert={!open}>
        <div className={styles.inner}>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </div>
  );
}
