import type { QuestionType } from '../types';

export const QUESTION_TYPES = ['choice', 'score', 'boolean'] as const satisfies readonly QuestionType[];

type ChoiceQuestion = {
  type: 'choice';
  instructions: string;
  criteria: Record<string, string>;
};

type ScoreQuestion = {
  type: 'score';
  instructions: string;
  criteria: string[];
};

type BooleanQuestion = {
  type: 'boolean';
  instructions: string;
  criteria: { true: string; false: string };
};

export type Scenario = {
  label: string;
  key: string;
  question: ChoiceQuestion | ScoreQuestion | BooleanQuestion;
  examples: { label: string; text: string }[];
};

export const SCENARIOS: Record<QuestionType, Scenario> = {
  choice: {
    label: 'Choice',
    key: 'department',
    question: {
      type: 'choice',
      instructions: 'Which team should handle this ticket?',
      criteria: {
        billing: 'Charges, invoices, and refunds',
        technical: 'Bugs, outages, and integration failures',
        account: 'Login, permissions, and profile changes',
      },
    },
    examples: [
      { label: 'Login issue', text: 'Subject: Login failed. Message: I reset my password twice and still cannot get into my account.' },
      { label: 'Double charge', text: 'I was charged twice for my subscription this month, please fix it.' },
      { label: 'API errors', text: 'Your webhook endpoint has been returning 500s since this morning and our sync is broken.' },
    ],
  },
  score: {
    label: 'Score',
    key: 'severity',
    question: {
      type: 'score',
      instructions: 'How severe is this issue?',
      criteria: [
        'Cosmetic or informational',
        'Degraded, but workaround exists',
        'Blocking with no workaround',
        'Blocking with financial loss',
      ],
    },
    examples: [
      { label: 'Outage', text: 'System down for 2 hours, affecting all users. Checkout is failing.' },
      { label: 'Typo', text: 'There is a typo on the pricing page, "anual" instead of "annual".' },
      { label: 'Slow export', text: 'CSV export takes about 5 minutes now, but it still finishes eventually.' },
    ],
  },
  boolean: {
    label: 'Boolean',
    key: 'refunded',
    question: {
      type: 'boolean',
      instructions: 'Was a refund issued to the customer?',
      criteria: {
        true: 'Money was returned to the customer.',
        false: 'No refund was issued or it was declined.',
      },
    },
    examples: [
      { label: 'Refunded', text: 'The support agent issued a full refund to the customer.' },
      { label: 'Declined', text: 'We looked into it, but the purchase is outside the 30 day window so we cannot refund it.' },
      { label: 'Store credit', text: 'Instead of a refund, we added $20 of store credit to your account.' },
    ],
  },
};
