'use client';

import { useEffect, useRef, useState } from 'react';
import { QUESTION_TYPES, SCENARIOS, type Scenario } from '@/lib/content/scenarios';
import { requestEvaluation } from '@/lib/evaluate-client';
import { MAX_TEXT_LENGTH } from '@/lib/evaluate-request';
import { REPO_URL } from '@/lib/site';
import type { EvaluateSuccess, QuestionType } from '@/lib/types';
import { CodeBlock } from './Code';
import { usePlayground } from './PlaygroundProvider';
import { ResultView } from './ResultView';
import styles from './Playground.module.css';

const CLONE_STEPS = `git clone ${REPO_URL}.git
cd jev-explained && npm install
echo "AI_GATEWAY_API_KEY=your_key" > .env.local && npm run dev`;

const TABS = [
  { id: 'visual', label: 'Visual' },
  { id: 'json', label: 'JSON' },
  { id: 'code', label: 'Code' },
] as const;

type Tab = (typeof TABS)[number]['id'];

function buildSnippet(scenario: Scenario, text: string) {
  const question = JSON.stringify(scenario.question, null, 2).replace(/\n/g, '\n    ');
  return `import { experimental_evaluate as evaluate } from 'ai';

const result = await evaluate({
  model: 'typesafe-ai/jev',
  state: ${JSON.stringify(text)},
  questions: {
    ${scenario.key}: ${question},
  },
});

console.log(result.answers.${scenario.key});`;
}

function criteriaLabels(scenario: Scenario): string[] {
  const { question } = scenario;
  if (question.type === 'choice') return Object.keys(question.criteria);
  if (question.type === 'score') return question.criteria.map((_, i) => String(i));
  return ['yes', 'no'];
}

