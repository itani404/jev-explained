import { Disclosure } from './Disclosure';
import styles from './WhyJev.module.css';

export function WhyJev() {
  return (
    <Disclosure title="Why is it called Jev?" className={styles.aside}>
      <div className={styles.asideText}>
        <p>
          It&apos;s named after William Stanley Jevons. In 1865 he noticed that as steam engines got
          more efficient, Britain burned <em>more</em> coal, not less, because cheap energy got used
          for more things. That&apos;s the Jevons paradox.
        </p>
        <p>
          TypeSafe&apos;s bet is the same for AI decisions: make them nearly free and people will
          build things that were never worth doing at frontier-model prices. They call Jev a
          &quot;System One&quot; model, borrowing Daniel Kahneman&apos;s term for fast, intuitive
          thinking, as opposed to the slow, deliberate System Two that LLMs are good at.
        </p>
      </div>
    </Disclosure>
  );
}
