import { run } from '../_shared';
import { experimental_evaluate as evaluate } from 'ai';

async function main() {
  const result = await evaluate({
    model: 'typesafe-ai/jev',
    state: 'System down for 2 hours, affecting all users.',
    questions: {
      severity: {
        type: 'score',
        instructions: 'How severe is this issue?',
        criteria: [
          'Cosmetic or informational',
          'Degraded, but workaround exists',
          'Blocking with no workaround',
          'Blocking with financial loss',
        ],
      },
    },
  });

  console.log(JSON.stringify(result.answers, null, 2));
}

run(main);
