'use client';

import { ANSWER_TYPES } from '@/lib/content/answer-types';
import { usePlayground } from './PlaygroundProvider';
import ui from './ui.module.css';
import styles from './AnswerTypes.module.css';

export function AnswerTypes() {
  const { tryType } = usePlayground();

  return (
    <div className={styles.typeGrid}>
      {ANSWER_TYPES.map((t) => (
        <article key={t.type} className={styles.typeCard}>
          <div className={styles.typeTop}>
            <h3>{t.name}</h3>
            <code className={styles.returns}>{t.returns}</code>
          </div>
          <p>{t.summary}</p>

          <div className={styles.miniBars} aria-hidden>
            {t.preview.map((p, i) => (
              <div key={p.label} className={styles.miniRow}>
                <span>{p.label}</span>
                <span className={styles.miniTrack}>
                  <span
                    className={i === 0 || p.value > 0.5 ? styles.miniFillOn : styles.miniFill}
                    style={{ width: `${Math.max(p.value * 100, 2)}%` }}
                  />
                </span>
              </div>
            ))}
          </div>

          <ul className={styles.goodFor}>
            {t.goodFor.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>

          <button className={ui.ghost} onClick={() => tryType(t.type)}>
            Try {t.name} in the playground ↓
          </button>
        </article>
      ))}
    </div>
  );
}
