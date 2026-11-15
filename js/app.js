/* ===== STATE ===== */
let state = {
  view: 'home',
  bookIdx: 0,
  novelIdx: 0,
  chapIdx: 0,
  mode: 'both',
  readingType: 'book',
  fontLevel: 0,
  grammarLevel: 0
};

const BOOKS = window.BOOKS || [];
const NOVELS = window.NOVELS || [];
const GRAMMAR = window.GRAMMAR || [];
const LEVEL_COLORS = { 'A1':'#27ae60','A2':'#2980b9','A2+':'#8e44ad','B1':'#d4781e','B1+':'#c0392b' };
const LEVEL_GRADIENTS = { 'A1':'linear-gradient(135deg,#1e8449,#2ecc71)','A2':'linear-gradient(135deg,#1a5276,#3498db)','A2+':'linear-gradient(135deg,#6c3483,#af7ac5)','B1':'linear-gradient(135deg,#a0600e,#e67e22)','B1+':'linear-gradient(135deg,#922b21,#e74c3c)' };
const MODES = ['both', 'pinyin', 'english', 'reveal'];
const MODE_LABELS = { both: 'Both', pinyin: 'Pinyin', english: 'English', reveal: 'Reveal' };
const LEVEL_CLASSES = { 'A1': 'level-a1', 'A2': 'level-a2', 'A2+': 'level-a2p', 'B1': 'level-b1', 'B1+': 'level-b1p' };

function getCurrentBook() {
  if (state.readingType === 'novel') return NOVELS[state.novelIdx];
  return BOOKS[state.bookIdx];
}

