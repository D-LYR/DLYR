/* ============================================================
   D'LYR — Jeux VR : vidéo, avis, plus de jeux, marquee
   ============================================================ */
(function () {
  const I = window.DLYR_ICONS || {};

  /* ---- Jeu courant (body[data-game]) ---- */
  const ALL = window.DLYR_GAMES || [];
  const slug = document.body.dataset.game || 'outbreak-lab';
  const TK = 'dlyr-trailer-t-' + slug;

  // flèche
  const ar = document.querySelector('[data-arrow]');
  if (ar) ar.innerHTML = I.arrow || '';

  /* ---- Bande-annonce vidéo ---- */
  const vid = document.querySelector('[data-video]');
  if (vid && vid.querySelector('.jhero__player')) {
    const player = vid.querySelector('.jhero__player');
    const start = () => {
      if (!player || vid.classList.contains('is-playing')) return;
      vid.classList.add('is-playing');
      player.controls = true;
      const t = parseFloat(localStorage.getItem(TK) || '0');
      if (t > 0 && t < (player.duration || Infinity) - 2) player.currentTime = t;
      player.play();
    };
    vid.addEventListener('click', (e) => { if (!vid.classList.contains('is-playing')) { e.preventDefault(); start(); } });
    vid.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && !vid.classList.contains('is-playing')) { e.preventDefault(); start(); } });
    if (player) {
      player.addEventListener('timeupdate', () => { try { localStorage.setItem(TK, String(player.currentTime)); } catch (_) {} });
      player.addEventListener('ended', () => {
        try { localStorage.setItem(TK, '0'); } catch (_) {}
        vid.classList.remove('is-playing');
        player.controls = false;
      });
    }
  }

  /* ---- Galerie carrousel ---- */
  const gal = document.querySelector('[data-jgal]');
  if (gal) {
    const vp = gal.querySelector('.jgal__viewport');
    const step = () => ((gal.querySelector('.jg')?.offsetWidth || 240) + 16);
    gal.querySelector('.jgal__nav--next').addEventListener('click', () => vp.scrollBy({ left: step(), behavior: 'smooth' }));
    gal.querySelector('.jgal__nav--prev').addEventListener('click', () => vp.scrollBy({ left: -step(), behavior: 'smooth' }));
  }

  /* ---- Avis carousel ---- */
  const AVIS = [
    { n: 'Thomas M.', t: "Le meilleur jeu VR auquel j'ai joué ! L'immersion est totale, on sursaute pour de vrai. Mention spéciale au mode coopératif à 6, c'est l'éclate totale." },
    { n: 'Laura P.',  t: "Frissons garantis. On se croit vraiment au cœur d'une invasion de zombies. Le free roaming change tout : on bouge, on se cache, on court. Bluffant." },
    { n: 'Yanis K.',  t: "Venu pour mon EVG, on a adoré Outbreak Lab. Difficulté bien dosée, ambiance au top. On a enchaîné deux sessions tellement c'était prenant." },
    { n: 'Nadia B.',  t: "Une expérience intense et hyper réaliste. L'équipe explique très bien le fonctionnement, même pour les débutants. On reviendra tester les autres jeux !" },
    { n: 'Marc D.',   t: "Graphismes superbes, sensations garanties. Parfait pour les amateurs d'action et d'horreur. 30 minutes qui passent à toute vitesse." },
  ];
  (function avis() {
    const root = document.querySelector('[data-javis]'); if (!root) return;
    const track = root.querySelector('[data-javis-track]');
    const dots = document.querySelector('[data-javis-dots]');
    track.innerHTML = AVIS.map(a => `
      <div class="jrcard">
        <div class="ph ph--dark jrcard__img"><img class="ph__img" loading="lazy" src="uploads/home/hero-accueil.jpg" alt=""></div>
        <div class="jrcard__body">
          <span class="jrcard__name">${a.n}</span>
          <span class="jrcard__stars">★★★★★</span>
          <p class="jrcard__text">"${a.t}"</p>
        </div>
      </div>`).join('');
    dots.innerHTML = AVIS.map((_, i) => `<button${i === 0 ? ' class="on"' : ''} aria-label="Avis ${i + 1}"></button>`).join('');
    let idx = 0; const n = AVIS.length;
    function go(i) { idx = (i + n) % n; track.style.transform = `translateX(-${idx * 100}%)`; dots.querySelectorAll('button').forEach((b, k) => b.classList.toggle('on', k === idx)); }
    root.querySelector('.rev__nav--next').addEventListener('click', () => go(idx + 1));
    root.querySelector('.rev__nav--prev').addEventListener('click', () => go(idx - 1));
    dots.querySelectorAll('button').forEach((b, k) => b.addEventListener('click', () => go(k)));
    let t = setInterval(() => go(idx + 1), 6000);
    const restart = () => { clearInterval(t); t = setInterval(() => go(idx + 1), 6000); };
    root.addEventListener('mouseenter', () => clearInterval(t));
    root.addEventListener('mouseleave', restart);
    if (window.DLYR_swipe) window.DLYR_swipe(root.querySelector('.javis__viewport'), {
      left: () => { go(idx + 1); restart(); },
      right: () => { go(idx - 1); restart(); },
    });
  })();

  /* ---- Plus de jeux ---- */
  const GAMES = ALL.filter(g => g.slug !== slug && !g.hidden).slice(0, 3).map(g => ({
    name: g.name, genre: g.genre,
    dur: g.dur ? g.dur + ' min' : '', pl: g.pl || '',
    href: 'jeu-' + g.slug + '.html', img: g.img
  }));
  const grid = document.querySelector('.jmore__grid');
  if (grid) grid.innerHTML = GAMES.map(g => `
    <a class="jcard" href="${g.href}">
      <div class="ph ph--dark">${g.img ? `<img class="ph__img" src="${g.img}" alt="${g.name}">` : `<span class="ph__label">Visuel · ${g.name}</span>`}</div>
      <span class="jcard__scrim"></span>
      <span class="jcard__tag tag-genre">${g.genre}</span>
      <span class="jcard__name">${g.name}</span>
      <span class="jcard__meta">${g.dur ? `<span>Durée ${g.dur}</span>` : ''}${g.pl ? `<span>${g.pl}</span>` : ''}</span>
    </a>`).join('');

  /* ---- Marquee gaming ---- */
  const gmq = document.querySelector('[data-gmq]');
  const gi = {
    pad: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 8h10a4 4 0 0 1 4 4l-1 5a2.5 2.5 0 0 1-4.4 1L13 16h-2l-2.6 2a2.5 2.5 0 0 1-4.4-1l-1-5a4 4 0 0 1 4-4zm0 3v2H5v2h2v2h2v-2h2v-2H9v-2H7zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm2 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>',
    head: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="13" width="4" height="7" rx="2" fill="currentColor"/><rect x="17" y="13" width="4" height="7" rx="2" fill="currentColor"/></svg>',
    vr: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 8h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-4l-2-2h-4l-2 2H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2z"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17.8 6.8 19.1l1-5.8-4.3-4.1 5.9-.9z"/></svg>',
  };
  if (gmq) {
    const seq = [['Jeux VR', gi.vr], ['Action', gi.pad], ['Immersion', gi.head], ['Free Roaming', gi.star]];
    gmq.innerHTML = seq.map(([txt, ic]) => `<span class="marquee__item">${ic} ${txt}</span>`).join('');
  }
})();
