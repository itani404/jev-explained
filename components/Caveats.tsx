import { CAVEATS } from '@/lib/content/caveats';
import { Disclosure } from './Disclosure';
import styles from './Caveats.module.css';

export function Caveats() {
  return (
    <div className={styles.accordion}>
      {CAVEATS.map((item, i) => (
        <Disclosure key={item.q} title={item.q} defaultOpen={i === 0} className={styles.accItem}>
          <p className={styles.accText}>{item.a}</p>
        </Disclosure>
      ))}
    </div>
  );
}
