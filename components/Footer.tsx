import Image from 'next/image';
import { GITHUB_PROFILE_URL, GITHUB_USER, REPO_URL } from '@/lib/site';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <a className={styles.author} href={GITHUB_PROFILE_URL} target="_blank" rel="noreferrer">
        <Image src={`${GITHUB_PROFILE_URL}.png?size=80`} alt="" width={32} height={32} />
        <span>
          Built by <strong>@{GITHUB_USER}</strong>
        </span>
      </a>
      <p>
        Independent, unofficial project. Not affiliated with TypeSafe AI or Vercel.{' '}
        <a href={REPO_URL} target="_blank" rel="noreferrer">
          Source on GitHub ↗
        </a>
      </p>
    </footer>
  );
}
