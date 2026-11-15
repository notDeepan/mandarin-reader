# Multi-language Reader Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Mandarin Reader into a multi-language graded reader ("Story Reader") with a pluggable language-pack system. Keep Mandarin unchanged, and add a full Vietnamese pack (5 books, a novel, 30 grammar patterns, a glossary) plus a small Vietnamese tones section with ElevenLabs free-plan audio.

**Architecture:** Plain HTML/CSS/JS, no build step. `index.html` becomes a markup shell. Styles move to `css/app.css` and logic to `js/app.js`. Pure, DOM-free logic goes in `js/core.js` (unit-tested in Node via `vm`). `js/packs.js` registers each language's metadata and data files. On boot the app picks one language and injects only that pack's data scripts, which write the same globals as today (`window.BOOKS`, `GRAMMAR`, `NOVELS`, `GLOSSARY`, plus `TONES` for Vietnamese). Switching language saves the choice and reloads the page.

**Tech Stack:** Vanilla JS (ES2017, browser), CSS, Service Worker. Node 24 (present) for tests and dev scripts only, using `node:test`, `node:assert`, `node:vm` and `fetch`, with zero npm dependencies. Dev server: `npx serve` on port 3456 (`.claude/launch.json` config `mandarin-reader`).

**Spec:** `docs/superpowers/specs/2026-11-15-multi-language-design.md`

## Global Constraints

- All work happens on branch `feature/multi-language`. **Never push, and never merge to `master`.** `master` auto-deploys to `https://notdeepan.github.io/mandarin-reader/`. Merging needs the owner's go-ahead after Task 18.
- No build step and no runtime dependencies. `package.json` holds scripts only. No `"type": "module"`; Node files use `.mjs`.
- Every path in `js/packs.js`, `sw.js`, `manifest.json` and `index.html` is **relative** (no leading `/`).
- Mandarin must look and behave exactly as on `master`. **The only allowed visible difference is the brand:** `APP_NAME` is "Story Reader" and the brand mark is "SR".
- ElevenLabs is **free plan only**. The key comes only from the env var `ELEVENLABS_API_KEY`. It is never written to a file, printed, or committed.
- Audio file names are ASCII: `ngang.mp3 huyen.mp3 sac.mp3 hoi.mp3 nga.mp3 nang.mp3` in `audio/vi/tones/`.
- Vietnamese text is NFC, with full tone marks and the **old-style mark placement used consistently**: `hòa`, `khỏe`, `thủy` (never `hoà`, `khoẻ`, `thuỷ`). Southern (Saigon) everyday words.
- Existing static English UI text in the markup stays where it is. `js/strings.js` holds only the brand and **new** UI strings. Extracting the rest waits until a second interface language actually exists.
- localStorage keys: `reader-lang`, `reader-dark`. The legacy key is `mandarin-reader-dark`.

## Review Focus

1. **A Vietnamese phrase next to punctuation or an opening quote** (`Dạ, học.` / `Mẹ "học`). Gloss must never join syllables across a punctuation break. Tested in Task 2.
2. **Vietnamese in decomposed Unicode (NFD) or capitalised at sentence start** (`Học sinh`). Gloss must still match glossary keys. Tested in Task 2.
3. **The URL has `?lang=xx` and the learner switches language from the navbar.** The new choice must stick, and `?lang` must not override it on reload. Tested via `Core.stripLangParam` in Task 2; browser-checked in Task 4.
4. **Tone clips not generated yet, or one missing.** No broken play button, the credit is hidden, the service-worker install still succeeds, and a missing `.mp3` is never answered with `index.html`. Covered by Task 5 (navigation-only fallback, optional precache) and Task 7 (content-type check, browser check with no clips).
5. **A pack file fails to load** (404, or offline on first visit). Show a friendly error with Retry and "Choose another language", never a blank page. Browser-checked in Task 4.

---

## File Map

| File | Responsibility |
|---|---|
| `index.html` | Markup shell: navbar (brand, lang switch, nav links), chooser, load error, landing sections, reader, grammar, vocab panel; script tags |
| `css/app.css` | All styles (moved verbatim), plus new: chooser, lang switch, load error, tones, `.cover-word` |
| `js/strings.js` | `self.STRINGS`: brand and new UI text |
| `js/packs.js` | `self.PACKS`: per-language metadata, copy, file lists |
| `js/core.js` | `self.Core`: pure functions (language choice, storage migration, URL, gloss tokens, precache list, hero stats, template fill) |
| `js/app.js` | DOM app: boot/loader, state, rendering, actions (moved from index.html) |
| `js/tones.js` | `self.Tones`: tones section render, curve maths, audio availability and playback |
| `langs/zh/*.js` | Mandarin data (moved from `data/`) |
| `langs/vi/*.js` | Vietnamese data: `book1-5.js`, `novel1.js`, `grammar.js`, `glossary.js`, `tones.js` |
| `audio/vi/tones/` | Tone clips and `SOURCE.md`; `_samples/` is git-ignored |
| `sw.js`, `manifest.json` | Offline cache built from PACKS; generic relative manifest |
| `scripts/lib/load-scripts.mjs` | Load browser scripts into a `vm` context (shared by tests and scripts) |
| `scripts/check-data.mjs` | Data validator and gloss coverage report |
| `scripts/gen-tone-audio.mjs` | ElevenLabs free-plan clip generator |
| `tests/*.test.mjs` | `core`, `data`, `tones`, `gen-audio` tests |
| `package.json` | `test`, `check`, `audio` scripts |

---

### Task 1: Branch, baseline, and split `index.html` (no behaviour change)

**Files:**
- Create: `css/app.css`, `js/app.js`
- Modify: `index.html` (remove `<style>` lines 29-1438 and the inline `<script>` lines 1677-2070)

**Interfaces:**
- Produces: `css/app.css` (exact former `<style>` contents) and `js/app.js` (exact former inline script). Later tasks edit these.

- [ ] **Step 1: Create the branch and commit the docs**

```bash
git switch -c feature/multi-language
git add docs/superpowers/specs/2026-11-15-multi-language-design.md docs/superpowers/plans/2026-11-15-multi-language.md
git commit -m "docs: multi-language design and implementation plan"
```

- [ ] **Step 2: Capture the Mandarin baseline in the browser**

Start preview `mandarin-reader`. Clear old service workers first, because an earlier `sw.js` may still control localhost:3456. Run this with `javascript_tool`, then reload:
`navigator.serviceWorker.getRegistrations().then(r=>r.forEach(x=>x.unregister())); caches.keys().then(k=>k.forEach(c=>caches.delete(c)))`
Then screenshot these as reference:
- landing hero, and the landing at 375px width
- Book 1 Ch 1 in each of the modes Both, Pinyin, English and Reveal (with one sentence revealed)
- the vocab panel open
- Book 4 Ch 1 (no gloss)
- grammar A1
- novel Ch 1
- dark mode on the landing and the reader
- font size A+

Keep these screenshots to compare against in Tasks 1, 3, 4, 5 and 18.

- [ ] **Step 3: Move the CSS and JS**

Cut the `<style>` contents into `css/app.css` and the inline `<script>` contents into `js/app.js` (dedenting is fine). In `index.html`, put `<link rel="stylesheet" href="css/app.css">` where `<style>` was and `<script src="js/app.js"></script>` where the inline script was, after the data scripts.

