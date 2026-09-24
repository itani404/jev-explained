export type Benchmark = {
  source: string;
  url: string;
  task: string;
  against: string;
  speed: { multiple: string; jev: string; other: string };
  cost: { multiple: string; jev: string; other: string };
  accuracy: string;
};

// Third-party results published Sept 17 to 20, 2026. Figures as reported by each source.
export const BENCHMARKS: Benchmark[] = [
  {
    source: 'jev-aita on GitHub',
    url: 'https://github.com/dchristopoulos/jev-aita',
    task: '770 Reddit “Am I the Asshole?” verdicts',
    against: 'Claude Sonnet 5',
    speed: { multiple: '6.3x', jev: '0.39s', other: '2.46s' },
    cost: { multiple: '62x', jev: '$0.037', other: '$2.29 per 1,000' },
    accuracy: 'Sonnet was slightly more accurate (Brier score 0.344 vs 0.369).',
  },
  {
    source: 'DEV Community',
    url: 'https://dev.to/arifulislamat/typesafes-jev-model-is-it-really-193x-faster-and-444x-cheaper-56oa',
    task: '100 support tickets, 400 decisions',
    against: 'Claude Sonnet 5',
    speed: { multiple: '5.2x', jev: '474ms', other: '2,479ms' },
    cost: { multiple: '64x', jev: '$0.0031', other: '$0.199 per 100 tickets' },
    accuracy:
      'When Jev was very confident it agreed with the other models 100% of the time. Below 0.70 confidence, only 72%.',
  },
  {
    source: 'LiteLLM',
    url: 'https://docs.litellm.ai/blog/jev-auto-router-benchmark',
    task: '240 model-routing decisions',
    against: 'Claude Haiku 4.5',
    speed: { multiple: '5.4x', jev: '127ms', other: '688ms' },
    cost: { multiple: '26x', jev: '$0.0077', other: '$0.199 per 240 calls' },
    accuracy: 'Jev matched the expected answer more often: 95% vs 74%.',
  },
];
