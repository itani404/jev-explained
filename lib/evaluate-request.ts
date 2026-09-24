import { z } from 'zod';
import { QUESTION_TYPES } from './content/scenarios';

export const MAX_TEXT_LENGTH = 2000;

export const evaluateRequestSchema = z.object({
  text: z
    .string({ error: 'text must be a string.' })
    .trim()
    .min(1, 'Provide some text to evaluate.')
    .max(MAX_TEXT_LENGTH, `Keep the text under ${MAX_TEXT_LENGTH} characters.`),
  questionType: z.enum(QUESTION_TYPES, {
    error: `questionType must be one of: ${QUESTION_TYPES.join(', ')}.`,
  }),
});

export type EvaluateRequest = z.infer<typeof evaluateRequestSchema>;
