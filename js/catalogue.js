/* ============================================================
   D'LYR — Catalogue : données, filtres, tri, rendu
   ============================================================ */
(function () {
  const I = window.DLYR_ICONS || {};
  const P = window.DLYR_PRIX || {};
  const ar = document.querySelector('[data-arrow]');
  if (ar) ar.innerHTML = I.arrow || '';

  /* Clic sur l'affiche = bouton « Réserver » de la fiche du jeu (application D'LYR) ;
     sans code de réservation, l'affiche mène à la fiche du jeu. */
  const BOOK = window.DLYR_BOOK || { base: '', exp: {} };
  const GAMES = (window.DLYR_GAMES || []).filter(g => !g.hidden).map(g => ({
    slug: g.slug, story: g.story, name: g.name, genre: g.genre, type: g.type, dur: g.dur, players: g.players, pl: g.pl,
    img: g.img, href: BOOK.exp['jeu-' + g.slug] ? BOOK.base + BOOK.exp['jeu-' + g.slug] : 'jeu-' + g.slug + '.html', book: !!BOOK.exp['jeu-' + g.slug], cardBottom: g.cardBottom, cardPos: g.cardPos
  }));
  /* Seules les catégories qui ont au moins une expérience affichée ont leur filtre */
  const GENRES = ['Tous', 'Action', 'Aventure', 'Escape Game', 'Quiz', 'Culturel', 'Adapté aux enfants']
    .filter(g => g === 'Tous' || GAMES.some(x => x.genre === g));
  const GCOLOR = { Action: '#43744c', Aventure: '#1b8a4b', 'Escape Game': '#7c3aed', Quiz: '#0e7490', 'Adapté aux enfants': '#c2410c', Culturel: '#b91c1c' };

  const state = { genre: 'Tous', players: 'all', sort: 'az' };

  const filtersEl = document.querySelector('[data-genre-filters]');
  const gridEl = document.querySelector('[data-grid]');
  const countEl = document.querySelector('[data-count]');
  const emptyEl = document.querySelector('[data-empty]');

  filtersEl.innerHTML = GENRES.map(g =>
    `<button class="cat__chip${g === 'Tous' ? ' on' : ''}" data-genre="${g}">${g}</button>`).join('');

  const clock = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
  const ppl = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0M15 19a4.5 4.5 0 0 1 6 0"/></svg>';

  /* Titre + durée/joueurs d'une carte : en bas de l'affiche, juste au-dessus de son slogan
     (hauteur réglable par expérience avec cardBottom, ex. '14%') */
  function titleMeta(g) {
    return `<h3 class="xcard__name">${g.name}</h3>
          <div class="xcard__meta">${g.dur ? `<span>${clock} ${g.dur} min</span>` : ''}${g.pl ? `<span>${ppl} ${g.pl}</span>` : ''}</div>`;
  }

  function playersBucket(p) { return p <= 1 ? 'solo' : p <= 4 ? 'small' : 'large'; }

  function apply() {
    let list = GAMES.filter(g =>
      (state.genre === 'Tous' || g.genre === state.genre) &&
      (state.players === 'all' || (g.players && playersBucket(g.players) === state.players))
    );
    list.sort((a, b) => state.sort === 'dur' ? (a.dur || 99) - (b.dur || 99) : a.name.localeCompare(b.name));

    countEl.textContent = `${list.length} expérience${list.length > 1 ? 's' : ''} disponible${list.length > 1 ? 's' : ''}`;
    emptyEl.hidden = list.length > 0;

    gridEl.innerHTML = list.map((g, i) => `
      <div class="rdate__card reveal" data-d="${i % 4}"><a class="xcard" href="${g.href.replace(/&/g, '&amp;')}"${g.book ? ` data-book="${g.slug}"` : ''}>
        <div class="ph ph--dark">${g.img ? `<img class="ph__img" src="${g.img}" alt="${g.name}"${g.cardPos ? ` style="object-position:${g.cardPos}"` : ''}>` : `<span class="ph__label">Visuel · ${g.name}</span>`}</div>
        <span class="xcard__scrim"></span>
        <div class="xcard__header">
          <div class="xcard__tags">
            <span class="xcard__tag tag-genre" style="background:${GCOLOR[g.genre] || 'var(--blue)'}">${g.genre}</span>
            ${g.type ? `<span class="xcard__tag tag-type">${g.type}</span>` : ''}
          </div>
        </div>
        <div class="xcard__footer"${g.cardBottom ? ` style="bottom:${g.cardBottom}"` : ''}>${titleMeta(g)}</div>
      </a>${window.DLYR_SYN ? DLYR_SYN.button(g) : ''}</div>`).join('');

    if (window.DLYR_reveal) window.DLYR_reveal();
  }

  gridEl.addEventListener('click', e => {
    const a = e.target.closest('[data-book]');
    if (a && window.DLYR_track) window.DLYR_track('InitiateCheckout', { content_name: a.dataset.book });
  });
  filtersEl.querySelectorAll('.cat__chip').forEach(b => b.addEventListener('click', () => {
    filtersEl.querySelectorAll('.cat__chip').forEach(x => x.classList.remove('on'));
    b.classList.add('on'); state.genre = b.dataset.genre; apply();
  }));
  const pSel = document.querySelector('[data-filter-players]');
  if (pSel) pSel.addEventListener('change', e => { state.players = e.target.value; apply(); });
  const sSel = document.querySelector('[data-sort]');
  if (sSel) sSel.addEventListener('change', e => { state.sort = e.target.value; apply(); });

  // Barre de filtres collante : fond visible seulement une fois « collée » sous la nav
  const bar = document.querySelector('[data-cat-bar]');
  if (bar) {
    const onScroll = () => {
      const top = parseFloat(getComputedStyle(bar).top) || 0;
      bar.classList.toggle('is-stuck', bar.getBoundingClientRect().top <= top + 1 && window.scrollY > 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }
  // Changer de filtre une fois descendu : remonter au début de la grille
  filtersEl.addEventListener('click', e => {
    if (!e.target.closest('.cat__chip') || !bar || !bar.classList.contains('is-stuck')) return;
    const y = gridEl.getBoundingClientRect().top + window.scrollY - bar.offsetHeight - parseFloat(getComputedStyle(bar).top) - 16;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });

  /* Prix d'appel sous le titre du catalogue */
  const head = document.querySelector('.cat__head');
  if (head && P.vr && !document.querySelector('.cat__price')) {
    const p = document.createElement('p');
    p.className = 'cat__price';
    p.innerHTML = `<strong>${P.vr}</strong> <span>${P.vrDetail || ''}</span>`;
    head.insertAdjacentElement('afterend', p);
  }

  apply();
})();
