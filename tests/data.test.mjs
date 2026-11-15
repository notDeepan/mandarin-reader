import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkPack } from '../scripts/check-data.mjs';

test('zh data is valid', () => assert.deepEqual(checkPack('zh').errors, []));
test('vi data is valid', () => assert.deepEqual(checkPack('vi').errors, []));
test('vi gloss coverage >= 95% on glossed chapters', () =>
  assert.deepEqual(checkPack('vi').coverage.filter(c => c.ratio < 0.95).map(c => c.where), []));