- [ ] **Step 4: Verify the move is lossless**

Run:
```bash
node -e "const fs=require('fs');const old=require('child_process').execSync('git show master:index.html').toString();const n=s=>s.split('\n').map(l=>l.trim()).filter(Boolean).join('\n');const css=old.split('<style>')[1].split('</style>')[0];const js=old.split('<script>\n')[1].split('</script>')[0];console.log('css',n(css)===n(fs.readFileSync('css/app.css','utf8')),'js',n(js)===n(fs.readFileSync('js/app.js','utf8')))"
```
Expected: `css true js true`

- [ ] **Step 5: Browser check.** Reload the preview. The landing, Book 1 Ch 1 (Both mode) and grammar A1 must match the baseline, and `read_console_messages` must show no errors.

- [ ] **Step 6: Commit**

```bash
git add index.html css/app.css js/app.js
git commit -m "refactor: move inline CSS and JS out of index.html"
```

---

### Task 2: Test harness and `js/core.js` pure functions

**Files:**
- Create: `package.json`, `scripts/lib/load-scripts.mjs`, `js/core.js`, `tests/core.test.mjs`

**Interfaces:**
- Produces:
  - `loadBrowserScripts(paths: string[]) -> object`, exported from `scripts/lib/load-scripts.mjs`. Paths are relative to the repo root. It runs each file in one shared `vm` context where `self`, `window` and `globalThis` are the context, and returns that context. A missing file throws `Error("<path>: file not found")`.
  - `self.Core` in `js/core.js`. DOM-free, so it loads in the page, the service worker and Node:
    - `Core.pickLang({ query, stored, hadLegacy, packs }) -> string|null`: a valid `query` wins, else a valid `stored`, else `'zh'` if `hadLegacy`, else `null` (meaning "show the chooser"). "Valid" means it's a key of `packs`.
    - `Core.migrateStorage(storage) -> { hadLegacy: boolean }`. `storage` has `getItem`/`setItem`/`removeItem`. If `mandarin-reader-dark` exists, copy it to `reader-dark` (only if `reader-dark` is absent), then remove the old key.
    - `Core.stripLangParam(href: string) -> string`: removes the `lang` query param and keeps the other params and the hash. Drops a now-empty `?`.
    - `Core.glossTokens(line: string, glossary: object, mode: 'word'|'syllables') -> Array<{ text: string, meaning: string }>`
    - `Core.precacheList(packs, coreFiles: string[]) -> { required: string[], optional: string[] }`: `required` is `coreFiles` then every pack's `files`, in pack order. `optional` is every pack's `audio` (if any).
    - `Core.heroStats(books) -> { stories: number, levels: number, range: string }`: `range` is `first.level + '–' + last.level` (en dash), or `''` when empty. `levels` counts distinct book levels.
    - `Core.fill(template: string, vars: object) -> string`: replaces `{key}` with `vars[key]` and leaves unknown keys as they are.

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "story-reader",
  "private": true,
  "scripts": {
    "test": "node --test \"tests/*.test.mjs\"",
    "check": "node scripts/check-data.mjs",
    "audio": "node scripts/gen-tone-audio.mjs"
  }
}
```

- [ ] **Step 2: Write the failing tests in `tests/core.test.mjs`**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadBrowserScripts } from '../scripts/lib/load-scripts.mjs';
const { Core } = loadBrowserScripts(['js/core.js']);
const P = { zh: {}, vi: {} };
const fakeStorage = init => { const m = new Map(Object.entries(init)); return {
  getItem: k => m.has(k) ? m.get(k) : null, setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k), dump: () => Object.fromEntries(m) }; };

test('pickLang: valid query wins', () => assert.equal(Core.pickLang({ query: 'vi', stored: 'zh', hadLegacy: false, packs: P }), 'vi'));
test('pickLang: unknown query falls back to stored', () => assert.equal(Core.pickLang({ query: 'xx', stored: 'zh', hadLegacy: false, packs: P }), 'zh'));
test('pickLang: unknown stored + legacy user -> zh', () => assert.equal(Core.pickLang({ query: null, stored: 'fr', hadLegacy: true, packs: P }), 'zh'));
test('pickLang: nothing -> null', () => assert.equal(Core.pickLang({ query: null, stored: null, hadLegacy: false, packs: P }), null));

test('migrateStorage moves dark flag', () => { const s = fakeStorage({ 'mandarin-reader-dark': 'true' });
  assert.deepEqual(Core.migrateStorage(s), { hadLegacy: true }); assert.deepEqual(s.dump(), { 'reader-dark': 'true' }); });
test('migrateStorage keeps existing reader-dark', () => { const s = fakeStorage({ 'mandarin-reader-dark': 'true', 'reader-dark': 'false' });
  Core.migrateStorage(s); assert.deepEqual(s.dump(), { 'reader-dark': 'false' }); });
test('migrateStorage without legacy', () => assert.deepEqual(Core.migrateStorage(fakeStorage({})), { hadLegacy: false }));

test('stripLangParam keeps other params and hash', () => assert.equal(Core.stripLangParam('https://x.io/app/?lang=vi&sw=1#books'), 'https://x.io/app/?sw=1#books'));
test('stripLangParam drops empty query', () => assert.equal(Core.stripLangParam('https://x.io/app/?lang=vi'), 'https://x.io/app/'));

test('gloss word mode (Mandarin behaviour)', () => assert.deepEqual(
  Core.glossTokens('Wǒ shì xuéshēng.', { 'wǒ': 'I', 'shì': 'am', 'xuéshēng': 'student' }, 'word'),
  [{ text: 'Wǒ', meaning: 'I' }, { text: 'shì', meaning: 'am' }, { text: 'xuéshēng.', meaning: 'student' }]));
test('gloss syllables: longest match', () => assert.deepEqual(
  Core.glossTokens('Tôi là học sinh.', { 'tôi': 'I', 'là': 'am', 'học': 'study', 'sinh': 'born', 'học sinh': 'student' }, 'syllables'),
  [{ text: 'Tôi', meaning: 'I' }, { text: 'là', meaning: 'am' }, { text: 'học sinh.', meaning: 'student' }]));
test('gloss syllables: never spans trailing punctuation', () => assert.deepEqual(
  Core.glossTokens('Dạ, học.', { 'dạ học': 'X', 'dạ': 'yes (polite)', 'học': 'study' }, 'syllables'),
  [{ text: 'Dạ,', meaning: 'yes (polite)' }, { text: 'học.', meaning: 'study' }]));
test('gloss syllables: never spans an opening quote', () => assert.deepEqual(
  Core.glossTokens('Mẹ "học', { 'mẹ học': 'X', 'mẹ': 'mom', 'học': 'study' }, 'syllables'),
  [{ text: 'Mẹ', meaning: 'mom' }, { text: '"học', meaning: 'study' }]));
test('gloss syllables: NFD text and NFD keys match', () => {
  const nfd = 'Học sinh'.normalize('NFD');
  assert.deepEqual(Core.glossTokens(nfd, { 'học sinh': 'student' }, 'syllables'), [{ text: nfd, meaning: 'student' }]);
  assert.deepEqual(Core.glossTokens('học sinh', { ['học sinh'.normalize('NFD')]: 'student' }, 'syllables'), [{ text: 'học sinh', meaning: 'student' }]);
});
test('gloss syllables: unmatched syllables stay separate', () => assert.deepEqual(
  Core.glossTokens('Sài Gòn', {}, 'syllables'), [{ text: 'Sài', meaning: '' }, { text: 'Gòn', meaning: '' }]));

test('precacheList', () => assert.deepEqual(
  Core.precacheList({ zh: { files: ['langs/zh/a.js'] }, vi: { files: ['langs/vi/b.js'], audio: ['audio/vi/tones/ngang.mp3'] } }, ['./', 'index.html']),
  { required: ['./', 'index.html', 'langs/zh/a.js', 'langs/vi/b.js'], optional: ['audio/vi/tones/ngang.mp3'] }));
test('heroStats', () => {
  assert.deepEqual(Core.heroStats([{ level: 'A1', chapters: [1, 2] }, { level: 'B1+', chapters: [1] }]), { stories: 3, levels: 2, range: 'A1–B1+' });
  assert.deepEqual(Core.heroStats([]), { stories: 0, levels: 0, range: '' });
});
test('fill', () => assert.equal(Core.fill('{stories} stories {x}', { stories: 30 }), '30 stories {x}'));
```

