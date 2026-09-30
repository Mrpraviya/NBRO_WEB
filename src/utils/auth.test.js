import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeEmail,
  isValidEmail,
  hashPassword,
  verifyCredentials,
  requestPasswordReset,
  resetPassword,
} from './auth.js';

test('normalizeEmail trims and lowercases email values', () => {
  assert.equal(normalizeEmail(' User@Example.com '), 'user@example.com');
});

test('isValidEmail rejects malformed addresses', () => {
  assert.equal(isValidEmail('user@example.com'), true);
  assert.equal(isValidEmail('user@localhost'), false);
  assert.equal(isValidEmail('userexample.com'), false);
});

test('verifyCredentials rejects wrong password and accepts matching hash', async () => {
  const users = [
    {
      name: 'Test User',
      email: 'user@example.com',
      passwordHash: await hashPassword('StrongPass123!'),
    },
  ];

  assert.deepEqual(
    await verifyCredentials(users, 'user@example.com', 'WrongPass123!'),
    { ok: false, message: 'Invalid email or password' },
  );

  assert.deepEqual(
    await verifyCredentials(users, 'user@example.com', 'StrongPass123!'),
    { ok: true, user: { name: 'Test User', email: 'user@example.com' } },
  );
});

test('requestPasswordReset accepts a valid registered email', async () => {
  const users = [{ name: 'Reset User', email: 'reset@example.com', passwordHash: await hashPassword('StrongPass123!') }];

  const result = requestPasswordReset(users, 'reset@example.com');

  assert.equal(result.ok, true);
  assert.equal(result.email, 'reset@example.com');
  assert.ok(result.token);
});

test('resetPassword updates a known user and clears the request token', async () => {
  const users = [{ name: 'Reset User', email: 'reset@example.com', passwordHash: await hashPassword('OldPassword123!') }];

  const updated = await resetPassword(users, 'reset@example.com', 'NewPassword456!');

  assert.equal(updated.ok, true);
  assert.equal(updated.message, 'Password reset successfully');
  assert.notEqual(updated.user.passwordHash, await hashPassword('OldPassword123!'));
});
