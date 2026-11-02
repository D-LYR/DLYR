/* D'LYR — Données structurées JSON-LD (SEO). Injectées côté client sur toutes les pages. */
(function () {
  function add(obj) {
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(obj);
    document.head.appendChild(s);
  }
  var BASE = 'https://www.dlyr-vr.com/';
  var biz = {
    "@context": "https://schema.org",
    "@type": "EntertainmentBusiness",
    "@id": BASE + "#dlyr",
    "name": "D'LYR",
    "description": "Centre de loisirs VR à Colombes : jeux en réalité virtuelle free-roaming, fléchettes connectées, quiz Hologame, évènements et Bar&Snack.",
    "url": BASE,
    "image": BASE + "uploads/brand/badge-vr.png",
    "email": "contact@dlyr-vr.com",
    "priceRange": "€€",
    "address": { "@type": "PostalAddress", "streetAddress": "3 Boulevard Charles de Gaulle", "postalCode": "92700", "addressLocality": "Colombes", "addressCountry": "FR" },
    "hasMap": "https://www.google.com/maps/search/?api=1&query=D%27LYR%2C+3+Boulevard+Charles+de+Gaulle%2C+92700+Colombes",
    "openingHoursSpecification": [
      { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "11:00", "closes": "22:30" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "10:00", "closes": "23:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "10:00", "closes": "20:00" }
    ],
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "bestRating": "5", "ratingCount": "121" }
  };
  add(biz);

  var page = (document.body && document.body.getAttribute('data-page')) || '';

  /* FAQPage : construit depuis les données FAQ déjà chargées */
  if (page === 'faq' && window.DLYR_FAQ_DATA) {
    add({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": window.DLYR_FAQ_DATA.map(function (f) {
        var div = document.createElement('div');
        div.innerHTML = f.a;
        return { "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": div.textContent } };
      })
    });
  }

  /* Fiche jeu : Product avec offre */
  var slug = location.pathname.split('/').pop().replace(/\.html$/, '');
  if (slug.indexOf('jeu-') === 0 && window.DLYR_GAMES) {
    var game = null;
    for (var i = 0; i < window.DLYR_GAMES.length; i++) {
      if ((window.DLYR_GAMES[i].href || '').indexOf(slug) !== -1) { game = window.DLYR_GAMES[i]; break; }
    }
    var h1 = document.querySelector('h1');
    add({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": (game && game.name) || document.title.replace(/^D'LYR — /, '').replace(/ · Jeu VR$/, ''),
      "description": (document.querySelector('meta[name="description"]') || {}).content || '',
      "image": game && game.img ? BASE + game.img : BASE + "uploads/brand/badge-vr.png",
      "brand": { "@type": "Brand", "name": "D'LYR" },
      "offers": { "@type": "Offer", "price": "25", "priceCurrency": "EUR", "availability": "https://schema.org/InStock", "url": BASE + slug + '.html' }
    });
  }

  /* Fil d'Ariane simple : accueil > page courante */
  if (page && page !== 'accueil') {
    var t = document.title.replace(/^D'LYR — /, '');
    add({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Accueil", "item": BASE },
        { "@type": "ListItem", "position": 2, "name": t, "item": BASE + location.pathname.split('/').pop() }
      ]
    });
  }
})();
