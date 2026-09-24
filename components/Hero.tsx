import { HERO_FACTS } from '@/lib/content/hero';
import ui from './ui.module.css';
import styles from './Hero.module.css';

export function Hero({ playgroundEnabled }: { playgroundEnabled: boolean }) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroCopy}>
        <span className={styles.pill}>Launched Sept 15, 2026 by TypeSafe AI</span>
        <h1>
          A model that returns <span className={ui.accentText}>decisions</span>, not text.
        </h1>
        <p className={styles.lead}>
          Jev answers narrow questions about your data with a typed answer and a probability. It&apos;s
          built for the small calls inside an agent: route this, score that, is this safe. This page
          explains how it works, and lets you run it with your own key.
        </p>
        <div className={styles.heroActions}>
          <a href="#how" className={ui.secondary}>
            How it works
          </a>
          <a href="#try" className={ui.primary}>
            {playgroundEnabled ? 'Try it live ↓' : 'Try it ↓'}
          </a>
        </div>
      </div>
      <dl className={styles.facts}>
        {HERO_FACTS.map((f) => (
          <div key={f.label}>
            <dt className={ui.mono}>{f.value}</dt>
            <dd>{f.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
