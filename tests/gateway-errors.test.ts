import { test } from 'node:test';
import assert from 'node:assert/strict';
import { describeGatewayError } from '../lib/gateway-errors';

// Shaped like the real wrapped errors AI Gateway returned during testing.
const wrapped = (type: string, message: string, statusCode = 403) => ({
  name: 'GatewayInternalServerError',
  message,
  statusCode,
  cause: { name: 'AI_APICallError', statusCode, data: { error: { type, message } } },
});

test('maps a missing card to card_required', () => {
  const err = wrapped('customer_verification_required', 'AI Gateway requires a valid credit card');
  assert.equal(describeGatewayError(err)?.code, 'card_required');
});

test('maps the free-tier model block to model_unavailable', () => {
  const err = wrapped('no_providers_available', 'Free tier users do not have access to this model.');
  assert.equal(describeGatewayError(err)?.code, 'model_unavailable');
});

test('maps 401 to invalid_api_key', () => {
  assert.equal(describeGatewayError({ statusCode: 401, message: 'nope' })?.code, 'invalid_api_key');
});

test('maps 429 to upstream_rate_limited', () => {
  assert.equal(describeGatewayError({ statusCode: 429, message: 'slow down' })?.code, 'upstream_rate_limited');
});

test('maps timeouts to timeout', () => {
  const err = new DOMException('The operation timed out.', 'TimeoutError');
  assert.equal(describeGatewayError(err)?.code, 'timeout');
});

test('returns null for unknown errors so they get logged', () => {
  assert.equal(describeGatewayError(new Error('something odd')), null);
});
