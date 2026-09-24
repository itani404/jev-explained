import type { Scenario } from '@/lib/content/scenarios';
import type { BooleanAnswer, ChoiceAnswer, JevAnswer, ScoreAnswer } from '@/lib/types';
import styles from './ResultView.module.css';

function Bar({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`${styles.row} ${highlight ? styles.rowActive : ''}`}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.track}>
        <span className={styles.fill} style={{ width: `${Math.max(value * 100, 0.5)}%` }} />
      </span>
      <span className={styles.rowValue}>{value.toFixed(2)}</span>
    </div>
  );
}

function Headline({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <p className={styles.headline}>
      <span className={styles.key}>{label}</span>
      <span className={styles.arrow}>→</span>
      {children}
    </p>
  );
}

function ChoiceResult({ scenario, answer }: { scenario: Scenario; answer: ChoiceAnswer }) {
  const keys = scenario.question.type === 'choice' ? Object.keys(scenario.question.criteria) : [];
  const options = keys
    .map((key) => ({ key, value: answer.probabilities?.[key] ?? 0 }))
    .sort((a, b) => b.value - a.value);

  return (
    <>
      <Headline label={scenario.key}>
        <span className={styles.value}>{answer.choice}</span>
      </Headline>
      <div className={styles.bars}>
        {options.map((o) => (
          <Bar key={o.key} label={o.key} value={o.value} highlight={o.key === answer.choice} />
        ))}
      </div>
    </>
  );
}

function ScoreResult({ scenario, answer }: { scenario: Scenario; answer: ScoreAnswer }) {
  const levels = scenario.question.type === 'score' ? scenario.question.criteria : [];
  const max = Math.max(levels.length - 1, 1);
  const nearest = Math.round(answer.score);

  return (
    <>
      <Headline label={scenario.key}>
        <span className={styles.value}>
          {answer.score.toFixed(2)} <span className={styles.muted}>/ {max}</span>
        </span>
      </Headline>
      <div className={styles.ladder}>
        <div className={styles.ladderTrack}>
          <span className={styles.marker} style={{ left: `${(answer.score / max) * 100}%` }} />
        </div>
        <div className={styles.ladderTicks}>
          {levels.map((_, i) => (
            <span key={i}>{i}</span>
          ))}
        </div>
      </div>
      <div className={styles.bars}>
        {levels.map((level, i) => (
          <Bar
            key={level}
            label={`${i} · ${level}`}
            value={answer.probabilities?.[String(i)] ?? 0}
            highlight={i === nearest}
          />
        ))}
      </div>
    </>
  );
}

function BooleanResult({ scenario, answer }: { scenario: Scenario; answer: BooleanAnswer }) {
  const p = answer.probability;
  const verdict = p >= 0.5;
  const criteria = scenario.question.type === 'boolean' ? scenario.question.criteria : null;

  return (
    <>
      <Headline label={scenario.key}>
        <span className={styles.value}>{verdict ? 'yes' : 'no'}</span>
        <span className={styles.muted}>· {p.toFixed(2)}</span>
      </Headline>
      <div className={styles.meter}>
        <span className={styles.meterYes} style={{ width: `${p * 100}%` }} />
      </div>
      <div className={styles.meterLabels}>
        <span>yes {(p * 100).toFixed(0)}%</span>
        <span>no {((1 - p) * 100).toFixed(0)}%</span>
      </div>
      {criteria && <p className={styles.criteria}>{verdict ? criteria.true : criteria.false}</p>}
    </>
  );
}

export function ResultView({ scenario, answer }: { scenario: Scenario; answer: JevAnswer }) {
  switch (answer.type) {
    case 'choice':
      return <ChoiceResult scenario={scenario} answer={answer} />;
    case 'score':
      return <ScoreResult scenario={scenario} answer={answer} />;
    case 'boolean':
      return <BooleanResult scenario={scenario} answer={answer} />;
  }
}
