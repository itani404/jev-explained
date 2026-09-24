import { run } from '../_shared';
import { experimental_evaluate as evaluate } from 'ai';

// A valid answer isn't always a sure one. The last case needs date math, and in
// testing Jev answered it correctly but only barely (around 0.55). The fix isn't
// to trust or distrust the model, it's to act only when it's confident enough
// and hand the rest to a person.
const THRESHOLD = 0.8;

const cases: { state: string; question: string; expected: boolean }[] = [
  {
    state: 'The user asked to cancel, we offered a discount, and they accepted and kept the plan.',
    question: 'Did the customer cancel?',
    expected: false,
  },
  {
    state: 'The agent said a refund was not possible, then processed it anyway an hour later.',
    question: 'Was a refund issued to the customer?',
    expected: true,
  },
  {
    state: 'Subscription started Jan 10 on a 30 day free trial. Today is Feb 12 and the card was never charged.',
    question: 'Should the customer have been charged by now?',
    expected: true,
  },
];

async function main() {
  for (const c of cases) {
    const result = await evaluate({
      model: 'typesafe-ai/jev',
      state: c.state,
      questions: { answer: { type: 'boolean', instructions: c.question } },
    });

    const p = result.answers.answer.probability;
    const confidence = Math.max(p, 1 - p);
    const action =
      confidence >= THRESHOLD ? `act automatically (${p >= 0.5 ? 'yes' : 'no'})` : 'send to a person';

    console.log(`\n${c.question}`);
    console.log(`  ${c.state}`);
    console.log(`  probability yes: ${p.toFixed(2)}   confidence: ${confidence.toFixed(2)}`);
    console.log(`  expected: ${c.expected ? 'yes' : 'no'}   ->  ${action}`);
  }
}

run(main);
