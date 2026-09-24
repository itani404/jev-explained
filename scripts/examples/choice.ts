import { run } from '../_shared';
import { experimental_evaluate as evaluate } from 'ai';

async function main() {
  const result = await evaluate({
    model: 'typesafe-ai/jev',
    state: { subject: 'Login failed', message: 'Cannot access account' },
    questions: {
      department: {
        type: 'choice',
        instructions: 'Which team should handle this?',
        criteria: {
          billing: 'Charges, invoices, and refunds',
          technical: 'Bugs, outages, and integration failures',
          account: 'Login, permissions, and profile changes',
        },
      },
    },
  });

  console.log(JSON.stringify(result.answers, null, 2));
}

run(main);
