(function (root) {
  var VIEW = '-6 -6 112 52';
  var W = 100;
  var H = 40;
  var current = { audio: null, card: null };
  var mode = 'none';
  var lang = 'vi-VN';

  function curvePoints(levels, w, h) {
    var n = levels.length;
    return levels.map(function (level, i) {
      return [n === 1 ? 0 : (i / (n - 1)) * w, h - ((level - 1) / 4) * h];
    });
  }

  // Catmull-Rom spline through the points, as cubic Bézier segments.
  function smoothPath(points) {
    var d = 'M' + points[0][0] + ',' + points[0][1];
    for (var i = 0; i < points.length - 1; i++) {
      var p0 = points[i - 1] || points[i];
      var p1 = points[i];
      var p2 = points[i + 1];
      var p3 = points[i + 2] || p2;
      var c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      var c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ' C' + c1.join(',') + ' ' + c2.join(',') + ' ' + p2.join(',');
    }
    return d;
  }

  function curveSvg(levels) {
    var guides = [1, 2, 3, 4, 5].map(function (level) {
      var y = H - ((level - 1) / 4) * H;
      return '<line x1="0" x2="' + W + '" y1="' + y + '" y2="' + y + '" />';
    }).join('');
    var pts = curvePoints(levels, W, H);
    var end = pts[pts.length - 1];
    return '<svg class="tone-curve" viewBox="' + VIEW + '" aria-hidden="true" focusable="false">' +
      '<g class="tone-guides">' + guides + '</g>' +
      '<path class="tone-line" d="' + smoothPath(pts) + '" />' +
      '<circle class="tone-dot" cx="' + end[0] + '" cy="' + end[1] + '" r="3" />' +
    '</svg>';
  }

  function findVoice(speechLang) {
    if (!('speechSynthesis' in root)) return Promise.resolve(null);
    var prefix = speechLang.split('-')[0].toLowerCase();
    var pick = function () {
      return root.speechSynthesis.getVoices().filter(function (v) {
        return v.lang.toLowerCase().indexOf(prefix) === 0;
      })[0] || null;
    };
    if (root.speechSynthesis.getVoices().length) return Promise.resolve(pick());
    return new Promise(function (resolve) {
      var done = false;
      var finish = function () { if (!done) { done = true; resolve(pick()); } };
      root.speechSynthesis.addEventListener('voiceschanged', finish, { once: true });
      setTimeout(finish, 1500);
    });
  }

  function availability(tones, speechLang) {
    return fetch(tones[0].audio).then(function (r) {
      var type = r.headers.get('content-type') || '';
      if (r.ok && type.indexOf('audio/') === 0) return 'clips';
      throw new Error('no clips');
    }).catch(function () {
      return findVoice(speechLang).then(function (voice) { return voice ? 'speech' : 'none'; });
    });
  }

  function setPlaying(card, on) {
    if (card) card.classList.toggle('playing', on);
  }

  function stop() {
    if (current.audio) { current.audio.pause(); current.audio = null; }
    if ('speechSynthesis' in root) root.speechSynthesis.cancel();
    setPlaying(current.card, false);
    current.card = null;
  }

  function speak(tone, speechLang, card) {
    if (!('speechSynthesis' in root)) { setPlaying(card, false); return; }
    findVoice(speechLang).then(function (voice) {
      var u = new root.SpeechSynthesisUtterance(tone.example);
      u.lang = speechLang;
      u.rate = 0.75;
      if (voice) u.voice = voice;
      u.onend = u.onerror = function () { setPlaying(card, false); };
      root.speechSynthesis.speak(u);
    });
  }

  function play(tone, how, speechLang, card) {
    stop();
    current.card = card || null;
    setPlaying(card, true);
    if (how !== 'clips') { speak(tone, speechLang, card); return; }
    var audio = new Audio(tone.audio);
    var fellBack = false;
    var fallback = function () {
      if (fellBack) return;
      fellBack = true;
      speak(tone, speechLang, card);
    };
    current.audio = audio;
    audio.onended = function () { setPlaying(card, false); };
    audio.onerror = fallback;
    var p = audio.play();
    if (p && p.catch) p.catch(fallback);
  }

  function card(tone, i) {
    return '<div class="tone-card" data-index="' + i + '">' +
      '<div class="tone-card-top">' +
        '<span class="tone-name">' + tone.name + '</span>' +
        '<span class="tone-mark-label">' + tone.markLabel + '</span>' +
      '</div>' +
      '<div class="tone-mark">' + tone.mark + '</div>' +
      curveSvg(tone.levels) +
      '<p class="tone-describe">' + tone.describe + '</p>' +
      '<div class="tone-example">' +
        '<span class="tone-word">' + tone.example + '</span>' +
        '<span class="tone-meaning">' + tone.meaning + '</span>' +
      '</div>' +
      '<button class="tone-play hidden" type="button" aria-label="Play ' + tone.example + '">' +
        '<span class="tone-play-icon" aria-hidden="true">&#9654;</span> Listen' +
      '</button>' +
    '</div>';
  }

  function render(data, speechLang) {
    lang = speechLang || lang;
    document.getElementById('tonesTitle').textContent = data.title;
    document.getElementById('tonesIntro').textContent = data.intro;
    var grid = document.getElementById('tonesGrid');
    grid.innerHTML = data.tones.map(card).join('');
    document.getElementById('tonesNotes').innerHTML =
      '<div class="tones-callout"><strong>Saigon</strong><p>' + data.southNote + '</p></div>' +
      '<p class="tones-north">' + data.northNote + '</p>' +
      '<p class="tones-tip">' + data.lettersTip + '</p>';
    var credit = document.getElementById('tonesCredit');
    credit.textContent = data.credit;
    credit.classList.add('hidden');

    grid.querySelectorAll('.tone-card').forEach(function (el) {
      var tone = data.tones[Number(el.getAttribute('data-index'))];
      el.querySelector('.tone-play').addEventListener('click', function () {
        play(tone, mode, lang, el);
      });
    });

    return availability(data.tones, lang).then(function (how) {
      mode = how;
      grid.querySelectorAll('.tone-play').forEach(function (b) { b.classList.toggle('hidden', how === 'none'); });
      credit.classList.toggle('hidden', how !== 'clips');
      return how;
    });
  }

  root.Tones = {
    curvePoints: curvePoints,
    availability: availability,
    render: render,
    play: play
  };
})(self);
