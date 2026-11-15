(function (root) {
  var TRAIL = /[.,!?;:，。！？、；：""''…—·]+$/g;
  var ANY_PUNCT = /[.,!?;:，。！？、；：""''…—·]+/g;
  var LEAD = /^[""''«»]+/;
  var MAX_PHRASE = 4;
  var normCache = typeof WeakMap === 'function' ? new WeakMap() : null;

  function has(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  function pickLang(opts) {
    var packs = opts.packs || {};
    if (opts.query && has(packs, opts.query)) return opts.query;
    if (opts.stored && has(packs, opts.stored)) return opts.stored;
    if (opts.hadLegacy && has(packs, 'zh')) return 'zh';
    return null;
  }

  function migrateStorage(storage) {
    var old = storage.getItem('mandarin-reader-dark');
    if (old === null) return { hadLegacy: false };
    if (storage.getItem('reader-dark') === null) storage.setItem('reader-dark', old);
    storage.removeItem('mandarin-reader-dark');
    return { hadLegacy: true };
  }

  function stripLangParam(href) {
    var url = new URL(href);
    url.searchParams.delete('lang');
    var out = url.origin + url.pathname;
    var q = url.searchParams.toString();
    return out + (q ? '?' + q : '') + url.hash;
  }

  function glossWord(line, glossary) {
    return line.split(/\s+/).map(function (w) {
      var clean = w.replace(TRAIL, '').replace(LEAD, '');
      var lookup = glossary[clean] || glossary[clean.toLowerCase()] || '';
      if (!lookup) {
        var noPunct = clean.replace(ANY_PUNCT, '');
        lookup = glossary[noPunct] || glossary[noPunct.toLowerCase()] || '';
      }
      return { text: w, meaning: lookup };
    });
  }

  function normalizedGlossary(glossary) {
    if (normCache && normCache.has(glossary)) return normCache.get(glossary);
    var out = {};
    Object.keys(glossary).forEach(function (k) {
      out[k.normalize('NFC').toLowerCase()] = glossary[k];
    });
    if (normCache) normCache.set(glossary, out);
    return out;
  }

  function glossSyllables(line, glossary) {
    var g = normalizedGlossary(glossary);
    var tokens = line.split(/\s+/).filter(Boolean).map(function (t) {
      var lead = (t.match(LEAD) || [''])[0];
      var rest = t.slice(lead.length);
      var trail = (rest.match(/[.,!?;:，。！？、；：""''…—·]+$/) || [''])[0];
      var core = rest.slice(0, rest.length - trail.length);
      return { text: t, lead: lead, trail: trail, key: core.normalize('NFC').toLowerCase() };
    });
    var out = [];
    var i = 0;
    while (i < tokens.length) {
      for (var n = Math.min(MAX_PHRASE, tokens.length - i); n >= 1; n--) {
        var blocked = false;
        for (var j = i; j < i + n - 1; j++) if (tokens[j].trail) blocked = true;
        for (var k = i + 1; k < i + n; k++) if (tokens[k].lead) blocked = true;
        if (blocked) continue;
        var slice = tokens.slice(i, i + n);
        var phrase = slice.map(function (t) { return t.key; }).join(' ');
        if (n === 1 || has(g, phrase)) {
          out.push({
            text: slice.map(function (t) { return t.text; }).join(' '),
            meaning: has(g, phrase) ? g[phrase] : ''
          });
          i += n;
          break;
        }
      }
    }
    return out;
  }

  function glossTokens(line, glossary, mode) {
    return mode === 'syllables' ? glossSyllables(line, glossary) : glossWord(line, glossary);
  }

  function precacheList(packs, coreFiles) {
    var required = coreFiles.slice();
    var optional = [];
    Object.keys(packs).forEach(function (code) {
      required = required.concat(packs[code].files || []);
      optional = optional.concat(packs[code].audio || []);
    });
    return { required: required, optional: optional };
  }

  function heroStats(books) {
    var levels = [];
    var stories = 0;
    books.forEach(function (b) {
      stories += b.chapters.length;
      if (levels.indexOf(b.level) === -1) levels.push(b.level);
    });
    var range = books.length ? books[0].level + '–' + books[books.length - 1].level : '';
    return { stories: stories, levels: levels.length, range: range };
  }

  function fill(template, vars) {
    return template.replace(/\{(\w+)\}/g, function (m, key) {
      return has(vars, key) ? String(vars[key]) : m;
    });
  }

  root.Core = {
    pickLang: pickLang,
    migrateStorage: migrateStorage,
    stripLangParam: stripLangParam,
    glossTokens: glossTokens,
    precacheList: precacheList,
    heroStats: heroStats,
    fill: fill
  };
})(self);
