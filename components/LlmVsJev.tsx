'use client';

import { useEffect, useRef, useState } from 'react';
import { DEMO_JEV_REPLY, DEMO_LLM_REPLY, DEMO_TICKET } from '@/lib/content/llm-vs-jev';
import ui from './ui.module.css';
import styles from './LlmVsJev.module.css';

// Scaled illustration timings, not a live call.
const JEV_DELAY_MS = 300;
const LLM_START_MS = 600;
const LLM_CHAR_MS = 12;

type Phase = 'idle' | 'running' | 'done';

export function LlmVsJev() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [llmChars, setLlmChars] = useState(0);
  const [jevShown, setJevShown] = useState(false);
  const [elapsed, setElapsed] = useState({ llm: 0, jev: 0 });
  const timers = useRef<number[]>([]);
  const interval = useRef<number | undefined>(undefined);

  function clearAll() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    window.clearInterval(interval.current);
  }

  useEffect(() => clearAll, []);

  function run() {
    clearAll();
    setPhase('running');
    setLlmChars(0);
    setJevShown(false);

    timers.current.push(
      window.setTimeout(() => {
        setJevShown(true);
        setElapsed((e) => ({ ...e, jev: JEV_DELAY_MS }));
      }, JEV_DELAY_MS)
    );

    const total = DEMO_LLM_REPLY.length;
    const llmDone = LLM_START_MS + total * LLM_CHAR_MS;
    timers.current.push(
      window.setTimeout(() => {
        let i = 0;
        interval.current = window.setInterval(() => {
          i += 1;
          setLlmChars(i);
          if (i >= total) {
            window.clearInterval(interval.current);
            setPhase('done');
            setElapsed((e) => ({ ...e, llm: llmDone }));
          }
        }, LLM_CHAR_MS);
      }, LLM_START_MS)
    );
  }

  const llmText = DEMO_LLM_REPLY.slice(0, llmChars);

  return (
    <div className={styles.versus}>
      <div className={styles.versusTicket}>
        <span className={`${ui.eyebrow} ${styles.ticketLabel}`}>Same ticket, two models</span>
        <p className={ui.mono}>{DEMO_TICKET}</p>
        <button className={`${ui.primary} ${styles.sendButton}`} onClick={run} disabled={phase === 'running'}>
          {phase === 'idle' ? 'Send to both ▶' : phase === 'running' ? 'Running…' : 'Run again ↻'}
        </button>
      </div>

      <div className={styles.versusGrid}>
        <div className={styles.versusCard}>
          <div className={styles.versusHead}>
            <span>General LLM</span>
            <span className={styles.badge}>{phase === 'done' ? `${elapsed.llm}ms` : 'free text'}</span>
          </div>
          <p className={styles.versusBody}>
            {phase === 'idle' ? (
              <span className={styles.placeholder}>Waiting for the ticket…</span>
            ) : (
              <>
                {llmText}
                {phase === 'running' && <span className={styles.caret} />}
              </>
            )}
          </p>
          <div className={styles.versusFoot}>
            <span className={ui.eyebrow}>Your code next</span>
            <code>parse the paragraph, hope it picked one team</code>
          </div>
        </div>

        <div className={`${styles.versusCard} ${styles.versusCardJev}`}>
          <div className={styles.versusHead}>
            <span>Jev</span>
            <span className={styles.badgeAccent}>{jevShown ? `${elapsed.jev}ms` : 'typed'}</span>
          </div>
          <pre className={styles.versusBody}>
            {jevShown ? (
              <span className={styles.popIn}>{DEMO_JEV_REPLY}</span>
            ) : (
              <span className={styles.placeholder}>
                {phase === 'idle' ? 'Waiting for the ticket…' : 'Deciding…'}
              </span>
            )}
          </pre>
          <div className={styles.versusFoot}>
            <span className={ui.eyebrow}>Your code next</span>
            <code>if (answer.choice === &apos;account&apos;) route()</code>
          </div>
        </div>
      </div>

      <p className={ui.note}>
        * Illustration with scaled timings, not a live call. Run the real thing in the playground below.
      </p>
    </div>
  );
}
