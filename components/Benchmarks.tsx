import { BENCHMARKS } from '@/lib/content/benchmarks';
import ui from './ui.module.css';
import styles from './Benchmarks.module.css';

export function Benchmarks() {
  return (
    <div className={styles.bench}>
      <div className={styles.claimRow}>
        <div className={styles.claim}>
          <span className={ui.eyebrow}>Speed</span>
          <p>
            <strong className={styles.highlight}>5 to 6x</strong> faster
          </p>
          <span className={styles.claimed}>TypeSafe claimed 193.6x</span>
        </div>
        <div className={styles.claim}>
          <span className={ui.eyebrow}>Cost</span>
          <p>
            <strong className={styles.highlight}>26 to 64x</strong> cheaper
          </p>
          <span className={styles.claimed}>TypeSafe claimed 444.6x</span>
        </div>
        <div className={styles.claim}>
          <span className={ui.eyebrow}>Accuracy</span>
          <p>
            <strong>Close</strong> to the big models
          </p>
          <span className={styles.claimedPlain}>Sometimes a bit worse, sometimes better</span>
        </div>
      </div>

      <div className={styles.benchGrid}>
        {BENCHMARKS.map((b) => (
          <article key={b.url} className={styles.benchCard}>
            <div>
              <span className={ui.eyebrow}>vs {b.against}</span>
              <h3>{b.task}</h3>
            </div>

            <dl className={styles.benchStats}>
              <div>
                <dt>Faster</dt>
                <dd className={ui.mono}>{b.speed.multiple}</dd>
                <span>
                  {b.speed.jev} vs {b.speed.other}
                </span>
              </div>
              <div>
                <dt>Cheaper</dt>
                <dd className={ui.mono}>{b.cost.multiple}</dd>
                <span>
                  {b.cost.jev} vs {b.cost.other}
                </span>
              </div>
            </dl>

            <p className={styles.benchNote}>{b.accuracy}</p>

            <a className={ui.ghost} href={b.url} target="_blank" rel="noreferrer">
              Source: {b.source} ↗
            </a>
          </article>
        ))}
      </div>

      <p className={ui.note}>
        Figures as reported by each source, published Sept 17 to 20, 2026. Different tasks and
        setups, so compare the pattern, not the exact numbers.
      </p>
    </div>
  );
}