export function Playground() {
  const { enabled, questionType, setQuestionType } = usePlayground();
  const [texts, setTexts] = useState<Record<QuestionType, string>>({
    choice: SCENARIOS.choice.examples[0].text,
    score: SCENARIOS.score.examples[0].text,
    boolean: SCENARIOS.boolean.examples[0].text,
  });
  const [result, setResult] = useState<{ type: QuestionType; data: EvaluateSuccess } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>('visual');
  const [runId, setRunId] = useState(0);
  const inFlight = useRef<AbortController | null>(null);

  useEffect(() => () => inFlight.current?.abort(), []);

  const scenario = SCENARIOS[questionType];
  const text = texts[questionType];
  const current = result?.type === questionType ? result.data : null;
  const viewState = error ? 'error' : loading && !current ? 'loading' : current ? `run-${runId}` : 'empty';
  const viewKey = `${tab}-${questionType}-${viewState}`;

  function setText(value: string) {
    setTexts((prev) => ({ ...prev, [questionType]: value }));
  }

  async function run(e: React.FormEvent) {
    e.preventDefault();
    if (!enabled) return;

    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;

    setLoading(true);
    setError(null);

    try {
      const data = await requestEvaluation({ text, questionType }, controller.signal);
      setResult({ type: questionType, data });
      setRunId((n) => n + 1);
    } catch (err) {
      if (controller.signal.aborted) return;
      setResult(null);
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      if (inFlight.current === controller) {
        inFlight.current = null;
        setLoading(false);
      }
    }
  }

  return (
    <div className={styles.grid}>
      <form className={`${styles.panel} ${styles.inputPanel}`} onSubmit={run}>
        <div
          className={styles.segmented}
          role="group"
          aria-label="Decision type"
          style={{ '--index': QUESTION_TYPES.indexOf(questionType) } as React.CSSProperties}
        >
          <span className={styles.segmentIndicator} aria-hidden />
          {QUESTION_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              aria-pressed={type === questionType}
              className={type === questionType ? styles.segmentActive : styles.segment}
              onClick={() => {
                setQuestionType(type);
                setError(null);
              }}
            >
              {SCENARIOS[type].label}
            </button>
          ))}
        </div>

        <div className={styles.question}>
          <span className={styles.eyebrow}>Question</span>
          <p>{scenario.question.instructions}</p>
          <div className={styles.chips}>
            {criteriaLabels(scenario).map((c) => (
              <span key={c} className={styles.criteriaChip}>
                {c}
              </span>
            ))}
          </div>
        </div>

        <label className={styles.field}>
          <span className={styles.eyebrow}>State</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            maxLength={MAX_TEXT_LENGTH}
            placeholder="Paste a ticket, a message, anything..."
          />
          <span className={styles.counter}>
            {text.length} / {MAX_TEXT_LENGTH}
          </span>
        </label>

        <div className={styles.examples}>
          <span className={styles.eyebrow}>Try</span>
          {scenario.examples.map((ex) => (
            <button
              key={ex.label}
              type="button"
              aria-pressed={ex.text === text}
              className={ex.text === text ? styles.exampleActive : styles.example}
              onClick={() => setText(ex.text)}
            >
              {ex.label}
            </button>
          ))}
        </div>

        <div className={styles.runBar}>
          <button className={styles.run} type="submit" disabled={!enabled || loading || !text.trim()}>
            {!enabled ? 'Clone the repo to run Jev' : loading ? 'Running…' : 'Run Jev ▶'}
          </button>
        </div>
      </form>

      <section className={`${styles.panel} ${styles.outputPanel}`} aria-live="polite" aria-busy={loading}>
        <div className={styles.tabs} role="group" aria-label="Output view">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={t.id === tab}
              className={t.id === tab ? styles.tabActive : styles.tab}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className={styles.outputBody}>
          <div key={viewKey} className={styles.fadeIn}>
            {tab === 'code' ? (
              <CodeBlock filename="evaluate.ts" code={buildSnippet(scenario, text)} />
            ) : error ? (
              <div className={styles.error} role="alert">
                <strong>Request failed</strong>
                <p>{error}</p>
              </div>
            ) : loading && !current ? (
              <div className={styles.skeleton}>
                <span />
                <span />
                <span />
              </div>
            ) : !current && !enabled ? (
              <div className={styles.hosted}>
                <div>
                  <p className={styles.hostedTitle}>This playground runs on your machine</p>
                  <p className={styles.emptyHint}>
                    It calls Jev with your own Vercel AI Gateway key, so it&apos;s switched off on the
                    hosted site. Three commands and you&apos;re running it:
                  </p>
                </div>
                <CodeBlock filename="terminal" code={CLONE_STEPS} />
                <a className={styles.hostedLink} href={REPO_URL} target="_blank" rel="noreferrer">
                  View the repo on GitHub ↗
                </a>
                <p className={styles.emptyHint}>
                  Meanwhile, the Code tab shows the exact call for the example you picked.
                </p>
              </div>
            ) : !current ? (
              <div className={styles.empty}>
                <p>Pick an example or paste your own text, then run it.</p>
                <p className={styles.emptyHint}>
                  You&apos;ll see the typed answer, the probability for every option, and what the call
                  cost.
                </p>
              </div>
            ) : tab === 'json' ? (
              <CodeBlock filename="response.json" code={JSON.stringify(current.answer, null, 2)} />
            ) : (
              <ResultView scenario={scenario} answer={current.answer} />
            )}
          </div>
        </div>

        {current && !error && (
          <dl key={runId} className={`${styles.stats} ${styles.fadeIn}`}>
            <div>
              <dt>Latency</dt>
              <dd>{current.elapsedMs}ms</dd>
            </div>
            <div>
              <dt>Input tokens</dt>
              <dd>{current.inputTokens}</dd>
            </div>
            <div>
              <dt>Cost</dt>
              <dd>${current.cost.toFixed(7)}</dd>
            </div>
          </dl>
        )}
      </section>
    </div>
  );
}
