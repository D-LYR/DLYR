/* ============================================================
   D'LYR — Site shell (nav + footer + interactions partagées)
   ============================================================ */
(function () {
  document.documentElement.classList.add('js-anim');
  const PAGES = [
    { href: 'catalogue.html',   label: 'Expériences', key: 'catalogue' },
    { href: 'flechettes.html',  label: 'Fléchettes',  key: 'flechettes' },
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
  function getBookHref() {
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
    return `<a class="brand" href="${prefix}index.html" aria-label="D'LYR — accueil"><img src="${prefix}uploads/brand/DLYR-02.png" alt="D'LYR"></a>`;
  }

  function buildNav() {
    const body = document.body;
    const current = body.dataset.page || '';
    const onPaper = body.dataset.nav === 'paper';
    const bookHref = getBookHref();
    const links = PAGES.map(p =>
      `<a href="${p.href}"${p.key === current ? ' aria-current="page"' : ''}>${p.label}</a>`
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
      ${PAGES.map(p => `<a href="${p.href}"${p.key === current ? ' aria-current="page"' : ''}>${p.label}</a>`).join('')}
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
            <p>${ICONS.clock}<span>Ouvert 7j/7 · Lun–Ven 11h–22h30<br>Samedi 10h–23h · Dimanche 10h–21h30</span></p>
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
          ${col('Activités', [['Expériences','catalogue.html'],['Fléchettes','flechettes.html']])}
          ${col('Mentions légales', [['Politique de confidentialité','politique-confidentialite.html'],['Mentions légales','mentions-legales.html'],['CGV','cgv.html']])}
          ${col('Plan du site', [['Accueil','index.html'],['Expériences','catalogue.html'],['Fléchettes','flechettes.html'],['Évènements','evenements.html'],['Entreprises','entreprises.html'],['Offrir','offrir.html'],['Bar&Snack','snack-bar.html'],['FAQ','faq.html'],['Contact','contact.html']])}
        </div>
      </div>
      <div class="footer__word" aria-hidden="true"><img src="${prefix}uploads/brand/DLYR-05.png" alt=""></div>
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
    var prod = currentProduct();
    smeetzLoad();
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href="#reserver"], [data-smeetz-open]');
      if (!a) return;
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

  function analytics() {
    var KEY = 'dlyr_cookie_consent';
    try {
      if (localStorage.getItem(KEY) === 'accepted') { loadGTM(); loadClarity(); }
    } catch (e) {}
    window.addEventListener('dlyr:consent', function (e) {
      if (e.detail === 'accepted') { loadGTM(); loadClarity(); }
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
      'Nous utilisons des cookies pour le bon fonctionnement du site et, avec votre accord, pour mesurer son audience (Microsoft Clarity). Notre module de r\u00e9servation (Smeetz) d\u00e9pose \u00e9galement ses propres cookies. ' +
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
            <p class="pmaps__line">${ICONS.pin} 1 Bd Charles de Gaulle, 92700 Colombes – Hall A - Rez de Jardin</p>
            <p class="pmaps__line">${ICONS.clock} 7j/7 · Lun–Ven 11h–22h30 · Sam. 10h–23h · Dim. 10h–21h30</p>
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
          <div class="ph steaser__media steaser__media--tall"><img class="ph__img" loading="lazy" src="${prefix}uploads/lounge/lounge.jpg" alt="Le bar de D'LYR"></div>
          <div class="ph steaser__media"><img class="ph__img" src="${prefix}uploads/lounge/lounge-arbre.jpg" alt="L'espace lounge avec arbre central chez D'LYR"></div>
          <div class="ph steaser__media"><img class="ph__img" loading="lazy" src="${prefix}uploads/snack-bar/acceuil.jpg" alt="L'espace bar & snack"></div>
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
    [buildNav, buildFooter, buildMaps, buildSnackTeaser, toastInit, reserve, marquees, cookies, analytics, lightboxInit, woodRings].forEach(fn => {
      try { fn(); } catch (e) { console.warn('[DLYR]', fn.name, e); }
    });
    try { reveal(); } catch (e) { console.warn('[DLYR] reveal', e); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  window.addEventListener('load', () => { try { reveal(); } catch (e) {} });
})();
