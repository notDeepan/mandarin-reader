import { test } from 'node:test';
import assert from 'node:assert/strict';
import { planClips, creditsNeeded, checkBudget } from '../scripts/gen-tone-audio.mjs';

test('planClips', () => assert.deepEqual(planClips([{ example: 'ma', audio: 'audio/vi/tones/ngang.mp3' }]), [{ file: 'audio/vi/tones/ngang.mp3', text: 'ma. ma.' }]));
test('creditsNeeded', () => assert.equal(creditsNeeded([{ text: 'ma. ma.' }, { text: 'mà. mà.' }]), 14));
test('budget ok on free with room', () => assert.deepEqual(checkBudget({ tier: 'free', character_count: 9000, character_limit: 10000 }, 100), { ok: true, remaining: 1000 }));
test('budget refuses paid tier', () => {
  const r = checkBudget({ tier: 'starter', character_count: 0, character_limit: 30000 }, 10);
  assert.equal(r.ok, false);
  assert.match(r.reason, /free/);
});
test('budget refuses thin margin', () => assert.equal(checkBudget({ tier: 'free', character_count: 9950, character_limit: 10000 }, 100).ok, false));