- [ ] **Step 3: Run `npm test`.** Expected: FAIL, with `js/core.js: file not found`.

- [ ] **Step 4: Implement `scripts/lib/load-scripts.mjs` and `js/core.js`**

`js/core.js` is wrapped as `(function (root) { … root.Core = { … }; })(self);` with no DOM access.

`glossTokens` behaviour:
- **`word` mode** reproduces the current `glossSentence` lookup exactly (`js/app.js`, formerly `index.html:1830-1838`): the same split, the same trailing and leading punctuation regexes, the same exact-then-lowercase-then-stripped lookup. It does **no** Unicode normalisation.
- **`syllables` mode:**

```
tokens = line.split(/\s+/).filter(Boolean)
for each token: lead = leading quote/bracket chars, trail = trailing punctuation (same char classes as word mode),
                key = core.normalize('NFC').toLowerCase()
normGlossary = glossary keys normalised NFC + lowercase (cache per glossary object in a WeakMap)
i = 0; while i < tokens.length:
  for n = min(4, remaining) down to 1:
    reject n if any token i..i+n-2 has a non-empty trail, or any token i+1..i+n-1 has a non-empty lead
    phrase = keys[i..i+n-1].join(' ')
    if n == 1 or normGlossary has phrase: emit { text: tokens[i..i+n-1].join(' '), meaning: normGlossary[phrase] || '' }; i += n; break
```

- [ ] **Step 5: Run `npm test`.** Expected: all tests PASS.

- [ ] **Step 6: Commit**

```bash
git add package.json scripts/lib/load-scripts.mjs js/core.js tests/core.test.mjs
git commit -m "feat: add pure core helpers with node tests"
```

---

### Task 3: Pack registry, move Mandarin data, loader, generic names

**Files:**
- Create: `js/packs.js`, `js/strings.js`, `scripts/check-data.mjs`, `tests/data.test.mjs`
- Move: `data/` → `langs/zh/` (`git mv`)
- Modify: `langs/zh/grammar.js` (`nameZh` → `nameTarget`), `langs/zh/novel1.js` (`titleZh` → `titleTarget`), `index.html`, `css/app.css`, `js/app.js`

**Interfaces:**
- Consumes: `Core.glossTokens`, `loadBrowserScripts` (Task 2).
- Produces:
  - `self.PACKS.zh` with the keys `code, name, nativeName, icon, levels, blurb, targetLabel, vocabLabel, glossMode:'word', glossLevels:['A1','A2','A2+'], files, copy` (`copy` is filled in Task 4).
  - `self.STRINGS = { APP_NAME: 'Story Reader', BRAND_MARK: 'SR' }` (more keys come in Task 4).
  - In `js/app.js`: `loadScripts(files: string[]) -> Promise<void>` (injects `<script>` with `async = false` in order, resolves when all have loaded, rejects on the first `onerror`), and `async boot()`.
  - Mode keys become `['both','target','english','reveal']`, with labels from `pack.targetLabel`.
  - `checkPack(code) -> { errors: string[], warnings: string[], coverage: Array<{ where: string, ratio: number, missing: string[] }>, vocabCount: number }`, exported from `scripts/check-data.mjs`. Run as a CLI (`node scripts/check-data.mjs vi`), it prints errors, warnings, per-chapter coverage with missing words, and the count of unique vocab entries.