/* ===== LANDING ===== */
function renderHome() {
  const grid = document.getElementById('booksGrid');
  grid.innerHTML = BOOKS.map((book, bi) => `
    <div class="book-card ${LEVEL_CLASSES[book.level] || 'level-a1'}" onclick="openBook(${bi})">
      <div class="book-card-cover">
        <span class="cover-char">${book.icon || ''}</span>
        <span class="cover-title">${book.title}</span>
      </div>
      <div class="book-card-body">
        <span class="book-card-level">Level ${book.level}</span>
        <p class="book-card-desc">${book.description || ''}</p>
        <div class="book-card-footer">
          <span class="book-card-chapters">${book.chapters.length} chapters</span>
          <button class="book-card-btn">Start reading &#8594;</button>
        </div>
      </div>
    </div>
  `).join('');
  renderGrammarSection();
  renderNovelSection();
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function openBook(bi, ci) {
  state.readingType = 'book';
  ci = ci || 0;
  state.bookIdx = bi;
  state.chapIdx = ci;
  state.view = 'reader';
  document.getElementById('landingView').classList.add('hidden');
  document.getElementById('navbar').classList.add('hidden');
  document.getElementById('readerView').classList.remove('hidden');
  renderReader();
}

function goHome() {
  state.view = 'home';
  state.readingType = 'book';
  document.getElementById('readerView').classList.add('hidden');
  document.getElementById('grammarView').classList.add('hidden');
  document.getElementById('vocabPanel').classList.remove('open');
  document.getElementById('landingView').classList.remove('hidden');
  document.getElementById('navbar').classList.remove('hidden');
  window.scrollTo(0, 0);
}

function renderNovelSection() {
  var grid = document.getElementById('novelGrid');
  if (!grid) return;
  grid.innerHTML = NOVELS.map(function(novel, ni) {
    return '<div class="novel-card" onclick="openNovel(' + ni + ')">' +
      '<span class="novel-icon">' + (novel.icon || '') + '</span>' +
      '<div class="novel-title">' + novel.title + '</div>' +
      '<div class="novel-titleZh">' + (novel.titleZh || '') + '</div>' +
      '<p class="novel-desc">' + (novel.description || '') + '</p>' +
      '<div class="novel-meta">' +
        '<span>' + novel.chapters.length + ' chapters &middot; Vol. 1</span>' +
      '</div>' +
      '<button class="novel-btn">Start reading &#8594;</button>' +
    '</div>';
  }).join('');
}

function openNovel(ni) {
  state.readingType = 'novel';
  state.novelIdx = ni;
  state.chapIdx = 0;
  state.view = 'reader';
  document.getElementById('landingView').classList.add('hidden');
  document.getElementById('navbar').classList.add('hidden');
  document.getElementById('readerView').classList.remove('hidden');
  renderReader();
}

/* ===== READER ===== */
function renderReader() {
  const book = getCurrentBook();
  if (!book) return;
  const chapter = book.chapters[state.chapIdx];
  if (!chapter) return;

  const isNovel = state.readingType === 'novel';
  const sidebarLvl = isNovel ? '' : (book.level || chapter.level || '');
  document.getElementById('sidebarTitle').textContent = book.title;
  document.getElementById('sidebarLevel').textContent = sidebarLvl ? ('Level ' + sidebarLvl) : '';

  document.getElementById('breadcrumbs').innerHTML =
    `<a onclick="goHome()">Library</a><span class="sep">/</span>` +
    `<span>${book.title}</span><span class="sep">/</span>` +
    `<span>Ch. ${state.chapIdx + 1}</span>`;

  renderChapterList();
  renderModeToggle();
  renderStory();
  renderVocab();
  window.scrollTo(0, 0);
}

function renderChapterList() {
  const book = getCurrentBook();
  document.getElementById('chapterList').innerHTML = book.chapters.map((ch, ci) => `
    <button class="chapter-item ${ci === state.chapIdx ? 'active' : ''}" onclick="loadChapter(${ci})">
      <span class="chapter-num">${ci + 1}</span>
      <span class="chapter-info">
        <span class="ch-title">${ch.title}</span>
        <span class="ch-sub">${ch.subtitle}</span>
      </span>
    </button>
  `).join('');
}

function renderModeToggle() {
  document.getElementById('modeToggle').innerHTML = MODES.map(m =>
    `<button class="mode-btn ${state.mode === m ? 'active' : ''}" onclick="setMode('${m}')">${MODE_LABELS[m]}</button>`
  ).join('');
}

function glossSentence(pinyin, level) {
  var glossLevels = ['A1', 'A2', 'A2+'];
  if (glossLevels.indexOf(level) === -1 || !window.GLOSSARY) {
    return '<div class="pinyin-line">' + pinyin + '</div>';
  }
  var words = pinyin.split(/\s+/);
  var parts = words.map(function(w) {
    var clean = w.replace(/[.,!?;:，。！？、；：""''…—·]+$/g, '').replace(/^[""''«»]+/, '');
    var trailing = w.slice(clean.length);
    var lookup = GLOSSARY[clean] || GLOSSARY[clean.toLowerCase()] || '';
    if (!lookup) {
      var noPunct = clean.replace(/[.,!?;:，。！？、；：""''…—·]+/g, '');
      lookup = GLOSSARY[noPunct] || GLOSSARY[noPunct.toLowerCase()] || '';
    }
    return '<span class="gloss-word">' +
      '<span class="gw-meaning">' + (lookup || ' ') + '</span>' +
      '<span class="gw-pinyin">' + w + '</span>' +
      '</span>';
  });
  return '<div class="gloss-line">' + parts.join('') + '</div>';
}

function renderStory() {
  const book = getCurrentBook();
  const ch = book.chapters[state.chapIdx];
  const modeClass = state.mode !== 'both' ? 'mode-' + state.mode : '';
  const isNovel = state.readingType === 'novel';
  const lvl = isNovel ? '' : (ch.level || book.level || '');
  const glossLevel = isNovel ? 'A1' : (ch.level || book.level);

  const hasPrev = state.chapIdx > 0 || (!isNovel && state.bookIdx > 0);
  const hasNext = state.chapIdx < book.chapters.length - 1 || (!isNovel && state.bookIdx < BOOKS.length - 1);

  document.getElementById('storyContent').innerHTML = `
    <div class="story-header">
      <div class="story-label">${book.title}${lvl ? ' &middot; Level ' + lvl : ''}</div>
      <h2 class="story-title">${ch.title}</h2>
      <p class="story-subtitle">${ch.subtitle}</p>
      <div class="story-meta">
        <span>&#128337; ${ch.readTime || ''}</span>
        <span>&#128221; ${ch.wordCount || ''}</span>
        ${lvl ? `<span>&#127793; Level ${lvl}</span>` : ''}
      </div>
    </div>
    <div class="story-body ${modeClass}" id="storyBody">
      ${ch.paragraphs.map((para, pi) => `
        <div class="paragraph">
          ${para.map(([p, e]) => `
            <div class="sentence-pair" onclick="revealSentence(this)">
              ${glossSentence(p, glossLevel)}
              <div class="english-line">${e}</div>
            </div>
          `).join('')}
        </div>
        ${pi < ch.paragraphs.length - 1 ? '<div class="section-divider">&#9671; &#9671; &#9671;</div>' : ''}
      `).join('')}
    </div>
    <div class="nav-footer">
      <button class="nav-btn prev" onclick="navChapter(-1)" ${hasPrev ? '' : 'disabled'}>&#8592; Previous</button>
      <button class="nav-btn next" onclick="navChapter(1)" ${hasNext ? '' : 'disabled'}>Next &#8594;</button>
    </div>
  `;
}

function renderVocab() {
  const ch = getCurrentBook().chapters[state.chapIdx];
  document.getElementById('vocabBody').innerHTML = (ch.vocab || []).map(([p, e]) => `
    <div class="vocab-item">
      <span class="vocab-pinyin">${p}</span>
      <span class="vocab-english">${e}</span>
    </div>
  `).join('');
}

/* ===== ACTIONS ===== */
function loadChapter(ci) {
  state.chapIdx = ci;
  renderReader();
  if (window.innerWidth <= 900) closeSidebar();
}

function navChapter(dir) {
  const book = getCurrentBook();
  let newChap = state.chapIdx + dir;
  if (newChap >= 0 && newChap < book.chapters.length) {
    loadChapter(newChap);
  } else if (state.readingType === 'novel') {
    // Novels don't navigate across into other novels or books.
    return;
  } else if (dir > 0 && state.bookIdx < BOOKS.length - 1) {
    openBook(state.bookIdx + 1, 0);
  } else if (dir < 0 && state.bookIdx > 0) {
    const prevBook = BOOKS[state.bookIdx - 1];
    openBook(state.bookIdx - 1, prevBook.chapters.length - 1);
  }
}

function setMode(m) {
  state.mode = m;
  renderModeToggle();
  const body = document.getElementById('storyBody');
  if (body) {
    body.className = 'story-body';
    if (m !== 'both') body.classList.add('mode-' + m);
  }
  document.querySelectorAll('.sentence-pair').forEach(el => el.classList.remove('revealed'));
}

function revealSentence(el) {
  if (state.mode === 'reveal') el.classList.toggle('revealed');
}

function adjustFont(dir) {
  state.fontLevel = Math.max(-1, Math.min(1, state.fontLevel + dir));
  document.body.classList.remove('font-small', 'font-large');
  if (state.fontLevel === -1) document.body.classList.add('font-small');
  if (state.fontLevel === 1) document.body.classList.add('font-large');
}

function toggleDark() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('mandarin-reader-dark', isDark);
  const icon = isDark ? '&#9788;' : '&#9789;';
  document.querySelectorAll('#darkBtnNav, #darkBtnReader, #darkBtnGrammar').forEach(el => el.innerHTML = icon);
}

function toggleVocab() { document.getElementById('vocabPanel').classList.toggle('open'); }

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('show');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

/* ===== GRAMMAR ===== */
function renderGrammarSection() {
  var grid = document.getElementById('grammarGrid');
  if (!grid) return;
  grid.innerHTML = GRAMMAR.map(function(lvl, li) {
    return '<div class="grammar-level-card" onclick="openGrammar(' + li + ')">' +
      '<div class="grammar-level-icon" style="background:' + LEVEL_GRADIENTS[lvl.level] + '">' + lvl.icon + '</div>' +
      '<div class="glc-level" style="color:' + LEVEL_COLORS[lvl.level] + '">Level ' + lvl.level + '</div>' +
      '<h3>' + lvl.title + '</h3>' +
      '<p>' + lvl.subtitle + '</p>' +
      '<div class="glc-count">' + lvl.patterns.length + ' patterns</div>' +
    '</div>';
  }).join('');
}

function openGrammar(li) {
  state.view = 'grammar';
  state.grammarLevel = li;
  document.getElementById('landingView').classList.add('hidden');
  document.getElementById('navbar').classList.add('hidden');
  document.getElementById('grammarView').classList.remove('hidden');
  renderGrammar();
}

function renderExampleParts(parts, formula) {
  return parts.map(function(p) {
    var color = p[2] === -1 ? 'var(--text)' : (formula[p[2]] ? formula[p[2]][1] : 'var(--text)');
    var cls = p[2] === -1 ? ' part-neutral' : '';
    return '<div class="part-group' + cls + '">' +
      '<span class="part-pinyin" style="color:' + color + '">' + p[0] + '</span>' +
      (p[1] !== '-' ? '<span class="part-english">' + p[1] + '</span>' : '') +
    '</div>';
  }).join('');
}

function renderGrammar() {
  var lvl = GRAMMAR[state.grammarLevel];
  if (!lvl) return;

  document.getElementById('grammarTabs').innerHTML = GRAMMAR.map(function(g, gi) {
    return '<button class="grammar-tab' + (gi === state.grammarLevel ? ' active' : '') + '" onclick="switchGrammarLevel(' + gi + ')">' + g.level + '</button>';
  }).join('');

  var html = '<div class="grammar-level-header">' +
    '<h2>' + lvl.title + '</h2>' +
    '<div class="glh-sub">' + lvl.subtitle + ' — Level ' + lvl.level + '</div>' +
    '<div class="glh-desc">' + lvl.description + '</div>' +
  '</div>';

  lvl.patterns.forEach(function(pat, pi) {
    var formulaHtml = pat.formula.map(function(f, fi) {
      return (fi > 0 ? '<span class="formula-plus">+</span>' : '') +
        '<span class="formula-part" style="background:' + f[1] + '">' + f[0] + '</span>';
    }).join('');

    var examplesHtml = pat.examples.map(function(ex) {
      return '<div class="example-item"><div class="example-parts">' +
        renderExampleParts(ex.parts, pat.formula) +
      '</div></div>';
    }).join('');

    html += '<div class="pattern-card">' +
      '<div class="pattern-header">' +
        '<span class="pattern-num">' + (pi + 1) + '</span>' +
        '<span class="pattern-name">' + pat.name + '</span>' +
      '</div>' +
      '<div class="pattern-name-zh">' + pat.nameZh + '</div>' +
      '<div class="formula-display">' + formulaHtml + '</div>' +
      '<div class="pattern-tip">' + pat.tip + '</div>' +
      '<div class="examples-label">Examples</div>' +
      examplesHtml +
    '</div>';
  });

  document.getElementById('grammarContent').innerHTML = html;
  window.scrollTo(0, 0);
}

function switchGrammarLevel(gi) {
  state.grammarLevel = gi;
  renderGrammar();
}

/* ===== NAVBAR SCROLL ===== */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);

  if (state.view === 'reader') {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
    document.getElementById('progressBar').style.width = pct + '%';
  }
});

/* ===== INIT ===== */
if (localStorage.getItem('mandarin-reader-dark') === 'true') {
  document.body.classList.add('dark');
  document.querySelectorAll('#darkBtnNav, #darkBtnReader').forEach(el => el.innerHTML = '&#9788;');
}
renderHome();

/* ===== SERVICE WORKER ===== */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
