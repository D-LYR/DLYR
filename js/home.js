/* ============================================================
   D'LYR — Accueil : interactions
   ============================================================ */
(function () {
  const I = window.DLYR_ICONS || {};

  /* ---------- Injection des icônes ---------- */
  function icons() {
    const S = window.DLYR_SOCIAL || {
      tiktok: 'https://www.tiktok.com/@dlyr.vr',
      facebook: 'https://www.facebook.com/profile.php?id=61591286531090',
      instagram: 'https://www.instagram.com/dlyr.vr/',
      linkedin: 'https://www.linkedin.com/company/d-lyr/'
    };
    const soc = document.querySelector('[data-social]');
    if (soc) soc.innerHTML =
      `<a href="${S.tiktok}" target="_blank" rel="noopener" aria-label="TikTok">${I.tiktok}</a>
       <a href="${S.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.facebook}</a>
       <a href="${S.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.instagram}</a>
       <a href="${S.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${I.linkedin}</a>`;
    document.querySelectorAll('.btn-arrow').forEach(b => { if (b.textContent.trim() === '_ARROW_') b.innerHTML = I.arrow; });
    document.querySelectorAll('[data-ic]').forEach(s => { s.innerHTML = I[s.dataset.ic] || ''; });
  }

  /* ---------- Slider Expériences VR ---------- */
  const GAMES = [
    { name: 'Outbreak Lab', genre: 'Aventure', theme: 'Survie · Zombies', pitch: "Un laboratoire contaminé, des couloirs plongés dans le noir et une horde qui se rapproche : survivrez-vous assez longtemps pour percer le secret de X-Labs ?", dur: '30 min', pl: '2 à 12 joueurs', img: 'uploads/experiences/outbreak-lab/outbreak-lab-affiche.jpg', href: 'jeu-outbreak-lab.html' },
    { name: 'Titanic — Le Rêve Englouti', genre: 'Culturel', theme: 'Histoire · Exploration', pitch: "Explorer le Titanic, percer ses mystères et revivre son voyage inaugural.", dur: '30 min', pl: '1 à 12 joueurs', img: 'uploads/experiences/titanic/titanic-affiche.jpg', href: 'jeu-titanic-le-reve-englouti.html' },
    { name: 'Volcanic Warfare', genre: 'Action', theme: 'Team Deathmatch · Tactique', pitch: "La lave dévale l'île et le sol tremble sous vos pieds. Deux équipes s'affrontent, une seule victoire : jouez serré, la montagne ne pardonne pas.", dur: '30 min', pl: '4 à 8 joueurs', img: 'uploads/experiences/volcanic-warfare/volcanic-warfare-affiche.jpg', href: 'jeu-volcanic-warfare.html' },
    /* CULTUREL désactivé — { name: 'Versailles — Les Jardins Disparus du Roi Soleil', genre: 'Culturel', theme: 'Histoire · Exploration', pitch: "Explorer les jardins disparus et découvrir les trésors cachés de Versailles.", dur: '30 min', pl: '1 à 12 joueurs', img: 'uploads/experiences/versailles/versailles-affiche.png', href: 'jeu-versailles-les-jardins-disparus-du-roi-soleil.html' }, */
    { name: 'Paradise Expedition', genre: 'Action', theme: 'Free For All · Survie', pitch: "Une serre tropicale magnifique… et impitoyable. Chacun pour soi : dans ce paradis perdu, chaque rencontre peut être votre dernière.", dur: '30 min', pl: '2 à 12 joueurs', img: 'uploads/experiences/paradise-expedition/paradise-expedition-affiche.jpg', href: 'jeu-paradise-expedition.html' },
    /* CULTUREL désactivé — { name: 'Quantum Dome Project — Le Louvre Abu Dhabi', genre: 'Culturel', theme: 'Aventure · Histoire', pitch: "Embarquez pour une aventure extraordinaire à travers les âges. Explorez la Rome impériale, la Maison de la Sagesse de Bagdad et l'Inde moghole.", dur: '30 min', pl: '1 à 12 joueurs', img: 'uploads/experiences/quantum-dome/quantum-dome-affiche.png', href: 'jeu-quantum-dome-project.html' }, */
    { name: 'Harbor Siege', genre: 'Action', theme: 'Conquête · Stratégie', pitch: "Deux équipes, un port abandonné, des ruelles à prendre mètre par mètre. Coordonnez-vous, tenez vos positions et dominez le champ de bataille.", dur: '30 min', pl: '2 à 12 joueurs', img: 'uploads/experiences/harbor-siege/harbor-siege-affiche.jpg', href: 'jeu-harbor-siege.html' },
    /* CULTUREL désactivé — { name: 'Gaudí — L\'Atelier du Divin', genre: 'Culturel', theme: 'Art · Architecture', pitch: "Comprendre Gaudí, plonger dans son atelier et reprendre son œuvre : la Sagrada Familia.", dur: '30 min', pl: '1 à 12 joueurs', img: 'uploads/experiences/gaudi/gaudi-affiche.png', href: 'jeu-gaudi-latelier-du-divin.html' }, */
  ];
  function posters() {
    const grid = document.querySelector('[data-posters]');
    if (!grid) return;
    grid.innerHTML = GAMES.map((g, i) => `
      <div class="pslide">
        <a class="poster" href="${g.href}" aria-label="${g.name}" data-fit>
          <img class="poster__img" src="${g.img}" alt="${g.name} — affiche du jeu VR" loading="${i ? 'lazy' : 'eager'}">
        </a>
        <div class="pinfo">
          <span class="tag-genre">${g.genre}</span>
          <h3 class="pinfo__name">${g.name}</h3>
          <p class="pinfo__theme">${g.theme}</p>
          <p class="pinfo__pitch">${g.pitch}</p>
          <ul class="pinfo__meta">
            <li><svg aria-hidden=\"true\" viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v5l3.5 2\"/></svg>${g.dur}</li>
            <li><svg aria-hidden=\"true\" viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"9\" cy=\"8\" r=\"3\"/><circle cx=\"17\" cy=\"9\" r=\"2.4\"/><path d=\"M3.5 19a5.5 5.5 0 0 1 11 0M15 19a4.5 4.5 0 0 1 6 0\"/></svg>${g.pl}</li>
          </ul>
          <a class="btn btn--lime-o btn--sm" href="${g.href}">Découvrir</a>
        </div>
      </div>`).join('');
    /* chaque affiche adopte le ratio exact de son image : aucun recadrage */
    grid.querySelectorAll('[data-fit] img').forEach(img => {
      const fit = () => {
        if (!img.naturalWidth) return;
        img.closest('[data-fit]').style.setProperty('--ar', img.naturalWidth + ' / ' + img.naturalHeight);
      };
      img.complete ? fit() : img.addEventListener('load', fit, { once: true });
    });

    const rail = document.querySelector('[data-prail]');
    if (!rail) return;
    const prev = rail.querySelector('[data-prail-prev]');
    const next = rail.querySelector('[data-prail-next]');
    const slides = [...grid.children];
    let i = 0;

    const go = (n, smooth) => {
      i = (n + slides.length) % slides.length;
      grid.scrollTo({ left: slides[i].offsetLeft - grid.offsetLeft, behavior: smooth === false ? 'auto' : 'smooth' });
      dots.forEach((d, k) => d.setAttribute('aria-current', k === i ? 'true' : 'false'));
    };

    const dotsWrap = rail.parentElement.querySelector('[data-prail-dots]');
    const dots = slides.map((s, k) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pdot';
      b.setAttribute('aria-label', GAMES[k].name);
      b.addEventListener('click', () => go(k));
      dotsWrap && dotsWrap.appendChild(b);
      return b;
    });

    prev.addEventListener('click', () => go(i - 1));
    next.addEventListener('click', () => go(i + 1));

    /* garde l'index en phase avec le défilement tactile */
    let t;
    grid.addEventListener('scroll', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const c = grid.scrollLeft + grid.clientWidth / 2;
        let best = 0, bd = Infinity;
        slides.forEach((s, k) => {
          const d = Math.abs(s.offsetLeft - grid.offsetLeft + s.offsetWidth / 2 - c);
          if (d < bd) { bd = d; best = k; }
        });
        i = best;
        dots.forEach((d, k) => d.setAttribute('aria-current', k === i ? 'true' : 'false'));
      }, 90);
    }, { passive: true });

    window.addEventListener('resize', () => go(i, false));
    go(0, false);
  }

  /* ---------- Carrousel d'avis ---------- */
  const REVIEWS = [
    { n: 'Thomas M.', c: '#43744c', t: "Une expérience VR bluffante ! On s'est cru dans le jeu pendant 30 minutes. L'équipe est top et le bar parfait pour finir la soirée." },
    { n: 'Sophie L.', c: '#55703a', t: "Organisé l'EVJF de ma sœur ici, soirée inoubliable. Quiz Hologame, fléchettes, boissons… tout y était. Je recommande à 200%." },
    { n: 'Julien R.', c: '#1b8a4b', t: "Le meilleur spot de Colombes pour s'amuser entre potes. Les jeux sont variés et l'immersion est totale. On reviendra !" },
    { n: 'Inès B.',   c: '#c2410c', t: "Anniversaire de mon fils au top, les enfants ont adoré la réalité virtuelle. Accueil chaleureux et formule goûter parfaite." },
    { n: 'Karim D.',  c: '#43744c', t: "Team building d'entreprise réussi. Ambiance garantie, défis VR en équipe et privatisation impeccable. Bravo à toute l'équipe." },
  ];
  function reviews() {
    const root = document.querySelector('[data-reviews]');
    if (!root) return;
    const track = root.querySelector('[data-rev-track]');
    const dots = document.querySelector('[data-rev-dots]');
    track.innerHTML = REVIEWS.map(r => `
      <div class="rcard">
        <div class="rcard__inner">
          <div class="rcard__stars">★★★★★</div>
          <p class="rcard__text">"${r.t}"</p>
          <div class="rcard__who">
            <span class="rcard__av" style="background:${r.c}">${r.n[0]}</span>
            <span class="rcard__name">${r.n}</span>
          </div>
        </div>
      </div>`).join('');

    function perView() { return window.innerWidth <= 720 ? 1 : window.innerWidth <= 980 ? 2 : 3; }
    let idx = 0;
    function maxIdx() { return Math.max(0, REVIEWS.length - perView()); }
    function render() {
      const pv = perView();
      track.querySelectorAll('.rcard').forEach(c => c.style.flexBasis = (100 / pv) + '%');
      idx = Math.min(idx, maxIdx());
      track.style.transform = `translateX(-${idx * (100 / pv)}%)`;
      dots.innerHTML = Array.from({ length: maxIdx() + 1 }, (_, i) =>
        `<button${i === idx ? ' class="on"' : ''} aria-label="Page ${i + 1}"></button>`).join('');
      dots.querySelectorAll('button').forEach((b, k) => b.addEventListener('click', () => { idx = k; render(); }));
    }
    root.querySelector('.rev__nav--next').addEventListener('click', () => { idx = Math.min(idx + 1, maxIdx()); render(); });
    root.querySelector('.rev__nav--prev').addEventListener('click', () => { idx = Math.max(idx - 1, 0); render(); });
    if (window.DLYR_swipe) window.DLYR_swipe(root.querySelector('.rev__viewport'), {
      left: () => { idx = Math.min(idx + 1, maxIdx()); render(); },
      right: () => { idx = Math.max(idx - 1, 0); render(); },
    });
    window.addEventListener('resize', render);
    render();
  }

  /* ---------- Avis Google (section « Note moyenne ») ----------
     Copier ici les avis de la fiche Google D'LYR :
       { n: 'Prénom N.', d: 'Visité en septembre 2026', s: 5, t: "Texte de l'avis" }
     Tant que la liste est vide, le bloc d'avis reste masqué sur le site en ligne ;
     en local (file:// ou localhost) des cartes d'exemple montrent la mise en page. */
  const GOOGLE_REVIEWS = [
    { n: 'Katia BERNARDINI', d: 'Visité en septembre 2026', s: 5, t: "Très bonne expérience de VR entre collègues.\nCadre acceuillant et atypique pour passer de bons moments." },
    { n: 'Clara Le Corre', d: 'Visité en septembre 2026', s: 5, t: "Expérience validée chez D’lyr, nous avons apprécié la diversité des modes proposés, on a choisi Titanic, l’immersion a dépassé mes attentes !\nGros plus sur l’espace accueil / bar qui fait une forte impression & donne envie de s’attarder boire un verre :)\nOn reviendra tester d’autres modes entre amis!!" },
    { n: 'Vincent Dussard', d: 'Visité en septembre 2026', s: 5, t: "Super expérience dès l'accueil ! À notre arrivée on a été reçu par une équipe au top, clairement passionnée! L'entrée et la zone d'attente sont magnifiques et super confortable, ça change clairement du standing des autres du genre (escape games etc)\nEt l'expérience en elle même est super immersive, on a eu l'occasion de tester deux jeux; un escape game intelligent et bien adapté à la VR et mon préféré, l'immersif du Titanic, un vrai voyage dans le temps!\n\nOn a hâte d'entendre l'avancé du projet avec les nouveaux jeux et les futurs événements !" },
    { n: 'Yann', d: 'Visité en septembre 2026', s: 5, t: "Super expérience de réalité virtuelle, nous sommes venus entre amis et avons passé un excellent moment.\nDifférents jeux possibles, il y en a pour tous les goûts !\nL’accueil est au top avec le sourire et des explications claires.\nOn passe un excellent moment, un espace parfait également je pense pour organiser un team building." },
    { n: 'Margaux Combes', d: 'Visité en septembre 2026', s: 5, t: "L'immersion en réalité virtuelle est tout simplement bluffante et l'espace est vraiment impressionnant. L'équipe est accueillante, passionnée et prend le temps de bien tout expliquer avant de se lancer. Vous pouvez y aller les yeux fermés. Je recommande à 100 % !" },
    { n: 'Oscar', d: 'Visité en septembre 2026', s: 5, t: "Super expérience, je recommande accueil chaleureux, bonne ambiance, très intuitif à prendre en main, je vous conseille fortement l’expérience Harbor Siege en amis ou entre collègues c’est très fun 😂" },
  ];

  const isEN = document.documentElement.lang === 'en';
  const GREV_SAMPLE = Array.from({ length: 5 }, (_, i) => ({
    n: 'Exemple ' + (i + 1), d: 'Aperçu local', s: 5,
    t: i % 2
      ? "Exemple d'avis court pour visualiser la mise en page."
      : "Exemple d'avis plus long : ce texte sera remplacé par un vrai avis copié depuis la fiche Google de D'LYR. Il permet de vérifier le rendu des cartes, la coupure du texte après quelques lignes et le bouton pour lire la suite de l'avis."
  }));
  const GREV_COLORS = ['#43744c', '#55703a', '#8a6d1f', '#2f5d62', '#7a4b2a'];
  const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

  function googleReviews() {
    const root = document.querySelector('[data-greviews]');
    if (!root) return;
    const preview = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
    const list = GOOGLE_REVIEWS.length ? GOOGLE_REVIEWS : (preview ? GREV_SAMPLE : []);
    if (!list.length) return;

    root.hidden = false;

    const track = root.querySelector('[data-grev-track]');
    const dots = root.querySelector('[data-grev-dots]');
    const moreLbl = isEN ? 'Read more' : 'Lire la suite';
    const lessLbl = isEN ? 'Show less' : 'Réduire';
    track.innerHTML = list.map((r, i) => {
      const s = Math.max(1, Math.min(5, r.s || 5));
      return `
      <article class="gcard">
        <div class="gcard__inner">
          <header class="gcard__top">
            <span class="gcard__av" style="background:${GREV_COLORS[i % GREV_COLORS.length]}">${esc(r.n.trim()[0] || '?')}</span>
            <span class="gcard__who"><span class="gcard__name">${esc(r.n)}</span>${r.d ? `<span class="gcard__date">${esc(r.d)}</span>` : ''}</span>
          </header>
          <div class="gcard__stars" role="img" aria-label="${s} ${isEN ? 'out of 5 stars' : 'étoiles sur 5'}">${'★'.repeat(s)}<span>${'★'.repeat(5 - s)}</span></div>
          <p class="gcard__text">${esc(r.t)}</p>
          <button type="button" class="gcard__more" hidden>${moreLbl}</button>
        </div>
      </article>`;
    }).join('');

    // « Lire la suite » uniquement si le texte est coupé
    function checkClamp() {
      track.querySelectorAll('.gcard').forEach(card => {
        const p = card.querySelector('.gcard__text'), b = card.querySelector('.gcard__more');
        if (card.classList.contains('is-open')) return;
        b.hidden = p.scrollHeight <= p.clientHeight + 2;
      });
    }
    track.addEventListener('click', e => {
      const b = e.target.closest('.gcard__more');
      if (!b) return;
      const open = b.closest('.gcard').classList.toggle('is-open');
      b.textContent = open ? lessLbl : moreLbl;
    });

    function perView() { return window.innerWidth <= 720 ? 1 : window.innerWidth <= 980 ? 2 : 3; }
    let idx = 0;
    function maxIdx() { return Math.max(0, list.length - perView()); }
    function render() {
      const pv = perView();
      track.querySelectorAll('.gcard').forEach(c => c.style.flexBasis = (100 / pv) + '%');
      idx = Math.min(idx, maxIdx());
      track.style.transform = `translateX(-${idx * (100 / pv)}%)`;
      dots.innerHTML = Array.from({ length: maxIdx() + 1 }, (_, i) =>
        `<button type="button"${i === idx ? ' class="on"' : ''} aria-label="Page ${i + 1}"></button>`).join('');
      dots.querySelectorAll('button').forEach((b, k) => b.addEventListener('click', () => { idx = k; render(); }));
      root.querySelector('[data-grev-prev]').disabled = idx === 0;
      root.querySelector('[data-grev-next]').disabled = idx === maxIdx();
      // Peu d'avis : cartes centrées, sans flèches ni points
      const few = list.length <= pv;
      track.classList.toggle('is-few', few);
      root.querySelector('.greviews__foot').hidden = few;
      checkClamp();
    }
    const next = () => { idx = Math.min(idx + 1, maxIdx()); render(); };
    const prev = () => { idx = Math.max(idx - 1, 0); render(); };
    root.querySelector('[data-grev-next]').addEventListener('click', next);
    root.querySelector('[data-grev-prev]').addEventListener('click', prev);
    if (window.DLYR_swipe) window.DLYR_swipe(root.querySelector('.greviews__viewport'), { left: next, right: prev });
    window.addEventListener('resize', render);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(checkClamp);
    render();
  }

  /* ---------- Carrousel d'évènements ----------
     Une slide par carte .evcar__slide dans la page : pour ajouter un
     évènement, dupliquer une carte dans index.html et en/index.html. */
  function eventsCarousel() {
    const root = document.querySelector('[data-evcar]');
    if (!root) return;
    const track = root.querySelector('[data-evcar-track]');
    const slides = Array.from(track.children);
    if (slides.length < 2) { root.setAttribute('data-single', ''); return; }
    const dots = root.querySelector('[data-evcar-dots]');
    const lbl = isEN ? 'Event' : 'Évènement';
    dots.innerHTML = slides.map((_, i) => `<button type="button" aria-label="${lbl} ${i + 1}"></button>`).join('');
    const dotBtns = Array.from(dots.children);
    let idx = 0, timer = null;

    // Petit écran : cartes empilées, de hauteurs différentes → la hauteur suit la carte affichée
    const compact = () => window.matchMedia('(max-width: 880px)').matches;

    function render() {
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      track.style.height = compact() ? slides[idx].offsetHeight + 'px' : '';
      track.style.transform = `translateX(calc(${-idx} * (100% + ${gap}px)))`;
      slides.forEach((s, i) => {
        s.setAttribute('aria-hidden', i === idx ? 'false' : 'true');
        if ('inert' in s) s.inert = i !== idx;
      });
      dotBtns.forEach((b, i) => {
        b.classList.toggle('on', i === idx);
        b.setAttribute('aria-current', i === idx ? 'true' : 'false');
      });
    }
    function go(i) { idx = (i + slides.length) % slides.length; render(); }

    // Défilement automatique (grand écran seulement, pour ne pas faire bouger la page sur mobile) :
    // suspendu au survol, au focus et quand l'onglet est masqué
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function start() { stop(); if (!reduce && !compact()) timer = setInterval(() => go(idx + 1), 7000); }
    const next = () => { go(idx + 1); start(); };
    const prev = () => { go(idx - 1); start(); };

    root.querySelector('[data-evcar-next]').addEventListener('click', next);
    root.querySelector('[data-evcar-prev]').addEventListener('click', prev);
    dotBtns.forEach((b, i) => b.addEventListener('click', () => { go(i); start(); }));
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
    if (window.DLYR_swipe) window.DLYR_swipe(root.querySelector('.evcar__viewport'), { left: next, right: prev });

    // Les images des slides masquées sont chargées dès que le carrousel approche de l'écran
    const loadImgs = () => root.querySelectorAll('img[loading="lazy"]').forEach(im => { im.loading = 'eager'; });
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((en) => {
        if (en.some(x => x.isIntersecting)) { io.disconnect(); loadImgs(); }
      }, { rootMargin: '400px 0px' });
      io.observe(root);
    } else { loadImgs(); }

    window.addEventListener('resize', () => { render(); start(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(render);
    render();
    start();
  }

  /* ---------- Compteurs animés ---------- */
  function counters() {
    const els = document.querySelectorAll('[data-count]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target; io.unobserve(el);
        const target = parseFloat(el.dataset.count);
        const dec = parseInt(el.dataset.dec || '0', 10);
        const dur = 1400; const start = performance.now();
        function step(now) {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * ease).toFixed(dec);
          if (p < 1) requestAnimationFrame(step); else el.textContent = target.toFixed(dec);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    els.forEach(el => io.observe(el));
  }

  document.addEventListener('DOMContentLoaded', () => {
    icons(); posters(); reviews(); googleReviews(); eventsCarousel(); counters();
  });
})();
