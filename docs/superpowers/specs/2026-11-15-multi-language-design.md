# Multi-language Reader — Design

Date: 2026-11-15
Repo: `notDeepan/mandarin-reader` (local `C:\Users\goswa\mandarin-reader`, branch `master` @ `bb7b049`)

## 1. Intent

Mandarin Reader is a graded-story reading app (A1 → B1+). Each sentence is shown in the target language (pinyin for Mandarin) with English underneath, plus a vocab panel, reading modes, word-by-word gloss, and a grammar section.

The owner wants it to become **one app that teaches several languages**, starting with **Vietnamese**:

- The owner is learning Vietnamese now, mostly to talk with people from Ho Chi Minh City (Saigon).
- The app is meant to become a product on the App Store / Play Store soon. Adding a third language later must be cheap.

Vietnamese has no pinyin layer. A Vietnamese sentence is shown with English underneath, the same way pinyin is today. Vietnamese also gets **one small section that teaches the six tones**, placed before the books.

## 2. Goals

1. Restructure the app so the core knows nothing about any specific language. Each language is a self-contained **pack**.
2. Move all Mandarin content into a Mandarin pack. **Mandarin must look and behave exactly as it does today.**
3. Add a Vietnamese pack with **the same full set as Mandarin**:
   - 5 books (A1, A2, A2+, B1, B1+), set in Saigon, using Southern everyday words.
   - 1 novel (6 chapters).
   - Vietnamese grammar for all 5 levels (6 patterns each, 30 total), in the same format as the Mandarin grammar section.
   - A Vietnamese glossary so word-by-word gloss works.
   - A small tones section (section 7) with short audio clips.
4. Add a language picker so the learner can choose and switch languages.
5. Keep the app plain HTML/CSS/JS, offline-first, with no build step, so it can later be wrapped with Capacitor unchanged.

## 3. Non-goals (this round)

- Audio anywhere except the tones section. Stories get **no** read-aloud.
- Changes to how books, the reader, the modes or the vocab panel behave. A tone-colour reading mode and a tone drill were considered and **dropped** by the owner.
- Switching the app's own interface language (the UI stays in English).
- Accounts, payments, progress sync, Capacitor wrapping, store submission.
- Choosing the final product name (see 10.1).

## 4. Anti-goals (would count as failure even if it "works")

