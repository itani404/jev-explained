// Server-only check. The playground spends the host's own API key, so it's off on
// Vercel (VERCEL=1) unless PLAYGROUND=on is set explicitly.
export function isPlaygroundEnabled(): boolean {
  const setting = process.env.PLAYGROUND ?? (process.env.VERCEL ? 'off' : 'on');
  return setting === 'on';
}
