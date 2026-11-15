import { pathToFileURL } from 'node:url';
import { loadBrowserScripts } from './lib/load-scripts.mjs';

const LEVELS = ['A1', 'A2', 'A2+', 'B1', 'B1+'];
const TARGET_TOKENS = { A1: 130, A2: 265, 'A2+': 390, B1: 950, 'B1+': 1300, novel: 950 };
const isStr = v => typeof v === 'string' && v.trim() !== '';
const isPair = v => Array.isArray(v) && v.length === 2 && isStr(v[0]) && isStr(v[1]);

function checkChapter(ch, where, errors) {
  for (const f of ['title', 'subtitle', 'readTime', 'wordCount']) if (!isStr(ch[f])) errors.push(`${where}: missing ${f}`);
  if (!Array.isArray(ch.paragraphs) || ch.paragraphs.length === 0) errors.push(`${where}: no paragraphs`);
  else ch.paragraphs.forEach((p, pi) => {
    if (!Array.isArray(p) || p.length === 0) errors.push(`${where} p${pi + 1}: empty paragraph`);
    else p.forEach((s, si) => { if (!isPair(s)) errors.push(`${where} p${pi + 1} s${si + 1}: sentence is not a pair of strings`); });
  });
  (ch.vocab || []).forEach((v, vi) => { if (!isPair(v)) errors.push(`${where} vocab ${vi + 1}: not a pair of strings`); });
}

function checkGrammar(grammar, errors) {
  grammar.forEach((lvl, li) => {
    const where = `grammar ${lvl.level || li + 1}`;
    for (const f of ['level', 'title', 'subtitle', 'icon', 'description']) if (!isStr(lvl[f])) errors.push(`${where}: missing ${f}`);
    if (!LEVELS.includes(lvl.level)) errors.push(`${where}: bad level`);
    if (!Array.isArray(lvl.patterns) || lvl.patterns.length === 0) { errors.push(`${where}: no patterns`); return; }
    lvl.patterns.forEach((pat, pi) => {
      const pw = `${where} pattern ${pi + 1}`;
      for (const f of ['name', 'nameTarget', 'tip']) if (!isStr(pat[f])) errors.push(`${pw}: missing ${f}`);
      if (!Array.isArray(pat.formula) || !pat.formula.every(isPair)) errors.push(`${pw}: formula must be [label, color] pairs`);
      const n = (pat.formula || []).length;
      if (!Array.isArray(pat.examples) || pat.examples.length === 0) errors.push(`${pw}: no examples`);
      else pat.examples.forEach((ex, ei) => (ex.parts || []).forEach((part, ri) => {
        const ok = Array.isArray(part) && part.length === 3 && typeof part[0] === 'string' && typeof part[1] === 'string' &&
          Number.isInteger(part[2]) && (part[2] === -1 || (part[2] >= 0 && part[2] < n));
        if (!ok) errors.push(`${pw} example ${ei + 1} part ${ri + 1}: bad part`);
      }));
    });
  });
}

function checkTones(tones, pack, errors) {
  const list = tones.tones || [];
  if (list.length !== 6) errors.push(`tones: expected 6 tones, got ${list.length}`);
  list.forEach((t, i) => {
    const where = `tone ${t.id || i + 1}`;
    for (const f of ['id', 'name', 'mark', 'markLabel', 'example', 'meaning', 'describe', 'audio']) if (!isStr(t[f])) errors.push(`${where}: missing ${f}`);
    if (!Array.isArray(t.levels) || t.levels.length < 2 || !t.levels.every(l => Number.isInteger(l) && l >= 1 && l <= 5)) errors.push(`${where}: levels must be 2+ integers 1-5`);
    if (!/^audio\/vi\/tones\/[a-z]+\.mp3$/.test(t.audio || '')) errors.push(`${where}: bad audio path`);
    if (!(pack.audio || []).includes(t.audio)) errors.push(`${where}: audio not listed in pack.audio`);
  });
}