- Any visible regression in Mandarin: content, modes, gloss, grammar, novels, dark mode, font size, mobile layout.
- **Spending any money.** ElevenLabs may only be used on the free plan's monthly credits. Nothing may trigger a paid plan, top-up or overage.
- The tones section growing into a course. It stays one small landing-page section.
- Losing offline support, or making the first load noticeably heavier (only the chosen language's data should load).

## 5. Constraints and facts about the current code

- `index.html` is about 2,070 lines and holds all CSS, markup and JS. The data files load as `<script>` tags and attach to globals: `window.BOOKS`, `window.NOVELS`, `window.GRAMMAR`, `window.GLOSSARY` (`index.html:1668-1675`).
- **The sentence format already fits Vietnamese.** Mandarin sentences are pinyin/English pairs with no Chinese characters: `["Jīntiān shì xīngqīyī.", "Today is Monday."]`. A Vietnamese pair `["Hôm nay là thứ Hai.", "Today is Monday."]` drops into the same shape. Vocab entries are `[target, english]` pairs too.
- Mandarin-specific wiring that must become per-language:
  - Branding: "Mandarin Reader" in the title, meta tags, navbar, hero, features copy, footer, `manifest.json` and the `MR` icon.
  - Mode labels: `MODES = ['both','pinyin','english','reveal']`, with the label "Pinyin" (`index.html:1695-1696`). The CSS classes `.pinyin-line`, `.gw-pinyin`, `.vocab-pinyin`, `.part-pinyin`, `--pinyin` and `--font-pinyin`.
  - Gloss: `glossSentence()` (`index.html:1825`) splits on whitespace and looks each token up. This works for pinyin because each word is one token (`péngyǒu`). **Vietnamese puts a space between syllables**, so `học sinh` (student) is two tokens. Vietnamese gloss must match multi-syllable words.
  - Grammar data uses a `nameZh` field (`index.html:2030`).
  - `localStorage` key `mandarin-reader-dark` (`index.html:1947, 2060`).
  - The service worker (`sw.js`, cache `mandarin-reader-v5`) precaches a fixed list of Mandarin data files.
  - The footer GitHub link points to `gdeepan/mandarin-reader`, but the real repo is `notDeepan/mandarin-reader`.
- Dev server: `.claude/launch.json` config `mandarin-reader` runs `npx serve` on port 3456.
- **Hosting:** the app is live on GitHub Pages at `https://notdeepan.github.io/mandarin-reader/`, built from `master` at `/`. **Every push to `master` deploys live.** It's served from a subpath, but `sw.js` precaches root-absolute paths (`/index.html`, `/data/...`) and `manifest.json` has `start_url: "/"`. So offline mode and the installed PWA are very likely already broken on Pages. This round fixes that (7.9).
- There is no test suite.

## 6. Approaches considered

| | Approach | Trade-off | Verdict |
|---|---|---|---|
| **A** | **Language packs inside the current vanilla app.** Split `index.html` into a few plain files and move each language's data into its own folder. | Stays hand-written vanilla JS, so future features like accounts and sync will be clunkier. | **Chosen by owner.** Fastest path to learning Vietnamese and nothing working gets rewritten. |
| B | Rebuild on Vite + a framework, then add Vietnamese. | Cleanest long-term base, but every working Mandarin feature gets rewritten before any Vietnamese exists. Weeks with no learning value, plus regression risk. | Rejected for now. |
| C | Copy the app per language (as was done for English Reader). | Every fix gets done N times and there's one store app per language. Works against the product goal. | Rejected. |

## 7. Design

### 7.1 File layout

```
index.html              markup shell only (views, navbar, panels), no inline CSS/JS
css/app.css             all styles (moved from index.html)
js/strings.js           generic UI text (English) in one object
js/packs.js             registry of available languages (meta + file list)
js/app.js               state, loader, rendering, actions (moved from index.html)
langs/zh/               book1-5.js, novel1.js, grammar.js, glossary.js  (moved from data/)
langs/vi/               book1-5.js, novel1.js, grammar.js, glossary.js, tones.js
audio/vi/tones/         tone clips (.mp3)
scripts/gen-tone-audio.mjs   one-off ElevenLabs generator (dev only, never shipped/called by app)
scripts/check-data.mjs       data validator + gloss coverage report (dev only)
manifest.json, sw.js
```

`data/` is removed once its files are moved (use `git mv` so history follows).

### 7.2 Language registry and loading

`js/packs.js` defines `self.PACKS` (`self` so the service worker can `importScripts` it too), one entry per language. Each entry holds the metadata the core needs to render that language without loading its content. **All paths are relative** (no leading `/`), so the app works both at a domain root and under `/mandarin-reader/`:

```js
self.PACKS = {
  zh: {
    code: 'zh', name: 'Mandarin', nativeName: '中文', icon: '中',
    levels: 'A1 – B1+', blurb: 'Graded stories in pinyin, plus a novel and grammar.',  // chooser card text
    targetLabel: 'Pinyin',            // reader mode button + any "target line" wording
    vocabLabel: 'Pinyin',
    glossMode: 'word',                // whitespace tokens = words
    glossLevels: ['A1','A2','A2+'],   // novels: gloss every chapter (as today)
    hero: { title: 'Learn Mandarin<br>Through <span class="highlight">Stories</span>', text: '…current copy…' },
    copy: { /* features/how-it-works lines that mention pinyin or Mandarin, current wording */ },
    files: ['langs/zh/book1.js', …, 'langs/zh/glossary.js']
  },
  vi: {
    code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', icon: 'Việt',
    levels: 'A1 – B1+', blurb: 'Saigon stories, a novel, the six tones, and grammar.', beta: true,
    targetLabel: 'Tiếng Việt', vocabLabel: 'Tiếng Việt',
    audio: ['audio/vi/tones/ngang.mp3', /* … one per tone */],   // optional files, see 7.9
    glossMode: 'syllables',           // longest-match across space-separated syllables
    glossLevels: ['A1','A2','A2+'],
    speechLang: 'vi-VN',              // tones-section fallback voice only
    hero: { … }, copy: { … },
    files: ['langs/vi/book1.js', …, 'langs/vi/book5.js', 'langs/vi/novel1.js',
            'langs/vi/grammar.js', 'langs/vi/glossary.js', 'langs/vi/tones.js']
  }
};
```

On boot, `app.js`:
1. Picks the language: `?lang=xx` in the URL if valid, else `localStorage['reader-lang']`, else none (first visit, see 7.3).
2. Injects that pack's `files` as `<script>` tags in order and waits for all to load.
3. Renders the landing page.

Data files keep writing to the same globals they use today (`window.BOOKS.push(...)`, `window.GRAMMAR = ...`, `window.GLOSSARY = ...`, `window.NOVELS.push(...)`). Vietnamese adds `window.TONES`. Only one language is loaded per page, so the globals never mix.

**Switching language = save the choice to `localStorage` and reload the page.** (Designer's call, not the owner's.) It's instant for local static files and avoids resetting globals by hand.

### 7.3 Language picker

- **First visit** (no saved language, no `?lang`): a simple full-screen chooser with one card per pack. Each card shows the icon, English name, native name, `levels` and `blurb`, all from `PACKS` metadata. **No book counts** on the chooser, so it never loads pack data. Packs with `beta: true` show a small "Beta" badge here and in the navbar switch, until the native review (10.2) is done. Picking a card saves the choice and loads that language.
- An unknown `?lang=` value is ignored, and the app falls back to the saved choice or the chooser.
- **Afterwards:** a compact language switch in the navbar (current language's native name and a dropdown of the others). The reader and grammar views don't need it; the learner goes back to the library to switch.
- Existing users: if `localStorage['mandarin-reader-dark']` exists, migrate it to `reader-dark`. If any `mandarin-reader-*` key exists and no language is saved, default to `zh` silently, so existing Mandarin users never see the chooser.

### 7.4 Generic core changes

- **Branding:** a single `APP_NAME` constant in `js/strings.js` drives the title, navbar, footer and `<meta>` tags, on every language including Mandarin. The working name is the placeholder **"Story Reader"** until the owner picks one (10.1). "Mandarin identical" (goal 2, anti-goal 1) means content, layout and behaviour; **the brand text is the one expected difference.** Per-language titles read e.g. "`APP_NAME` — Learn Vietnamese Through Graded Stories". `manifest.json` gets the generic name and the icon text changes from `MR` to a neutral mark.
- **Reader modes:** internal mode keys become `['both','target','english','reveal']`. The label for `target` comes from `pack.targetLabel`, giving "Pinyin" for Mandarin and "Tiếng Việt" for Vietnamese. CSS classes are renamed generically (`.target-line`, `.gw-target`, `.vocab-target`, `.part-target`, `--target`, `--font-target`) with values unchanged.
- **Grammar:** the `nameZh` field becomes `nameTarget` in both packs. Rendering is otherwise unchanged.
- **Novels section:** rendered only if the pack has novels. It's hidden for Vietnamese, along with its navbar link.
- **Landing copy:** any line that says "pinyin" or "Mandarin" comes from `pack.hero` / `pack.copy`. Mandarin wording stays word-for-word as today. Book/grammar counts are computed, not hard-coded (the hero currently says "30 … stories").
- **Fix the footer GitHub link** to `notDeepan/mandarin-reader`.
- **Fonts:** Inter and Noto Serif from Google Fonts serve a Vietnamese subset automatically. Verify that stacked diacritics (ệ, ở, ữ, ặ) render correctly at all three font sizes and don't clip in the gloss layout.

### 7.5 Gloss for Vietnamese

`glossSentence()` gets a `syllables` mode:
- Split the line into syllable tokens on whitespace, keeping punctuation attached to each token for display.
- At each position, try the longest phrase first (up to 4 syllables, then 3, 2, 1). Compare lowercase with surrounding punctuation stripped, against `GLOSSARY` keys that may contain spaces (`"học sinh": "student"`).
- Render each matched phrase as **one** `gloss-word` unit (the meaning above, the syllables below). An unmatched syllable renders alone with an empty meaning, as today.
- Unicode: normalise both the text and the glossary keys to NFC before comparing, so precomposed and combining-mark spellings match.

Mandarin keeps the current `word` behaviour exactly.

### 7.6 Vietnamese content

- **Accent and words:** standard Vietnamese spelling with all tone marks, set in Saigon, using Southern everyday words (`dạ` for polite yes, `chén` bowl, `heo` pig, `muỗng` spoon, `bắp` corn, `ly` glass, `bệnh` sick, `tiệm` shop). Where the North uses a different common word, the vocab entry notes it in the English half: `["chén", "bowl (North: bát)"]`.
- **Books:** five books mirroring the Mandarin ladder, chapter counts and lengths, and its data shape (`title`, `level`, `icon`, `description`, `chapters[]` with `title`, `subtitle`, `readTime`, `wordCount`, `paragraphs`, `vocab`). They're original Saigon stories, not translations of the Mandarin ones.
  - Book 1 — A1, 6 chapters of roughly 120-140 words each (meeting people, family, numbers/prices at a market, time, food, a weekend).
  - Book 2 — A2, 6 chapters of roughly 250-280 words each (daily life in Saigon: street food, getting around by xe ôm/Grab, the doctor, phone calls, shopping, a birthday).
  - Book 3 — A2+, 6 chapters of roughly 380-400 words each (work interview, a trip to Vũng Tàu or Đà Lạt, cooking a dish, moving house, a misunderstanding, an old friend).
  - Book 4 — B1, 6 stories of roughly 900-1,000 words each, in the same genre mix as Mandarin Book 4 (mystery, sci-fi, family drama, a ghost story, a contest/game, one more of the builder's choice). Example settings: Chợ Lớn, a Saigon apartment block, the Mekong Delta.
  - Book 5 — B1+, 6 stories of roughly 1,200-1,400 words each, literary themes like Mandarin Book 5 (an heirloom, memory, a silent witness, a garden, plus two of the builder's choice).
  - (Every Mandarin book has 6 chapters, 30 in total, and Vietnamese mirrors that.)
  - Chapter titles are in Vietnamese with an English subtitle, same as Mandarin. Book icons are short Vietnamese words.
  - About 20-35 vocab items per chapter, more at higher levels.
- **Novel:** a Vietnamese retelling of the same novel as Mandarin (No Game No Life Vol. 1), 6 chapters of roughly 900-1,000 words each, following the Mandarin `novel1.js` plot and shape (`title`, `titleTarget`, `icon`, `description`, `chapters[]`). The `titleZh` field becomes `titleTarget` in both packs. Like Mandarin, every novel chapter is glossed.
  - **Store-launch risk:** this is a retelling of a copyrighted light novel. That's fine for personal study, but it needs a rights decision before any store release. The same applies to the existing Mandarin novel. Recorded in 10.3.
- **Gloss coverage** (7.10) covers everything that shows a gloss: Books 1-3 and the novel. Books 4-5 show no gloss, same as Mandarin B1/B1+.
- **Grammar:** 5 levels × 6 patterns, in the same `formula`/`tip`/`examples[].parts` format. Suggested set (builder may adjust within the levels):
  - A1: basic SVO; `là` identity; adjectives as predicates (no `là`); `không` negation; `… không?` yes/no questions; `của` possession.
  - A2: time words; `đã / đang / sẽ` tense markers; `ở` location; `có … không?` questions; `rồi` completion; `được` ability/permission.
  - A2+: classifiers (`con`, `cái`, `chiếc`, `quyển`); `muốn / định` want/plan; `vì … nên` cause/effect; `hơn` comparison; `tuy … nhưng` concession; `nếu … thì` condition.
  - B1: `bị / được` passive (bad vs good outcome); `càng ngày càng` more and more; `vừa … vừa` simultaneous; `mới` just/only then; `cho` causative/benefactive (`đưa cho`, `làm cho`); `để` purpose.
  - B1+: `không những … mà còn` not only … but also; `ngay cả … cũng` even; `ngoài … ra` besides; `chính` emphasis; `miễn là` as long as; sentence-final particles (`nhé`, `nha`, `mà`, `đâu`, `chứ`), including Southern `nha`.
- **Accuracy:** content is written by the builder (AI). It should be natural, everyday Saigon Vietnamese. Glosses should be the plain meaning in context. Before store launch the owner will ask a native HCMC speaker to read through it. That review doesn't block this round. Until then Vietnamese carries the "Beta" badge (7.3), with no other in-app warning.
- **Incremental:** each book, the novel and the grammar file are independent. The library, chapter navigation and grammar tabs already handle any number of books and levels. Content can therefore be written and committed book by book. The owner wants the full set this round.

### 7.7 Tones section (Vietnamese only)

A small section on the Vietnamese landing page, **placed directly above the books section**. It's rendered only when the pack provides `window.TONES`, and it gets a navbar link "Tones".

Contents, all from `langs/vi/tones.js`:

1. Heading and one short paragraph: Vietnamese has six tones, the tone mark is part of the spelling, and changing the tone changes the word.
2. **Six tone cards** in a responsive grid (3×2 on desktop, 2×3 on tablet, 1-column or horizontal scroll on phone). Each card shows:
   - The tone name: `ngang`, `huyền`, `sắc`, `hỏi`, `ngã`, `nặng`
   - The mark on a vowel: `a  à  á  ả  ã  ạ` (ngang shows "no mark")
   - A small inline SVG pitch curve (Southern pronunciation)
   - A one-line plain-English description of the voice movement
   - The example word and its meaning: `ma` ghost · `mà` but · `má` mom · `mả` grave · `mã` horse · `mạ` rice seedling
   - A play button
3. **Saigon note** (one short callout): in Saigon, `hỏi` and `ngã` sound the same, but they're still written differently, so learn both marks. One line on how Hà Nội differs.
4. **One-line tip:** `â ê ô ơ ư ă đ` are separate letters, not tones. A syllable can carry both, as in `ệ` (ê + nặng).

Southern pitch shapes used for the curves (approximate; flag for native check):

| Tone | Shape (Saigon) |
|---|---|
| ngang | mid, level |
| huyền | low, gently falling |
| sắc | rising high |
| hỏi | dips, then rises |
| ngã | same as hỏi in Saigon |
| nặng | low, dips slightly then lifts; not cut short (in Hà Nội it's short and cut off) |

The section must stay small: no quiz, no extra pages.

### 7.8 Tones audio

- **Clips:** one per tone card (6 clips, the `ma` series). Optionally 6 more with a second example word per tone if credits and quality allow. Files: `audio/vi/tones/{tone}.mp3`, e.g. `ngang.mp3`, `huyen.mp3`, `sac.mp3`, `hoi.mp3`, `nga.mp3`, `nang.mp3` (ASCII file names).
- **Playback:** tapping play uses the `.mp3` if present. If the file is missing, fall back to `speechSynthesis` with a `vi-VN` voice. If neither exists, hide the play button. Only one clip plays at a time.
- **Generation:** `scripts/gen-tone-audio.mjs` (Node 18+, no dependencies, uses `fetch`). Rules:
  - Reads the key from the environment variable `ELEVENLABS_API_KEY`. The owner sets it themselves. The key is never written to any file, logged, or committed.
  - Before generating, calls `GET /v1/user/subscription`. It **aborts** unless the tier is `free` and the remaining character credits cover the full batch plus a 50% margin. It prints the expected cost and remaining credits.
  - It skips clips that already exist, so reruns cost nothing.
  - It uses a Vietnamese-capable model (`eleven_multilingual_v2` or newer) and a voice chosen for a Southern/Saigon accent from voices available to the free plan. The voice ID is a constant in the script. The builder shortlists 2-3 candidate voices. The owner listens to a sample and picks; the cost of samples counts toward the same credit check.
  - Isolated single syllables can come out unclear from TTS. The builder may speak each word in a short carrier, e.g. `"ma"` said twice, and must listen-check the output.
  - Expected total cost: well under 1,000 of the free plan's monthly credits.
- **What "done" means for audio:** the script, the playback code and the speech fallback are built in any case. Generating the clips is a step that **needs the owner**: they set `ELEVENLABS_API_KEY` in their own environment, then listen to 2-3 short voice samples and pick one. After that, the builder runs the script and commits the `.mp3` files. If the owner can't do it in this round, Vietnamese ships with the speech fallback and an empty `audio/vi/tones/`. The credit line only shows when at least one clip exists.
- **Licence:** free-plan ElevenLabs audio is understood to be for non-commercial use with attribution. So:
  - Show a small credit in the tones section ("Tone audio: ElevenLabs").
  - Keep a `audio/vi/tones/SOURCE.md` noting the clips came from the ElevenLabs free plan and must be replaced (with native recordings or properly licensed audio) **before any store release**.

### 7.9 Service worker and manifest

- Rename the cache to a generic one (e.g. `reader-v6`) and delete old caches on activate, including `mandarin-reader-*`.
- **Paths:** all paths in `sw.js`, `PACKS` and `manifest.json` are relative. `start_url` is `"./"` and `scope` is `"./"`. The worker's fallback is `index.html`, relative to its own location.
- **Precache:** the core files, `js/packs.js` and every pack's `files`. Precaching happens at service-worker install, in the background, after the page has already rendered. **The page itself only downloads and runs the chosen language.** This keeps first load light and still makes every language work offline after the first visit. Pack data is small (a few hundred KB of text in total).
  - Generate the list from `PACKS` via `importScripts('js/packs.js')` instead of keeping a second list by hand.
  - Pack `audio` files are **optional**. Cache them one by one and ignore failures, because a single missing file makes `cache.addAll` reject the whole install.
- Keep the cache-first strategy.

### 7.10 Verification (no test suite exists)

- `scripts/check-data.mjs` loads each pack's data in a sandbox (`vm`) and checks:
  - every sentence and vocab entry is a pair of non-empty strings
  - every chapter has the required fields
  - grammar `parts` indexes point at real `formula` entries
  - For Vietnamese, it prints **gloss coverage** per chapter (the share of syllables covered by a glossary match) and lists unmatched words, so the glossary can be filled. Target: ≥ 95% coverage on A1-A2+.
- Browser check on the dev server (port 3456), both languages, desktop and phone width:
  - Mandarin looks identical to before: compare screenshots of the landing, reader in all four modes, gloss, grammar, novel, dark mode and font sizes against `master`.
  - Vietnamese: chooser, switch, books, all modes, multi-syllable gloss, vocab with North notes, grammar, and the tones section with playback and the speech fallback.
  - Offline: load once, go offline, reload, and both languages still work.

## 8. Work order (suggested)

All work happens on a branch (`feature/multi-language`). **Never push to `master` until the full verification (7.10) passes**, because `master` deploys live to GitHub Pages. Merging to `master` and pushing need the owner's go-ahead.

1. Split `index.html` into css/js files with **no behaviour change**. Mandarin must be identical.
2. Introduce `PACKS`, move `data/` to `langs/zh/`, add the loader, generic mode keys and class names, and branding strings. Mandarin must still be identical.
3. Language chooser, switch and storage migration. Service worker update.
4. Vietnamese pack skeleton plus syllable gloss, then Book 1, glossary and the check script.
5. Tones section UI with speech fallback, then the ElevenLabs script and clips.
6. Books 2-3, then grammar A1-A2+.
7. Books 4-5, grammar B1-B1+, and the novel.
8. Full verification pass.

Rough Vietnamese content volume: about 28,000 Vietnamese words plus English lines, vocab and glossary. Expect content to be most of the effort.

## 9. Left to the builder

- Exact split of `app.js` into more files, if it helps (still no build step).
- Visual design of the chooser, the language switch and the tone cards, within the existing style. The owner's bar is polished and modern; match the current landing page's quality.
- Story plots and characters within the topics above. Exact grammar patterns within each level.
- Carrier phrasing for the clips and the shortlist of candidate voices.

## 10. Open items

### 10.1 Product name
The final name is undecided. Use the placeholder "Story Reader" in `APP_NAME` and the manifest. Renaming later is a one-line change plus the manifest. Renaming the GitHub repo would also change the Pages URL; that isn't part of this round.

### 10.2 Native review
A native HCMC speaker will review the Vietnamese text and tone descriptions before store launch, outside this round.

### 10.3 Novel rights
Both novel packs retell *No Game No Life* Vol. 1. Before a store release, decide whether to license it, replace it with an original or public-domain story, or leave novels out of the store build.