- [ ] **Step 1: Write the failing data test in `tests/data.test.mjs`**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkPack } from '../scripts/check-data.mjs';
test('zh data is valid', () => assert.deepEqual(checkPack('zh').errors, []));
```

- [ ] **Step 2: Run `npm test`.** Expected: FAIL (cannot find `scripts/check-data.mjs`).

- [ ] **Step 3: Move the data and rename the fields**

```bash
mkdir -p langs && git mv data langs/zh
```
Then rename `nameZh` → `nameTarget` everywhere in `langs/zh/grammar.js`, and `titleZh` → `titleTarget` in `langs/zh/novel1.js`.

- [ ] **Step 4: Write `js/packs.js` (zh only) and `js/strings.js`**

`PACKS.zh.files` lists these in order: `langs/zh/book1.js` … `book5.js`, `novel1.js`, `grammar.js`, `glossary.js`. The other values: `name:'Mandarin', nativeName:'中文', icon:'中', levels:'A1 – B1+', blurb:'Graded stories in pinyin, plus a novel and grammar.', targetLabel:'Pinyin', vocabLabel:'Pinyin'`.

- [ ] **Step 5: Implement `scripts/check-data.mjs`**

It loads `js/packs.js`, then that pack's `files`, via `loadBrowserScripts`. Collect a missing file as the error `<file>: file not found` rather than throwing.

Errors to report:
- **Book:** `title`, `level` ∈ {A1, A2, A2+, B1, B1+}, and a non-empty `chapters`.
- **Chapter** (books and novels): `title`, `subtitle`, `readTime`, `wordCount`, and a non-empty `paragraphs` where every sentence is a pair of non-empty strings. `vocab` is pairs of non-empty strings.
- **Grammar level:** `level`, `title`, `subtitle`, `icon`, `description`, and non-empty `patterns`. Each pattern has `name`, `nameTarget`, `formula` as `[label, color]` pairs, `tip`, and `examples[].parts` as `[string, string, int]` where the int is `-1` or a valid `formula` index.
- **Novel:** `id`, `title`, `titleTarget`, `icon`, `description`, and chapters as above.
- **Tones** (only if `window.TONES` exists): exactly 6 entries, each with `id, name, mark, markLabel, example, meaning, describe, audio`. `levels` is an array of at least 2 integers between 1 and 5. `audio` matches `^audio/vi/tones/[a-z]+\.mp3$` and appears in `pack.audio`.

Coverage:
- Computed for each chapter that shows a gloss: books whose level is in `pack.glossLevels`, plus all novel chapters.
- Uses `Core.glossTokens` with `pack.glossMode`.
- `ratio` = syllables (tokens) inside matched units ÷ all tokens, **excluding tokens that contain a digit**.
- `where` = `"<book title> ch<N>"`.

Warnings (vi only): flag a chapter whose token count is more than 25% off the target for its level: A1 130, A2 265, A2+ 390, B1 950, B1+ 1300, novel 950.

- [ ] **Step 6: Run `npm test`.** Expected: PASS.

- [ ] **Step 7: Make the app load packs**

In `index.html`:
- Replace the eight `data/*.js` script tags with `js/strings.js`, `js/packs.js`, `js/core.js`, `js/app.js`.
- The brand reads `STRINGS.BRAND_MARK` and `STRINGS.APP_NAME`. Set them from `boot()`, and keep a static fallback of "SR" and "Story Reader" in the markup.

In `js/app.js`:
- Change `const BOOKS/NOVELS/GRAMMAR` to `let`, assigned after loading.
- `boot()`, for now: `state.pack = PACKS.zh`, then `await loadScripts(state.pack.files)`, then read the globals, then run the existing init (dark mode, `renderHome()`, SW registration).
- `glossSentence(line, level)`:
  - checks `state.pack.glossLevels` instead of the hard-coded list;
  - builds its spans from `Core.glossTokens(line, window.GLOSSARY, state.pack.glossMode)`;
  - keeps the same markup and the same empty-meaning fallback literal as the current code;
  - novels stay glossed on every chapter.
- `renderNovelSection` uses `novel.titleTarget`, and `renderGrammar` uses `pat.nameTarget`.

Rename in `css/app.css` and `js/app.js`:
- `.pinyin-line`→`.target-line`, `.gw-pinyin`→`.gw-target`, `.vocab-pinyin`→`.vocab-target`, `.part-pinyin`→`.part-target`
- `--pinyin`→`--target`, `--font-pinyin`→`--font-target`
- `mode-pinyin`→`mode-target`, mode key `pinyin`→`target`

- [ ] **Step 8: Verify the renames**

`grep -n "pinyin" css/app.css js/app.js index.html` → no matches.

- [ ] **Step 9: Browser check against the baseline**

Check every Mandarin view from Task 1 Step 2. Everything must match, except that the navbar and footer brand now read "Story Reader" / "SR". The mode button still reads "Pinyin", the gloss words are unchanged in Book 1 Ch 1, and there are no console errors.

- [ ] **Step 10: Commit**

```bash
git add -A langs js css index.html scripts tests
git commit -m "feat: load Mandarin as a language pack"
```

---

### Task 4: Per-pack copy, language chooser, navbar switch, load error, Vietnamese skeleton

**Files:**
- Create: `langs/vi/glossary.js` (`window.GLOSSARY = {};`)
- Modify: `js/packs.js`, `js/strings.js`, `js/app.js`, `index.html`, `css/app.css`

**Interfaces:**
- Consumes: `Core.pickLang`, `Core.migrateStorage`, `Core.stripLangParam`, `Core.heroStats`, `Core.fill`, `loadScripts`.
- Produces:
  - `PACKS.vi`. Copy and other content are below. `files` starts as `['langs/vi/glossary.js']`, and later tasks insert files **before** `glossary.js` in this order: `book1-5`, `novel1`, `grammar`, then `glossary`, then `tones`.
  - `PACKS.<code>.copy` keys: `metaTitle, metaDescription, ogTitle, ogDescription, keywords, heroBg, heroTitle, heroDesc, modesFeature, booksDesc, grammarDesc, novelsDesc, howRead, footerDesc, vocabStat`.
  - In `js/app.js`: `switchLang(code)` sets `localStorage['reader-lang']` and then calls `location.replace(Core.stripLangParam(location.href))`. Also `setSectionVisible(id, visible)` hides or shows section `#id` together with its navbar button `[data-nav="id"]`.

- [ ] **Step 1: Fill `PACKS.zh.copy` verbatim from the current markup and meta tags**
  - `heroBg` 读书学习; `heroTitle` and `heroDesc` from lines 1468 and 1471. In `heroDesc`, replace "30" with `{stories}`.
  - `modesFeature` line 1518, `booksDesc` 1548, `grammarDesc` 1558, `novelsDesc` 1568, `howRead` 1589, `footerDesc` 1607.
  - `metaDescription` / `keywords` / `ogDescription` from lines 7, 8, 13.
  - `metaTitle`: `Learn Mandarin Through Graded Stories`; `ogTitle`: `Learn Mandarin Through Stories`; `vocabStat`: `1000+`.

- [ ] **Step 2: Add `PACKS.vi`**

```js
vi: { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', icon: 'Việt',
  levels: 'A1 – B1+', blurb: 'Saigon stories, a novel, the six tones, and grammar.', beta: true,
  targetLabel: 'Tiếng Việt', vocabLabel: 'Tiếng Việt', glossMode: 'syllables', glossLevels: ['A1', 'A2', 'A2+'],
  speechLang: 'vi-VN', files: ['langs/vi/glossary.js'],
  copy: {
    metaTitle: 'Learn Vietnamese Through Graded Stories', ogTitle: 'Learn Vietnamese Through Stories',
    metaDescription: 'Learn Southern (Saigon) Vietnamese from A1 to B1+ through graded stories, a novel, grammar patterns and the six tones.',
    ogDescription: 'Graded Vietnamese stories set in Saigon, from first greetings to mysteries and dramas — with English under every line.',
    keywords: 'Vietnamese, learn Vietnamese, Saigon, Southern Vietnamese, tones, graded reader, stories, language learning',
    heroBg: 'Đọc truyện',
    heroTitle: 'Learn Vietnamese<br>Through <span class="highlight">Stories</span>',
    heroDesc: 'Learn Vietnamese the way Saigon speaks it, through {stories} graded stories — from your first chào to full mysteries and dramas.',
    modesFeature: 'Read with both Vietnamese and English, Vietnamese-only for challenge, English-only for review, or reveal mode to test yourself.',
    booksDesc: 'Five books, thirty stories set in Saigon. Start wherever you are.',
    grammarDesc: 'Learn how Vietnamese sentences are built — from basic word order to the particles that make speech sound natural.',
    novelsDesc: 'Immerse yourself in complete stories retold in graded Vietnamese — every chapter with word-by-word meanings.',
    howRead: 'Each sentence shows Vietnamese with an English translation. Hover to highlight, click to reveal in test mode.',
    footerDesc: 'An open-source project for learning Vietnamese through the joy of reading.',
    vocabStat: '0' } }
```

- [ ] **Step 3: Add strings to `js/strings.js`**

`CHOOSER_TITLE: 'What do you want to learn?'`, `CHOOSER_SUB: 'You can switch any time from the top bar.'`, `CHOOSER_META_TITLE: 'Learn Languages Through Graded Stories'`, `BETA: 'Beta'`, `LOAD_ERROR: 'Couldn’t load {name}. Check your connection and try again.'`, `RETRY: 'Try again'`, `CHOOSE_OTHER: 'Choose another language'`, `TONES_NAV: 'Tones'`.

- [ ] **Step 4: Add markup and CSS**
  - Add `data-copy="<key>"` to each element whose text came from `copy`.
  - Add `data-nav="<sectionId>"` to every navbar section button.
  - Give the hero stat numbers the ids `statStories`, `statLevels`, `statRange`, `statVocab`.
  - Add `#langSwitch` (a button showing `nativeName ▾` plus the beta badge, and a menu listing the other packs) inside `.navbar` **outside** `.nav-links`, so it stays visible below 900px, where `.nav-link` is hidden.
  - Add `#langChooser` (a full-screen card grid) and `#loadError` (message plus two buttons), both `hidden` by default.
  - Style them within the existing visual language (cards, radius, accent colour, dark mode variables). The menu closes on outside click and on Escape.

- [ ] **Step 5: Rewrite `boot()`**
  1. Run `Core.migrateStorage(localStorage)`, then apply `reader-dark`. Replace both uses of `mandarin-reader-dark` with `reader-dark`.
  2. Get `code` from `Core.pickLang` (`query` = URL `lang` param, `stored` = `localStorage['reader-lang']`).
  3. If `code` is null: set the document title to `APP_NAME — CHOOSER_META_TITLE`, show the chooser, and stop. Clicking a card calls `switchLang(code)`.
  4. Otherwise save `reader-lang`, `await loadScripts`, and on rejection show `#loadError`. Retry runs `location.reload()`. Choose-other removes `reader-lang` and calls `location.replace(Core.stripLangParam(location.href))`.
  5. Apply the copy: `innerHTML` of each `[data-copy]` element; `document.title = APP_NAME + ' — ' + copy.metaTitle`; meta description, keywords, `og:title` (`APP_NAME — ogTitle`) and `og:description`.
  6. Fill the hero stats from `Core.heroStats(BOOKS)`, `copy.vocabStat`, and `Core.fill(copy.heroDesc, stats)`.
  7. Run `renderHome()`. Call `setSectionVisible` for `grammar` (`GRAMMAR.length > 0`) and `novels` (`NOVELS.length > 0`).

- [ ] **Step 6: Fix the footer link** to `https://github.com/notDeepan/mandarin-reader`, and render the footer copyright with `APP_NAME`.

- [ ] **Step 7: Run `npm test`.** Expected: PASS.

- [ ] **Step 8: Browser checks**
  - Clear storage, then load `/`: the chooser shows, with two cards and a Beta badge on Vietnamese.
  - Pick Mandarin: it matches the baseline apart from the brand. The hero still shows 30 / 5 / A1–B1+ / 1000+.
  - Use the switch to go to Vietnamese: the Vietnamese hero copy shows, the books grid is empty, and the grammar and novels sections and nav links are hidden.
  - Load `/?lang=zh`, then switch to Vietnamese from the navbar, then reload: it stays Vietnamese and the URL has no `lang` (Review Focus 3).
  - Set `localStorage['mandarin-reader-dark']='true'` with no `reader-lang`, then reload: you get Mandarin, dark, and no chooser.
  - Load-error check (Review Focus 5): temporarily add `'langs/vi/missing.js'` as the first entry of `PACKS.vi.files` in `js/packs.js`, then load `?lang=vi`. `#loadError` must show the Vietnamese name. "Choose another language" must reach the chooser, and Retry must reload. Revert the edit and confirm `git diff js/packs.js` is empty.
  - At 375px width, the language switch is visible and usable.

- [ ] **Step 9: Commit**

```bash
git add -A js css index.html langs/vi
git commit -m "feat: language chooser, navbar switch and per-pack copy"
```

---

### Task 5: Service worker and manifest

**Files:**
- Modify: `sw.js` (rewrite), `manifest.json`, `js/app.js` (registration)

**Interfaces:**
- Consumes: `self.PACKS`, `Core.precacheList` (via `importScripts('js/packs.js', 'js/core.js')`).
- Produces: `CORE_FILES` in `sw.js`. Task 7 appends `'js/tones.js'`.

- [ ] **Step 1: Rewrite `sw.js`**
  - `CACHE_NAME = 'reader-v6'`
  - `CORE_FILES = ['./', 'index.html', 'manifest.json', 'css/app.css', 'js/strings.js', 'js/packs.js', 'js/core.js', 'js/app.js']`
  - **install:** `cache.addAll(required)`, then each optional file with `cache.add(u).catch(() => {})`, then `skipWaiting()`.
  - **activate:** delete every cache whose key isn't `CACHE_NAME`, then `clients.claim()`.
  - **fetch:** GET only. Cache-first, falling back to the network and storing ok responses. On network failure, return `caches.match('index.html')` **only when `request.mode === 'navigate'`**, otherwise `Response.error()` (Review Focus 4).

- [ ] **Step 2: Update `manifest.json`**
  - `name` and `short_name`: `Story Reader`
  - `description`: `Learn languages through graded stories — Mandarin and Vietnamese, A1 to B1+`
  - `start_url` and `scope`: `./`
  - Icon SVG text: `SR`
  - Keep the colours.

- [ ] **Step 3: Change registration in `js/app.js`**

On `localhost` / `127.0.0.1` without a `sw` URL param, **unregister** all service workers and skip registration, so dev edits are never served stale. Otherwise register `sw.js`.

- [ ] **Step 4: Offline browser check**
  - Load `http://localhost:3456/?sw=1&lang=zh` and wait until `navigator.serviceWorker.controller` is set.
  - Confirm with `caches.keys()` / `caches.open('reader-v6').then(c => c.keys())` that the core files and both packs' files are cached.
  - `preview_stop` the server, then reload: Mandarin still works. Navigate to `?sw=1&lang=vi`: Vietnamese still works.
  - Restart the preview, then load `/` without `sw`: the worker gets unregistered.

- [ ] **Step 5: Commit**

```bash
git add sw.js manifest.json js/app.js
git commit -m "fix: relative-path service worker precaching every pack"
```

---

## Vietnamese Content: shared rules (apply to Tasks 6, 10-17)

**Data shape**: identical to the Mandarin files. Book file:

```js
window.BOOKS = window.BOOKS || [];
window.BOOKS.push({
  title: "First Steps", level: "A1", icon: "Bạn",
  description: "Your first Vietnamese in Saigon: greetings, family and everyday life.",
  chapters: [{
    title: "Người Bạn Mới", subtitle: "My New Friend", readTime: "5 min", wordCount: "~130 words",
    paragraphs: [[ ["Hôm nay là thứ Hai.", "Today is Monday."] /* … */ ] /* … */],
    vocab: [["hôm nay", "today"], ["chén", "bowl (North: bát)"] /* … */]
  } /* … */]
});
```

**Writing rules:**
- **Language:** natural, everyday Saigon Vietnamese with Southern words: `dạ`, `ba` (dad), `má`, `chén`, `heo`, `muỗng`, `bắp`, `ly`, `bệnh`, `tiệm`. Where the North commonly uses a different word, the vocab English says `(North: …)`.
- **Spelling:** NFC, old-style tone placement (see Global Constraints).
- **Pronouns:** Southern kinship pronouns. `tôi` in narration; `tui` in casual dialogue from A2+, with the vocab note `(Southern casual: I)`.
- **Names and places:** names like Minh, Lan, Tuấn, Hương, Bảo, Thảo, Khang, Vy. Real places: Quận 1, chợ Bến Thành, Chợ Lớn, Thủ Đức, Vũng Tàu, Đà Lạt, Cần Thơ.
- **Length and layout:**
  - `wordCount` = whitespace tokens across all Vietnamese lines, rounded to the nearest 10, written `~N words`.
  - Lengths hit the targets in Task 3 Step 5.
  - `readTime` and paragraph count mirror the Mandarin book of the same level.
- **English lines:** natural English, faithful to the meaning.
- **Vocab:** 20-35 items per chapter, written as they appear in the text, lowercase except names.
- Escape inner double quotes as `\"`, as in the Mandarin files.
- **Glossary entries** (glossed content only: Books 1-3 and the novel):
  - Append to `langs/vi/glossary.js` under a `// Book N` or `// Novel` comment.
  - Keys are lowercase NFC, with multi-syllable keys separated by single spaces (`"học sinh"`).
  - Values are 1-3 word English glosses. Names are glossed as `"(name)"`, and particles get a short gloss (`"nha": "okay? (soft)"`).
  - Don't duplicate a key that already exists.
