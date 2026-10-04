/* D'LYR — Évènements */
(function () {
  const I = window.DLYR_ICONS || {};
  const ar = document.querySelector('[data-arrow]');
  if (ar) ar.innerHTML = I.arrow || '';

  // Switcher d'onglets B2B Pro
  const tabBtns = document.querySelectorAll('[data-pro-tab]');
  const tabPanes = document.querySelectorAll('[data-pro-pane]');
  if (tabBtns.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.proTab;
        tabBtns.forEach(b => {
          b.classList.toggle('is-active', b === btn);
          b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
        });
        tabPanes.forEach(pane => {
          pane.classList.toggle('is-active', pane.dataset.proPane === target);
        });
      });
    });

    // Boutons CTA "Demander un devis pour ce format"
    document.querySelectorAll('[data-select-type]').forEach(cta => {
      cta.addEventListener('click', (e) => {
        e.preventDefault();
        const typeVal = cta.dataset.selectType;
        const formEl = document.querySelector('form[data-quote]');
        const select = formEl ? formEl.querySelector('select[name="type"]') : null;
        if (select && typeVal) {
          for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].value.toLowerCase().includes(typeVal.toLowerCase()) || select.options[i].text.toLowerCase().includes(typeVal.toLowerCase())) {
              select.selectedIndex = i;
              break;
            }
          }
        }
        const targetSection = document.getElementById('reserver') || formEl;
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          const firstInput = formEl ? formEl.querySelector('input:not([type="hidden"])') : null;
          if (firstInput) {
            setTimeout(() => { firstInput.focus(); }, 450);
          }
        }
      });
    });
  }

  // Adresse de réception des demandes de devis
  const DEST = 'contact@dlyr-vr.com';
  const WORKER_ENDPOINT = 'https://dlyr.tristankouker.workers.dev/send-email';

  const form = document.querySelector('[data-quote]');
  if (!form) return;

  const TYPE_LABEL = {
    'Anniversaire': 'Anniversaire', 'EVG / EVJF': 'EVG / EVJF',
    'Team building': 'Team building', 'Séminaire': 'Séminaire', 'Autre': 'Autre',
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nom = (form.nom.value || '').trim();
    const email = (form.email.value || '').trim();
    const tel = (form.tel && form.tel.value || '').trim();
    const type = form.type.value || '';
    const pers = (form.pers.value || '').trim();
    const msg = (form.msg.value || '').trim();

    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Envoi en cours…';

    const payload = {
      Nom: nom,
      Email: email,
      'Téléphone': tel || 'Non précisé',
      'Type d\'évènement': TYPE_LABEL[type] || type,
      'Nombre de personnes': pers || 'Non précisé',
      Message: msg || '—',
      _subject: `Nouvelle demande de devis D'LYR — ${TYPE_LABEL[type] || type}`,
    };

    try {
      const res = await fetch(WORKER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data || !data.ok) throw new Error('fail');

      form.innerHTML = `<div class="quote__done"><strong>Merci ${nom || ''} !</strong><br>Votre demande a bien été envoyée. Notre équipe vous recontacte sous 24/48h.</div>`;
      window.DLYR_toast && window.DLYR_toast('Demande de devis envoyée !');
      window.DLYR_track && window.DLYR_track('Lead');
    } catch (err) {
      btn.disabled = false;
      btn.textContent = original;
      // Repli : ouverture du client mail pré-rempli
      const subject = encodeURIComponent(`Demande de devis D'LYR — ${TYPE_LABEL[type] || type}`);
      const body = encodeURIComponent(
        `Nom : ${nom}\nEmail : ${email}\nTéléphone : ${tel || 'Non précisé'}\nType d'évènement : ${TYPE_LABEL[type] || type}\n` +
        `Nombre de personnes : ${pers || 'Non précisé'}\n\nMessage :\n${msg || '—'}`
      );
      const mailto = `mailto:${DEST}?subject=${subject}&body=${body}`;
      let err2 = form.querySelector('.quote__err');
      if (!err2) {
        err2 = document.createElement('div');
        err2.className = 'quote__err';
        btn.parentNode.insertBefore(err2, btn);
      }
      err2.innerHTML = `L'envoi automatique a échoué. <a href="${mailto}">Cliquez ici pour nous écrire directement par mail</a>.`;
      window.DLYR_toast && window.DLYR_toast('Envoi impossible — utilisez le lien mail proposé');
    }
  });
})();
