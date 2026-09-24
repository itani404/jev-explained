import { experimental_evaluate as evaluate, generateObject } from 'ai';
import { z } from 'zod';
import { costFor } from '../lib/pricing';
import { run } from './_shared';

// Same classification task two ways: Jev's typed evaluate() call, and Claude Sonnet 5
// forced into the same shape with generateObject. Needs paid Gateway credits, since
// Vercel's free tier doesn't allow Sonnet. Each model runs RUNS times; the median is reported.
const RUNS = 5;

const state = { subject: 'Login failed', message: 'Cannot access account' };
const instructions = 'Which team should handle this: billing, technical, or account?';
const criteria = {
  billing: 'Charges, invoices, and refunds',
  technical: 'Bugs, outages, and integration failures',
  account: 'Login, permissions, and profile changes',
};

type Sample = { answer: string; ms: number; cost: number };

async function jevOnce(): Promise<Sample> {
  const start = performance.now();
  const result = await evaluate({
    model: 'typesafe-ai/jev',
    state,
    questions: { department: { type: 'choice', instructions, criteria } },
  });
  return {
    answer: result.answers.department.choice,
    ms: performance.now() - start,
    cost: costFor('jev', result.usage.inputTokens ?? 0),
  };
}

async function sonnetOnce(): Promise<Sample> {
  const start = performance.now();
  const result = await generateObject({
    model: 'anthropic/claude-sonnet-5',
    schema: z.object({ department: z.enum(['billing', 'technical', 'account']) }),
    prompt: `${instructions}\n\nTicket:\n${JSON.stringify(state)}`,
  });
  return {
    answer: result.object.department,
    ms: performance.now() - start,
    cost: costFor('sonnet', result.usage.inputTokens ?? 0, result.usage.outputTokens ?? 0),
  };
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

async function sample(label: string, once: () => Promise<Sample>) {
  const samples: Sample[] = [];
  for (let i = 0; i < RUNS; i++) samples.push(await once());
  const ms = median(samples.map((s) => s.ms));
  const cost = median(samples.map((s) => s.cost));
  console.log(`\n${label}`);
  console.log(`  answers: ${samples.map((s) => s.answer).join(', ')}`);
  console.log(`  median latency: ${ms.toFixed(0)}ms`);
  console.log(`  median cost:    $${cost.toFixed(8)}`);
  return { ms, cost };
}

async function main() {
  console.log(`Running each model ${RUNS} times...`);
  const jev = await sample('Jev', jevOnce);
  const sonnet = await sample('Claude Sonnet 5', sonnetOnce);

  console.log(`\nJev was ${(sonnet.ms / jev.ms).toFixed(1)}x faster`);
  console.log(`Jev was ${(sonnet.cost / jev.cost).toFixed(1)}x cheaper`);
}

run(main);