export function checkPack(code) {
  const errors = [];
  const warnings = [];
  const coverage = [];
  const ctx = loadBrowserScripts(['js/core.js', 'js/packs.js']);
  const pack = ctx.PACKS[code];
  if (!pack) return { errors: [`unknown pack ${code}`], warnings, coverage, vocabCount: 0 };
  const dupes = pack.files.filter((f, i) => pack.files.indexOf(f) !== i);
  dupes.forEach(f => errors.push(`${f}: listed more than once in pack files`));
  for (const file of pack.files) {
    try { loadBrowserScripts([file], ctx); } catch (e) { errors.push(e.message); }
  }
  const books = ctx.BOOKS || [];
  const novels = ctx.NOVELS || [];
  const glossary = ctx.GLOSSARY || {};
  const vocab = new Set();

  const measure = (ch, where, glossed, targetKey) => {
    let tokens = 0;
    let matched = 0;
    const missing = new Set();
    for (const p of ch.paragraphs || []) for (const s of p) {
      if (!isPair(s)) continue;
      tokens += s[0].split(/\s+/).filter(Boolean).length;
      if (!glossed) continue;
      for (const unit of ctx.Core.glossTokens(s[0], glossary, pack.glossMode)) {
        const parts = unit.text.split(/\s+/).filter(t => !/\d/.test(t));
        if (unit.meaning) matched += parts.length;
        else parts.forEach(t => missing.add(t.replace(/[.,!?;:"'…—·«»()]/g, '').normalize('NFC').toLowerCase()));
      }
    }
    if (glossed) {
      let total = 0;
      for (const p of ch.paragraphs || []) for (const s of p) if (isPair(s)) total += s[0].split(/\s+/).filter(t => t && !/\d/.test(t)).length;
      coverage.push({ where, ratio: total ? matched / total : 1, missing: [...missing].filter(Boolean).sort() });
    }
    const target = TARGET_TOKENS[targetKey];
    if (code === 'vi' && target && Math.abs(tokens - target) / target > 0.25) warnings.push(`${where}: ${tokens} tokens, target ~${target}`);
    (ch.vocab || []).forEach(v => isPair(v) && vocab.add(v[0].normalize('NFC').toLowerCase()));
  };

  books.forEach((b, bi) => {
    const where = `book ${bi + 1}`;
    if (!isStr(b.title)) errors.push(`${where}: missing title`);
    if (!LEVELS.includes(b.level)) errors.push(`${where}: bad level ${b.level}`);
    if (!Array.isArray(b.chapters) || b.chapters.length === 0) { errors.push(`${where}: no chapters`); return; }
    b.chapters.forEach((ch, ci) => {
      const cw = `${b.title} ch${ci + 1}`;
      checkChapter(ch, cw, errors);
      const lvl = ch.level || b.level;
      measure(ch, cw, pack.glossLevels.includes(lvl), b.level);
    });
  });

  novels.forEach((n, ni) => {
    const where = `novel ${ni + 1}`;
    for (const f of ['id', 'title', 'titleTarget', 'icon', 'description']) if (!isStr(n[f])) errors.push(`${where}: missing ${f}`);
    if (!Array.isArray(n.chapters) || n.chapters.length === 0) { errors.push(`${where}: no chapters`); return; }
    n.chapters.forEach((ch, ci) => {
      const cw = `${n.title} ch${ci + 1}`;
      checkChapter(ch, cw, errors);
      measure(ch, cw, true, 'novel');
    });
  });

  if (ctx.GRAMMAR) checkGrammar(ctx.GRAMMAR, errors);
  if (ctx.TONES) checkTones(ctx.TONES, pack, errors);

  return { errors, warnings, coverage, vocabCount: vocab.size };
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const code = process.argv[2] || 'vi';
  const r = checkPack(code);
  console.log(`pack ${code}: ${r.errors.length} errors, ${r.warnings.length} warnings, ${r.vocabCount} unique vocab`);
  r.errors.forEach(e => console.log('  ERROR ' + e));
  r.warnings.forEach(w => console.log('  WARN  ' + w));
  r.coverage.forEach(c => console.log(`  gloss ${(c.ratio * 100).toFixed(1)}%  ${c.where}${c.ratio < 0.95 ? '  missing: ' + c.missing.join(', ') : ''}`));
  process.exit(r.errors.length ? 1 : 0);
}
