/* ============================================================
   D'LYR — Site shell (nav + footer + interactions partagées)
   ============================================================ */
(function () {
  document.documentElement.classList.add('js-anim');
  const PAGES = [
    { href: 'catalogue.html',   label: 'Expériences', key: 'catalogue' },
    { href: 'activites.html',   label: 'Activités',   key: 'activites', also: ['flechettes', 'arcade', 'karaoke'] },
    { href: 'evenements.html',  label: 'Évènements',  key: 'evenements' },
    { href: 'entreprises.html', label: 'Entreprises', key: 'entreprises' },
    { href: 'snack-bar.html',   label: 'Bar&Snack',   key: 'snack' },
    { href: 'faq.html',         label: 'FAQ',         key: 'faq' },
    { href: 'contact.html',     label: 'Contact',     key: 'contact' },
  ];

  /* Réservation : sur une fiche jeu, ouvre le widget Smeetz (#reserver) ;
     partout ailleurs, renvoie vers la page Expériences VR. */
  function isGamePage() {
    var b = document.body;
    if (b && (b.dataset.page === 'jeux' || b.getAttribute('data-game'))) return true;
    return /(?:jeu-[a-z-]+|soiree-decouverte)(?:\.html?)?$/i.test(location.pathname);
  }
  /* Réservation directe dans l'application D'LYR (remplace le widget Smeetz).
     Une ligne par page : nom de la page → code de l'expérience (paramètre « exp »).
     Sur ces pages, tous les boutons « Réserver » mènent à BOOK_BASE + code. */
  /* Prix d'appel affichés sur le site (accueil, catalogue, fiches jeux, fléchettes).
     À tenir à jour avec la grille tarifaire de l'application D'LYR. */
  window.DLYR_PRIX = {
    vr: 'Dès 24,90 € / participant',
    vrCourt: 'dès 24,90 €',
    vrDetail: 'De 24,90 € à 32 € par participant selon le jour et l\'heure.',
    flechettes: 'Dès 12 € la demi-heure, pour tout le groupe'
  };
  var BOOK_BASE = 'https://admin.dlyr-vr.com/?client=1&exp=';
  var BOOK_CRENEAU = 'https://admin.dlyr-vr.com/?client=1&parcours=creneau'; /* nouveau parcours par créneau : utilisé par la page « Réserver par date » */
  var BOOK_EXP = {
    'jeu-brain-arena': 'brain',
    'jeu-desert-village': 'custom-desert-village-rhrg',
    'jeu-gaudi-latelier-du-divin': 'custom-gaudi-l-atelier-du-divin-ca02',
    'jeu-harbor-siege': 'harbor',
    'jeu-icarus-station': 'icarus',
    'jeu-outbreak-lab': 'outbreak',
    'jeu-outbreak-lab-2': 'custom-outbreak-lab-2-w0xj',
    'jeu-paradise-expedition': 'paradise',
    'jeu-snow-village': 'snow',
    'jeu-titanic-le-reve-englouti': 'titanic',
    'jeu-volcanic-warfare': 'volcanic',
    'flechettes': 'flechettes'
  };
  /* Pass VR (page Expériences) et bon cadeau (page Offrir) : liens directs vers l'application D'LYR.
     Pass : repère du bouton « Sélectionner » (data-smeetz-cat) → code du pack (paramètre « pack »). */
  /* Partagé avec la page « Réserver par date » (js/reserver-date.js) */
  window.DLYR_BOOK = { base: BOOK_BASE, exp: BOOK_EXP, creneau: BOOK_CRENEAU };
  var PACK_BASE = 'https://admin.dlyr-vr.com/?client=1&view=vrpack&pack=';
  var PACK_BY_CAT = { '162309': 'duo', '162310': 'dlyr', '162311': 'ultimate' };
  var GIFT_URL = 'https://admin.dlyr-vr.com/?client=1&view=giftcard';
  var GIFT_HREF = GIFT_URL.replace(/&/g, '&amp;'); /* même adresse, prête à être écrite dans le HTML du menu */
  /* Adresse directe d'un bouton (pass VR ou bon cadeau), sinon '' */
  function buttonBookUrl(a) {
    var cat = a.getAttribute('data-smeetz-cat');
    if (cat && PACK_BY_CAT.hasOwnProperty(cat)) return PACK_BASE + PACK_BY_CAT[cat];
    if (document.body && document.body.dataset.page === 'offrir' && a.getAttribute('href') === '#reserver') return GIFT_URL;
    return '';
  }
  function pageSlug() {
    var raw = (document.body && document.body.getAttribute('data-game')) ||
      (location.pathname.split('/').filter(Boolean).pop() || '').replace(/\.html?$/i, '');
    return (raw || '').trim();
  }
  function directBookUrl() {
    if (document.body && document.body.dataset.bookUrl) return '';
    var s = pageSlug();
    var key = BOOK_EXP.hasOwnProperty(s) ? s : 'jeu-' + s;
    return BOOK_EXP.hasOwnProperty(key) ? BOOK_BASE + BOOK_EXP[key] : '';
  }
  function getBookHref() {
    /* Billetterie propre à la page (attribut data-book-url du <body>) */
    var b = document.body;
    if (b && b.dataset.bookUrl) return b.dataset.bookUrl.replace(/&/g, '&amp;');
    var direct = directBookUrl();
    if (direct) return direct.replace(/&/g, '&amp;');
    return isGamePage() ? '#reserver' : 'catalogue.html';
  }
  const BOOK_HREF = getBookHref();

  const ICONS = {
    tiktok: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M16.5 3c.3 2.1 1.6 3.6 3.6 3.8v2.4c-1.3.1-2.5-.3-3.6-1v5.8a5.7 5.7 0 1 1-5.7-5.7c.3 0 .6 0 .9.1v2.5a3.2 3.2 0 1 0 2.3 3V3h2.5z"/></svg>',
    facebook: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M13.5 22v-8.1h2.7l.4-3.1h-3.1V8.8c0-.9.25-1.5 1.55-1.5h1.65V4.5c-.3-.04-1.3-.13-2.4-.13-2.4 0-4.05 1.47-4.05 4.15v2.27H7.55v3.1h2.7V22h3.25z"/></svg>',
    instagram: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none"/></svg>',
    linkedin: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0zM3.4 8.4h3.1V21H3.4V8.4zM9.2 8.4h2.97v1.72h.04c.41-.78 1.42-1.6 2.93-1.6 3.13 0 3.71 2.06 3.71 4.74V21h-3.1v-5.52c0-1.32-.02-3.01-1.84-3.01-1.84 0-2.12 1.44-2.12 2.92V21H9.2V8.4z"/></svg>',
    pin: '<svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.6"/></svg>',
    clock: '<svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
    phone: '<svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 4h4l1.6 5-2.2 1.4a12 12 0 0 0 5.2 5.2L15.2 15l5 1.6V21a1.6 1.6 0 0 1-1.8 1.6A17 17 0 0 1 3.4 5.8 1.6 1.6 0 0 1 5 4z"/></svg>',
    arrow: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 9v9H9"/></svg>',
  };
  window.DLYR_ICONS = ICONS;

  const SOCIAL = {
    tiktok: 'https://www.tiktok.com/@dlyr.vr',
    facebook: 'https://www.facebook.com/profile.php?id=61591286531090',
    instagram: 'https://www.instagram.com/dlyr.vr/',
    linkedin: 'https://www.linkedin.com/company/d-lyr/'
  };
  window.DLYR_SOCIAL = SOCIAL;

  const isEN = document.documentElement.lang === 'en' || /\/en\//i.test(location.pathname);
  const prefix = isEN ? '../' : '';

  function brand(onPaper) {
    return `<a class="brand" href="${prefix}index.html" aria-label="D'LYR — accueil"><img src="${prefix}uploads/brand/logo-blanc.png" alt="D'LYR"></a>`;
  }

  function buildNav() {
    const body = document.body;
    const current = body.dataset.page || '';
    const onPaper = body.dataset.nav === 'paper';
    const bookHref = getBookHref();
    const links = PAGES.map(p =>
      `<a href="${p.href}"${(p.key === current || (p.also || []).indexOf(current) > -1) ? ' aria-current="page"' : ''}>${p.label}</a>`
    ).join('');

    const nav = document.createElement('header');
    nav.className = 'nav' + (onPaper ? ' nav--on-paper' : '');
    nav.innerHTML = `
      <div class="nav__inner">
        ${brand(onPaper)}
        <nav class="nav__links">${links}</nav>
        <div class="nav__cta">
          <button class="lang-btn" data-lang-toggle type="button" aria-label="Switch site to English" title="English version"><svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="40" fill="#012169"></rect><path d="M0 0 60 40M60 0 0 40" stroke="#fff" stroke-width="8"></path><path d="M0 0 60 40M60 0 0 40" stroke="#C8102E" stroke-width="4"></path><path d="M30 0v40M0 20h60" stroke="#fff" stroke-width="13"></path><path d="M30 0v40M0 20h60" stroke="#C8102E" stroke-width="8"></path></svg></button>
          <a class="btn btn--sm btn--cta" href="${bookHref}">Réserver</a>
          <a class="btn btn--sm btn--cta" href="offrir.html">Offrir</a>
        </div>
        <button class="nav__burger" aria-label="Menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>`;
    body.prepend(nav);

    // Lien d'évitement (RGAA 12.7) — première cible focusable de la page
    const main = document.querySelector('.hero, .phero, .jhero, main, .section');
    if (main) {
      if (!main.id) main.id = 'contenu';
      main.setAttribute('tabindex', '-1');
      const skip = document.createElement('a');
      skip.className = 'skip-link';
      skip.href = '#' + main.id;
      skip.textContent = 'Aller au contenu';
      body.prepend(skip);
    }

    const drawer = document.createElement('div');
    drawer.className = 'drawer';
    drawer.innerHTML = `
      <button class="drawer__close" aria-label="Fermer">&times;</button>
      ${PAGES.map(p => `<a href="${p.href}"${(p.key === current || (p.also || []).indexOf(current) > -1) ? ' aria-current="page"' : ''}>${p.label}</a>`).join('')}
      <div class="drawer__cta">
        <button class="lang-btn" data-lang-toggle type="button" aria-label="Switch site to English" title="English version"><svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="40" fill="#012169"></rect><path d="M0 0 60 40M60 0 0 40" stroke="#fff" stroke-width="8"></path><path d="M0 0 60 40M60 0 0 40" stroke="#C8102E" stroke-width="4"></path><path d="M30 0v40M0 20h60" stroke="#fff" stroke-width="13"></path><path d="M30 0v40M0 20h60" stroke="#C8102E" stroke-width="8"></path></svg></button>
        <a class="btn btn--sm btn--cta" href="${bookHref}">Réserver</a>
        <a class="btn btn--sm btn--cta" href="offrir.html">Offrir</a>
      </div>`;
    body.appendChild(drawer);

    const burger = nav.querySelector('.nav__burger');
    const close = drawer.querySelector('.drawer__close');
    const open = () => { drawer.classList.add('open'); burger.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; };
    const shut = () => { drawer.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
    burger.addEventListener('click', open);
    close.addEventListener('click', shut);
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', shut));

    // Boutons toujours dans la barre : si liens + boutons ne tiennent pas, on passe au menu burger
    const inner = nav.querySelector('.nav__inner');
    const fit = () => {
      nav.classList.remove('nav--compact');
      if (inner.scrollWidth > inner.clientWidth + 1) nav.classList.add('nav--compact');
    };
    fit();
    window.addEventListener('resize', fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    document.addEventListener('click', e => { if (e.target.closest('[data-lang-toggle]')) setTimeout(fit, 60); });

    // état "solide" au scroll
    const onScroll = () => nav.classList.toggle('nav--solid', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function buildFooter() {
    const mount = document.querySelector('[data-footer]');
    if (!mount) return;
    const col = (title, items) =>
      `<div class="footer__col"><h4>${title}</h4><ul>${items.map(i => `<li><a href="${i[1]}">${i[0]}</a></li>`).join('')}</ul></div>`;
    mount.outerHTML = `
    <footer class="footer">
      <div class="footer__top wrap">
        <div class="footer__grid">
          <div class="footer__contact">
            <h4>Contactez-nous</h4>
            <p>${ICONS.pin}<span>1 Bd Charles de Gaulle,<br>92700 Colombes – Hall A - Rez de Jardin</span></p>
            <p>${ICONS.clock}<span>Ouvert 7j/7 · Lun–Ven 11h–22h30<br>Samedi 10h–23h · Dimanche 10h–20h</span></p>
            <p>${ICONS.phone}<span><a href="tel:+33147848884">01 47 84 88 84</a></span></p>
            <p><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5 12 13l8.5-6.5"/></svg><a href="mailto:contact@dlyr-vr.com" style="text-decoration:underline">contact@dlyr-vr.com</a></p>
            <p><a href="https://g.page/r/CbReluTUYyljEBM/review" target="_blank" rel="noopener" style="text-decoration:underline;font-weight:bold;color:var(--lime)">Laissez-nous un avis ⭐</a></p>
            <div class="footer__followlabel">Follow us !</div>
            <div class="footer__social">
              <a href="${SOCIAL.tiktok}" target="_blank" rel="noopener" aria-label="TikTok">${ICONS.tiktok}</a>
              <a href="${SOCIAL.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${ICONS.facebook}</a>
              <a href="${SOCIAL.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${ICONS.instagram}</a>
              <a href="${SOCIAL.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${ICONS.linkedin}</a>
            </div>
          </div>
          ${col('Activités', [['Expériences','catalogue.html'],['Fléchettes','flechettes.html'],['Arcade','arcade.html'],['Karaoké','karaoke.html']])}
          ${col('Mentions légales', [['Politique de confidentialité','politique-confidentialite.html'],['Mentions légales','mentions-legales.html'],['CGV','cgv.html'],['Gérer les cookies','#gerer-cookies']])}
          ${col('Plan du site', [['Accueil','index.html'],['Expériences','catalogue.html'],['Activités','activites.html'],['Évènements','evenements.html'],['Entreprises','entreprises.html'],['Offrir','offrir.html'],['Bar&Snack','snack-bar.html'],['FAQ','faq.html'],['Contact','contact.html']])}
        </div>
      </div>
      <div class="footer__word" aria-hidden="true"><img src="${prefix}uploads/brand/logo-noir.png" alt=""></div>
      <div class="footer__bar">© D'LYR — Vivez l'immersion VR · Colombes</div>
    </footer>`;
  }

  /* ---------- Rondelles de bois sur fonds sauge (positions/tailles pseudo-aléatoires stables) ---------- */
  function woodRings() {
    const els = document.querySelectorAll('.bg-paper, .phero, .footer');
    let seed = 7 + location.pathname.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const rnd = (min, max) => { seed = (seed * 16807) % 2147483647; return min + (seed / 2147483647) * (max - min); };
    els.forEach(el => {
      el.classList.add('tex');
      el.style.setProperty('--b1x', rnd(-12, 28).toFixed(1) + '%');
      el.style.setProperty('--b1y', rnd(-15, 45).toFixed(1) + '%');
      el.style.setProperty('--b1s', Math.round(rnd(160, 380)) + 'px');
      el.style.setProperty('--b2x', rnd(75, 112).toFixed(1) + '%');
      el.style.setProperty('--b2y', rnd(55, 112).toFixed(1) + '%');
      el.style.setProperty('--b2s', Math.round(rnd(260, 560)) + 'px');
      el.style.setProperty('--b3x', rnd(35, 75).toFixed(1) + '%');
      el.style.setProperty('--b3y', rnd(-18, 25).toFixed(1) + '%');
      el.style.setProperty('--b3s', Math.round(rnd(120, 300)) + 'px');
      el.style.setProperty('--b4x', rnd(0, 45).toFixed(1) + '%');
      el.style.setProperty('--b4y', rnd(70, 115).toFixed(1) + '%');
      el.style.setProperty('--b4s', Math.round(rnd(140, 340)) + 'px');
    });
  }

  /* ---------- Scroll reveal ---------- */
  function reveal() {
    const root = document.documentElement;
    const els = Array.prototype.slice.call(document.querySelectorAll('.reveal:not(.in)'));
    const vh = () => window.innerHeight || document.documentElement.clientHeight;
    function check() {
      for (let i = els.length - 1; i >= 0; i--) {
        const e = els[i];
        const r = e.getBoundingClientRect();
        if (r.top < vh() * 0.94 && r.bottom > -40) { e.classList.add('in'); els.splice(i, 1); }
      }
      if (!els.length) { window.removeEventListener('scroll', check); window.removeEventListener('resize', check); }
    }
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    check();
    requestAnimationFrame(check);
    setTimeout(check, 300);

    // Failsafe : si la timeline d'animation ne progresse pas (environnements
    // de rendu throttlés), on force l'affichage de tout après un court délai.
    function forceIfStuck() {
      const probe = document.querySelector('.reveal.in');
      if (!probe) { setTimeout(forceIfStuck, 200); return; }
      const anims = probe.getAnimations ? probe.getAnimations() : [];
      const progressing = anims.some(a => a.currentTime && a.currentTime > 0);
      if (!progressing && getComputedStyle(probe).opacity === '0') {
        root.classList.add('force-show');
      }
    }
    setTimeout(forceIfStuck, 250);
    // Filet ultime : tout devient visible au plus tard à 1,2 s.
    setTimeout(() => { document.querySelectorAll('.reveal').forEach(e => e.classList.add('in')); }, 1200);
  }
  window.DLYR_reveal = reveal;

  /* ---------- Swipe tactile (carrousels) ----------
     DLYR_swipe(el, { left, right }) : left = geste vers la gauche (slide suivante). */
  window.DLYR_swipe = function (el, cb) {
    if (!el) return;
    let x0 = 0, y0 = 0, t0 = 0, tracking = false;
    el.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      x0 = t.clientX; y0 = t.clientY; t0 = Date.now(); tracking = true;
    }, { passive: true });
    el.addEventListener('touchend', (e) => {
      if (!tracking) return; tracking = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - x0, dy = t.clientY - y0;
      if (Date.now() - t0 > 700) return;                 // trop lent = pas un swipe
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.2) return; // geste vertical = scroll
      if (dx < 0) cb.left && cb.left(); else cb.right && cb.right();
    }, { passive: true });
  };

  /* ---------- Marquees : duplique le contenu pour boucle continue ---------- */
  function marquees() {
    document.querySelectorAll('.marquee__track').forEach(tr => {
      if (tr.dataset.cloned) return;
      tr.dataset.cloned = '1';
      const container = tr.parentElement;
      const unit = tr.innerHTML;
      // Répète le motif de base jusqu'à ce qu'une "moitié" remplisse largement l'écran,
      // puis duplique le tout : les deux moitiés identiques donnent une boucle sans raccord.
      let half = unit;
      tr.innerHTML = half;
      let guard = 0;
      while (tr.scrollWidth < container.offsetWidth + 100 && guard < 40) {
        half += unit;
        tr.innerHTML = half;
        guard++;
      }
      tr.innerHTML = half + half;
    });
  }

  /* ============================================================
     Réservation — widget Smeetz
     ============================================================
     Un produit Smeetz par jeu. Pour ajouter un jeu : copier une
     entrée ci-dessous en reprenant productId / codes / cats fournis
     par Smeetz (Embed code du produit).
     Les pages sans produit configuré affichent le message d'attente. */
  var SMEETZ_GID = '19897';
  var SMEETZ_WID = '5696';

  var SMEETZ_PRODUCTS = {
    'jeu-brain-arena': {
      productId: '76840',
      wId: '5696',
      codes: 'M1GAXSNW,VTGRZERM,9FYJTSN6,JCS35DY7,CFQ4FUTQ,9NAAR2DK',
      cats: '161527,161528,161529,161530,161531,162411',
      grouptickets: '161527,161528,161529,161530,161531,162411'
    },
    'jeu-volcanic-warfare': {
      productId: '76836',
      wId: '5702',
      codes: '7ZN7QTLN,9EYV77ZG,R8J9LAFN,963UTFK2,S2NEFHFY,R3PL6MLA',
      cats: '161505,161506,161507,161508,161509,162435',
      grouptickets: '161505,161506,161507,161508,161509,162435'
    },
    'jeu-time-quest': {
      productId: '76844',
      codes: '1XNKDUDZ,AKFVPTCM,SGFWVCRM,EZV89MBD,ZV14GA5M',
      cats: '161577,161578,161579,161580,161581'
    },
    'jeu-quantum-dome-project': {
      productId: '76844',
      wId: '5701',
      codes: '1XNKDUDZ,AKFVPTCM,SGFWVCRM,EZV89MBD,ZV14GA5M,PASY7MTE',
      cats: '161577,161578,161579,161580,161581,162424',
      grouptickets: '161577,161578,161579,161580,161581,162424'
    },
    'jeu-titanic-le-reve-englouti': {
      productId: '76927',
      wId: '5728',
      codes: 'C3JZ8CKD,G12S499W,LXULSELA,UPM4NHNJ,2W22L8HQ,BJBS73JP',
      cats: '162281,162282,162283,162284,162285,162433',
      grouptickets: '162281,162282,162283,162284,162285,162433'
    },
    'jeu-versailles-les-jardins-disparus-du-roi-soleil': {
      productId: '76926',
      wId: '5727',
      codes: '1H7VEAEP,8J2MEYQV,PXDGHTT6,STRUAWHQ,CJ2GWPE2,F5SU884N',
      cats: '162271,162272,162273,162274,162275,162434',
      grouptickets: '162271,162272,162273,162274,162275,162434'
    },
    'jeu-gaudi-latelier-du-divin': {
      productId: '76843',
      wId: '5700',
      codes: 'Z3VTAVSP,TRXCH7QH,QTHQLW63,ZQTMBGHH,LUL8N73Y,P2YK3LM4',
      cats: '161569,161570,161571,161572,161573,162419',
      grouptickets: '161569,161570,161571,161572,161573,162419'
    },
    'jeu-snow-village': {
      productId: '76838',
      wId: '5699',
      codes: 'DHNL3T62,BXMEJGZT,VNCVZHHG,ZNMSBGF2,RD2T2LYF,U65Q4H33',
      cats: '161520,161521,161522,161523,161524,162432',
      grouptickets: '161520,161521,161522,161523,161524,162432'
    },
    'jeu-paradise-expedition': {
      productId: '76835',
      wId: '5698',
      codes: 'QZPVPZS7,M72Y7F4A,EX113SNJ,A79QDY3W,399NK1TT,V5LWKYHQ',
      cats: '161498,161499,161500,161501,161502,162423',
      grouptickets: '161498,161499,161500,161501,161502,162423'
    },
    'jeu-outbreak-lab': {
      productId: '76834',
      wId: '5695',
      codes: 'MCRD4MW5,KPBVEJDR,H68LXZ3X,MU84YMAJ,T7E5JVAB,B3KDK6TL',
      cats: '161493,161494,161495,161496,161497,162422',
      grouptickets: '161493,161494,161495,161496,161497,162422'
    },
    'jeu-icarus-station': {
      productId: '76837',
      wId: '5697',
      codes: 'NHYT93B7,LF8KAE68,VBH8FM5T,AQL6HKWS,WPX4M16T,P1ZK58GC',
      cats: '161513,161514,161515,161516,161517,162421',
      grouptickets: '161513,161514,161515,161516,161517,162421'
    },
    'jeu-harbor-siege': {
      productId: '75662',
      wId: '5694',
      codes: 'YTDM1D5P,44YF2JL1,KVQP12CW,L7EFY8RJ,7TUSP6DM,4GYYSYZ4',
      cats: '153187,161042,161043,161044,161045,162420',
      grouptickets: '153187,161042,161043,161044,161045,162420'
    },
    'flechettes': {
      productId: '76883',
      wId: '5721'
    },
    'activites': {
      productId: '76883',
      wId: '5721'
    },
    'offrir': {
      productId: '76867',
      wId: '5722'
    },
    'catalogue': {
      productId: '76933',
      codes: '162309,162310,162311',
      cats: '162309,162310,162311'
    },
    'soiree-decouverte': {
      productId: '77464',
      wId: '6155',
      codes: '180706',
      cats: '180706',
      grouptickets: '180706'
    }
  };

  // Permet l'accès direct aux produits avec ou sans préfixe 'jeu-'
  Object.keys(SMEETZ_PRODUCTS).forEach(function (k) {
    if (k.indexOf('jeu-') === 0) {
      var shortKey = k.replace(/^jeu-/, '');
      if (!SMEETZ_PRODUCTS[shortKey]) SMEETZ_PRODUCTS[shortKey] = SMEETZ_PRODUCTS[k];
    } else {
      var longKey = 'jeu-' + k;
      if (!SMEETZ_PRODUCTS[longKey]) SMEETZ_PRODUCTS[longKey] = SMEETZ_PRODUCTS[k];
    }
  });

  function smeetzLoad() {
    if (window._smtz) return;
    var w = window, d = document;
    var p = w._smtz = function () { p.p ? p.p.apply(p, arguments) : p.q.push(arguments); };
    p.q = []; p.t = 1 * new Date(); p.g = SMEETZ_GID;
    var r = d.createElement('script');
    r.async = 1;
    r.src = 'https://tracker.smeetz.com/smeetz-main-widget.js';
    var s = d.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(r, s);
  }

  // Pré-chargement silencieux dès l'initialisation de la page
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', smeetzLoad);
  } else {
    smeetzLoad();
  }

  function currentProduct() {
    var raw = (document.body && document.body.getAttribute('data-game')) ||
              (location.pathname.split('/').filter(Boolean).pop() || '').replace(/\.html?$/i, '');
    var slug = (raw || '').trim();
    if (!slug) return null;
    return SMEETZ_PRODUCTS[slug] ||
           SMEETZ_PRODUCTS['jeu-' + slug] ||
           SMEETZ_PRODUCTS[slug.replace(/^jeu-/, '')] ||
           null;
  }

  function smeetzOpen(prod) {
    smeetzLoad();
    if (!prod) return;
    var opts = {
      lightbox: true,
      listView: false,
      gId: SMEETZ_GID
    };
    if (prod.productId) opts.productId = prod.productId;
    if (prod.wId) opts.wId = prod.wId;
    if (prod.widgetId) opts.wId = prod.widgetId;
    if (prod.cats) opts.cats = prod.cats;
    if (prod.codes) opts.codes = prod.codes;
    if (prod.grouptickets || prod.cats) opts.grouptickets = prod.grouptickets || prod.cats;
    if (prod.listView !== undefined) opts.listView = prod.listView;
    opts.lang = document.documentElement.lang || 'fr';

    window._smtz('openwidget', 1 * new Date(), opts);
  }

  function reserve() {
    /* Réservation directe : les boutons « Réserver » de la page mènent à l'application D'LYR */
    var direct = directBookUrl();
    if (direct) {
      document.querySelectorAll('a[href="#reserver"]').forEach(function (a) { a.setAttribute('href', direct); });
      document.addEventListener('click', function (e) {
        var a = e.target.closest('a[href="#reserver"], a[href="' + direct + '"], [data-smeetz-open]');
        if (!a) return;
        window.DLYR_track('InitiateCheckout', { content_name: pageSlug() });
        if (a.getAttribute('href') !== direct) { e.preventDefault(); location.href = direct; }
      });
      return;
    }
    /* Pass VR et bon cadeau : ces boutons mènent à l'application D'LYR */
    document.querySelectorAll('a[href="#reserver"], a[data-smeetz-cat]').forEach(function (a) {
      var u = buttonBookUrl(a);
      if (u) a.setAttribute('href', u);
    });
    /* Accueil et menu : « Offrir » mène à la page Offrir (montants suggérés), qui mène ensuite au paiement du bon cadeau */
    var prod = currentProduct();
    smeetzLoad();
    document.addEventListener('click', (e) => {
      /* Page à billetterie propre : le lien s'ouvre normalement, on suit juste le clic */
      var bookUrl = document.body && document.body.dataset.bookUrl;
      if (bookUrl) {
        if (e.target.closest('a[href="' + bookUrl + '"]')) {
          window.DLYR_track('InitiateCheckout', { content_name: document.body.getAttribute('data-game') || '' });
        }
        return;
      }
      var d = e.target.closest('a[href^="' + PACK_BASE + '"], a[href="' + GIFT_URL + '"]');
      if (d) { window.DLYR_track('InitiateCheckout', { content_name: pageSlug() }); return; }
      const a = e.target.closest('a[href="#reserver"], [data-smeetz-open]');
      if (!a) return;
      var u = buttonBookUrl(a);
      if (u) {
        e.preventDefault();
        window.DLYR_track('InitiateCheckout', { content_name: pageSlug() });
        location.href = u;
        return;
      }
      var p = currentProduct();
      if (p) {
        e.preventDefault();
        var cat = a.getAttribute('data-smeetz-cat');
        if (cat) {
          p = Object.assign({}, p, {
            cats: cat,
            codes: cat,
            grouptickets: cat,
            listView: false
          });
        }
        window.DLYR_track('InitiateCheckout', { content_name: (document.body.getAttribute('data-game') || location.pathname.split('/').pop() || '').replace(/\.html?$/i, '') });
        smeetzOpen(p);
        return;
      }
      var target = document.getElementById('reserver');
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      e.preventDefault();
      location.href = 'catalogue.html';
    });
  }

  /* ============================================================
     Google Tag Manager — chargé UNIQUEMENT après consentement
     ============================================================ */
  var GTM_ID = 'GTM-P924MCGJ';

  function loadGTM() {
    if (window.__gtmLoaded) return;
    window.__gtmLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
    var f = document.getElementsByTagName('script')[0];
    var j = document.createElement('script');
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    f.parentNode.insertBefore(j, f);
  }

  /* ============================================================
     Microsoft Clarity — chargé UNIQUEMENT après consentement
     ============================================================ */
  var CLARITY_ID = 'y1sla4fh4d';

  function loadClarity() {
    if (window.__clarityLoaded) return;
    window.__clarityLoaded = true;
    window.clarity = window.clarity || function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    var t = document.createElement('script');
    t.async = true;
    t.src = 'https://www.clarity.ms/tag/' + CLARITY_ID;
    var y = document.getElementsByTagName('script')[0];
    y.parentNode.insertBefore(t, y);
  }

  /* ============================================================
     Pixel Meta (Facebook) — chargé UNIQUEMENT après consentement
     ============================================================ */
  var META_PIXEL_IDS = ['1443068404365497', '1855618918965512'];

  function loadMetaPixel() {
    if (window.__metaPixelLoaded) return;
    window.__metaPixelLoaded = true;
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window,document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    META_PIXEL_IDS.forEach(function (id) { window.fbq('init', id); });
    window.fbq('track', 'PageView');
  }

  /* ============================================================
     Google Ads (gtag.js) — chargé UNIQUEMENT après consentement
     ============================================================ */
  var GOOGLE_ADS_ID = 'AW-18466204211';
  // Libellés des actions de conversion (partie après « AW-18466204211/ »)
  var GOOGLE_ADS_ITINERAIRE = 'STvZCOL457MdELPUr-VE';
  var GOOGLE_ADS_RESERVER = 'sGclCJLQvLQdELPUr-VE'; // clic sur « Réserver »

  // Envoie une conversion Google Ads ; sans consentement (tag non chargé) ou sans libellé, ne fait rien.
  function adsConversion(label) {
    if (!label || !window.__googleAdsLoaded || !window.gtag) return;
    window.gtag('event', 'conversion', { send_to: GOOGLE_ADS_ID + '/' + label, transport_type: 'beacon' });
  }

  function loadGoogleAds() {
    if (window.__googleAdsLoaded) return;
    window.__googleAdsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GOOGLE_ADS_ID);
    var t = document.createElement('script');
    t.async = true;
    t.src = 'https://www.googletagmanager.com/gtag/js?id=' + GOOGLE_ADS_ID;
    var y = document.getElementsByTagName('script')[0];
    y.parentNode.insertBefore(t, y);
  }

  // Évènement de conversion Meta : sans consentement (pixel non chargé), ne fait rien.
  // « InitiateCheckout » (clic sur un bouton de réservation) part aussi vers Google Ads.
  window.DLYR_track = function (ev, params) {
    if (window.__metaPixelLoaded && window.fbq) window.fbq('track', ev, params || {});
    if (ev === 'InitiateCheckout') adsConversion(GOOGLE_ADS_RESERVER);
  };

  function analytics() {
    var KEY = 'dlyr_cookie_consent';
    try {
      if (localStorage.getItem(KEY) === 'accepted') { loadGTM(); loadGoogleAds(); loadClarity(); loadMetaPixel(); }
    } catch (e) {}
    window.addEventListener('dlyr:consent', function (e) {
      if (e.detail === 'accepted') { loadGTM(); loadGoogleAds(); loadClarity(); loadMetaPixel(); }
    });
    // Clic sur un lien téléphone ou mail → évènement « Contact »
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="tel:"], a[href^="mailto:"]');
      if (a) window.DLYR_track('Contact');
    });
    // Clic sur l'adresse (itinéraire Google Maps) → conversion Google Ads « Itinéraire »
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[data-itineraire]');
      if (a) adsConversion(GOOGLE_ADS_ITINERAIRE);
    });
  }

  /* ---------- Bandeau cookies (RGPD) ---------- */
  function cookies() {
    var KEY = 'dlyr_cookie_consent';
    try { if (localStorage.getItem(KEY)) return; } catch (e) { return; }
    var b = document.createElement('div');
    b.className = 'cookiebar';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Gestion des cookies');
    b.innerHTML =
      '<div class="cookiebar__txt"><strong>Cookies &amp; confidentialit\u00e9</strong>' +
      'Nous utilisons des cookies pour le bon fonctionnement du site et, avec votre accord, pour mesurer son audience (Microsoft Clarity) et vous proposer des publicités adaptées (Meta). ' +
      '<a href="politique-confidentialite.html#cookies">En savoir plus</a></div>' +
      '<div class="cookiebar__btns">' +
      '<button class="btn btn--lime btn--sm" data-cc="accepted">Tout accepter</button>' +
      '<button class="btn btn--paper-o btn--sm" data-cc="refused">Continuer sans accepter</button>' +
      '</div>';
    b.addEventListener('click', function (e) {
      var t = e.target.closest('[data-cc]');
      if (!t) return;
      try { localStorage.setItem(KEY, t.dataset.cc); } catch (err) {}
      window.dispatchEvent(new CustomEvent('dlyr:consent', { detail: t.dataset.cc }));
      b.classList.remove('cookiebar--in');
      setTimeout(function () { b.remove(); }, 400);
    });
    document.body.appendChild(b);
    setTimeout(function () { b.classList.add('cookiebar--in'); }, 80);
    // Failsafe : si la transition ne progresse pas (environnement throttlé), on force la position finale.
    setTimeout(function () {
      if (getComputedStyle(b).transform.indexOf('matrix') !== -1 && b.getBoundingClientRect().top > window.innerHeight) {
        b.style.transition = 'none';
        b.classList.add('cookiebar--in');
        b.style.transform = 'translate(-50%,0)';
      }
    }, 900);
  }

  /* ---------- « Gérer les cookies » (pied de page) : retrait / modification du consentement ---------- */
  function cookieSettings() {
    var KEY = 'dlyr_cookie_consent';
    // Cookies posés par GTM/Google, Clarity et le pixel Meta
    var TRACKERS = /^(_ga|_gid|_gat|_gcl|_clck|_clsk|_fbp|_fbc)/;
    function clearTrackers() {
      var host = location.hostname, parts = host.split('.');
      var domains = ['', host, '.' + host];
      if (parts.length > 2) domains.push('.' + parts.slice(-2).join('.'));
      document.cookie.split(';').forEach(function (c) {
        var name = c.split('=')[0].trim();
        if (!TRACKERS.test(name)) return;
        domains.forEach(function (d) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
        });
      });
    }
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href="#gerer-cookies"]');
      if (!a) return;
      e.preventDefault();
      var prev = null;
      try { prev = localStorage.getItem(KEY); localStorage.removeItem(KEY); } catch (err) { return; }
      if (document.querySelector('.cookiebar')) return;
      window.addEventListener('dlyr:consent', function (ev) {
        // Accord retiré : on efface les cookies de mesure/publicité et on recharge
        // pour couper les scripts déjà chargés sur cette page.
        if (prev === 'accepted' && ev.detail === 'refused') { clearTrackers(); setTimeout(function () { location.reload(); }, 450); }
      }, { once: true });
      cookies();
    });
  }

  /* ---------- Toast léger ---------- */
  function toastInit() {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;left:50%;bottom:28px;transform:translate(-50%,140%);z-index:200;background:#d4bc72;color:#1c3024;font-family:Barlow,sans-serif;font-weight:700;font-size:18px;padding:14px 26px;border-radius:14px;box-shadow:0 12px 30px rgba(0,0,0,.3);transition:transform .4s cubic-bezier(.6,0,.2,1);max-width:90vw;text-align:center';
    document.body.appendChild(t);
    let to;
    window.DLYR_toast = (msg) => {
      t.textContent = msg; t.style.transform = 'translate(-50%,0)';
      clearTimeout(to); to = setTimeout(() => t.style.transform = 'translate(-50%,140%)', 2800);
    };
  }

  /* ---------- Section "Où nous trouver" (réutilisable) ---------- */
  function buildMaps() {
    const mount = document.querySelector('[data-maps]');
    if (!mount) return;
    mount.outerHTML = `
    <section class="section bg-paper tex pmaps" id="ounoustrouver">
      <div class="wrap">
        <h2 class="h1 pmaps__h">Où nous trouver ?</h2>
        <div class="pmaps__layout reveal">
          <div class="ph pmaps__map map-embed"><iframe src="https://www.google.com/maps?q=1+Boulevard+Charles+de+Gaulle+92700+Colombes&output=embed&hl=fr" title="Carte — D'LYR, 1 Bd Charles de Gaulle, Colombes" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>
          <div class="pmaps__card">
            <h3 class="h3">Horaires d'ouverture</h3>
            <p class="pmaps__line">${ICONS.pin} <a href="https://www.google.com/maps/dir/?api=1&destination=1+Boulevard+Charles+de+Gaulle+92700+Colombes" target="_blank" rel="noopener" data-itineraire>1 Bd Charles de Gaulle, 92700 Colombes – Hall A - Rez de Jardin</a></p>
            <p class="pmaps__line">${ICONS.clock} 7j/7 · Lun–Ven 11h–22h30 · Sam. 10h–23h · Dim. 10h–20h</p>
            <hr class="pmaps__rule">
            <h3 class="h3">Comment s'y rendre ?</h3>
            <div class="pmaps__how">
              <p><strong>En métro&nbsp;:</strong> Ligne T2 — arrêt Charlebourg, à 5 min à pied.</p>
              <p><strong>En bus&nbsp;:</strong> Lignes 167 / 366 — arrêt Charles de Gaulle.</p>
              <p><strong>En voiture&nbsp;:</strong> Parking Q-Park à 300m — tarif négocié. <a href="http://www.q-park.fr/dlyr-vr" target="_blank" rel="noopener" style="text-decoration:underline">Réservez votre place ici</a>. Accès A86.</p>
            </div>
            <a class="btn btn--ink" href="mailto:contact@dlyr-vr.com?subject=${encodeURIComponent("Contact D'LYR")}" style="align-self:flex-start;margin-top:8px">Nous contacter</a>
          </div>
        </div>
      </div>
    </section>`;
  }

  /* ---------- Teaser Snack Bar (réutilisable) ---------- */
  function buildSnackTeaser() {
    const mount = document.querySelector('[data-snack-teaser]');
    if (!mount) return;
    mount.outerHTML = `
    <section class="section bg-paper tex">
      <div class="wrap">
        <h2 class="h1 eyebrow-bar" style="margin-bottom:clamp(36px,4vw,56px)"><span>Bar&amp;Snack</span></h2>
        <div class="steaser__grid reveal">
          <div class="ph steaser__media steaser__media--tall"><img class="ph__img" loading="lazy" src="${prefix}uploads/lieu/lounge-ecran.jpg" alt="Le bar de D'LYR"></div>
          <div class="ph steaser__media"><img class="ph__img" src="${prefix}uploads/lieu/lounge-arbre-2.jpg" alt="L'espace lounge avec arbre central chez D'LYR"></div>
          <div class="ph steaser__media"><img class="ph__img" loading="lazy" src="${prefix}uploads/lieu/bar-snack.jpg" alt="L'espace bar & snack"></div>
        </div>
        <div class="steaser__foot reveal"><a class="btn btn--ink-o" href="snack-bar.html">Voir la carte</a></div>
      </div>
    </section>`;
  }

  /* ---------- Lightbox images ---------- */
  function lightboxInit() {
    const imgs = [...document.querySelectorAll('[data-lightbox="true"]')]
      .filter(el => !el.closest('[data-video]') && !el.closest('a'));
    if (!imgs.length) return;
    const ov = document.createElement('div');
    ov.className = 'lightbox';
    ov.innerHTML = '<button class="lightbox__close" aria-label="Fermer">×</button><img class="lightbox__img" alt="">';
    document.body.appendChild(ov);
    const im = ov.querySelector('.lightbox__img');
    function close() { ov.classList.remove('on'); document.body.style.overflow = ''; }
    imgs.forEach(el => {
      el.classList.add('is-zoomable');
      el.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        im.src = el.currentSrc || el.src; im.alt = el.alt || '';
        ov.classList.add('on'); document.body.style.overflow = 'hidden';
      });
    });
    ov.addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  function init() {
    [buildNav, buildFooter, buildMaps, buildSnackTeaser, toastInit, reserve, marquees, cookies, cookieSettings, analytics, lightboxInit, woodRings].forEach(fn => {
      try { fn(); } catch (e) { console.warn('[DLYR]', fn.name, e); }
    });
    try { reveal(); } catch (e) { console.warn('[DLYR] reveal', e); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  window.addEventListener('load', () => { try { reveal(); } catch (e) {} });
})();
/* ==========================================================================
   D'LYR — LE SITE SUIT L'APPLICATION
                                                            (11/11/2026)

   À COLLER À LA FIN DE js/site.js, dans le dépôt du SITE (dlyr-vr.com).

   ⚠ APRÈS LA TOUTE DERNIÈRE LIGNE DU FICHIER, qui est exactement :

         })();

   Tout le fichier existant est enfermé dans cette parenthèse. Collé à
   l'intérieur, ce bloc verrait des choses qui ne le regardent pas ;
   collé après, il est indépendant — et il suffit de le retirer pour
   revenir en arrière. Rien d'autre n'est à modifier au-dessus.

   ────────────────────────────────────────────────────────────────────
   LE PROBLÈME
     Le site tenait sa propre liste d'expériences, écrite en dur plus
     haut dans ce fichier (la table BOOK_EXP). L'application en tenait
     une autre. Deux listes veut dire deux vérités, et la deuxième finit
     toujours par mentir : « Gaudi L'atelier du Divin » était désactivée
     dans l'application depuis des semaines alors que le site la
     proposait encore à la réservation.

   CE QUE FAIT CE BLOC
     Il demande à l'application la liste des expériences, et il ajuste la
     page en conséquence :

       · une expérience désactivée disparaît des cartes et des listes ;
       · sa page de présentation RESTE EN LIGNE, avec son adresse et son
         contenu — mais sans bouton « Réserver » ;
       · la durée et l'effectif affichés viennent de l'application ;
       · le synopsis et le résumé Google aussi, dès qu'ils y sont saisis ;
       · une expérience nouvelle apparaît dans le catalogue, avec son
         affiche, sans que personne n'ait à toucher au site.

   ⚠ CE QU'IL NE FAIT PAS, ET C'EST VOLONTAIRE
     Il ne fabrique pas de page de présentation. Un synopsis, des photos
     et un texte de référencement s'écrivent ; ils ne se déduisent pas
     d'une fiche de base de données. Une expérience nouvelle a donc sa
     carte dans le catalogue, et cette carte mène directement à la
     réservation tant que sa page n'est pas écrite.

   ⚠ SI L'APPLICATION NE RÉPOND PAS, LE SITE NE CHANGE PAS.
     Pas de page blanche, pas de catalogue vide : on s'abstient, et le
     visiteur voit le site tel qu'il est écrit dans les fichiers. Une
     panne de lecture ne doit jamais devenir une panne de vitrine.

   RETOUR ARRIÈRE : supprimer ce bloc. Le site redevient exactement ce
   qu'il était, puisque rien d'autre n'a été modifié.
   ========================================================================== */

