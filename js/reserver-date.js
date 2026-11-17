/* ============================================================
   D'LYR — Réserver par date : le client choisit d'abord son jour
   et son nombre de participants, puis l'expérience.
   Les horaires et les tarifs sont lus en direct dans la base
   « D'LYR PROD » (tables en lecture publique). Les créneaux libres
   restent calculés par l'outil de réservation, à l'étape suivante :
   le lien ouvre le parcours par créneau avec &exp=<code>&date=AAAA-MM-JJ&n=<participants>.
   ============================================================ */
(function () {
  const EN = document.documentElement.lang === 'en';
  const T = EN ? {
    closed: 'Closed', open: 'Open', from: 'to', perP: 'per participant',
    hint: n => `Experiences that can be played with ${n} participant${n > 1 ? 's' : ''}. Available time slots appear on the next step.`,
    pickDay: 'Pick a day to continue.',
    exc: 'Special opening hours',
    noneGenre: 'No experience of this type can be played with this number of participants.'
  } : {
    closed: 'Fermé', open: 'Ouvert', from: 'à', perP: 'par participant',
    hint: n => `Les expériences jouables à ${n} participant${n > 1 ? 's' : ''}. Les créneaux libres s'affichent à l'étape suivante.`,
    pickDay: 'Choisissez un jour pour continuer.',
    exc: 'Horaires exceptionnels',
    noneGenre: 'Aucune expérience de ce type ne se joue à ce nombre de participants.'
  };

  const SB_URL = 'https://yeuvlnlkkonxstkgdrxf.supabase.co/rest/v1/';
  const SB_KEY = 'sb_publishable_oKOLGd461XVPULJR0jB5xg_O2EA1uLj'; // clé publique (lecture seule), comme js/home.js
  const DAYS_AHEAD = 30;   // même horizon que l'outil de réservation
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
  /* « En famille » n'est pas un genre : il regroupe les expériences marquées famille: true (games-data.js) */
  const isGenre = (x, g) => g === 'Tous' || (g === 'En famille' ? !!x.famille : x.genre === g);
  const GENRES = ['Tous', 'Action', 'Aventure', 'Escape Game', 'Quiz', 'Culturel', 'Adapté aux enfants', 'En famille']
    .filter(g => g === 'Tous' || GAMES.some(x => isGenre(x, g)));
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

  function renderGames() {
    const n = state.n;
    nEl.textContent = n;
    document.querySelector('[data-minus]').disabled = n <= 1;
    document.querySelector('[data-plus]').disabled = n >= 24;
    const big = n > MAX_ONLINE;
    bigEl.hidden = !big;
    const byN = big ? [] : GAMES.filter(g => n >= g.min && n <= g.max);
    const list = byN.filter(g => isGenre(g, state.genre));
    filtersEl.hidden = big;
    if (emptyEl) emptyEl.innerHTML = byN.length ? T.noneGenre : emptyDefault;
    hintEl.textContent = big ? '' : (state.date ? T.hint(n) : T.pickDay);
    gridEl.classList.toggle('is-waiting', !state.date);
    emptyEl.hidden = big || list.length > 0;
    gridEl.innerHTML = list.map(g => {
      /* Parcours par créneau de l'outil : expérience, jour et participants pré-remplis, le client n'y choisit plus que l'heure. */
      const href = state.date ? (BOOK.creneau ? `${BOOK.creneau}&exp=${encodeURIComponent(g.code)}&date=${state.date}&n=${n}` : `${BOOK.base}${encodeURIComponent(g.code)}&date=${state.date}&n=${n}`) : '#reserver-par-date';
      return `<div class="rdate__card"><a class="xcard" href="${href.replace(/&/g, '&amp;')}" data-book="${g.slug}"${state.date ? '' : ' aria-disabled="true"'}>
        <div class="ph ph--dark">${g.img ? `<img class="ph__img" src="${g.img}" alt="${g.name}"${g.cardPos ? ` style="object-position:${g.cardPos}"` : ''}>` : ''}</div>
        <span class="xcard__scrim"></span>
        <div class="xcard__header"${g.cardTop ? ` style="top:${g.cardTop}"` : ''}>
          <div class="xcard__tags">
            ${g.genre ? `<span class="xcard__tag tag-genre" style="background:${GCOLOR[g.genre] || 'var(--blue)'}">${g.genre}</span>` : ''}
            ${g.type ? `<span class="xcard__tag tag-type">${g.type}</span>` : ''}
          </div>
        </div>
        <div class="xcard__footer${g.cardNoName ? ' xcard__footer--noname' : ''}"${g.cardBottom ? ` style="bottom:${g.cardBottom}"` : ''}>
          <h3 class="xcard__name">${g.name}</h3>
          <div class="xcard__meta">${g.dur ? `<span>${clock} ${g.dur} min</span>` : ''}<span>${ppl} ${g.pl}</span></div>
        </div>
      </a>${window.DLYR_SYN ? DLYR_SYN.button(g) : ''}</div>`;
    }).join('');
  }

  function syncUrl() {
    const p = new URLSearchParams(location.search);
    state.date ? p.set('date', state.date) : p.delete('date');
    p.set('n', state.n);
    history.replaceState(null, '', location.pathname + '?' + p.toString());
  }
  function render() { renderDays(); renderInfo(); renderGames(); syncAutoCards(); syncUrl(); }

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
  document.querySelector('[data-minus]').addEventListener('click', () => { state.n = Math.max(1, state.n - 1); renderGames(); syncAutoCards(); syncUrl(); });
  document.querySelector('[data-plus]').addEventListener('click', () => { state.n = Math.min(24, state.n + 1); renderGames(); syncAutoCards(); syncUrl(); });
  /* Cartes ajoutées automatiquement depuis l'application (ex. Napoleon) : site.js les insère
     après coup dans la grille. Même règle que les autres : grisées et bloquées tant qu'aucun
     jour n'est choisi, puis lien vers la réservation du jour et du nombre de participants. */
  function bookHref(code) {
    const n = state.n;
    return BOOK.creneau ? `${BOOK.creneau}&exp=${encodeURIComponent(code)}&date=${state.date}&n=${n}` : `${BOOK.base}${encodeURIComponent(code)}&date=${state.date}&n=${n}`;
  }
  function syncAutoCards() {
    gridEl.querySelectorAll('a.xcard[data-exp]').forEach(a => {
      if (!a.dataset.ficheHref) a.dataset.ficheHref = a.getAttribute('href') || '';
      if (state.date) { a.removeAttribute('aria-disabled'); a.setAttribute('href', bookHref(a.dataset.exp)); }
      else { a.setAttribute('aria-disabled', 'true'); a.setAttribute('href', '#reserver-par-date'); }
      const min = +a.dataset.min || 1, max = +a.dataset.max || 99;
      const box = a.closest('.rdate__card') || a;
      box.style.display = (state.n >= min && state.n <= max) ? '' : 'none';
    });
  }
  if (typeof MutationObserver === 'function') new MutationObserver(syncAutoCards).observe(gridEl, { childList: true });

  gridEl.addEventListener('click', e => {
    const a = e.target.closest('a.xcard'); if (!a) return;
    if (a.dataset.exp) syncAutoCards();
    if (!state.date) { e.preventDefault(); daysEl.scrollIntoView({ behavior: 'smooth', block: 'center' }); daysEl.classList.add('is-nudged'); setTimeout(() => daysEl.classList.remove('is-nudged'), 900); return; }
    if (window.DLYR_track) window.DLYR_track('InitiateCheckout', { content_name: a.dataset.book || a.dataset.exp });
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
/* ============================================================
   D'LYR — RÉSERVER PAR DATE : LES EXPÉRIENCES PAS ENCORE OUVERTES
                                                      (17/11/2026)

   ⚠ CECI EST POUR LE SITE PUBLIC, PAS POUR L'APPLICATION.
     Dépôt D-LYR/DLYR, fichier js/reserver-date.js.

   OÙ LE METTRE
     À COLLER À LA FIN de js/reserver-date.js, après la parenthèse
     fermante du bloc existant. NE RIEN REMPLACER, ne rien modifier
     au-dessus. C'est un bloc indépendant.

     Rien à changer dans le HTML : le fichier est déjà chargé par la
     page qui porte « Réserver par date ».

   LE DÉFAUT QU'IL CORRIGE
     Dans ce tunnel, le client choisit son JOUR d'abord, puis son
     expérience. La liste des jeux vient de window.DLYR_GAMES — une
     liste écrite dans le site, qui ne connaît pas votre base. Napoléon
     s'y affichait donc pour le 21 novembre alors que ses séances ne
     commencent que le 2 décembre.

     L'autre tunnel — l'affiche d'abord, le jour ensuite — est traité
     par le fichier 86, dans l'application. Celui-ci ne le concerne pas.

   CE QU'IL FAIT
     Il lit en base les dates d'ouverture (une seule requête, avec la
     clé publique en lecture seule déjà utilisée par ce fichier), puis
     pour chaque carte dont le jour choisi est antérieur à l'ouverture :

       · une étiquette « Séances à partir du 02/12 » sur la carte ;
       · la carte grisée, et le clic bloqué ;
       · une phrase sous la carte qui dit quoi faire.

   ⚠ CE QU'IL NE FAIT PAS
     Il ne refuse rien : le refus est en base et tient de toute façon.
     Ceci évite au client de s'y heurter après avoir saisi ses
     coordonnées.

   ⚠ ET SI LA BASE NE RÉPOND PAS
     On ne grise rien, et le tunnel redevient exactement celui d'avant.
     Fermer la vente parce qu'une lecture a échoué coûterait plus cher
     que le défaut qu'on corrige.

   RETOUR ARRIÈRE : supprimer ce bloc. Rien d'autre n'y touche.
   ============================================================ */
(function () {
  'use strict';

  var SB_URL = 'https://yeuvlnlkkonxstkgdrxf.supabase.co/rest/v1/';
  //  La même clé publique, en lecture seule, que celle déjà écrite plus
  //  haut dans ce fichier et dans js/home.js. Rien de secret ici.
  var SB_KEY = 'sb_publishable_oKOLGd461XVPULJR0jB5xg_O2EA1uLj';

  var MARQUE  = 'data-seances-bloquee';   //  posée sur le lien
  var ETIQ    = 'data-seances-etiquette';
  var PHRASE  = 'data-seances-phrase';

  var dates = null;        //  { codeExperience: 'AAAA-MM-JJ' }
  var prevu = false;       //  un passage est déjà programmé

  var EN = document.documentElement.lang === 'en';

  function enFrancais(iso) {
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return '';
    return EN ? iso : iso.slice(8, 10) + '/' + iso.slice(5, 7) + '/' + iso.slice(0, 4);
  }

  function texteEtiquette(iso) {
    return (EN ? 'From ' : 'Dès le ') + enFrancais(iso);
  }

  function textePhrase(iso) {
    return EN
      ? 'Sessions start on ' + enFrancais(iso) + '. Pick a later day to book this experience.'
      : 'Les séances commencent le ' + enFrancais(iso)
        + '. Choisissez un jour à partir de cette date pour réserver cette expérience.';
  }

  // ----------------------------------------------------------------
  //  LA LECTURE — une seule fois, et seulement ce qui sert
  // ----------------------------------------------------------------
  function lire() {
    fetch(SB_URL + 'experiences?select=id,seances_a_partir_du&seances_a_partir_du=not.is.null', {
      headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY }
    })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (rows) {
        dates = {};
        (rows || []).forEach(function (r) {
          if (r && r.id && r.seances_a_partir_du) dates[r.id] = r.seances_a_partir_du;
        });
        passer();
      })
      .catch(function (e) {
        //  Pas de date connue = aucune carte grisée. Le tunnel redevient
        //  celui d'avant ce bloc, ce qui est vendable.
        dates = {};
        if (window.console) console.error('séances à partir du :', e);
      });
  }

  // ----------------------------------------------------------------
  //  CE QUE PORTE UNE CARTE
  //
  //  ⚠ ON LIT LE JOUR DANS LE LIEN DE LA CARTE, PAS AILLEURS.
  //  Le bloc d'origine garde son jour dans une variable qui lui est
  //  privée : on ne peut pas y accéder, et il ne faut pas essayer. Mais
  //  il écrit ce même jour dans chaque lien, sous la forme
  //  « &exp=<code>&date=AAAA-MM-JJ&n=<nombre> ». C'est donc la source la
  //  plus sûre : elle vient de lui, elle est toujours à jour, et elle
  //  survit à toutes ses reconstructions.
  // ----------------------------------------------------------------
  function infos(a) {
    var href = a.getAttribute('href') || '';
    var e = /[?&]exp=([^&]+)/.exec(href);
    var d = /[?&]date=(\d{4}-\d{2}-\d{2})/.exec(href);
    if (!e || !d) return null;
    var code;
    try { code = decodeURIComponent(e[1]); } catch (err) { code = e[1]; }
    return { exp: code, date: d[1] };
  }

  function nettoyer(a) {
    if (!a.getAttribute(MARQUE)) return;
    a.removeAttribute(MARQUE);
    a.removeAttribute('aria-disabled');
    a.style.opacity = '';
    a.style.filter = '';
    var carte = a.parentNode;
    var etiq = a.querySelector('[' + ETIQ + ']');
    if (etiq && etiq.parentNode) etiq.parentNode.removeChild(etiq);
    var ph = carte && carte.querySelector ? carte.querySelector('[' + PHRASE + ']') : null;
    if (ph && ph.parentNode) ph.parentNode.removeChild(ph);
  }

  function bloquer(a, iso) {
    if (a.getAttribute(MARQUE) === iso) return;   //  déjà fait, et à jour
    nettoyer(a);
    a.setAttribute(MARQUE, iso);
    a.setAttribute('aria-disabled', 'true');
    a.style.opacity = '.55';
    a.style.filter = 'grayscale(.5)';

    var tags = a.querySelector('.xcard__tags');
    if (tags) {
      var s = document.createElement('span');
      s.className = 'xcard__tag';
      s.setAttribute(ETIQ, '1');
      s.setAttribute('style', 'background:#6B7A5E;color:#fff;');
      s.textContent = texteEtiquette(iso);
      tags.appendChild(s);
    }

    var carte = a.parentNode;
    if (carte && carte.querySelector && !carte.querySelector('[' + PHRASE + ']')) {
      var p = document.createElement('p');
      p.setAttribute(PHRASE, '1');
      p.setAttribute('style', 'margin:6px 2px 0;font-size:12px;line-height:1.35;opacity:.85;');
      p.textContent = textePhrase(iso);
      carte.appendChild(p);
    }
  }

  function passer() {
    if (!dates) return;
    var liens = document.querySelectorAll('a.xcard[href]');
    for (var i = 0; i < liens.length; i++) {
      var a = liens[i];
      var i2 = infos(a);
      if (!i2) { nettoyer(a); continue; }
      var iso = dates[i2.exp];
      if (!iso || i2.date >= iso) { nettoyer(a); continue; }
      bloquer(a, iso);
    }
  }

  /*  ⚠⚠ POURQUOI ON ATTEND LA FIN DU TOUR, ET POURQUOI C'EST ESSENTIEL.
      CORRIGÉ LE 17/11 APRÈS UN ESSAI RATÉ EN PRODUCTION.

      Un changement de jour ne produit pas UNE salve de modifications,
      mais DEUX, au même millième de seconde :

        1 · renderGames() refait toute la grille — à cet instant, les
            cartes automatiques portent encore leur lien de FICHE, sans
            date : il n'y a donc rien à décider ;
        2 · syncAutoCards() réécrit leur lien avec le jour choisi — et
            c'est seulement là que l'information existe.

      Ma première version posait un verrou « je travaille, qu'on me
      laisse » pendant toute la durée du tour, pour éviter de boucler
      sur mes propres modifications. Il avalait la deuxième salve :
      celle qui comptait. Napoléon n'était donc jamais grisé — et
      pourtant tout marchait quand on modifiait un lien à la main, ce
      qui rendait le défaut incompréhensible.

      On ne verrouille donc plus rien : on REGROUPE. Toutes les salves
      d'un même tour déclenchent un seul passage, exécuté une fois le
      tour terminé, quand les liens ont leur forme définitive.

      Et la boucle, alors ? Elle ne peut pas se produire : passer() ne
      modifie rien s'il n'y a rien à changer — bloquer() et nettoyer()
      se retirent d'eux-mêmes quand la carte est déjà dans l'état voulu.
      Le passage qui suit nos propres modifications ne touche donc à
      rien, et plus rien ne réveille l'observateur. Deux tours au
      maximum, toujours. */
  function demander() {
    if (prevu) return;
    prevu = true;
    setTimeout(function () { prevu = false; passer(); }, 0);
  }

  // ----------------------------------------------------------------
  //  LE CLIC, BLOQUÉ AVANT TOUT LE MONDE
  //  En phase de capture, pour passer avant les gestionnaires du bloc
  //  d'origine et avant la navigation.
  // ----------------------------------------------------------------
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a.xcard[' + MARQUE + ']') : null;
    if (!a) return;
    ev.preventDefault();
    ev.stopPropagation();
  }, true);

  // ----------------------------------------------------------------
  //  LA SURVEILLANCE
  //  Le bloc d'origine reconstruit la grille à chaque changement de jour
  //  ou de nombre de participants. On repasse derrière lui.
  // ----------------------------------------------------------------
  function surveiller() {
    var grille = document.querySelector('[data-games], .rdate__grid') || document.body;
    try {
      new MutationObserver(function () { demander(); })
        .observe(grille, { childList: true, subtree: true, attributes: true,
                           attributeFilter: ['href'] });
    } catch (e) {
      //  Pas d'observateur : on repasse au moins sur les clics de jour.
      document.addEventListener('click', function () { setTimeout(demander, 60); }, false);
    }
    demander();
  }

  function demarrer() {
    //  Rien à faire sur une page qui ne porte pas ce tunnel.
    if (!document.querySelector('a.xcard')) return;
    lire();
    surveiller();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', demarrer);
  } else {
    demarrer();
  }

  //  Pour le banc d'essai.
  window.__seancesSite = {
    passer: passer, demander: demander, infos: infos, enFrancais: enFrancais,
    poserDates: function (d) { dates = d; },
    dates: function () { return dates; }
  };
})();
