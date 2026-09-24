import { NextResponse, type NextRequest } from 'next/server';
import { experimental_evaluate as evaluate } from 'ai';
import { SCENARIOS } from '@/lib/content/scenarios';
import { evaluateRequestSchema } from '@/lib/evaluate-request';
import { describeGatewayError } from '@/lib/gateway-errors';
import { isPlaygroundEnabled } from '@/lib/playground';
import { costFor } from '@/lib/pricing';
import { clientIp, createRateLimiter } from '@/lib/rate-limit';
import type { ApiError, ApiErrorCode, EvaluateSuccess, JevAnswer } from '@/lib/types';

export const runtime = 'nodejs';

const JEV_TIMEOUT_MS = 15_000;
const limiter = createRateLimiter({ limit: 10, windowMs: 60_000 });

function fail(status: number, code: ApiErrorCode, message: string) {
  return NextResponse.json<ApiError>({ error: { code, message } }, { status });
}

export async function POST(req: NextRequest) {
  if (!isPlaygroundEnabled()) {
    return fail(403, 'playground_disabled', 'The playground is off on the hosted site. Clone the repo to run it locally.');
  }

  if (limiter.isLimited(clientIp(req.headers))) {
    return fail(429, 'rate_limited', 'Too many requests. Try again in a minute.');
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail(400, 'invalid_json', 'The request body must be valid JSON.');
  }

  const parsed = evaluateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return fail(400, 'invalid_request', parsed.error.issues[0]?.message ?? 'Invalid request.');
  }

  if (!process.env.AI_GATEWAY_API_KEY) {
    return fail(
      500,
      'missing_api_key',
      'AI_GATEWAY_API_KEY is missing. Add it to .env.local and restart the dev server.'
    );
  }

  const { text, questionType } = parsed.data;
  const scenario = SCENARIOS[questionType];

  try {
    const start = performance.now();
    const result = await evaluate({
      model: 'typesafe-ai/jev',
      state: text,
      questions: { [scenario.key]: scenario.question },
      abortSignal: AbortSignal.timeout(JEV_TIMEOUT_MS),
    });
    const elapsedMs = Math.round(performance.now() - start);
    const inputTokens = result.usage.inputTokens ?? 0;

    return NextResponse.json<EvaluateSuccess>({
      answer: result.answers[scenario.key] as JevAnswer,
      elapsedMs,
      inputTokens,
      cost: costFor('jev', inputTokens),
    });
  } catch (err) {
    const known = describeGatewayError(err);
    if (known) return fail(known.status, known.code, known.message);

    console.error('[api/evaluate] unexpected Jev error', err);
    return fail(502, 'upstream_error', 'Jev request failed. Check the server logs for details.');
  }
}
