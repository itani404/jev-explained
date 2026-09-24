export const STEPS = [
  {
    title: 'Hand it the state',
    body: 'The thing the decision is about. A ticket, a JSON object, an array. You can ask several questions about the same state in one call.',
  },
  {
    title: 'Declare the answers',
    body: 'Before the model runs, you list the only answers it is allowed to give: a set of options, a score rubric, or a yes/no statement.',
  },
  {
    title: 'Get a typed answer back',
    body: 'One of the answers you declared, with a probability for each. Nothing to parse, and no way for it to answer outside your schema.',
  },
];

// Each line is tagged with the step it belongs to (0 = shared scaffolding).
export const WALKTHROUGH_CODE: [step: number, line: string][] = [
  [0, 'const result = await evaluate({'],
  [0, "  model: 'typesafe-ai/jev',"],
  [1, "  state: { subject: 'Login failed', message: 'Cannot access account' },"],
  [2, '  questions: {'],
  [2, '    department: {'],
  [2, "      type: 'choice',"],
  [2, "      criteria: { billing: '...', technical: '...', account: '...' },"],
  [2, '    },'],
  [2, '  },'],
  [0, '});'],
  [0, ''],
  [3, 'result.answers.department'],
  [3, "// { choice: 'account', probabilities: { account: 0.94, ... } }"],
];