- **Self-review:** after writing each chapter, re-read every Vietnamese line for tone-mark typos and anything that sounds unnatural.

**Content Task Procedure (CTP), the steps for every content task:**
1. Insert the new file into `PACKS.vi.files` in the order defined in Task 4.
2. Run `npm test`. Expected: FAIL with `langs/vi/<file>: file not found`.
3. Write the content following the rules above.
4. For glossed content, run `node scripts/check-data.mjs vi` and add glossary entries until every new chapter reaches coverage ≥ 0.95.
5. Run `npm test`. Expected: PASS. `node scripts/check-data.mjs vi` shows 0 errors and no length warnings for the new chapters.
6. Browser check at `?lang=vi`:
   - the new item renders in the library;
   - Both, Tiếng Việt, English and Reveal modes work;
   - multi-syllable gloss words render as one unit (glossed content);
   - the vocab panel works;
   - diacritics like `ệ ở ữ ặ` aren't clipped at A⁻, normal and A⁺ sizes.
7. Commit with `git add js/packs.js langs/vi` and the message given in the task.

---

### Task 6: Vietnamese Book 1 (A1), with gloss and icon fit

**Files:**
- Create: `langs/vi/book1.js`
- Modify: `js/packs.js`, `langs/vi/glossary.js`, `tests/data.test.mjs`, `js/app.js`, `css/app.css`

