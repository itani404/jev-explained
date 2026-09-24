'use client';

import { useState } from 'react';
import { CodeLine, Editor } from './Code';
import codeStyles from './Code.module.css';
import { STEPS, WALKTHROUGH_CODE } from '@/lib/content/how-it-works';
import styles from './HowItWorks.module.css';

export function HowItWorks() {
  const [active, setActive] = useState(1);

  return (
    <div className={styles.how}>
      <ol className={styles.steps}>
        {STEPS.map((step, i) => {
          const n = i + 1;
          return (
            <li key={step.title}>
              <button
                className={n === active ? styles.stepActive : styles.step}
                onClick={() => setActive(n)}
                aria-pressed={n === active}
              >
                <span className={styles.stepNum}>{n}</span>
                <span>
                  <span className={styles.stepTitle}>{step.title}</span>
                  <span className={styles.stepBody}>{step.body}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <Editor
        filename="route-ticket.ts"
        action={
          <button
            className={codeStyles.actionButton}
            onClick={() => setActive(active === STEPS.length ? 1 : active + 1)}
          >
            {active === STEPS.length ? 'Start over ↺' : 'Next step →'}
          </button>
        }
      >
        {WALKTHROUGH_CODE.map(([step, line], i) => (
          <CodeLine
            key={i}
            number={i + 1}
            line={line}
            className={
              step === active ? codeStyles.lineActive : step === 0 ? undefined : codeStyles.lineDim
            }
          />
        ))}
      </Editor>
    </div>
  );
}
