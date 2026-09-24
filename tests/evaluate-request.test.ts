import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateRequestSchema, MAX_TEXT_LENGTH } from '../lib/evaluate-request';

const firstIssue = (input: unknown) => {
  const result = evaluateRequestSchema.safeParse(input);
  assert.equal(result.success, false);
  return result.error?.issues[0]?.message;
};

test('accepts a valid request and trims the text', () => {
  const result = evaluateRequestSchema.safeParse({ text: '  hello  ', questionType: 'score' });
  assert.equal(result.success, true);
  assert.deepEqual(result.data, { text: 'hello', questionType: 'score' });
});

test('rejects empty or whitespace-only text', () => {
  assert.equal(firstIssue({ text: '   ', questionType: 'choice' }), 'Provide some text to evaluate.');
});

test('rejects text over the length limit', () => {
  assert.equal(
    firstIssue({ text: 'a'.repeat(MAX_TEXT_LENGTH + 1), questionType: 'choice' }),
    `Keep the text under ${MAX_TEXT_LENGTH} characters.`
  );
});

test('rejects an unknown question type', () => {
  assert.match(firstIssue({ text: 'hi', questionType: 'poem' }) ?? '', /questionType must be one of/);
});

test('rejects a missing body', () => {
  assert.equal(evaluateRequestSchema.safeParse(null).success, false);
});
