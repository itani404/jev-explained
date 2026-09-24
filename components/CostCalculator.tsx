'use client';

import { useState } from 'react';
import { costFor } from '@/lib/pricing';
import ui from './ui.module.css';
import styles from './CostCalculator.module.css';

const SONNET_OUTPUT_TOKENS = 30; // a short JSON answer
const DECISION_STEPS = [100, 500, 1_000, 5_000, 10_000, 50_000, 100_000, 500_000, 1_000_000];

function money(n: number) {
  if (n >= 1000) return `$${Math.round(n).toLocaleString()}`;
  if (n >= 1) return `$${n.toFixed(2)}`;
  return `$${n.toFixed(4)}`;
}

export function CostCalculator() {
  const [stepIndex, setStepIndex] = useState(4);
  const [tokens, setTokens] = useState(400);

  const perDay = DECISION_STEPS[stepIndex];
  const monthly = perDay * 30;

  const sonnet = monthly * costFor('sonnet', tokens, SONNET_OUTPUT_TOKENS);
  const jev = monthly * costFor('jev', tokens);
  const ratio = sonnet / jev;

  return (
    <div className={styles.calc}>
      <div className={styles.calcInputs}>
        <label className={styles.slider}>
          <span className={styles.sliderHead}>
            <span>Decisions per day</span>
            <strong className={ui.mono}>{perDay.toLocaleString()}</strong>
          </span>
          <input
            type="range"
            min={0}
            max={DECISION_STEPS.length - 1}
            step={1}
            value={stepIndex}
            onChange={(e) => setStepIndex(Number(e.target.value))}
          />
        </label>

        <label className={styles.slider}>
          <span className={styles.sliderHead}>
            <span>Input tokens per decision</span>
            <strong className={ui.mono}>{tokens}</strong>
          </span>
          <input
            type="range"
            min={100}
            max={3000}
            step={50}
            value={tokens}
            onChange={(e) => setTokens(Number(e.target.value))}
          />
        </label>

        <p className={ui.note}>
          Assumes Claude Sonnet 5 returns a {SONNET_OUTPUT_TOKENS}-token JSON answer. Jev output is
          free. List prices only, so treat it as an estimate. For measured numbers, see the{' '}
          <a href="#tests" className={styles.inlineLink}>
            independent tests
          </a>
          .
        </p>
      </div>

      <div className={styles.calcOutput}>
        <div className={styles.costRow}>
          <div className={styles.costHead}>
            <span>Claude Sonnet 5</span>
            <strong className={ui.mono}>{money(sonnet)}/mo</strong>
          </div>
          <span className={styles.costTrack}>
            <span className={styles.costFillMuted} style={{ width: '100%' }} />
          </span>
        </div>

        <div className={styles.costRow}>
          <div className={styles.costHead}>
            <span>Jev</span>
            <strong className={`${ui.mono} ${ui.accentText}`}>{money(jev)}/mo</strong>
          </div>
          <span className={styles.costTrack}>
            <span
              className={styles.costFill}
              style={{ width: `${Math.max((jev / sonnet) * 100, 1)}%` }}
            />
          </span>
        </div>

        <p className={styles.ratio}>
          <span className={ui.mono}>{ratio.toFixed(0)}x</span> cheaper for this workload (estimate)
        </p>
      </div>
    </div>
  );
}
