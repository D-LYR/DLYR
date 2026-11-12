/* ============================================================
   D'LYR — Fenêtre « Synopsis » partagée (Expériences + Réserver par date)
   Texte seul, sans l'affiche ; un clic n'importe où la referme.
   Utilisation : DLYR_SYN.button(jeu) → HTML du bouton à poser sur l'affiche ;
   tout bouton [data-syn="slug"] ouvre la fenêtre.
   ============================================================ */
(function () {
  const EN = document.documentElement.lang === 'en';
  const T = EN ? { syn: 'Read the synopsis', goal: 'Objective', close: 'Close' }
               : { syn: 'Lire le synopsis', goal: 'Objectif', close: 'Fermer' };
  const GCOLOR = { Action: '#43744c', Aventure: '#1b8a4b', 'Escape Game': '#7c3aed', Quiz: '#0e7490', 'Adapté aux enfants': '#c2410c', Culturel: '#b91c1c' };
  const clock = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
  const ppl = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0M15 19a4.5 4.5 0 0 1 6 0"/></svg>';
  const book = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 21.5V5.5M8 7h8M8 11h6"/></svg>';
  const games = () => window.DLYR_GAMES || [];

  const box = document.createElement('div');
  box.className = 'rdate__syn';
  box.hidden = true;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-labelledby', 'rdate-syn-title');
  let from = null;

  function open(slug, trigger) {
    const g = games().find(x => x.slug === slug); if (!g) return;
    if (!box.isConnected) document.body.appendChild(box);
    box.innerHTML = `<div class="rdate__synbox">
        <button type="button" class="rdate__synx" aria-label="${T.close}">×</button>
        <div class="xcard__tags">
          ${g.genre ? `<span class="xcard__tag tag-genre" style="background:${GCOLOR[g.genre] || 'var(--blue)'}">${g.genre}</span>` : ''}
          ${g.type ? `<span class="xcard__tag tag-type">${g.type}</span>` : ''}
        </div>
        <h2 class="rdate__syntitle" id="rdate-syn-title">${g.name}</h2>
        <div class="xcard__meta rdate__synmeta">${g.dur ? `<span>${clock} ${g.dur} min</span>` : ''}${g.pl ? `<span>${ppl} ${g.pl}</span>` : ''}</div>
        ${(g.story || []).map(t => `<p>${t}</p>`).join('')}
        ${g.objective ? `<p class="rdate__syngoal"><strong>${T.goal}</strong> ${g.objective}</p>` : ''}
      </div>`;
    from = trigger || null;
    box.hidden = false;
    document.documentElement.classList.add('rdate-syn-open');
    const x = box.querySelector('.rdate__synx'); if (x) x.focus();
    if (window.DLYR_track) window.DLYR_track('Synopsis', { content_name: slug });
  }
  function close() {
    if (box.hidden) return;
    box.hidden = true; box.innerHTML = '';
    document.documentElement.classList.remove('rdate-syn-open');
    if (from) from.focus();
  }
  box.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  /* Clic sur un bouton Synopsis : on ouvre la fenêtre (et on ne suit pas le lien de l'affiche) */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-syn]'); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    open(b.dataset.syn, b);
  }, true);

  function button(g) {
    return g && g.story && g.story.length
      ? `<button type="button" class="rdate__synbtn" data-syn="${g.slug}"${g.cardTop ? ` style="top:calc(${g.cardTop} + 10px)"` : ''} aria-label="${T.syn} : ${g.name}" title="${T.syn}">${book}</button>` : '';
  }
  window.DLYR_SYN = { open, close, button };
})();
