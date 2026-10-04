/* ============================================================
   D'LYR — Moteur i18n FR/EN.
   Traduit les nœuds texte + attributs via window.DLYR_EN,
   observe le DOM (contenu injecté en JS, CMS, toasts) et pilote
   les boutons drapeau [data-lang-toggle] injectés par site.js.
   ============================================================ */
(function () {
  var KEY = 'dlyr_lang';
  function norm(s) { return String(s).replace(/\u2019/g, "'").replace(/[\s\u00A0\u202F\u2007]+/g, ' ').trim(); }
  var D = {};
  function rebuild() { D = {}; var raw = window.DLYR_EN || {}; for (var k in raw) D[norm(k)] = raw[k]; }
  var RX = [
    [/^Durée (.+)$/, function (m) { return 'Duration ' + m[1]; }],
    [/^(\d+) à (\d+) joueurs$/, function (m) { return m[1] + ' to ' + m[2] + ' players'; }],
    [/^(\d+) à (\d+) participants$/, function (m) { return m[1] + ' to ' + m[2] + ' participants'; }],
    [/^(\d+) expériences? disponibles?$/, function (m) { return m[1] + ' experience' + (m[1] === '1' ? '' : 's') + ' available'; }],
    [/^Merci (.+?) !$/, function (m) { return 'Thank you ' + m[1] + '!'; }],
    [/^Visuel · (.+)$/, function (m) { return 'Visual · ' + m[1]; }],
    [/^Avis (\d+)$/, function (m) { return 'Review ' + m[1]; }],
    [/^D'LYR — (.+) · Jeu VR$/, function (m) { return "D'LYR — " + m[1] + ' · VR Game'; }],
    [/^(.+) — affiche du jeu VR$/, function (m) { return m[1] + ' — VR game poster'; }]
  ];
  function tr(s) {
    var k = norm(s);
    if (!k || !/[A-Za-z\u00C0-\u024F]/.test(k)) return null;
    if (Object.prototype.hasOwnProperty.call(D, k)) return D[k];
    for (var i = 0; i < RX.length; i++) { var m = k.match(RX[i][0]); if (m) return RX[i][1](m); }
    return null;
  }

  var IS_EN = location.pathname.indexOf('/en/') !== -1;
  var FILE = location.pathname.split('/').pop() || 'index.html';
  var lang = IS_EN ? 'en' : 'fr';
  // Préférence EN mémorisée → redirection vers la version statique /en/ (indexée, hreflang)
  if (!IS_EN) { try { if (localStorage.getItem(KEY) === 'en') location.replace('en/' + FILE); } catch (e) {} }
  var ATTRS = ['alt', 'aria-label', 'title', 'placeholder'];
  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEMPLATE: 1 };

  function trText(t) {
    if (lang !== 'en') return;
    var p = t.parentNode;
    if (p && p.nodeType === 1 && SKIP[p.nodeName]) return;
    var cur = t.nodeValue, v = tr(cur);
    if (v == null) return;
    var lead = (cur.match(/^\s*/) || [''])[0], tail = (cur.match(/\s*$/) || [''])[0];
    if (lead.length === cur.length) return; // nœud uniquement blanc
    var out = lead + v + tail;
    if (out !== cur) { t.__fr = cur; t.nodeValue = out; }
  }
  function trAttrs(el) {
    if (lang !== 'en' || el.nodeType !== 1 || !el.getAttribute) return;
    if (IS_EN) for (var j = 0; j < 2; j++) { var sa = ['src', 'poster'][j], sv = el.getAttribute(sa); if (sv && /^(uploads|css|js)\//.test(sv)) el.setAttribute(sa, '../' + sv); }
    for (var i = 0; i < ATTRS.length; i++) {
      var a = ATTRS[i], val = el.getAttribute(a);
      if (!val) continue;
      var v = tr(val);
      if (v != null && v !== val) {
        el.__frA = el.__frA || {};
        if (!(a in el.__frA)) el.__frA[a] = val;
        el.setAttribute(a, v);
      }
    }
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { trText(root); return; }
    if (root.nodeType !== 1 || SKIP[root.nodeName]) return;
    trAttrs(root);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (n.nodeType === 1) return SKIP[n.nodeName] ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = w.nextNode())) { if (n.nodeType === 3) trText(n); else trAttrs(n); }
  }

  var headSaved = null;
  function trHead() {
    if (lang !== 'en') return;
    if (!headSaved) headSaved = { title: document.title, metas: {}, og: null };
    var v = tr(document.title);
    if (v != null) document.title = v;
    ['meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]'].forEach(function (sel) {
      var m = document.querySelector(sel);
      if (!m) return;
      var c = m.getAttribute('content'), t = c && tr(c);
      if (t != null && t !== c) { if (!(sel in headSaved.metas)) headSaved.metas[sel] = c; m.setAttribute('content', t); }
    });
    var og = document.querySelector('meta[property="og:locale"]');
    if (og) { if (headSaved.og == null) headSaved.og = og.getAttribute('content'); og.setAttribute('content', 'en_US'); }
  }
  function restoreAll() {
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null);
    var n = document.body;
    do {
      if (n.nodeType === 3) { if (n.__fr !== undefined) { n.nodeValue = n.__fr; delete n.__fr; } }
      else if (n.__frA) { for (var a in n.__frA) n.setAttribute(a, n.__frA[a]); delete n.__frA; }
    } while ((n = w.nextNode()));
    if (headSaved) {
      document.title = headSaved.title;
      for (var s in headSaved.metas) { var m = document.querySelector(s); if (m) m.setAttribute('content', headSaved.metas[s]); }
      if (headSaved.og != null) { var og = document.querySelector('meta[property="og:locale"]'); if (og) og.setAttribute('content', headSaved.og); }
      headSaved = null;
    }
  }

  /* ---------- Drapeaux ---------- */
  var F_EN = '<svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="40" fill="#012169"></rect><path d="M0 0 60 40M60 0 0 40" stroke="#fff" stroke-width="8"></path><path d="M0 0 60 40M60 0 0 40" stroke="#C8102E" stroke-width="4"></path><path d="M30 0v40M0 20h60" stroke="#fff" stroke-width="13"></path><path d="M30 0v40M0 20h60" stroke="#C8102E" stroke-width="8"></path></svg>';
  var F_FR = '<svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="40" fill="#fff"></rect><rect width="20" height="40" fill="#002654"></rect><rect x="40" width="20" height="40" fill="#ED2939"></rect></svg>';
  function decorate() {
    var en = lang === 'en';
    var btns = document.querySelectorAll('[data-lang-toggle]');
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i];
      if (!b.__wired) { b.__wired = 1; b.addEventListener('click', toggle); }
      var flag = en ? 'fr' : 'en';
      if (b.getAttribute('data-flag') !== flag) {
        b.setAttribute('data-flag', flag);
        b.innerHTML = en ? F_FR : F_EN;
        b.setAttribute('aria-label', en ? 'Passer le site en français' : 'Switch site to English');
        b.setAttribute('title', en ? 'Version française' : 'English version');
      }
    }
  }

  function setLang(l) {
    l = l === 'en' ? 'en' : 'fr';
    if (l === lang) { decorate(); return; }
    lang = l;
    try { localStorage.setItem(KEY, l); } catch (e) {}
    document.documentElement.lang = l;
    if (l === 'en') { rebuild(); walk(document.body); trHead(); }
    else restoreAll();
    decorate();
  }
  function toggle() {
    var toEN = lang !== 'en';
    try { localStorage.setItem(KEY, toEN ? 'en' : 'fr'); } catch (e) {}
    location.href = toEN ? 'en/' + FILE : '../' + FILE;
  }

  var mo = new MutationObserver(function (muts) {
    var sawChild = false;
    if (lang === 'en') {
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        if (m.type === 'childList') { sawChild = true; for (var j = 0; j < m.addedNodes.length; j++) walk(m.addedNodes[j]); }
        else if (m.type === 'characterData') trText(m.target);
        else if (m.type === 'attributes') trAttrs(m.target);
      }
    } else {
      for (var k = 0; k < muts.length; k++) if (muts[k].type === 'childList') { sawChild = true; break; }
    }
    if (sawChild) decorate();
  });

  function init() {
    rebuild();
    document.documentElement.lang = lang;
    mo.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    if (lang === 'en') { walk(document.body); trHead(); }
    decorate();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.DLYR_I18N = { get: function () { return lang; }, set: setLang, toggle: toggle, tr: tr };
})();
