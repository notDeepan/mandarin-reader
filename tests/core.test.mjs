import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadBrowserScripts } from '../scripts/lib/load-scripts.mjs';

const { Core } = loadBrowserScripts(['js/core.js']);
const P = { zh: {}, vi: {} };
const fakeStorage = init => {
  const m = new Map(Object.entries(init));
  return {
    getItem: k => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: k => m.delete(k),
    dump: () => Object.fromEntries(m)
  };
};
const plain = v => JSON.parse(JSON.stringify(v));

test('pickLang: valid query wins', () => assert.equal(Core.pickLang({ query: 'vi', stored: 'zh', hadLegacy: false, packs: P }), 'vi'));
test('pickLang: unknown query falls back to stored', () => assert.equal(Core.pickLang({ query: 'xx', stored: 'zh', hadLegacy: false, packs: P }), 'zh'));
test('pickLang: unknown stored + legacy user -> zh', () => assert.equal(Core.pickLang({ query: null, stored: 'fr', hadLegacy: true, packs: P }), 'zh'));
test('pickLang: nothing -> null', () => assert.equal(Core.pickLang({ query: null, stored: null, hadLegacy: false, packs: P }), null));

test('migrateStorage moves dark flag', () => {
  const s = fakeStorage({ 'mandarin-reader-dark': 'true' });
  assert.deepEqual(plain(Core.migrateStorage(s)), { hadLegacy: true });
  assert.deepEqual(s.dump(), { 'reader-dark': 'true' });
});
test('migrateStorage keeps existing reader-dark', () => {
  const s = fakeStorage({ 'mandarin-reader-dark': 'true', 'reader-dark': 'false' });
  Core.migrateStorage(s);
  assert.deepEqual(s.dump(), { 'reader-dark': 'false' });
});
test('migrateStorage without legacy', () => assert.deepEqual(plain(Core.migrateStorage(fakeStorage({}))), { hadLegacy: false }));

test('stripLangParam keeps other params and hash', () => assert.equal(Core.stripLangParam('https://x.io/app/?lang=vi&sw=1#books'), 'https://x.io/app/?sw=1#books'));
test('stripLangParam drops empty query', () => assert.equal(Core.stripLangParam('https://x.io/app/?lang=vi'), 'https://x.io/app/'));

test('gloss word mode (Mandarin behaviour)', () => assert.deepEqual(
  plain(Core.glossTokens('Wǒ shì xuéshēng.', { 'wǒ': 'I', 'shì': 'am', 'xuéshēng': 'student' }, 'word')),
  [{ text: 'Wǒ', meaning: 'I' }, { text: 'shì', meaning: 'am' }, { text: 'xuéshēng.', meaning: 'student' }]));
test('gloss syllables: longest match', () => assert.deepEqual(
  plain(Core.glossTokens('Tôi là học sinh.', { 'tôi': 'I', 'là': 'am', 'học': 'study', 'sinh': 'born', 'học sinh': 'student' }, 'syllables')),
  [{ text: 'Tôi', meaning: 'I' }, { text: 'là', meaning: 'am' }, { text: 'học sinh.', meaning: 'student' }]));
test('gloss syllables: never spans trailing punctuation', () => assert.deepEqual(
  plain(Core.glossTokens('Dạ, học.', { 'dạ học': 'X', 'dạ': 'yes (polite)', 'học': 'study' }, 'syllables')),
  [{ text: 'Dạ,', meaning: 'yes (polite)' }, { text: 'học.', meaning: 'study' }]));
test('gloss syllables: never spans an opening quote', () => assert.deepEqual(
  plain(Core.glossTokens('Mẹ "học', { 'mẹ học': 'X', 'mẹ': 'mom', 'học': 'study' }, 'syllables')),
  [{ text: 'Mẹ', meaning: 'mom' }, { text: '"học', meaning: 'study' }]));
test('gloss syllables: NFD text and NFD keys match', () => {
  const nfd = 'Học sinh'.normalize('NFD');
  assert.deepEqual(plain(Core.glossTokens(nfd, { 'học sinh': 'student' }, 'syllables')), [{ text: nfd, meaning: 'student' }]);
  assert.deepEqual(plain(Core.glossTokens('học sinh', { ['học sinh'.normalize('NFD')]: 'student' }, 'syllables')), [{ text: 'học sinh', meaning: 'student' }]);
});
test('gloss syllables: unmatched syllables stay separate', () => assert.deepEqual(
  plain(Core.glossTokens('Sài Gòn', {}, 'syllables')), [{ text: 'Sài', meaning: '' }, { text: 'Gòn', meaning: '' }]));

test('precacheList', () => assert.deepEqual(
  plain(Core.precacheList({ zh: { files: ['langs/zh/a.js'] }, vi: { files: ['langs/vi/b.js'], audio: ['audio/vi/tones/ngang.mp3'] } }, ['./', 'index.html'])),
  { required: ['./', 'index.html', 'langs/zh/a.js', 'langs/vi/b.js'], optional: ['audio/vi/tones/ngang.mp3'] }));
test('heroStats', () => {
  assert.deepEqual(plain(Core.heroStats([{ level: 'A1', chapters: [1, 2] }, { level: 'B1+', chapters: [1] }])), { stories: 3, levels: 2, range: 'A1–B1+' });
  assert.deepEqual(plain(Core.heroStats([])), { stories: 0, levels: 0, range: '' });
});
test('fill', () => assert.equal(Core.fill('{stories} stories {x}', { stories: 30 }), '30 stories {x}'));