- [ ] **Step 1: Extend `tests/data.test.mjs`**

```js
test('vi data is valid', () => assert.deepEqual(checkPack('vi').errors, []));
test('vi gloss coverage >= 95% on glossed chapters', () =>
  assert.deepEqual(checkPack('vi').coverage.filter(c => c.ratio < 0.95).map(c => c.where), []));
```

- [ ] **Step 2: Fit multi-letter icons.** In `renderHome`, add the class `cover-word` to `.cover-char` when `[...book.icon].length > 1`. Size `.cover-word` in `css/app.css` so a 5-letter word fits the cover at 375px. Mandarin's single characters are unaffected.

- [ ] **Step 3: Run the CTP for Book 1**
  - `title "First Steps"`, `level "A1"`, `icon "Bạn"`
  - 6 chapters of about 130 words each:
    1. meeting a new classmate
    2. my family
    3. prices at chợ Bến Thành
    4. what time is it
    5. food I like (cơm tấm, phở, bánh mì)
    6. a Sunday in Saigon
  - Commit: `feat(vi): add Book 1 (A1)`

---

### Task 7: Tones section

**Files:**
- Create: `langs/vi/tones.js`, `js/tones.js`, `tests/tones.test.mjs`
- Modify: `js/packs.js` (vi `files` += `'langs/vi/tones.js'` last; vi `audio` = the six `audio/vi/tones/*.mp3` paths), `index.html`, `css/app.css`, `js/app.js`, `sw.js` (`CORE_FILES` += `'js/tones.js'`)

**Interfaces:**
- Produces `self.Tones` in `js/tones.js` (it does no DOM work at load time):
  - `Tones.curvePoints(levels: number[], w: number, h: number) -> Array<[number, number]>`: `x = i/(n-1)*w`, `y = h - (level-1)/4*h`.
  - `Tones.availability(tones, speechLang) -> Promise<'clips'|'speech'|'none'>`:
    - `'clips'` if `fetch(tones[0].audio)` is ok **and** its content-type starts with `audio/`;
    - else `'speech'` if a voice whose `lang` starts with `vi` exists (wait for `voiceschanged` up to 1500 ms when `getVoices()` is empty);
    - else `'none'`.
  - `Tones.render(data, speechLang)`: fills `#tonesGrid`, `#tonesNotes` and `#tonesCredit`. Play buttons stay hidden until availability resolves. All buttons are hidden for `'none'`. The credit only shows for `'clips'`.
  - `Tones.play(tone, how, speechLang)`:
    - For `'clips'`: stop any current audio, then play `new Audio(tone.audio)`. On error, fall back to speech.
    - For `'speech'`: `speechSynthesis.cancel()`, then speak `tone.example` with `lang = speechLang` and the first `vi*` voice.
    - The playing card gets the class `playing` until the audio or speech ends.

