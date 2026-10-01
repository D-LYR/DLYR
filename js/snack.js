/* ============================================================
   D'LYR — Snack Bar : carte à onglets
   ============================================================ */
(function () {
  const I = window.DLYR_ICONS || {};
  const ar = document.querySelector('[data-arrow]');
  if (ar) ar.innerHTML = I.arrow || '';

  const isEn = document.documentElement.lang === 'en' || window.location.pathname.includes('/en/');

  const MENU_FR = {
    "boissons-froides": [
      { n: "Coca-Cola", d: "Canette 33 cl", p: "3€" },
      { n: "Coca-Cola Zéro", d: "Canette 33 cl", p: "3€" },
      { n: "Fanta Orange", d: "Canette 33 cl", p: "3€" },
      { n: "Orangina", d: "Canette 33 cl", p: "3€" },
      { n: "Sprite", d: "Canette 33 cl", p: "3€" },
      { n: "Fuze Tea Pêche", d: "Canette 33 cl", p: "3€" },
      { n: "Oasis Tropical", d: "Canette 33 cl", p: "3€" },
      { n: "Schweppes Agrumes", d: "Canette 33 cl", p: "3€" },
      { n: "Red Bull", d: "Canette 35,5 cl", p: "5€" },
      { n: "Eau minérale Mont Blanc", d: "Bouteille 50 cl", p: "3€" },
      { n: "Eau gazeuse San Pellegrino", d: "Bouteille 50 cl", p: "3€" },
      { n: "Pago Orange", d: "Jus de fruits · Bouteille 33 cl", p: "4€" },
      { n: "Pago Fraise", d: "Jus de fruits · Bouteille 33 cl", p: "4€" },
      { n: "Pago Tropical", d: "Jus de fruits · Bouteille 33 cl", p: "4€" },
      { n: "Pago Ananas", d: "Jus de fruits · Bouteille 33 cl", p: "4€" },
      { n: "La Goudale 0.0%", d: "Bière sans alcool · Bouteille 33 cl", p: "5€" }
    ],
    "boissons-chaudes": [
      { n: "Café expresso", d: "7 cl", p: "2,50€" },
      { n: "Café allongé", d: "12 cl", p: "3€" },
      { n: "Café double", d: "14 cl", p: "3,50€" },
      { n: "Thé vert à la menthe Twinings", d: "Théière 40 cl", p: "3,50€" },
      { n: "Thé Earl Grey Twinings", d: "Théière 40 cl", p: "3,50€" },
      { n: "Thé vert saveur citron Twinings", d: "Théière 40 cl", p: "3,50€" },
      { n: "Infusion Menthe", d: "La Tisanière Après Repas · Théière 40 cl", p: "3,50€" }
    ],
    "alcool": [
      { n: "Bière pression", d: "25 cl", p: "4,20€" },
      { n: "Bière pression", d: "50 cl", p: "8€" },
      { n: "Chardonnay Grand Ardèche Louis Latour", d: "Vin blanc · Verre 12,5 cl", p: "7€" },
      { n: "Chardonnay Grand Ardèche Louis Latour", d: "Vin blanc · Bouteille 75 cl", p: "33€" },
      { n: "Sancerre Les Demoiselles, Domaine Bernard Fleuriet et Fils", d: "Vin rouge · Verre 12,5 cl", p: "8,50€" },
      { n: "Sancerre Les Demoiselles, Domaine Bernard Fleuriet et Fils", d: "Vin rouge · Bouteille 75 cl", p: "42€" },
      { n: "Gremillet Blanc de Noirs Brut", d: "Champagne · Bouteille 75 cl", p: "65€" }
    ],
    "snack": [
      { n: "Bounty", d: "57g", p: "2,80€" },
      { n: "M&M's Peanut", d: "45g", p: "2,80€" },
      { n: "Mars", d: "51g", p: "2,80€" },
      { n: "Snickers", d: "50g", p: "2,80€" },
      { n: "Twix", d: "50g", p: "2,80€" },
      { n: "Popcorn Baff Caramel", d: "200g", p: "4€" },
      { n: "Chips Lay's Barbecue", d: "130g", p: "3€" }
    ],
    "pizza": [
      { n: "Margherita", d: "Sauce tomate à l'origan, mozzarella et basilic", p: "10€", b: "Végé" },
      { n: "Reine", d: "Sauce tomate à l'origan, mozzarella, jambon et basilic", p: "11€" },
      { n: "3 Fromages", d: "Sauce tomate à l'origan, mozzarella, emmental, chèvre et basilic", p: "11,50€", b: "Végé" },
      { n: "Orientale", d: "Sauce tomate à l'origan, mozzarella, merguez halal, poivrons et basilic", p: "11,50€", b: "Halal" },
      { n: "Diavola", d: "Sauce tomate à l'origan, mozzarella, chorizo, poivrons et basilic", p: "11,50€" },
      { n: "Montagnarde", d: "Crème fraîche, mozzarella, jambon cru, raclette, champignons et basilic", p: "12€" },
      { n: "All Pollo", d: "Sauce tomate à l'origan, mozzarella, poulet rôti halal, oignons rouges, sauce BBQ et basilic", p: "12€", b: "Halal" },
      { n: "Méridionale", d: "Sauce tomate à l'origan, poivrons, courgettes, mozzarella, oignons rouges, provola fumé, tomates séchées et basilic", p: "12€", b: "Végé" },
      { n: "D'LYR Signature", d: "Crème fraîche, mozzarella, jambon cuit fumé, mascarpone, huile de truffe et basilic", p: "13€" }
    ]
  };

  const MENU_EN = {
    "boissons-froides": [
      { n: "Coca-Cola", d: "Can 33 cl", p: "€3" },
      { n: "Coca-Cola Zero", d: "Can 33 cl", p: "€3" },
      { n: "Fanta Orange", d: "Can 33 cl", p: "€3" },
      { n: "Orangina", d: "Can 33 cl", p: "€3" },
      { n: "Sprite", d: "Can 33 cl", p: "€3" },
      { n: "Fuze Tea Peach", d: "Can 33 cl", p: "€3" },
      { n: "Oasis Tropical", d: "Can 33 cl", p: "€3" },
      { n: "Schweppes Citrus", d: "Can 33 cl", p: "€3" },
      { n: "Red Bull", d: "Can 35.5 cl", p: "€5" },
      { n: "Mont Blanc Mineral Water", d: "Still water bottle 50 cl", p: "€3" },
      { n: "San Pellegrino Sparkling Water", d: "Sparkling water bottle 50 cl", p: "€3" },
      { n: "Pago Orange", d: "Fruit juice · Bottle 33 cl", p: "€4" },
      { n: "Pago Strawberry", d: "Fruit juice · Bottle 33 cl", p: "€4" },
      { n: "Pago Tropical", d: "Fruit juice · Bottle 33 cl", p: "€4" },
      { n: "Pago Pineapple", d: "Fruit juice · Bottle 33 cl", p: "€4" },
      { n: "La Goudale 0.0%", d: "Non-alcoholic beer · Bottle 33 cl", p: "€5" }
    ],
    "boissons-chaudes": [
      { n: "Espresso", d: "7 cl", p: "€2.50" },
      { n: "Americano", d: "12 cl", p: "€3" },
      { n: "Double Espresso", d: "14 cl", p: "€3.50" },
      { n: "Twinings Mint Green Tea", d: "Teapot 40 cl", p: "€3.50" },
      { n: "Twinings Earl Grey Tea", d: "Teapot 40 cl", p: "€3.50" },
      { n: "Twinings Lemon Green Tea", d: "Teapot 40 cl", p: "€3.50" },
      { n: "Mint Herbal Infusion", d: "La Tisanière After Meal · Teapot 40 cl", p: "€3.50" }
    ],
    "alcool": [
      { n: "Draft Beer", d: "25 cl", p: "€4.20" },
      { n: "Draft Beer", d: "50 cl", p: "€8" },
      { n: "Chardonnay Grand Ardèche Louis Latour", d: "White wine · Glass 12.5 cl", p: "€7" },
      { n: "Chardonnay Grand Ardèche Louis Latour", d: "White wine · Bottle 75 cl", p: "€33" },
      { n: "Sancerre Les Demoiselles, Domaine Bernard Fleuriet et Fils", d: "Red wine · Glass 12.5 cl", p: "€8.50" },
      { n: "Sancerre Les Demoiselles, Domaine Bernard Fleuriet et Fils", d: "Red wine · Bottle 75 cl", p: "€42" },
      { n: "Gremillet Blanc de Noirs Brut", d: "Champagne · Bottle 75 cl", p: "€65" }
    ],
    "snack": [
      { n: "Bounty", d: "57g", p: "€2.80" },
      { n: "M&M's Peanut", d: "45g", p: "€2.80" },
      { n: "Mars", d: "51g", p: "€2.80" },
      { n: "Snickers", d: "50g", p: "€2.80" },
      { n: "Twix", d: "50g", p: "€2.80" },
      { n: "Baff Caramel Popcorn", d: "200g", p: "€4" },
      { n: "Lay's Barbecue Chips", d: "130g", p: "€3" }
    ],
    "pizza": [
      { n: "Margherita", d: "Oregano tomato sauce, mozzarella and fresh basil", p: "€10", b: "Veggie" },
      { n: "Reine", d: "Oregano tomato sauce, mozzarella, ham and fresh basil", p: "€11" },
      { n: "3 Cheeses", d: "Oregano tomato sauce, mozzarella, Emmental, goat cheese and basil", p: "€11.50", b: "Veggie" },
      { n: "Orientale", d: "Oregano tomato sauce, mozzarella, halal merguez sausage, peppers and basil", p: "€11.50", b: "Halal" },
      { n: "Diavola", d: "Oregano tomato sauce, mozzarella, chorizo, peppers and basil", p: "€11.50" },
      { n: "Montagnarde", d: "Fresh cream, mozzarella, cured ham, raclette cheese, mushrooms and basil", p: "€12" },
      { n: "All Pollo", d: "Oregano tomato sauce, mozzarella, halal roasted chicken, red onions, BBQ sauce and basil", p: "€12", b: "Halal" },
      { n: "Méridionale", d: "Oregano tomato sauce, bell peppers, zucchini, mozzarella, red onions, smoked provola, sun-dried tomatoes and basil", p: "€12", b: "Veggie" },
      { n: "D'LYR Signature", d: "Fresh cream, mozzarella, smoked cooked ham, mascarpone, truffle oil and basil", p: "€13" }
    ]
  };

  const MENU = isEn ? MENU_EN : MENU_FR;
  const listEl = document.querySelector('[data-menu]');
  const tabsEl = document.querySelector('[data-tabs]');

  if (!listEl || !tabsEl) return;

  function render(key) {
    const items = MENU[key] || [];
    const bannerHtml = key === 'pizza' ? `
      <div class="menu__tagline reveal" data-d="0">
        ${isEn ? 'Dine in or takeaway' : 'À consommer sur place ou à emporter'}
      </div>` : '';

    listEl.innerHTML = bannerHtml + items.map((it, i) => `
      <div class="mitem reveal" data-d="${i % 4}">
        <div class="mitem__info">
          <div class="mitem__name">${it.n}${it.b ? `<span class="mitem__badge">${it.b}</span>` : ''}</div>
          <div class="mitem__desc">${it.d}</div>
        </div>
        <span class="mitem__dots"></span>
        <span class="mitem__price">${it.p}</span>
      </div>`).join('');
    if (window.DLYR_reveal) window.DLYR_reveal();
  }

  tabsEl.querySelectorAll('.menu__tab').forEach(b => b.addEventListener('click', () => {
    tabsEl.querySelectorAll('.menu__tab').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    render(b.dataset.tab);
  }));

  render('boissons-froides');
})();
