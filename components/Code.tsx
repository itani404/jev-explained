import type { ReactNode } from 'react';
import { tokenize } from '@/lib/highlight';
import styles from './Code.module.css';

export function Tokens({ line }: { line: string }) {
  if (!line) return <> </>;
  return (
    <>
      {tokenize(line).map((t, i) =>
        t.type === 'plain' ? t.text : (
          <span key={i} className={styles[t.type]}>
            {t.text}
          </span>
        )
      )}
    </>
  );
}

type LineProps = {
  number: number;
  line: string;
  className?: string;
};

export function CodeLine({ number, line, className }: LineProps) {
  return (
    <span className={`${styles.line} ${className ?? ''}`}>
      <span className={styles.lineNo} aria-hidden>
        {number}
      </span>
      <span className={styles.lineText}>
        <Tokens line={line} />
      </span>
      {'\n'}
    </span>
  );
}

type EditorProps = {
  filename: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Editor({ filename, action, children, className }: EditorProps) {
  return (
    <div className={`${styles.editor} ${className ?? ''}`}>
      <div className={styles.titleBar}>
        <span className={styles.dots} aria-hidden>
          <span />
          <span />
          <span />
        </span>
        <span className={styles.tab}>{filename}</span>
        {action && <span className={styles.action}>{action}</span>}
      </div>
      <pre className={styles.body}>
        <code className={styles.inner}>{children}</code>
      </pre>
    </div>
  );
}

export function CodeBlock({ code, filename }: { code: string; filename: string }) {
  return (
    <Editor filename={filename}>
      {code.split('\n').map((line, i) => (
        <CodeLine key={i} number={i + 1} line={line} />
      ))}
    </Editor>
  );
}
