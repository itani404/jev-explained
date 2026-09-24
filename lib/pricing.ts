// List prices per 1M tokens on Vercel AI Gateway, Sept 2026. Verify before relying on them.
export const PRICES = {
  jev: { input: 0.042, output: 0 },
  sonnet: { input: 3, output: 15 },
} as const;

export type PricedModel = keyof typeof PRICES;

export function costFor(model: PricedModel, inputTokens: number, outputTokens = 0): number {
  const p = PRICES[model];
  return (inputTokens * p.input + outputTokens * p.output) / 1_000_000;
}