- [ ] **Step 1: Write the failing test in `tests/tones.test.mjs`**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadBrowserScripts } from '../scripts/lib/load-scripts.mjs';
const { Tones } = loadBrowserScripts(['js/tones.js']);
test('curvePoints level line', () => assert.deepEqual(Tones.curvePoints([3, 3], 100, 40), [[0, 20], [100, 20]]));
test('curvePoints dip-rise', () => assert.deepEqual(Tones.curvePoints([2, 1, 4], 100, 40), [[0, 30], [50, 40], [100, 10]]));
```

- [ ] **Step 2: Run `npm test`.** Expected: FAIL (`js/tones.js: file not found`).

- [ ] **Step 3: Write `langs/vi/tones.js` with exactly this content**

```js
window.TONES = {
  title: 'The Six Tones',
  intro: 'Vietnamese has six tones. The tone mark is part of the spelling, and changing the tone changes the word: ma, mà and má are three different words.',
  tones: [
    { id: 'ngang', name: 'ngang', mark: 'a', markLabel: 'no mark', example: 'ma', meaning: 'ghost', describe: 'Flat, in the middle of your voice.', levels: [3, 3], audio: 'audio/vi/tones/ngang.mp3' },
    { id: 'huyen', name: 'huyền', mark: 'à', markLabel: 'grave accent', example: 'mà', meaning: 'but', describe: 'Starts low and drifts lower.', levels: [2, 1], audio: 'audio/vi/tones/huyen.mp3' },
    { id: 'sac', name: 'sắc', mark: 'á', markLabel: 'acute accent', example: 'má', meaning: 'mom', describe: 'Rises sharply, like a surprised question.', levels: [3, 5], audio: 'audio/vi/tones/sac.mp3' },
    { id: 'hoi', name: 'hỏi', mark: 'ả', markLabel: 'hook above', example: 'mả', meaning: 'grave (tomb)', describe: 'Dips down, then comes back up.', levels: [2, 1, 4], audio: 'audio/vi/tones/hoi.mp3' },
    { id: 'nga', name: 'ngã', mark: 'ã', markLabel: 'tilde', example: 'mã', meaning: 'horse', describe: 'In Saigon it sounds just like hỏi: down, then up.', levels: [2, 1, 4], audio: 'audio/vi/tones/nga.mp3' },
    { id: 'nang', name: 'nặng', mark: 'ạ', markLabel: 'dot below', example: 'mạ', meaning: 'rice seedling', describe: 'Low and heavy: dips a little, then lifts.', levels: [2, 1, 2], audio: 'audio/vi/tones/nang.mp3' }
  ],
  southNote: 'In Saigon, hỏi and ngã sound the same. They are still written differently, so learn both marks.',
  northNote: 'In Hà Nội, ngã rises with a catch in the voice, and nặng is short and cut off.',
  lettersTip: 'â ê ô ơ ư ă đ are separate letters, not tones. One syllable can carry both: ệ is ê with the nặng tone.',
  credit: 'Tone audio generated with ElevenLabs (elevenlabs.io)'
};
```

- [ ] **Step 4: Implement `js/tones.js`, the markup and the CSS**
  - **Markup:** `<section class="tones-section hidden" id="tones">` directly **before** `#books`. It holds the section header (tag `Pronunciation`, title and desc from `TONES.title` / `TONES.intro`), `#tonesGrid`, `#tonesNotes` and `#tonesCredit`. Add a navbar button `data-nav="tones"` labelled `STRINGS.TONES_NAV`, placed before Books.
  - **Each card:** the name, the large mark, `markLabel`, an inline SVG curve (viewBox `0 0 100 40`, a smooth path through `curvePoints(levels, 100, 40)`, faint guide lines), `describe`, `example` with `meaning`, and the play button.
  - **Grid:** 3 columns at ≥900px, 2 columns between 500 and 900px, and a horizontal scroll-snap row at ≤500px.
  - **Notes:** `southNote` as a callout, `northNote` as a smaller line, `lettersTip` as a tip line.
  - **`boot()`:** if `window.TONES` exists, call `Tones.render(TONES, pack.speechLang)`. Call `setSectionVisible('tones', !!window.TONES)`.

- [ ] **Step 5: Run `npm test`.** Expected: PASS, including the tones checks in `check-data`.

- [ ] **Step 6: Browser check with no clips present** (Review Focus 4)
  - The section sits above the books and only appears for Vietnamese.
  - The curves match the shapes.
  - Play buttons use the browser voice when a `vi` voice exists, or are hidden otherwise.
  - The credit is hidden.
  - There are no console errors.
  - Layout works at 375px, 768px, desktop, and in dark mode.
  - Mandarin shows no tones section and no Tones nav button.

- [ ] **Step 7: Commit**

```bash
git add js/tones.js langs/vi/tones.js js/packs.js index.html css/app.css js/app.js sw.js tests/tones.test.mjs
git commit -m "feat(vi): add tones section with speech fallback"
```

---

### Task 8: ElevenLabs free-plan generator script

**Files:**
- Create: `scripts/gen-tone-audio.mjs`, `tests/gen-audio.test.mjs`, `audio/vi/tones/SOURCE.md`
- Modify: `.gitignore` (add `audio/vi/tones/_samples/`)

