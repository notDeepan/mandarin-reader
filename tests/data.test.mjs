import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkPack } from '../scripts/check-data.mjs';

test('zh data is valid', () => assert.deepEqual(checkPack('zh').errors, []));
