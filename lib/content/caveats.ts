export const CAVEATS = [
  {
    q: 'A valid answer is not the same as a correct one',
    a: 'Jev guarantees the shape of the answer, never that it picked the right option. Look at the probability: in one independent test Jev agreed with other models 100% of the time when it was very confident, but only 72% of the time below 0.70. Send the unsure cases to a person, and test it on labeled examples from your own data before trusting it.',
  },
  {
    q: 'The launch numbers are TypeSafe’s own',
    a: 'The 193.6x faster and 444.6x cheaper figures come from four workflow evaluations built by TypeSafe staff, and they describe them as the high end. Independent tests (see above) land closer to 5 to 6x faster and 26 to 64x cheaper.',
  },
  {
    q: 'It launched in September 2026',
    a: 'Vercel, Cloudflare, LangChain and Langfuse added it within days. Fast adoption by platforms is not the same as years of production reliability.',
  },
  {
    q: 'Is this actually new?',
    a: 'Some people call it a rebrand of zero-shot classifiers, which have existed for years. The honest answer is somewhere in between: the idea is familiar, the packaging (typed schemas, calibrated probabilities, near-zero price) is what makes it practical inside agents.',
  },
  {
    q: 'Will the price last?',
    a: 'TypeSafe has said it can’t yet prove the pricing isn’t subsidized. If your architecture depends on decisions being almost free, keep that risk in mind.',
  },
];