**Interfaces:**
- Exports from `scripts/gen-tone-audio.mjs` (the CLI runs only when it's the entry file):
  - `planClips(tones) -> Array<{ file: string, text: string }>`: `file = tone.audio`, `text = \`${tone.example}. ${tone.example}.\``.
  - `creditsNeeded(clips) -> number`: the sum of `text.length` (NFC).
  - `checkBudget(sub, needed) -> { ok: boolean, remaining: number, reason?: string }`: `ok` only if `sub.tier === 'free'` and `sub.character_limit - sub.character_count >= Math.ceil(needed * 1.5)`.
- CLI flags:
  - `--list-voices`: free, no credits. Prints Vietnamese-capable voices: name, voice_id, accent/description, plus a public owner id for shared voices.
  - `--samples id1,id2,id3`: generates `"ma, mà, má, mả, mã, mạ."` per voice into `audio/vi/tones/_samples/<id>.mp3`.
  - `--generate`: uses the `VOICE_ID` constant and skips files that already exist.
  - `--dry-run`: prints the plan and the credits needed.
- Every flag that spends credits calls `GET /v1/user/subscription` and `checkBudget` first, and **exits non-zero without generating** when `ok` is false. A missing `ELEVENLABS_API_KEY` exits with `Set ELEVENLABS_API_KEY in your environment first.` The key is never printed.

- [ ] **Step 1: Read the current ElevenLabs API reference** (https://elevenlabs.io/docs/api-reference). Confirm the exact paths and field names for: user subscription (`tier`, `character_count`, `character_limit`), listing account voices, searching shared voices by language, adding a shared voice to the account (if it's needed to use one), and text-to-speech (path, `xi-api-key` header, body `{ text, model_id }`, mp3 `output_format`). Pick `eleven_multilingual_v2`, or a newer model that lists Vietnamese. **If any name differs from this plan, follow the docs and note it in the commit message.**

- [ ] **Step 2: Write the failing tests in `tests/gen-audio.test.mjs`**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { planClips, creditsNeeded, checkBudget } from '../scripts/gen-tone-audio.mjs';
test('planClips', () => assert.deepEqual(planClips([{ example: 'ma', audio: 'audio/vi/tones/ngang.mp3' }]), [{ file: 'audio/vi/tones/ngang.mp3', text: 'ma. ma.' }]));
test('creditsNeeded', () => assert.equal(creditsNeeded([{ text: 'ma. ma.' }, { text: 'mà. mà.' }]), 14));
test('budget ok on free with room', () => assert.deepEqual(checkBudget({ tier: 'free', character_count: 9000, character_limit: 10000 }, 100), { ok: true, remaining: 1000 }));
test('budget refuses paid tier', () => { const r = checkBudget({ tier: 'starter', character_count: 0, character_limit: 30000 }, 10); assert.equal(r.ok, false); assert.match(r.reason, /free/); });
test('budget refuses thin margin', () => assert.equal(checkBudget({ tier: 'free', character_count: 9950, character_limit: 10000 }, 100).ok, false));
```

- [ ] **Step 3: Run `npm test`.** Expected: FAIL (module not found).

- [ ] **Step 4: Implement the script, `SOURCE.md` and the `.gitignore` line**

`SOURCE.md` states:
- the clips were generated on the ElevenLabs free plan (non-commercial use, attribution required);
- the voice ID and the date;
- they **must be replaced with native recordings or properly licensed audio before any store release**.

- [ ] **Step 5: Run `npm test`.** Expected: PASS. Without the key, `node scripts/gen-tone-audio.mjs --dry-run` prints 6 clips and the credit total, and `--generate` exits with the missing-key message.

- [ ] **Step 6: Commit**

```bash
git add scripts/gen-tone-audio.mjs tests/gen-audio.test.mjs audio/vi/tones/SOURCE.md .gitignore
git commit -m "feat(vi): free-plan-only ElevenLabs tone clip generator"
```

---

### Task 9: Generate the tone clips (needs the owner)

**Files:**
- Create: `audio/vi/tones/{ngang,huyen,sac,hoi,nga,nang}.mp3`
- Modify: `scripts/gen-tone-audio.mjs` (`VOICE_ID`), `audio/vi/tones/SOURCE.md`

If the owner isn't available, **skip this task**. Vietnamese works with the speech fallback, so continue with Task 10 and come back later.

- [ ] **Step 1: Ask the owner** to set the key themselves (it is never pasted in chat), using PowerShell: `[Environment]::SetEnvironmentVariable('ELEVENLABS_API_KEY','<their key>','User')`. Then restart the session so the variable is visible.
- [ ] **Step 2: List voices.** Run `node scripts/gen-tone-audio.mjs --list-voices` and shortlist 2-3 voices described as Southern or Saigon (or the most neutral Vietnamese voices if none are). Run `--samples <ids>`. It prints credits before and after; expect under 100 credits used.
- [ ] **Step 3: Owner listens.** Send the sample mp3s to the owner with `SendUserFile` and have them pick a voice. Set `VOICE_ID` to their choice.
- [ ] **Step 4: Generate.** Run `node scripts/gen-tone-audio.mjs --generate`. Listen to every clip. Delete and regenerate any clip that's unclear or has the wrong tone (reruns skip good files). The total must stay under 1,000 credits.
- [ ] **Step 5: Browser check.** At `?lang=vi`, every play button plays its clip, the credit line shows, and in `?sw=1` mode the clips are in `reader-v6`.
- [ ] **Step 6: Commit**

```bash
git add audio/vi/tones/*.mp3 audio/vi/tones/SOURCE.md scripts/gen-tone-audio.mjs
git commit -m "feat(vi): add tone clips (ElevenLabs free plan, replace before store release)"
```

---

### Task 10: Vietnamese Book 2 (A2)

- [ ] Run the CTP.
  - `langs/vi/book2.js`: `title "Daily Life"`, `level "A2"`, `icon "Sống"`
  - 6 chapters of about 265 words each:
    1. a new cơm tấm place
    2. I don't feel well (the clinic)
    3. Má's phone call
    4. getting around by xe ôm and Grab
    5. a birthday
    6. buying clothes at a market
  - Glossed.
  - Commit: `feat(vi): add Book 2 (A2)`

### Task 11: Vietnamese Book 3 (A2+)

- [ ] Run the CTP.
  - `langs/vi/book3.js`: `title "Expanding Horizons"`, `level "A2+"`, `icon "Đường"`
  - 6 chapters of about 390 words each:
    1. a job interview
    2. a weekend in Đà Lạt
    3. learning to cook canh chua
    4. moving to Thủ Đức
    5. a misunderstanding
    6. an old friend comes back
  - Glossed.
  - Commit: `feat(vi): add Book 3 (A2+)`

### Task 12: Vietnamese grammar A1-A2+

- [ ] Run the CTP.
  - `langs/vi/grammar.js` with `window.GRAMMAR = [...]`, levels A1, A2 and A2+, 6 patterns each. The patterns are listed in spec §7.6.
  - Each level has `level, title, subtitle, icon` (a short Vietnamese word) and `description`. Each pattern has `name, nameTarget` (the Vietnamese term), `formula` (reuse the Mandarin colour palette), `tip`, and 3 `examples`.
  - Not glossed, so step 4 of the CTP is skipped.
  - Browser check: the grammar section shows on the landing, the tabs switch, and the colours link between formula and example parts.
  - Commit: `feat(vi): add grammar A1-A2+`

### Task 13: Vietnamese Book 4 (B1)

- [ ] Run the CTP.
  - `langs/vi/book4.js`: `title "Tales & Adventures"`, `level "B1"`, `icon "Mơ"`
  - 6 stories of about 950 words each:
    1. a missing painting in a Chợ Lớn shop (mystery)
    2. a signal from space (sci-fi)
    3. an old letter (family drama)
    4. the ghost of the night market (ghost story)
    5. the chess master (contest)
    6. builder's choice, set in the Mekong Delta
  - Not glossed.
  - Commit: `feat(vi): add Book 4 (B1)`

### Task 14: Vietnamese Book 5 (B1+)

- [ ] Run the CTP.
  - `langs/vi/book5.js`: `title "Beyond"`, `level "B1+"`, `icon "Sao"`
  - 6 stories of about 1,300 words each:
    1. the jade pendant (heirloom)
    2. tomorrow's memory
    3. the silent witness
    4. the garden of stars
    5. builder's choice
    6. builder's choice
  - Literary tone. Not glossed.
  - Commit: `feat(vi): add Book 5 (B1+)`

### Task 15: Vietnamese grammar B1-B1+

- [ ] Run the CTP.
  - Append levels B1 and B1+ to `langs/vi/grammar.js`, using the patterns in spec §7.6, including Southern `nha` among the particles.
  - Commit: `feat(vi): add grammar B1-B1+`

### Task 16: Vietnamese novel, chapters 1-3

- [ ] Run the CTP.
  - `langs/vi/novel1.js`: `window.NOVELS = [{ id: "ngnl", title: "No Game No Life", titleTarget: "Trò Chơi Sinh Tử"`. The builder may pick a better Vietnamese title. Use `icon: "🎮"` and the same `description` meaning as Mandarin, then chapters 1-3.
  - Retell `langs/zh/novel1.js` chapters 1-3, reading their English lines for the plot, at about 950 words each. Use the same `level` per chapter as the Mandarin file.
  - Glossed (every novel chapter).
  - Commit: `feat(vi): add novel chapters 1-3`

### Task 17: Vietnamese novel, chapters 4-6

- [ ] Run the CTP.
  - Append chapters 4-6 to `langs/vi/novel1.js`, retelling `langs/zh/novel1.js` chapters 4-6.
  - Glossed.
  - Commit: `feat(vi): add novel chapters 4-6`

---

### Task 18: Final verification and handoff

- [ ] **Step 1: Run the checks**

Run `npm test` and `node scripts/check-data.mjs zh` and `node scripts/check-data.mjs vi`. Expected: all tests PASS, 0 errors, no vi length warnings, and every glossed vi chapter at coverage ≥ 0.95.

- [ ] **Step 2: Set the vocab stat.** Set `PACKS.vi.copy.vocabStat` to the printed vi `vocabCount` rounded down to the nearest hundred, plus `+`. Commit: `chore(vi): set vocab stat`

- [ ] **Step 3: Full browser pass**, at desktop, 768px and 375px, in light and dark mode:
  - Mandarin matches every baseline screenshot from Task 1, apart from the brand.
  - Vietnamese: the chooser; switching both ways; the tones section; all 5 books in every mode; gloss on Books 1-3 and the novel, none on Books 4-5; the vocab panel; grammar for all 5 levels; the novel.
  - The offline test from Task 5 Step 4, for both languages.

- [ ] **Step 4: Fix and re-check.** Fix anything found with its own `fix:` commit, then re-run Steps 1-3.

- [ ] **Step 5: Hand off.** Report to the owner: what shipped, the Pages offline fix, any open items (tone clips if Task 9 was skipped, native review, novel rights, final name). Ask for the go-ahead to merge `feature/multi-language` into `master` and push, which deploys live. Do nothing further without that yes.