(function () {
  'use strict';

  var SOURCE = 'https://yeuvlnlkkonxstkgdrxf.supabase.co/functions/v1/experiences-publiques';

  /*  L'adresse de réservation n'est PAS recopiée ici : site.js l'expose
      déjà sous window.DLYR_BOOK (c'est par là que la page « Réserver par
      date » la récupère). On la lui emprunte, pour que le jour où elle
      change, elle ne change qu'à un endroit. La valeur de repli ne sert
      que si ce bloc se retrouvait seul, sans le fichier qui le précède. */
  var RESERVER = (function () {
    try { return (window.DLYR_BOOK && window.DLYR_BOOK.base) || ''; } catch (e) { return ''; }
  })() || 'https://admin.dlyr-vr.com/?client=1&exp=';

  var CATALOGUE = 'catalogue.html';
  var DELAI    = 4000;                  //  au-delà, on renonce sans rien casser
  var MEMOIRE  = 'dlyr-experiences';    //  la dernière réponse, pour éviter le clignotement

  // =====================================================================
  //  OUTILS
  // =====================================================================
  /*  Le nom de page, c'est le nom du fichier sans .html :
        « jeu-harbor-siege.html?x#y »  → « jeu-harbor-siege »
        « /flechettes »                → « flechettes »
      C'est la clé qui relie une carte du site à une ligne de
      l'application (colonne slug_site). On ne se fie pas au préfixe
      « jeu- » : les fléchettes ont une page qui ne le porte pas. */
  function nomDePage(adresse) {
    if (!adresse) return '';
    var a = String(adresse).split('#')[0].split('?')[0];
    if (/^https?:/i.test(a)) {
      try { a = new URL(a).pathname; } catch (e) { /* on garde a tel quel */ }
    }
    a = a.substring(a.lastIndexOf('/') + 1);
    return a.replace(/\.html?$/i, '').toLowerCase();
  }

  /*  ⚠ DEUX FAÇONS DE RECONNAÎTRE UNE EXPÉRIENCE DANS UN LIEN, ET IL EN
      FAUT DEUX.

      En production, une carte du catalogue mène à sa page :
          jeu-harbor-siege.html
      En préprod, elle mène directement à la réservation :
          https://admin.dlyr-vr.com/?client=1&exp=harbor

      J'avais écrit ce bloc sur la première forme seulement, et sur la
      préprod il ne reconnaissait plus une seule carte : rien n'était
      masqué, rien n'était corrigé, en silence. On lit donc aussi le code
      de l'expérience dans l'adresse — et celui-là ne dépend d'aucune
      convention de nommage de page. */
  function codeDuLien(adresse) {
    if (!adresse) return '';
    var m = /[?&]exp=([^&#]+)/.exec(String(adresse));
    if (!m) return '';
    try { return decodeURIComponent(m[1]).toLowerCase(); }
    catch (e) { return m[1].toLowerCase(); }
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function propre(s) { return String(s == null ? '' : s).trim().toLowerCase(); }

  // =====================================================================
  //  LA LECTURE
  //
  //  Deux temps : ce qu'on a retenu de la visite précédente, appliqué
  //  tout de suite, puis la réponse fraîche. Sans cela, le visiteur
  //  verrait les cartes s'afficher puis l'une d'elles disparaître — un
  //  clignotement qui donne l'impression d'un site qui bafouille.
  // =====================================================================
  function enMemoire() {
    try {
      var brut = sessionStorage.getItem(MEMOIRE);
      return brut ? JSON.parse(brut) : null;
    } catch (e) { return null; }
  }

  function retenir(liste) {
    try { sessionStorage.setItem(MEMOIRE, JSON.stringify(liste)); } catch (e) { /* rien */ }
  }

  function demander(suite) {
    var fini = false;
    var minuteur = setTimeout(function () {
      if (!fini) { fini = true; suite(null); }
    }, DELAI);

    try {
      fetch(SOURCE, { credentials: 'omit' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) {
          if (fini) return;
          fini = true; clearTimeout(minuteur);
          suite(d && d.ok && Array.isArray(d.experiences) ? d.experiences : null);
        })
        .catch(function () {
          if (fini) return;
          fini = true; clearTimeout(minuteur);
          suite(null);
        });
    } catch (e) {
      if (!fini) { fini = true; clearTimeout(minuteur); suite(null); }
    }
  }

  // =====================================================================
  //  MASQUER CE QUI N'EST PLUS PROPOSÉ
  //
  //  ⚠ ON MASQUE, ON NE SUPPRIME PAS.
  //    La mémoire d'onglet peut être en retard d'une minute sur
  //    l'application : si elle annonce une expérience désactivée qui
  //    vient d'être réactivée, il faut pouvoir la faire RÉAPPARAÎTRE
  //    quand la réponse fraîche arrive. Une carte supprimée du document
  //    ne reviendrait pas.
  // =====================================================================
  var MARQUE = 'data-dlyr-masque';

  function carteDe(lien) {
    //  Les deux formes de cartes du site, puis les conteneurs ordinaires.
    if (lien.classList.contains('xcard') || lien.classList.contains('jcard')) return lien;
    return lien.closest('.xcard, .jcard, article, li') || lien;
  }

  function masquer(el) {
    if (el.getAttribute(MARQUE)) return;
    //  On note l'affichage d'origine : certaines cartes sont en flex ou
    //  en grid, et leur rendre « block » les déformerait au retour.
    el.setAttribute(MARQUE, el.style.display || '');
    el.style.display = 'none';
  }

  function demasquer(el) {
    if (!el.hasAttribute(MARQUE)) return;
    el.style.display = el.getAttribute(MARQUE);
    el.removeAttribute(MARQUE);
  }

  /*  L'expérience désignée par un lien, par sa page ou par son code. */
  function expDuLien(connues, href) {
    var p = nomDePage(href);
    if (p && connues.pages[p]) return connues.pages[p];
    var c = codeDuLien(href);
    if (c && connues.codes[c]) return connues.codes[c];
    return null;
  }

  function ajusterLiens(connues) {
    var liens = document.querySelectorAll('a[href]');
    for (var i = 0; i < liens.length; i++) {
      var e = expDuLien(connues, liens[i].getAttribute('href'));
      if (!e) continue;                       //  lien inconnu : on n'y touche pas
      var carte = carteDe(liens[i]);
      if (e.actif) demasquer(carte); else masquer(carte);
    }
  }

  // =====================================================================
  //  LA DURÉE ET L'EFFECTIF, PRIS DANS L'APPLICATION
  //
  //  Ce sont des FAITS, et ils changent : une séance qui passe de 30 à
  //  45 minutes, une expérience qui accepte deux joueurs de plus. Une
  //  durée fausse sur le site, c'est un client qui organise sa soirée
  //  de travers.
  //
  //  ⚠ LE GENRE ET L'AFFICHE, EUX, RESTENT CEUX DU SITE. Ce n'est pas un
  //    oubli, c'est une mesure :
  //
  //      · le genre du site appartient à un vocabulaire fermé de six
  //        catégories — Action, Aventure, Escape Game, Quiz, Culturel,
  //        Adapté aux enfants. Ce sont les boutons de filtre du
  //        catalogue, et la couleur de chaque étiquette. L'application,
  //        elle, écrit « Action tactique » ou « Enfants & Familles
  //        (Mode Family) » : du texte libre. Le recopier casserait les
  //        filtres et décolorerait les cartes ;
  //
  //      · les affiches de l'application sont réduites à 380 px de large
  //        au moment où vous les déposez (c'est fait pour le tunnel de
  //        réservation). Celles du site mesurent 768 à 1086 px. Mêmes
  //        images, deux usages — prendre les petites dégraderait le
  //        catalogue sur un grand écran.
  // =====================================================================
  function texteFinal(span, valeur) {
    //  Chaque case contient un pictogramme puis du texte : on ne remplace
    //  que le texte, sinon le pictogramme disparaît.
    for (var i = span.childNodes.length - 1; i >= 0; i--) {
      if (span.childNodes[i].nodeType === 3) {       //  nœud de texte
        span.childNodes[i].nodeValue = ' ' + valeur;
        return true;
      }
    }
    return false;
  }

  function rafraichirCartes(connues) {
    var cartes = document.querySelectorAll('a.xcard, a.jcard');
    for (var i = 0; i < cartes.length; i++) {
      var e = expDuLien(connues, cartes[i].getAttribute('href'));
      if (!e || !e.actif) continue;
      var cases = cartes[i].querySelectorAll('.xcard__meta span');
      if (cases.length >= 1 && e.duree) texteFinal(cases[0], e.duree + ' min');
      if (cases.length >= 2 && e.mini && e.maxi) {
        texteFinal(cases[1], e.mini + ' à ' + e.maxi + ' joueurs');
      }
    }
  }

  // =====================================================================
  //  LA PAGE D'UNE EXPÉRIENCE DÉSACTIVÉE
  //
  //  Elle reste en ligne, avec son adresse, son synopsis et ses images.
  //  C'est un choix de fond : Google a mis des mois à référencer cette
  //  page, et une expérience désactivée en novembre peut revenir en
  //  mars. Une page supprimée, elle, recommence de zéro.
  //
  //  Ce qui disparaît, c'est la possibilité de réserver quelque chose
  //  qui n'existe plus — et elle doit disparaître partout, y compris
  //  dans le bouton du menu, qui pointe lui aussi sur cette expérience.
  // =====================================================================
  function neutraliserLaPage(exp) {
    if (document.querySelector('[data-dlyr-indispo]')) return;

    var boutons = document.querySelectorAll('a[href^="' + RESERVER + '"], a[href*="admin.dlyr-vr.com"]');
    for (var i = 0; i < boutons.length; i++) {
      var a = boutons[i];
      if (!/exp=/.test(a.getAttribute('href') || '')) continue;

      var dansLeMenu = !!a.closest('.nav__cta, .drawer__cta');
      /*  ⚠ ON REMPLACE L'ÉLÉMENT, ON NE RÉÉCRIT PAS SON ADRESSE.
          Plus haut dans ce fichier, un écouteur de clic rattrape les
          liens de réservation et force la destination « directe » même
          si l'adresse a changé. Changer le href ne suffirait donc pas :
          le clic partirait quand même vers la réservation. En
          remplaçant le lien par un autre élément, il n'y a plus rien à
          rattraper. */
      var neuf;
      if (dansLeMenu) {
        //  Dans le menu, « Réserver » doit rester utile : il mène au
        //  catalogue, où le visiteur trouvera ce qui est jouable.
        neuf = document.createElement('a');
        neuf.className = a.className;
        neuf.href = CATALOGUE;
        neuf.textContent = 'Voir le catalogue';
      } else {
        //  Sur la page elle-même, un bouton qui ne mène nulle part est
        //  pire qu'un bouton absent : on le remplace par une mention.
        neuf = document.createElement('span');
        neuf.className = a.className;
        neuf.setAttribute('aria-disabled', 'true');
        neuf.style.opacity = '.55';
        neuf.style.cursor = 'not-allowed';
        neuf.textContent = 'Momentanément indisponible';
      }
      neuf.setAttribute('data-dlyr-indispo', '1');
      a.parentNode.replaceChild(neuf, a);
    }

    /*  ⚠ ET LES BOUTONS QUI N'ONT PAS D'ADRESSE.
        site.js rattrape aussi les éléments marqués « data-smeetz-open »
        et les envoie vers la réservation par un écouteur de clic — il
        n'y a donc rien à voir dans leur adresse, et les retirer de la
        liste ci-dessus ne suffirait pas. On enlève la marque : sans
        elle, l'écouteur ne les reconnaît plus. */
    var marques = document.querySelectorAll('[data-smeetz-open]');
    for (var m = 0; m < marques.length; m++) {
      marques[m].removeAttribute('data-smeetz-open');
      marques[m].setAttribute('data-dlyr-indispo', '1');
      marques[m].setAttribute('aria-disabled', 'true');
      marques[m].style.opacity = '.55';
      marques[m].style.cursor = 'not-allowed';
    }

    //  Et on le dit en toutes lettres, sous le titre : un bouton grisé
    //  sans explication laisse croire à une panne du site.
    var titre = document.querySelector('h1');
    if (titre && !document.querySelector('[data-dlyr-mot]')) {
      var mot = document.createElement('p');
      mot.setAttribute('data-dlyr-mot', '1');
      mot.setAttribute('style', 'margin:10px 0 0;font-size:15px;opacity:.9;');
      mot.textContent = esc(exp.nom) + ' n’est pas proposée en ce moment. '
        + 'Retrouvez toutes les expériences disponibles au catalogue.';
      titre.parentNode.insertBefore(mot, titre.nextSibling);
    }
  }

  // =====================================================================
  //  LES EXPÉRIENCES QUE LE SITE NE CONNAÎT PAS ENCORE
  //
  //  Une carte est fabriquée sur le modèle exact de celles du catalogue
  //  — mêmes classes, mêmes pictogrammes — pour qu'elle soit
  //  indiscernable des autres.
  //
  //  ⚠ ON NE DOUBLE JAMAIS UNE CARTE EXISTANTE.
  //    Reconnaissance par la page d'abord, par le nom ensuite. Le jour
  //    où vous écrirez la page d'une expérience et ajouterez sa carte à
  //    la main, la carte fabriquée s'effacera d'elle-même : elle aura
  //    reconnu son nom dans le catalogue.
  // =====================================================================
  var HORLOGE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
    + '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>';
  var JOUEURS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
    + '<circle cx="9" cy="8" r="3"></circle><circle cx="17" cy="9" r="2.4"></circle>'
    + '<path d="M3.5 19a5.5 5.5 0 0 1 11 0M15 19a4.5 4.5 0 0 1 6 0"></path></svg>';

  function cartesExistantes() {
    var pages = {}, codes = {}, noms = {};
    var cartes = document.querySelectorAll('.cat__grid a.xcard');
    for (var i = 0; i < cartes.length; i++) {
      var h = cartes[i].getAttribute('href');
      var p = nomDePage(h), c = codeDuLien(h);
      if (p) pages[p] = true;
      if (c) codes[c] = true;
      var n = cartes[i].querySelector('.xcard__name');
      if (n) noms[propre(n.textContent)] = true;
    }
    return { pages: pages, codes: codes, noms: noms };
  }

  function fabriquerCarte(e) {
    var a = document.createElement('a');
    a.className = 'xcard reveal in';
    a.setAttribute('data-dlyr-carte', '1');
    //  Si la page de présentation existe, on y mène ; sinon, droit à la
    //  réservation. Un lien vers une page qui n'existe pas serait pire
    //  que pas de lien du tout.
    a.href = e.page ? (e.page + '.html') : (RESERVER + encodeURIComponent(e.id));

    var visuel = e.affiche
      ? '<div class="ph ph--dark"><img class="ph__img" loading="lazy" src="'
        + esc(SOURCE + '?affiche=' + encodeURIComponent(e.id)) + '" alt="' + esc(e.nom)
        + '" onerror="this.remove()"></div>'
      //  Sans affiche, un aplat de la couleur du jeu : une carte sans
      //  image est moins belle, une image cassée fait amateur.
      : '<div class="ph ph--dark" style="background:' + esc(e.couleur || '#1C3024') + '"></div>';

    a.innerHTML = visuel
      + '<span class="xcard__scrim"></span>'
      + '<div class="xcard__header"><div class="xcard__tags">'
      +   (e.genre ? '<span class="xcard__tag tag-genre" style="background:'
                     + esc(e.couleur || '#0e7490') + '">' + esc(e.genre) + '</span>' : '')
      +   (e.accroche ? '<span class="xcard__tag tag-type">' + esc(e.accroche) + '</span>' : '')
      + '</div></div>'
      + '<div class="xcard__footer" style="bottom:15%">'
      +   '<h3 class="xcard__name">' + esc(e.nom) + '</h3>'
      +   '<div class="xcard__meta">'
      +     '<span>' + HORLOGE + ' ' + esc(e.duree) + ' min</span>'
      +     '<span>' + JOUEURS + ' ' + esc(e.mini) + ' à ' + esc(e.maxi) + ' joueurs</span>'
      +   '</div>'
      + '</div>';
    return a;
  }

  function completerLeCatalogue(experiences) {
    var grille = document.querySelector('.cat__grid');
    if (!grille) return;                      //  on n'est pas sur le catalogue

    /*  ⚠ ON EFFACE NOS PROPRES CARTES AVANT DE REGARDER CE QUI EXISTE.
        Dans l'autre ordre, la carte fabriquée au premier passage se
        reconnaîtrait elle-même au second — et le catalogue perdrait la
        nouveauté dès que la réponse fraîche arriverait. Attrapé par le
        banc, qui applique la liste deux fois de suite exprès. */
    var vieilles = grille.querySelectorAll('[data-dlyr-carte]');
    for (var v = 0; v < vieilles.length; v++) vieilles[v].parentNode.removeChild(vieilles[v]);

    var deja = cartesExistantes();

    for (var i = 0; i < experiences.length; i++) {
      var e = experiences[i];
      if (!e.actif) continue;
      /*  ⚠ ON NE FABRIQUE DE CARTE QUE POUR CE QUE LE SITE NE PRÉSENTE
          NULLE PART. Une expérience qui a déjà une page est, par
          définition, présentée quelque part : si sa carte ne figure pas
          au catalogue, c'est une décision éditoriale — les fléchettes
          ont leur page et ne sont pas dans la grille des jeux, et ce
          n'est pas à un script de corriger ce choix. */
      if (e.page) continue;
      //  Déjà présente sous une autre forme : par son code dans un lien
      //  de réservation, ou simplement par son nom.
      if (e.id && deja.codes[propre(e.id)]) continue;
      if (deja.noms[propre(e.nom)]) continue;
      if (!passeLeFiltre(e)) continue;
      grille.appendChild(fabriquerCarte(e));
    }

    recompterLesCartes();
  }

  /*  ⚠ LE FILTRE PAR GENRE S'APPLIQUE AUSSI À NOS CARTES.
      Sans ça, une expérience fabriquée restait affichée sous TOUS les
      filtres — « Napoleon » apparaissait sous « Quiz ». Le catalogue
      filtre sur un vocabulaire fermé (Action, Aventure, Escape Game…) ;
      l'application écrit « Culturel, Exploration historique ». On
      cherche donc le mot du filtre DANS le genre de l'application, ce
      qui fait très bien fonctionner les genres à plusieurs mots. */
  function passeLeFiltre(e) {
    var chip = document.querySelector('.cat__chip.on');
    if (!chip) return true;
    var g = chip.getAttribute('data-genre') || chip.textContent || '';
    if (!g || propre(g) === 'tous') return true;
    return propre(e.genre || '').indexOf(propre(g)) !== -1;
  }

  /*  ⚠ ET LE COMPTEUR DOIT SUIVRE, DANS LES DEUX SENS.
      Il est écrit par le catalogue à partir de SA liste : il annonçait
      « 10 expériences disponibles » sous onze cartes après un ajout, et
      il aurait annoncé dix sous neuf cartes après un masquage. On le
      recalcule sur ce qui est réellement affiché — la seule valeur qui
      ne puisse pas mentir. */
  function recompterLesCartes() {
    var grille = document.querySelector('.cat__grid');
    if (!grille) return;
    var n = 0;
    var cartes = grille.querySelectorAll('a.xcard');
    for (var i = 0; i < cartes.length; i++) {
      if (getComputedStyle(cartes[i]).display !== 'none') n++;
    }

    var compteur = document.querySelector('[data-count]');
    if (compteur) {
      compteur.textContent = n + ' expérience' + (n > 1 ? 's' : '')
        + ' disponible' + (n > 1 ? 's' : '');
    }
    //  Le message « rien à afficher » du catalogue ne connaît pas nos
    //  cartes : une seule carte fabriquée le laisserait affiché.
    var vide = document.querySelector('[data-empty]');
    if (vide) vide.hidden = n > 0;
  }

  // =====================================================================
  //  LE SYNOPSIS ET LE RÉSUMÉ GOOGLE, PRIS DANS L'APPLICATION
  //
  //  ⚠ UNE CASE VIDE N'EFFACE RIEN. Tant que le synopsis n'est pas saisi
  //    dans l'application, la page garde le texte de son fichier. C'est
  //    ce qui permet de remplir l'application à son rythme sans jamais
  //    appauvrir le site entre-temps.
  //
  //  ⚠ ET LE FICHIER DE LA PAGE, LUI, N'EST PAS RÉÉCRIT. Le texte saisi
  //    dans l'application s'affiche par-dessus celui de la page. Google
  //    le verra, mais il lit d'abord le fichier : pour un texte qui
  //    compte vraiment au référencement, le bon geste reste de le
  //    reporter dans la page au prochain dépôt du site.
  // =====================================================================
  function appliquerLesTextes(exp) {
    if (exp.synopsis) {
      //  Le synopsis de la page : le premier paragraphe « lead » du
      //  bandeau de titre. On ne touche pas aux autres.
      var lead = document.querySelector('.jhero__left p.lead, .jhero p.lead, p.lead');
      if (lead && propre(lead.textContent) !== propre(exp.synopsis)) {
        lead.textContent = exp.synopsis;
      }
    }
    if (exp.resume_seo) {
      var meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', exp.resume_seo);
    }
  }

  // =====================================================================
  //  L'APPLICATION DE LA LISTE
  // =====================================================================
  var enTrainDAppliquer = false;
  /*  ⚠ LA DERNIÈRE LISTE CONNUE, ET NON CELLE DU PREMIER PASSAGE.
      Le guetteur ci-dessous se rappelle tout seul quand le catalogue se
      redessine. S'il gardait la liste qu'il avait au moment où on l'a
      posé, il réappliquerait indéfiniment la liste PÉRIMÉE de la mémoire
      d'onglet — et une expérience qu'on vient de réactiver serait
      remasquée une demi-seconde après être réapparue. Vu au banc. */
  var derniereListe = null;

  function appliquer(experiences) {
    if (!experiences || !experiences.length) return;
    derniereListe = experiences;

    var connues = { pages: {}, codes: {} };
    for (var i = 0; i < experiences.length; i++) {
      var e = experiences[i];
      if (!e) continue;
      if (e.page) connues.pages[propre(e.page)] = e;
      if (e.id) connues.codes[propre(e.id)] = e;
    }

    enTrainDAppliquer = true;
    try {
      ajusterLiens(connues);
      rafraichirCartes(connues);

      var ici = connues.pages[nomDePage(location.pathname)];
      if (ici) {
        if (!ici.actif) neutraliserLaPage(ici);
        appliquerLesTextes(ici);
      }

      completerLeCatalogue(experiences);
      surveillerLaGrille();
    } finally {
      enTrainDAppliquer = false;
    }
  }

  // =====================================================================
  //  ⚠ LE CATALOGUE SE REDESSINE TOUT SEUL, ET C'EST LE PIÈGE
  //
  //  js/catalogue.js garde sa propre copie de la liste des jeux, faite
  //  au chargement, et réécrit toute la grille à chaque clic sur un
  //  filtre ou sur un tri. Sans ce guetteur, un visiteur qui clique
  //  « Action » verrait réapparaître l'expérience qu'on vient de retirer,
  //  et les durées corrigées redeviendraient celles du fichier.
  //
  //  On ne cherche pas à modifier sa copie — elle est enfermée dans sa
  //  fonction, et aller la chercher serait un bricolage qui casserait au
  //  premier changement du site. On regarde la grille, et on repasse
  //  derrière.
  // =====================================================================
  var guetteur = null;

  function surveillerLaGrille() {
    if (guetteur) return;
    var grille = document.querySelector('.cat__grid');
    if (!grille || typeof MutationObserver !== 'function') return;

    /*  ⚠ ON SE DÉBRANCHE PENDANT QU'ON RETOUCHE, ET C'EST INDISPENSABLE.
        Un simple drapeau « je suis en train de travailler » ne suffit
        pas : le guetteur n'est pas rappelé pendant la retouche mais
        APRÈS, quand le drapeau est déjà retombé. Il se déclencherait
        donc sur ses propres modifications, indéfiniment. Attrapé par le
        banc, qui s'est arrêté au bout de deux minutes sans rien dire —
        une boucle sans fin ne lève aucune erreur, elle mange la page. */
    guetteur = new MutationObserver(function () {
      if (enTrainDAppliquer) return;
      guetteur.disconnect();
      try { appliquer(derniereListe); }
      catch (e) { console.error('expériences pilotées :', e); }
      var g = document.querySelector('.cat__grid');
      if (g) guetteur.observe(g, { childList: true });
    });
    guetteur.observe(grille, { childList: true });
  }

  // =====================================================================
  //  LE DÉMARRAGE
  // =====================================================================
  function demarrer() {
    //  1. Ce qu'on savait en arrivant : appliqué immédiatement.
    try { appliquer(enMemoire()); } catch (e) { /* une liste périmée n'arrête rien */ }

    //  2. Ce que l'application dit maintenant.
    demander(function (liste) {
      if (!liste) return;                     //  pas de réponse : le site reste tel quel
      retenir(liste);
      try { appliquer(liste); }
      catch (e) { console.error('expériences pilotées :', e); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', demarrer);
  } else {
    demarrer();
  }

  //  Pour le banc d'essai.
  window.__experiencesPilotees = {
    nomDePage: nomDePage, codeDuLien: codeDuLien,
    appliquer: appliquer, fabriquerCarte: fabriquerCarte,
    rafraichirCartes: rafraichirCartes, appliquerLesTextes: appliquerLesTextes,
    SOURCE: SOURCE
  };
})();
