'use client';

import { useEffect, useState } from 'react';
import { SECTIONS } from '@/lib/content/sections';
import styles from './Nav.module.css';

export function Nav({ repoUrl }: { repoUrl: string }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header className={styles.nav}>
      <div className={styles.navInner}>
        <a href="#top" className={styles.logo}>
          jev-explained
        </a>
        <nav className={styles.navLinks} aria-label="Sections">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={active === s.id ? 'true' : undefined}
              className={active === s.id ? styles.navLinkActive : styles.navLink}
            >
              {s.label}
            </a>
          ))}
        </nav>
        <a className={styles.repoLink} href={repoUrl} target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
      </div>
    </header>
  );
}
