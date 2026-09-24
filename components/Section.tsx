import type { ReactNode } from 'react';
import ui from './ui.module.css';
import styles from './Section.module.css';

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  intro: ReactNode;
  children: ReactNode;
};

export function Section({ id, eyebrow, title, intro, children }: Props) {
  return (
    <section id={id} className={styles.section} data-reveal>
      <div className={styles.sectionHead}>
        <span className={ui.eyebrow}>{eyebrow}</span>
        <h2>{title}</h2>
        <p>{intro}</p>
      </div>
      {children}
    </section>
  );
}
