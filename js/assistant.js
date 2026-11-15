/* ============================================================
   D'LYR — Assistant « Quelle expérience choisir ? »
   ------------------------------------------------------------
   Un bouton flottant, en bas à droite de toutes les pages, ouvre
   un mini-quiz de 3 ou 4 questions puis propose 1 à 3 expériences,
   avec un bouton « Réserver » qui ouvre directement le tunnel de
   réservation de l'expérience recommandée.

   Chargé par js/site.js (aucune page HTML à modifier).
   Pour le retirer : supprimer le bloc « ASSISTANT » à la fin de
   js/site.js.

   Pour ajouter / retirer une expérience : modifier la liste EXP
   ci-dessous (le code de réservation vient de BOOK_EXP, dans
   js/site.js).
   ============================================================ */
(function () {
  'use strict';
  if (window.__dlyrAssistant) return;
  window.__dlyrAssistant = true;

  var isEN = document.documentElement.lang === 'en' || /\/en\//i.test(location.pathname);
  var P = isEN ? '../' : '';                 // chemin vers les images (à la racine)
  var BOOK = window.DLYR_BOOK || { base: 'https://reservation.dlyr-vr.com/?exp=', exp: {} };
  var PRIX = window.DLYR_PRIX || {};
  var PACK = 'https://reservation.dlyr-vr.com/?view=vrpack&pack=';

  /* ---------- Les expériences VR proposées ----------
     min/max : joueurs · kids : adaptée aux enfants (dès 8 ans)
     m : envies auxquelles elle répond (action, frisson, reflexion, culture)
     pop : popularité (départage les ex æquo) */
  var EXP = [
    { s: 'outbreak-lab', n: 'Outbreak Lab', img: 'outbreak-lab/outbreak-lab-affiche.jpg', min: 1, max: 12, dur: 30, kids: false, m: ['frisson', 'action'], pop: 9,
      fr: 'Survivez à une invasion de zombies, en équipe.', en: 'Survive a zombie outbreak as a team.' },
    { s: 'outbreak-lab-2', n: 'Outbreak Lab II', img: 'outbreak-lab-2/outbreak-lab-2-affiche-3x4.jpg', min: 2, max: 12, dur: 30, kids: false, m: ['frisson', 'action'], pop: 8,
      fr: "La suite : évadez-vous d'Apocalypse Stadium.", en: 'The sequel: break out of Apocalypse Stadium.' },
    { s: 'harbor-siege', n: 'Harbor Siege', img: 'harbor-siege/harbor-siege-affiche.jpg', min: 2, max: 12, dur: 30, kids: false, m: ['action'], pop: 9,
      fr: 'Équipe contre équipe : prenez le contrôle du port.', en: 'Team versus team: take control of the harbour.' },
    { s: 'volcanic-warfare', n: 'Volcanic Warfare', img: 'volcanic-warfare/volcanic-warfare-affiche.jpg', min: 4, max: 8, dur: 30, kids: false, m: ['action'], pop: 6,
      fr: 'Deux équipes, une seule victoire, au cœur du volcan.', en: 'Two teams, one victory, inside a volcano.' },
    { s: 'paradise-expedition', n: 'Paradise Expedition', img: 'paradise-expedition/paradise-expedition-affiche.jpg', min: 2, max: 12, dur: 30, kids: false, m: ['action'], pop: 7,
      fr: 'Chacun pour soi : le meilleur score l’emporte.', en: 'Every player for themselves: top score wins.' },
    { s: 'icarus-station', n: 'Icarus Station', img: 'icarus-station/icarus-station-affiche-titre.jpg', min: 2, max: 6, dur: 45, kids: true, m: ['reflexion'], pop: 8,
      fr: 'Escape game spatial : coopérez pour vous échapper.', en: 'Space escape game: work together to get out.' },
    { s: 'brain-arena', n: 'Brain Arena', img: 'brain-arena/brain-arena-affiche-titre.jpg', min: 2, max: 8, dur: 30, kids: true, m: ['reflexion'], pop: 7,
      fr: 'Le quiz immersif : qui finira en tête ?', en: 'The immersive quiz: who will top the board?' },
    { s: 'snow-village', n: 'Snow Village', img: 'snow-village/snow-village-affiche.jpg', min: 1, max: 12, dur: 30, kids: true, m: ['action'], pop: 8,
      fr: 'Sauvez le village du Père Noël, en famille.', en: "Save Santa's village, as a family." },
    { s: 'desert-village', n: 'Desert Village', img: 'desert-village/desert-village-affiche.jpg', min: 2, max: 12, dur: 30, kids: true, m: ['action'], pop: 6,
      fr: 'Une aventure cartoon à vivre en famille.', en: 'A cartoon adventure for the whole family.' },
    { s: 'titanic-le-reve-englouti', n: 'Titanic — Le Rêve Englouti', img: 'titanic/titanic-affiche-3x4.jpg', min: 1, max: 12, dur: 30, kids: true, m: ['culture'], pop: 8,
      fr: 'Remontez le temps à bord du Titanic.', en: 'Travel back in time aboard the Titanic.' }
  ];

  /* ---------- Textes ---------- */
  var T = isEN ? {
    launcher: 'Which experience?', launcherShort: 'Need help?',
    title: 'Find your experience', close: 'Close', back: 'Back', restart: 'Start again',
    step: function (i, n) { return 'Question ' + i + ' of ' + n; },
    q: {
      goal: 'What are you looking for?',
      size: 'How many of you?',
      kids: 'Are there children in the group?',
      mood: 'What are you in the mood for?',
      event: 'What kind of event?'
    },
    a: {
      play: ['Play', 'An experience to enjoy'], gift: ['Give', 'A gift idea'], event: ['Celebrate', 'Birthday, party, company'],
      s1: 'Just me', s2: '2', s36: '3 to 6', s712: '7 to 12', s13: '13 or more',
      kidsY: ['Yes', 'Children 8 and over'], kidsN: ['No', 'Adults / teenagers'],
      action: ['Action', 'Shoot, compete, win'], frisson: ['Thrills', 'Zombies & adrenaline'],
      reflexion: ['Brain power', 'Escape game, quiz'], culture: ['Wonder', 'Culture & discovery'], surprise: ['Surprise me', 'Our favourites'],
      bdayKids: ["Children's birthday", ''], bdayAdults: ['Birthday / stag & hen', ''], corporate: ['Company / team building', '']
    },
    res: 'Our recommendation', also: 'Also a great fit', book: 'Book', more: 'Details',
    players: function (a, b) { return a === b ? a + ' players' : a + '–' + b + ' players'; },
    min: ' min', from: PRIX.vrCourt ? 'from €24.90' : '',
    tipPass: ['Want to do several?', 'VR Passes: 2 to 4 sessions of your choice at a better price (Monday–Friday).', 'See the passes'],
    tipDarts: ['Make a night of it', 'Add connected darts and a drink at the bar.', 'Connected darts'],
    big: ['A big group?', 'From 13 people we organise sessions in parallel or privatise the venue. Ask us for a quote.', 'Request a quote'],
    gift: ['The gift card', 'A VR experience to live together, received by email in minutes. The recipient picks their date.', 'See gift ideas', 'Browse experiences'],
    event: ['Your event at D’LYR', 'VR, darts, bar & snacks: we put together the right package for your group. Free quote within 24h.', 'Request a quote', 'Ideas for your group:']
  } : {
    launcher: 'Quelle expérience choisir ?', launcherShort: 'Vous hésitez ?',
    title: 'Trouvez votre expérience', close: 'Fermer', back: 'Retour', restart: 'Recommencer',
    step: function (i, n) { return 'Question ' + i + ' sur ' + n; },
    q: {
      goal: 'Que cherchez-vous ?',
      size: 'Vous serez combien ?',
      kids: 'Y a-t-il des enfants dans le groupe ?',
      mood: 'De quoi avez-vous envie ?',
      event: 'Quel type d’évènement ?'
    },
    a: {
      play: ['Jouer', 'Une expérience à vivre'], gift: ['Offrir', 'Une idée cadeau'], event: ['Fêter', 'Anniversaire, EVG/EVJF, entreprise'],
      s1: 'Seul(e)', s2: '2', s36: '3 à 6', s712: '7 à 12', s13: '13 et plus',
      kidsY: ['Oui', 'Enfants dès 8 ans'], kidsN: ['Non', 'Adultes / ados'],
      action: ['De l’action', 'Viser, s’affronter, gagner'], frisson: ['Des frissons', 'Zombies et adrénaline'],
      reflexion: ['Se creuser la tête', 'Escape game, quiz'], culture: ['S’émerveiller', 'Culture et découverte'], surprise: ['Surprenez-moi', 'Nos coups de cœur'],
      bdayKids: ['Anniversaire enfant', ''], bdayAdults: ['Anniversaire adulte, EVG/EVJF', ''], corporate: ['Entreprise, team building', '']
    },
    res: 'Notre recommandation', also: 'Ça devrait aussi vous plaire', book: 'Réserver', more: 'Voir la fiche',
    players: function (a, b) { return a === b ? a + ' joueurs' : a + ' à ' + b + ' joueurs'; },
    min: ' min', from: PRIX.vrCourt || 'dès 24,90 €',
    tipPass: ['Envie d’en faire plusieurs ?', 'Les Pass VR : 2 à 4 sessions au choix, à tarif avantageux (du lundi au vendredi).', 'Voir les Pass VR'],
    tipDarts: ['Prolongez le moment', 'Ajoutez les fléchettes connectées et un verre au bar. ' + (PRIX.flechettes ? PRIX.flechettes + '.' : ''), 'Les fléchettes'],
    big: ['Un grand groupe ?', 'À partir de 13 personnes, nous organisons des sessions en parallèle ou privatisons la salle. Demandez-nous un devis.', 'Demander un devis'],
    gift: ['La carte cadeau', 'Une expérience VR à vivre ensemble, reçue par email en quelques minutes. Le bénéficiaire choisit sa date.', 'Voir les idées cadeaux', 'Parcourir les expériences'],
    event: ['Votre évènement chez D’LYR', 'VR, fléchettes, bar et snacks : nous composons la formule adaptée à votre groupe. Devis gratuit sous 24 h.', 'Demander un devis', 'Des idées pour votre groupe :']
  };

  /* ---------- Mesure (Clarity / Google, si présents) ---------- */
  function track(name, data) {
    try { if (typeof window.clarity === 'function') window.clarity('event', 'assistant_' + name); } catch (e) {}
    try { if (typeof window.gtag === 'function') window.gtag('event', 'assistant_' + name, data || {}); } catch (e) {}
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function bookUrl(e) {
    var code = BOOK.exp && BOOK.exp['jeu-' + e.s];
    return code ? BOOK.base + code : 'jeu-' + e.s + '.html';
  }

  /* ---------- Le moteur de recommandation ---------- */
  var SIZE = { s1: [1, 1], s2: [2, 2], s36: [3, 6], s712: [7, 12], s13: [13, 99] };

  function recommend(ans) {
    var sz = SIZE[ans.size] || [2, 2];
    var need = Math.min(sz[0], 12);          // au-delà de 12 : plusieurs sessions
    var mood = ans.mood || 'surprise';
    var kids = ans.kids === 'kidsY';
    var list = EXP.map(function (e) {
      var sc = e.pop;
      if (need < e.min || need > e.max) sc -= 100;           // ne convient pas à la taille du groupe
      if (mood !== 'surprise') sc += e.m.indexOf(mood) === 0 ? 30 : (e.m.indexOf(mood) > 0 ? 18 : 0);
      if (kids) sc += e.kids ? 25 : -60;
      if (/snow|desert/.test(e.s)) sc += kids ? 10 : -12;   // univers enfants : en tête pour les familles, en retrait sinon
      if (mood === 'frisson' && kids && e.s === 'icarus-station') sc += 8;
      if (sz[0] === 1 && e.min === 1) sc += 5;
      return { e: e, sc: sc };
    }).filter(function (x) { return x.sc > -50; })
      .sort(function (a, b) { return b.sc - a.sc; });
    return list.slice(0, 3).map(function (x) { return x.e; });
  }

  /* ---------- Les questions ---------- */
  function questionsFor(ans) {
    var q = [{ k: 'goal', opts: ['play', 'gift', 'event'] }];
    if (ans.goal === 'event') q.push({ k: 'event', opts: ['bdayKids', 'bdayAdults', 'corporate'] });
    if (ans.goal === 'play') {
      q.push({ k: 'size', opts: ['s1', 's2', 's36', 's712', 's13'], compact: true });
      if (ans.size !== 's1') q.push({ k: 'kids', opts: ['kidsY', 'kidsN'] });
      q.push({ k: 'mood', opts: ans.kids === 'kidsY'
        ? ['action', 'reflexion', 'culture', 'surprise']
        : ['action', 'frisson', 'reflexion', 'culture', 'surprise'] });
    }
    return q;
  }

  /* ---------- Interface ---------- */
  var CSS = '' +
    '.dlas-btn{position:fixed;right:clamp(14px,2vw,24px);bottom:clamp(14px,2vw,24px);z-index:250;display:flex;align-items:center;gap:10px;padding:12px 18px 12px 14px;border:0;border-radius:999px;background:var(--lime,#d4bc72);color:#101f15;font:700 15px/1.1 var(--f-ui,Barlow,sans-serif);cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.35);transition:transform .2s ease,background .2s ease,opacity .25s ease}' +
    '.dlas-btn:hover{transform:translateY(-2px);background:var(--lime-2,#c8ae61)}' +
    '.dlas-btn svg{width:22px;height:22px;flex:none}' +
    '.dlas-btn .dlas-s{display:none}' +
    '.dlas-btn.is-hidden{opacity:0;pointer-events:none;transform:translateY(12px)}' +
    '@media(max-width:600px){.dlas-btn{padding:11px 15px 11px 12px;font-size:14px}.dlas-btn .dlas-l{display:none}.dlas-btn .dlas-s{display:inline}}' +
    '.dlas{position:fixed;inset:0;z-index:2100;display:flex;align-items:flex-end;justify-content:flex-end;padding:clamp(0px,2vw,24px);background:rgba(8,16,11,.45);opacity:0;pointer-events:none;transition:opacity .25s ease}' +
    '.dlas.open{opacity:1;pointer-events:auto}' +
    '.dlas__box{position:relative;width:min(440px,100%);max-height:min(720px,100%);overflow:auto;background:var(--ink,#1c3024);color:var(--paper,#e8eedd);border:1px solid rgba(232,238,221,.16);border-radius:20px;box-shadow:0 24px 60px rgba(0,0,0,.5);padding:22px 22px 20px;font-family:var(--f-body,Barlow,sans-serif);transform:translateY(16px);transition:transform .3s cubic-bezier(.2,.8,.2,1)}' +
    '.dlas.open .dlas__box{transform:none}' +
    '@media(max-width:600px){.dlas{padding:0}.dlas__box{width:100%;max-height:92vh;border-radius:20px 20px 0 0}}' +
    '.dlas__head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}' +
    '.dlas__title{font:800 19px/1.2 var(--f-display,Barlow,sans-serif);margin:0;color:var(--paper,#e8eedd)}' +
    '.dlas__x{width:36px;height:36px;border:0;border-radius:10px;background:rgba(232,238,221,.08);color:inherit;font-size:24px;line-height:1;cursor:pointer}' +
    '.dlas__x:hover{background:rgba(232,238,221,.16)}' +
    '.dlas__bar{display:flex;gap:6px;margin-bottom:16px}.dlas__bar i{flex:1;height:4px;border-radius:4px;background:rgba(232,238,221,.15)}.dlas__bar i.on{background:var(--lime,#d4bc72)}' +
    '.dlas__step{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--lime,#d4bc72);margin:0 0 6px}' +
    '.dlas__q{font:700 22px/1.25 var(--f-display,Barlow,sans-serif);margin:0 0 16px;color:var(--paper,#e8eedd)}' +
    '.dlas__opts{display:grid;gap:10px}.dlas__opts--c{grid-template-columns:repeat(auto-fill,minmax(110px,1fr))}' +
    '.dlas__o{display:flex;flex-direction:column;align-items:flex-start;gap:2px;width:100%;text-align:left;padding:13px 16px;border-radius:14px;border:1px solid rgba(232,238,221,.18);background:rgba(232,238,221,.05);color:var(--paper,#e8eedd);font:600 16px/1.2 var(--f-ui,Barlow,sans-serif);cursor:pointer;transition:background .15s ease,border-color .15s ease}' +
    '.dlas__o small{font-weight:400;font-size:13px;opacity:.7}' +
    '.dlas__o:hover,.dlas__o:focus-visible{background:rgba(212,188,114,.14);border-color:var(--lime,#d4bc72);outline:none}' +
    '.dlas__o.sel{background:rgba(212,188,114,.22);border-color:var(--lime,#d4bc72)}' +
    '.dlas__nav{display:flex;justify-content:space-between;align-items:center;margin-top:16px;gap:10px}' +
    '.dlas__link{border:0;background:none;color:rgba(232,238,221,.75);font:600 14px var(--f-ui,Barlow,sans-serif);cursor:pointer;padding:6px 0;text-decoration:underline;text-underline-offset:3px}' +
    '.dlas__link:hover{color:var(--paper,#e8eedd)}' +
    '.dlas__top{display:grid;grid-template-columns:110px 1fr;gap:14px;align-items:start;padding:12px;border-radius:16px;background:rgba(232,238,221,.06);border:1px solid rgba(212,188,114,.45)}' +
    '.dlas__top img{width:110px;aspect-ratio:3/4;object-fit:cover;border-radius:10px;display:block}' +
    '.dlas__name{font:800 19px/1.2 var(--f-display,Barlow,sans-serif);margin:2px 0 6px;color:var(--paper,#e8eedd)}' +
    '.dlas__why{font-size:14px;line-height:1.4;margin:0 0 8px;opacity:.85}' +
    '.dlas__meta{font-size:13px;opacity:.7;margin:0 0 12px}' +
    '.dlas__cta{display:flex;flex-wrap:wrap;gap:8px;align-items:center}' +
    '.dlas__b{display:inline-flex;align-items:center;justify-content:center;padding:10px 16px;border-radius:999px;background:var(--lime,#d4bc72);color:#101f15;font:700 14px/1 var(--f-btn,Barlow,sans-serif);text-decoration:none;border:0}' +
    '.dlas__b:hover{background:var(--lime-2,#c8ae61)}' +
    '.dlas__b--o{background:transparent;color:var(--paper,#e8eedd);border:1px solid rgba(232,238,221,.35)}.dlas__b--o:hover{background:rgba(232,238,221,.1)}' +
    '.dlas__h{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--lime,#d4bc72);margin:18px 0 8px}' +
    '.dlas__alt{display:grid;grid-template-columns:52px 1fr auto;gap:12px;align-items:center;padding:8px;border-radius:12px;color:inherit;text-decoration:none}' +
    '.dlas__alt + .dlas__alt{margin-top:6px}' +
    '.dlas__alt:hover{background:rgba(232,238,221,.07)}' +
    '.dlas__alt img{width:52px;height:52px;object-fit:cover;border-radius:8px}' +
    '.dlas__alt b{display:block;font-size:15px}.dlas__alt span{font-size:12.5px;opacity:.7}' +
    '.dlas__alt em{font-style:normal;font-size:13px;font-weight:700;color:var(--lime,#d4bc72);white-space:nowrap}' +
    '.dlas__tip{margin-top:16px;padding:12px 14px;border-radius:14px;background:rgba(212,188,114,.1);font-size:14px;line-height:1.4}' +
    '.dlas__tip b{display:block;margin-bottom:2px}.dlas__tip a{color:var(--lime,#d4bc72);font-weight:700}' +
    '.dlas__card{padding:16px;border-radius:16px;background:rgba(232,238,221,.06);border:1px solid rgba(212,188,114,.45)}' +
    '.dlas__card p{margin:0 0 14px;font-size:15px;line-height:1.45;opacity:.9}';

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/></svg>';

  var ans = {}, hist = [], box, wrap, btn, lastFocus;

  function build() {
    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);

    btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dlas-btn';
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.innerHTML = ICON + '<span class="dlas-l">' + T.launcher + '</span><span class="dlas-s">' + T.launcherShort + '</span>';
    btn.addEventListener('click', open);
    document.body.appendChild(btn);

    wrap = document.createElement('div');
    wrap.className = 'dlas';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML = '<div class="dlas__box" role="dialog" aria-modal="true" aria-labelledby="dlas-t"></div>';
    box = wrap.firstChild;
    wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && wrap.classList.contains('open')) close(); });
    document.body.appendChild(wrap);

    // Le bouton s'efface tant que la bannière cookies est affichée (elle occupe le bas de l'écran).
    var watch = function () {
      var cb = document.querySelector('.cookiebar');
      btn.classList.toggle('is-hidden', !!(cb && cb.classList.contains('cookiebar--in')));
    };
    watch();
    setInterval(watch, 1500);
  }

  function open() {
    lastFocus = document.activeElement;
    ans = {}; hist = [];
    render();
    wrap.classList.add('open');
    wrap.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    track('open');
  }
  function close() {
    wrap.classList.remove('open');
    wrap.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function head() {
    return '<div class="dlas__head"><h2 class="dlas__title" id="dlas-t">' + T.title + '</h2>' +
      '<button type="button" class="dlas__x" data-x aria-label="' + T.close + '">&times;</button></div>';
  }

  function render() {
    var qs = questionsFor(ans);
    var cur = null;
    for (var i = 0; i < qs.length; i++) { if (!ans[qs[i].k]) { cur = i; break; } }
    var html = head();
    if (cur === null) {
      html += result();
    } else {
      var q = qs[cur];
      var total = qs.length + (ans.goal ? 0 : 2);
      html += '<div class="dlas__bar">' + new Array(Math.max(total, cur + 1) + 1).join('<i></i>') + '</div>';
      html += '<p class="dlas__step">' + T.step(cur + 1, Math.max(total, cur + 1)) + '</p>';
      html += '<p class="dlas__q">' + T.q[q.k] + '</p>';
      html += '<div class="dlas__opts' + (q.compact ? ' dlas__opts--c' : '') + '">';
      q.opts.forEach(function (o) {
        var a = T.a[o], lab = Array.isArray(a) ? a[0] : a, sub = Array.isArray(a) ? a[1] : '';
        html += '<button type="button" class="dlas__o" data-k="' + q.k + '" data-v="' + o + '">' + esc(lab) + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</button>';
      });
      html += '</div>';
      if (cur > 0) html += '<div class="dlas__nav"><button type="button" class="dlas__link" data-back>&larr; ' + T.back + '</button><span></span></div>';
    }
    box.innerHTML = html;
    var bars = box.querySelectorAll('.dlas__bar i');
    for (var b = 0; b <= (cur || 0) && b < bars.length; b++) bars[b].classList.add('on');
    bind();
    var f = box.querySelector('.dlas__o, .dlas__b');
    if (f) setTimeout(function () { try { f.focus({ preventScroll: true }); } catch (e) {} }, 30);
  }

  function bind() {
    box.querySelector('[data-x]').addEventListener('click', close);
    var bk = box.querySelector('[data-back]');
    if (bk) bk.addEventListener('click', function () { var k = hist.pop(); if (k) delete ans[k]; render(); });
    var rs = box.querySelector('[data-restart]');
    if (rs) rs.addEventListener('click', function () { ans = {}; hist = []; render(); });
    Array.prototype.forEach.call(box.querySelectorAll('.dlas__o'), function (el) {
      el.addEventListener('click', function () {
        var k = el.getAttribute('data-k'), v = el.getAttribute('data-v');
        // Changer une réponse efface celles qui en dépendaient
        if (k === 'goal') ans = {};
        if (k === 'size') { delete ans.kids; delete ans.mood; }
        if (k === 'kids') delete ans.mood;
        ans[k] = v; hist.push(k);
        render();
      });
    });
    Array.prototype.forEach.call(box.querySelectorAll('a[data-t]'), function (a) {
      a.addEventListener('click', function () { track(a.getAttribute('data-t'), { item: a.getAttribute('data-i') || '' }); });
    });
  }

  function meta(e) { return T.players(e.min, e.max) + ' · ' + e.dur + T.min + (T.from ? ' · ' + T.from : ''); }

  function topCard(e) {
    return '<div class="dlas__top"><img src="' + P + 'uploads/experiences/' + e.img + '" alt="" loading="lazy">' +
      '<div><p class="dlas__name">' + esc(e.n) + '</p><p class="dlas__why">' + esc(isEN ? e.en : e.fr) + '</p>' +
      '<p class="dlas__meta">' + esc(meta(e)) + '</p>' +
      '<div class="dlas__cta"><a class="dlas__b" href="' + esc(bookUrl(e)) + '" data-t="book" data-i="' + e.s + '">' + T.book + '</a>' +
      '<a class="dlas__b dlas__b--o" href="jeu-' + e.s + '.html" data-t="details" data-i="' + e.s + '">' + T.more + '</a></div></div></div>';
  }
  function altRow(e) {
    return '<a class="dlas__alt" href="' + esc(bookUrl(e)) + '" data-t="book_alt" data-i="' + e.s + '"><img src="' + P + 'uploads/experiences/' + e.img + '" alt="" loading="lazy">' +
      '<div><b>' + esc(e.n) + '</b><span>' + esc(isEN ? e.en : e.fr) + '</span></div><em>' + T.book + ' &rarr;</em></a>';
  }
  function tip(t, href, key) {
    return '<div class="dlas__tip"><b>' + t[0] + '</b>' + t[1] + ' <a href="' + esc(href) + '" data-t="' + key + '">' + t[2] + ' &rarr;</a></div>';
  }
  function foot() {
    return '<div class="dlas__nav"><button type="button" class="dlas__link" data-back>&larr; ' + T.back + '</button>' +
      '<button type="button" class="dlas__link" data-restart>' + T.restart + '</button></div>';
  }

  function result() {
    var h = '';
    if (ans.goal === 'gift') {
      track('result', { type: 'gift' });
      return '<p class="dlas__step">' + T.res + '</p><div class="dlas__card"><p class="dlas__name">' + T.gift[0] + '</p><p>' + T.gift[1] + '</p>' +
        '<div class="dlas__cta"><a class="dlas__b" href="offrir.html#formules" data-t="gift">' + T.gift[2] + '</a>' +
        '<a class="dlas__b dlas__b--o" href="catalogue.html" data-t="catalogue">' + T.gift[3] + '</a></div></div>' + foot();
    }
    if (ans.goal === 'event') {
      var corp = ans.event === 'corporate';
      var picks = recommend({ size: 's712', kids: ans.event === 'bdayKids' ? 'kidsY' : 'kidsN', mood: ans.event === 'bdayKids' ? 'action' : 'surprise' });
      if (corp) picks = [EXP[2], EXP[6], EXP[5]];          // Harbor Siege, Brain Arena, Icarus Station
      track('result', { type: 'event_' + ans.event });
      h += '<p class="dlas__step">' + T.res + '</p><div class="dlas__card"><p class="dlas__name">' + T.event[0] + '</p><p>' + T.event[1] + '</p>' +
        '<div class="dlas__cta"><a class="dlas__b" href="' + (corp ? 'entreprises.html' : 'evenements.html') + '#reserver" data-t="quote">' + T.event[2] + '</a></div></div>';
      h += '<p class="dlas__h">' + T.event[3] + '</p>' + picks.map(altRow).join('');
      return h + foot();
    }
    var recs = recommend(ans);
    track('result', { type: 'play', item: recs[0] && recs[0].s });
    h += '<p class="dlas__step">' + T.res + '</p>' + topCard(recs[0]);
    if (recs.length > 1) h += '<p class="dlas__h">' + T.also + '</p>' + recs.slice(1).map(altRow).join('');
    if (ans.size === 's13') h += tip(T.big, 'evenements.html#reserver', 'quote');
    else if (ans.size === 's1' || ans.size === 's2') h += tip(T.tipPass, 'catalogue.html#formules', 'pass');
    else h += tip(T.tipDarts, 'flechettes.html', 'darts');
    return h + foot();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
