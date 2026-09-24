export const GITHUB_USER = 'itani404';
export const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USER}`;
export const REPO_URL = `${GITHUB_PROFILE_URL}/jev-explained`;

export const SITE_TITLE = 'jev-explained';
export const SITE_DESCRIPTION =
  "A hands-on look at TypeSafe AI's Jev decision model: how it works, what it costs, and what independent tests found.";

// Vercel exposes the production domain at build time; fall back to localhost in dev.
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';
