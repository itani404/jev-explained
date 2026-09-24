import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tokenize } from '../lib/highlight';

const colored = (line: string) =>
  tokenize(line)
    .filter((t) => t.type !== 'plain')
    .map((t) => `${t.type}:${t.text}`);

test('colors keywords and function calls', () => {
  assert.deepEqual(colored('const result = await evaluate({'), [
    'keyword:const',
    'punct:=',
    'keyword:await',
    'function:evaluate',
    'punct:({',
  ]);
});

test('treats object keys as properties and quoted values as strings', () => {
  assert.deepEqual(colored("  state: 'Login failed',"), [
    'property:state',
    'punct::',
    "string:'Login failed'",
    'punct:,',
  ]);
});

test('treats quoted JSON keys as properties, not strings', () => {
  assert.deepEqual(colored('  "choice": "account",'), [
    'property:"choice"',
    'punct::',
    'string:"account"',
    'punct:,',
  ]);
});

test('keeps a whole comment as one token', () => {
  assert.deepEqual(colored("// { choice: 'account' }"), ["comment:// { choice: 'account' }"]);
});

test('reassembles to the original line', () => {
  const line = "  criteria: { billing: '...', n: 0.94 }, // note";
  assert.equal(
    tokenize(line)
      .map((t) => t.text)
      .join(''),
    line
  );
});
