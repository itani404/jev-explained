import type { EvaluateRequest } from './evaluate-request';
import type { ApiError, EvaluateSuccess } from './types';

const CLIENT_TIMEOUT_MS = 20_000;

function isApiError(value: unknown): value is ApiError {
  return (
    !!value &&
    typeof value === 'object' &&
    'error' in value &&
    typeof (value as ApiError).error?.message === 'string'
  );
}

export async function requestEvaluation(
  body: EvaluateRequest,
  signal?: AbortSignal
): Promise<EvaluateSuccess> {
  const timeout = AbortSignal.timeout(CLIENT_TIMEOUT_MS);
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;

  let res: Response;
  try {
    res = await fetch('/api/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: combined,
    });
  } catch (err) {
    if (timeout.aborted) throw new Error('Jev took too long to answer. Try again.');
    if (signal?.aborted) throw err;
    throw new Error('Could not reach the server. Is `npm run dev` still running?');
  }

  // A proxy or platform error page can come back as HTML, so don't assume JSON.
  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(isApiError(data) ? data.error.message : `Request failed (HTTP ${res.status}).`);
  }
  if (!data || typeof data !== 'object' || !('answer' in data)) {
    throw new Error('The server returned an unexpected response.');
  }
  return data as EvaluateSuccess;
}
