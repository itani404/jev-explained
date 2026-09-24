import type { ApiErrorCode } from './types';

export type DescribedError = { status: number; code: ApiErrorCode; message: string };

type Unknownish = Record<string, unknown> | undefined;

function asRecord(value: unknown): Unknownish {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : undefined;
}

// Gateway errors arrive wrapped (GatewayError -> APICallError). Walk the cause chain and
// collect the status code, error type and message wherever they appear.
function inspect(err: unknown) {
  let status: number | undefined;
  let type: string | undefined;
  let name: string | undefined;
  let message = '';

  for (let e = asRecord(err), depth = 0; e && depth < 5; e = asRecord(e.cause), depth++) {
    if (typeof e.statusCode === 'number') status ??= e.statusCode;
    if (typeof e.name === 'string') name ??= e.name;
    if (typeof e.message === 'string') message += ` ${e.message}`;
    const dataError = asRecord(asRecord(e.data)?.error);
    if (typeof dataError?.type === 'string') type ??= dataError.type;
  }

  return { status, type, name, message: message.toLowerCase() };
}

export function describeGatewayError(err: unknown): DescribedError | null {
  const { status, type, name, message } = inspect(err);

  if (name === 'TimeoutError' || name === 'AbortError') {
    return { status: 504, code: 'timeout', message: 'Jev took too long to answer. Try again.' };
  }
  if (type === 'customer_verification_required') {
    return {
      status: 402,
      code: 'card_required',
      message:
        'Your Vercel account needs a card on file before AI Gateway will run requests, even on the free credit.',
    };
  }
  if (type === 'no_providers_available' || message.includes('free tier')) {
    return {
      status: 403,
      code: 'model_unavailable',
      message: "This model isn't available on Vercel's free tier. Add paid Gateway credits to use it.",
    };
  }
  if (status === 401 || message.includes('invalid api key') || message.includes('unauthorized')) {
    return {
      status: 401,
      code: 'invalid_api_key',
      message: 'AI Gateway rejected the API key. Check AI_GATEWAY_API_KEY in .env.local.',
    };
  }
  if (status === 429) {
    return {
      status: 429,
      code: 'upstream_rate_limited',
      message: 'AI Gateway is rate limiting this key. Wait a moment and try again.',
    };
  }
  return null;
}
