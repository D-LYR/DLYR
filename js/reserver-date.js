/* ============================================================
   D'LYR — Réserver par date : le client choisit d'abord son jour
   et son nombre de participants, puis l'expérience.
   Les horaires et les tarifs sont lus en direct dans la base
   « D'LYR PROD » (tables en lecture publique). Les créneaux libres
   restent calculés par l'outil de réservation, à l'étape suivante :
   le lien lui transmet &date=AAAA-MM-JJ&n=<participants>.
   ============================================================ */
(function () {
  const EN = document.documentElement.lang === 'en';
  const T = EN ? {
    closed: 'Closed', open: 'Open', from: 'to', perP: 'per participant',
    hint: n => `Experiences that can be played with ${n} participant${n > 1 ? 's' : ''}. Available time slots appear on the next step.`,
    pickDay: 'Pick a day to continue.',
    exc: 'Special opening hours',
    noneGenre: 'No experience of this type can be played with this number of participants.',
    syn: 'Read the synopsis', goal: 'Objective', close: 'Close'
  } : {
    closed: 'Fermé', open: 'Ouvert', from: 'à', perP: 'par participant',
    hint: n => `Les expériences jouables à ${n} participant${n > 1 ? 's' : ''}. Les créneaux libres s'affichent à l'étape suivante.`,
    pickDay: 'Choisissez un jour pour continuer.',
    exc: 'Horaires exceptionnels',
    noneGenre: 'Aucune expérience de ce type ne se joue à ce nombre de participants.',
    syn: 'Lire le synopsis', goal: 'Objectif', close: 'Fermer'
  };

  const SB_URL = 'https://yeuvlnlkkonxstkgdrxf.supabase.co/rest/v1/';
  const SB_KEY = 'sb_publishable_oKOLGd461XVPULJR0jB5xg_O2EA1uLj'; // clé publique (lecture seule), comme js/home.js
  const DAYS_AHEAD = 14;   // même horizon que l'outil de réservation
  const MAX_ONLINE = 12;   // au-delà : devis (plusieurs arènes / privatisation)

  const BOOK = window.DLYR_BOOK || { base: 'https://admin.dlyr-vr.com/?client=1&exp=', exp: {} };
  const GAMES = (window.DLYR_GAMES || []).filter(g => !g.hidden && BOOK.exp['jeu-' + g.slug]).map(g => {
    const m = String(g.pl || '').match(/(\d+)\s*à\s*(\d+)/);
    return Object.assign({}, g, { min: m ? +m[1] : 1, max: m ? +m[2] : (g.players || 12), code: BOOK.exp['jeu-' + g.slug] });
  }).sort((a, b) => a.name.localeCompare(b.name));

  const daysEl = document.querySelector('[data-days]');
  const infoEl = document.querySelector('[data-day-info]');
  const nEl = document.querySelector('[data-n]');
  const bigEl = document.querySelector('[data-big]');
  const hintEl = document.querySelector('[data-hint]');
  const gridEl = document.querySelector('[data-grid]');
  const emptyEl = document.querySelector('[data-empty]');
  if (!daysEl || !gridEl) return;
  const emptyDefault = emptyEl ? emptyEl.innerHTML : '';

  /* ---- Sélecteur de type d'expérience (mêmes catégories et couleurs que le catalogue) ---- */
  const GENRES = ['Tous', 'Action', 'Aventure', 'Escape Game', 'Quiz', 'Culturel', 'Adapté aux enfants']
    .filter(g => g === 'Tous' || GAMES.some(x => x.genre === g));
  const GCOLOR = { Action: '#43744c', Aventure: '#1b8a4b', 'Escape Game': '#7c3aed', Quiz: '#0e7490', 'Adapté aux enfants': '#c2410c', Culturel: '#b91c1c' };
  const filtersEl = document.createElement('div');
  filtersEl.className = 'cat__filters rdate__filters';
  filtersEl.setAttribute('role', 'group');
  filtersEl.setAttribute('aria-label', EN ? 'Experience type' : "Type d'expérience");
  filtersEl.innerHTML = GENRES.map(g =>
    `<button type="button" class="cat__chip${g === 'Tous' ? ' on' : ''}" data-genre="${g}" aria-pressed="${g === 'Tous'}">${g}</button>`).join('');
  gridEl.insertAdjacentElement('beforebegin', filtersEl);

  /* ---- État (repris de l'adresse, pour que « retour » retrouve le choix) ---- */
  const qs = new URLSearchParams(location.search);
  const state = {
    date: /^\d{4}-\d{2}-\d{2}$/.test(qs.get('date') || '') ? qs.get('date') : null,
    n: Math.min(24, Math.max(1, parseInt(qs.get('n'), 10) || 2)),
    genre: 'Tous'
  };
  let HOURS = null, EXC = {}, PRICES = null;

  const pad = x => String(x).padStart(2, '0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const hm = t => { const [h, m] = String(t).split(':'); return EN ? `${+h}:${m}` : (m === '00' ? `${+h}h` : `${+h}h${m}`); };
  const euro = c => EN ? '€' + (c / 100).toFixed(2) : (c / 100).toFixed(2).replace('.', ',') + ' €';
  const loc = EN ? 'en-GB' : 'fr-FR';

  const days = [];
  const today = new Date(); today.setHours(0, 0, 0, 0);
  for (let i = 0; i < DAYS_AHEAD; i++) { const d = new Date(today); d.setDate(d.getDate() + i); days.push(d); }

  /* Ouverture d'un jour : exception datée d'abord, sinon horaires de la semaine */
  function dayRule(d) {
    const x = EXC[iso(d)];
    const base = HOURS ? HOURS[d.getDay()] : null;
    if (x) return { open: x.ouvert !== false, from: x.ouverture || (base && base.ouverture), to: x.fermeture || (base && base.fermeture), group: x.groupe_tarifaire || (base && base.groupe_tarifaire), exc: true, label: x.libelle };
    if (base) return { open: !!base.ouvert, from: base.ouverture, to: base.fermeture, group: base.groupe_tarifaire };
    return { open: true }; // horaires indisponibles : on ne bloque rien, l'outil tranchera
  }

  function renderDays() {
    daysEl.innerHTML = days.map(d => {
      const r = dayRule(d), id = iso(d);
      const wd = d.toLocaleDateString(loc, { weekday: 'short' }).replace('.', '');
      const mo = d.toLocaleDateString(loc, { month: 'short' }).replace('.', '');
      return `<button type="button" class="rdate__day${state.date === id ? ' on' : ''}" data-date="${id}"${r.open ? '' : ' disabled'} aria-pressed="${state.date === id}">
        <span class="rdate__wd">${wd}</span><span class="rdate__dn">${d.getDate()}</span><span class="rdate__mo">${r.open ? mo : T.closed}</span></button>`;
    }).join('');
  }

  function renderInfo() {
    if (!state.date) { infoEl.textContent = T.pickDay; return; }
    const d = new Date(state.date + 'T00:00:00');
    const r = dayRule(d);
    const parts = [];
    const long = d.toLocaleDateString(loc, { weekday: 'long', day: 'numeric', month: 'long' });
    parts.push(long.charAt(0).toUpperCase() + long.slice(1));
    if (r.from && r.to) parts.push(`${r.exc ? (r.label || T.exc) : T.open} ${EN ? 'from' : 'de'} ${hm(r.from)} ${T.from} ${hm(r.to)}`);
    if (PRICES && r.group && PRICES[r.group]) {
      const p = PRICES[r.group];
      parts.push(p.min === p.max ? `${euro(p.min)} ${T.perP}` : `${EN ? 'from' : 'de'} ${euro(p.min)} ${T.from} ${euro(p.max)} ${T.perP}`);
    }
    infoEl.textContent = parts.join(' · ');
  }

  const clock = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
  const ppl = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0M15 19a4.5 4.5 0 0 1 6 0"/></svg>';

  const book = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 21.5V5.5M8 7h8M8 11h6"/></svg>';

  /* ---- Fenêtre « Synopsis » : texte seul (sans l'affiche) ; un clic n'importe où la referme ---- */
  const syn = document.createElement('div');
  syn.className = 'rdate__syn';
  syn.hidden = true;
  syn.setAttribute('role', 'dialog');
  syn.setAttribute('aria-modal', 'true');
  syn.setAttribute('aria-labelledby', 'rdate-syn-title');
  document.body.appendChild(syn);
  let synFrom = null;
  function openSyn(slug, from) {
    const g = GAMES.find(x => x.slug === slug); if (!g) return;
    syn.innerHTML = `<div class="rdate__synbox">
        <button type="button" class="rdate__synx" aria-label="${T.close}">×</button>
        <div class="xcard__tags">
          ${g.genre ? `<span class="xcard__tag tag-genre" style="background:${GCOLOR[g.genre] || 'var(--blue)'}">${g.genre}</span>` : ''}
          ${g.type ? `<span class="xcard__tag tag-type">${g.type}</span>` : ''}
        </div>
        <h2 class="rdate__syntitle" id="rdate-syn-title">${g.name}</h2>
        <div class="xcard__meta rdate__synmeta">${g.dur ? `<span>${clock} ${g.dur} min</span>` : ''}<span>${ppl} ${g.pl}</span></div>
        ${(g.story || []).map(t => `<p>${t}</p>`).join('')}
        ${g.objective ? `<p class="rdate__syngoal"><strong>${T.goal}</strong> ${g.objective}</p>` : ''}
      </div>`;
    synFrom = from || null;
    syn.hidden = false;
    document.documentElement.classList.add('rdate-syn-open');
    const x = syn.querySelector('.rdate__synx'); if (x) x.focus();
    if (window.DLYR_track) window.DLYR_track('ReserverParDate_Synopsis', { content_name: slug });
  }
  function closeSyn() {
    if (syn.hidden) return;
    syn.hidden = true; syn.innerHTML = '';
    document.documentElement.classList.remove('rdate-syn-open');
    if (synFrom) synFrom.focus();
  }
  syn.addEventListener('click', closeSyn);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSyn(); });

  function renderGames() {
    const n = state.n;
    nEl.textContent = n;
    document.querySelector('[data-minus]').disabled = n <= 1;
    document.querySelector('[data-plus]').disabled = n >= 24;
    const big = n > MAX_ONLINE;
    bigEl.hidden = !big;
    const byN = big ? [] : GAMES.filter(g => n >= g.min && n <= g.max);
    const list = byN.filter(g => state.genre === 'Tous' || g.genre === state.genre);
    filtersEl.hidden = big;
    if (emptyEl) emptyEl.innerHTML = byN.length ? T.noneGenre : emptyDefault;
    hintEl.textContent = big ? '' : (state.date ? T.hint(n) : T.pickDay);
    gridEl.classList.toggle('is-waiting', !state.date);
    emptyEl.hidden = big || list.length > 0;
    gridEl.innerHTML = list.map(g => {
      const href = state.date ? `${BOOK.base}${encodeURIComponent(g.code)}&date=${state.date}&n=${n}` : '#reserver-par-date';
      return `<div class="rdate__card"><a class="xcard" href="${href.replace(/&/g, '&amp;')}" data-book="${g.slug}"${state.date ? '' : ' aria-disabled="true"'}>
        <div class="ph ph--dark">${g.img ? `<img class="ph__img" src="${g.img}" alt="${g.name}"${g.cardPos ? ` style="object-position:${g.cardPos}"` : ''}>` : ''}</div>
        <span class="xcard__scrim"></span>
        <div class="xcard__header">
          <div class="xcard__tags">
            ${g.genre ? `<span class="xcard__tag tag-genre" style="background:${GCOLOR[g.genre] || 'var(--blue)'}">${g.genre}</span>` : ''}
            ${g.type ? `<span class="xcard__tag tag-type">${g.type}</span>` : ''}
          </div>
        </div>
        <div class="xcard__footer"${g.cardBottom ? ` style="bottom:${g.cardBottom}"` : ''}>
          <h3 class="xcard__name">${g.name}</h3>
          <div class="xcard__meta">${g.dur ? `<span>${clock} ${g.dur} min</span>` : ''}<span>${ppl} ${g.pl}</span></div>
        </div>
      </a>${g.story && g.story.length ? `<button type="button" class="rdate__synbtn" data-syn="${g.slug}" aria-label="${T.syn} : ${g.name}" title="${T.syn}">${book}</button>` : ''}</div>`;
    }).join('');
  }

  function syncUrl() {
    const p = new URLSearchParams(location.search);
    state.date ? p.set('date', state.date) : p.delete('date');
    p.set('n', state.n);
    history.replaceState(null, '', location.pathname + '?' + p.toString());
  }
  function render() { renderDays(); renderInfo(); renderGames(); syncUrl(); }

  daysEl.addEventListener('click', e => {
    const b = e.target.closest('[data-date]'); if (!b || b.disabled) return;
    state.date = b.dataset.date; render();
    if (window.DLYR_track) window.DLYR_track('ReserverParDate_Jour', { content_name: state.date });
  });
  filtersEl.addEventListener('click', e => {
    const b = e.target.closest('[data-genre]'); if (!b) return;
    filtersEl.querySelectorAll('[data-genre]').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
    state.genre = b.dataset.genre; renderGames();
  });
  document.querySelector('[data-minus]').addEventListener('click', () => { state.n = Math.max(1, state.n - 1); renderGames(); syncUrl(); });
  document.querySelector('[data-plus]').addEventListener('click', () => { state.n = Math.min(24, state.n + 1); renderGames(); syncUrl(); });
  gridEl.addEventListener('click', e => {
    const s = e.target.closest('[data-syn]');
    if (s) { e.preventDefault(); openSyn(s.dataset.syn, s); return; }
    const a = e.target.closest('[data-book]'); if (!a) return;
    if (!state.date) { e.preventDefault(); daysEl.scrollIntoView({ behavior: 'smooth', block: 'center' }); daysEl.classList.add('is-nudged'); setTimeout(() => daysEl.classList.remove('is-nudged'), 900); return; }
    if (window.DLYR_track) window.DLYR_track('InitiateCheckout', { content_name: a.dataset.book });
  });

  /* ---- Données en direct ---- */
  const get = path => fetch(SB_URL + path, { headers: { apikey: SB_KEY } }).then(r => r.ok ? r.json() : Promise.reject(r.status));
  const first = iso(days[0]), last = iso(days[days.length - 1]);
  Promise.allSettled([
    get('horaires_ouverture?select=jour,ouvert,ouverture,fermeture,groupe_tarifaire'),
    get(`horaires_exceptions?select=jour_date,ouvert,ouverture,fermeture,groupe_tarifaire,libelle&jour_date=gte.${first}&jour_date=lte.${last}`),
    get('tarifs_grille?select=prix_cents,groupe_tarifaire,experience_id&experience_id=is.null')
  ]).then(([h, x, t]) => {
    if (h.status === 'fulfilled' && Array.isArray(h.value) && h.value.length) {
      HOURS = {}; h.value.forEach(r => { HOURS[r.jour] = r; });
    }
    if (x.status === 'fulfilled' && Array.isArray(x.value)) x.value.forEach(r => { if (r.jour_date) EXC[r.jour_date] = r; });
    if (t.status === 'fulfilled' && Array.isArray(t.value) && t.value.length) {
      PRICES = {};
      t.value.forEach(r => {
        const g = PRICES[r.groupe_tarifaire] || (PRICES[r.groupe_tarifaire] = { min: Infinity, max: 0 });
        g.min = Math.min(g.min, r.prix_cents); g.max = Math.max(g.max, r.prix_cents);
      });
    }
    /* Une date reçue dans l'adresse mais fermée n'est pas gardée */
    if (state.date && !dayRule(new Date(state.date + 'T00:00:00')).open) state.date = null;
    if (state.date && (state.date < first || state.date > last)) state.date = null;
    render();
  });

  render();
})();
