import { run } from '../_shared';
import { experimental_evaluate as evaluate } from 'ai';

async function main() {
  const result = await evaluate({
    model: 'typesafe-ai/jev',
    state: 'The support agent issued a full refund to the customer.',
    questions: {
      refunded: {
        type: 'boolean',
        instructions: 'Was a refund issued to the customer?',
        criteria: {
          true: 'Money was returned to the customer.',
          false: 'No refund was issued or was declined.',
        },
      },
    },
  });

  console.log(JSON.stringify(result.answers, null, 2));
}

run(main);
