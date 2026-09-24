import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clientIp, createRateLimiter } from '../lib/rate-limit';

test('allows up to the limit, then blocks', () => {
  const limiter = createRateLimiter({ limit: 2, windowMs: 1000 });
  assert.equal(limiter.isLimited('a', 0), false);
  assert.equal(limiter.isLimited('a', 1), false);
  assert.equal(limiter.isLimited('a', 2), true);
});

test('tracks keys separately', () => {
  const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
  assert.equal(limiter.isLimited('a', 0), false);
  assert.equal(limiter.isLimited('b', 0), false);
});

test('lets requests through again after the window passes', () => {
  const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
  limiter.isLimited('a', 0);
  assert.equal(limiter.isLimited('a', 500), true);
  assert.equal(limiter.isLimited('a', 2000), false);
});

test('uses the first address in x-forwarded-for', () => {
  const headers = new Headers({ 'x-forwarded-for': '9.9.9.9, 10.0.0.1' });
  assert.equal(clientIp(headers), '9.9.9.9');
});

test('falls back to a fixed key locally', () => {
  assert.equal(clientIp(new Headers()), 'local');
});
