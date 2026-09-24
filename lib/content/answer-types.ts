import type { QuestionType } from '../types';

export const ANSWER_TYPES: {
  type: QuestionType;
  name: string;
  summary: string;
  goodFor: string[];
  returns: string;
  preview: { label: string; value: number }[];
}[] = [
  {
    type: 'choice',
    name: 'Choice',
    summary: 'Pick one option from a list you define.',
    goodFor: ['Routing tickets', 'Picking the next agent tool', 'Intent detection'],
    returns: "choice: 'account'",
    preview: [
      { label: 'account', value: 0.94 },
      { label: 'technical', value: 0.05 },
      { label: 'billing', value: 0.01 },
    ],
  },
  {
    type: 'score',
    name: 'Score',
    summary: 'Grade something against an ordered rubric of 2 to 10 levels.',
    goodFor: ['Severity triage', 'Lead scoring', 'Quality checks'],
    returns: 'score: 2.86',
    preview: [
      { label: '0', value: 0.01 },
      { label: '1', value: 0.03 },
      { label: '2', value: 0.06 },
      { label: '3', value: 0.9 },
    ],
  },
  {
    type: 'boolean',
    name: 'Boolean',
    summary: 'How likely is a statement to be true, as a probability.',
    goodFor: ['Safety gates', 'Did the agent finish the task?', 'Escalate or not'],
    returns: 'probability: 0.99',
    preview: [
      { label: 'yes', value: 0.99 },
      { label: 'no', value: 0.01 },
    ],
  },
];
