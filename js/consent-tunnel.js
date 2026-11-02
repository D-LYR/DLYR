/* ═══════════════════════════════════════════════════════════════════════
   D'LYR — LE CONSENTEMENT DOIT TRAVERSER VERS LE TUNNEL DE RÉSERVATION

   ── LE PROBLÈME ──

   Le bandeau cookies de ce site enregistre le choix du visiteur dans
   localStorage, sous la clé « dlyr_cookie_consent ». Or localStorage est
   cloisonné PAR ORIGINE : dlyr-vr.com et admin.dlyr-vr.com — où vit le
   module de réservation — ne partagent rien du tout. Vérifié : sur
   admin.dlyr-vr.com, localStorage est vide.

   Le tunnel ne pouvait donc pas savoir ce que le visiteur a répondu ici.
   Il aurait redemandé, ou — pire — mesuré sans accord.

   ── CE QUE FAIT CE FICHIER ──

   Il recopie le choix dans un COOKIE posé sur le domaine racine
   (.dlyr-vr.com), lisible des deux côtés. Rien d'autre.

   · localStorage reste la référence pour CE site. Le cookie n'est qu'un
     messager : on ne l'écrit jamais de sa propre initiative, on ne fait
     que répéter ce que le bandeau a décidé.
   · Aucune donnée personnelle : la valeur vaut « accepted » ou
     « refused ». Rien d'autre n'y entre jamais.
   · Six mois, comme le recommande la CNIL pour la durée d'un choix.
   · SameSite=Lax et Secure : le cookie ne voyage qu'en HTTPS et jamais
     vers un autre site.

   ── POURQUOI UN FICHIER À PART, ET NON UNE MODIFICATION DE site.js ──

   Parce qu'il n'y a rien à casser. Ce fichier n'appelle rien de site.js
   et ne redéfinit rien : il écoute. Si on le retire, le site retrouve
   exactement son comportement d'avant, et le tunnel cesse simplement de
   mesurer — ce qui est le bon sens de la panne.

   ── OÙ LE POSER ──

   Dans js/, et une balise dans les pages, APRÈS celle de site.js :

       <script src="js/site.js" defer></script>
       <script src="js/consent-tunnel.js" defer></script>   ← celle-ci

   L'ordre compte un peu : posé après, il voit l'état déjà établi par
   site.js. Posé avant, il fonctionnerait quand même — il réécoute — mais
   le premier passage serait manqué.
   ═══════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var CLE_LOCALE = 'dlyr_cookie_consent';   // la clé du bandeau, inchangée
  var NOM_COOKIE = 'dlyr_consent';          // le messager vers le tunnel
  var SIX_MOIS   = 60 * 60 * 24 * 180;

  //  Le domaine racine, déduit de l'hôte : « dlyr-vr.com » aussi bien
  //  depuis « www.dlyr-vr.com » que depuis « dlyr-vr.com ». Posé avec un
  //  point devant, le cookie devient lisible par tous les sous-domaines,
  //  dont admin.dlyr-vr.com.
  function domaineRacine() {
    var parts = location.hostname.split('.');
    return parts.length > 2 ? parts.slice(-2).join('.') : location.hostname;
  }

  function ecrireCookie(valeur) {
    try {
      //  En local (localhost, 127.0.0.1) il n'y a pas de domaine racine à
      //  viser et Secure bloquerait l'écriture : on ne fait rien plutôt
      //  que d'écrire quelque chose de faux.
      if (location.protocol !== 'https:') return;
      var suffixe = '; path=/; domain=.' + domaineRacine() + '; SameSite=Lax; Secure';
      document.cookie = valeur
        ? NOM_COOKIE + '=' + encodeURIComponent(valeur) + suffixe + '; max-age=' + SIX_MOIS
        : NOM_COOKIE + '=' + suffixe + '; max-age=0';
    } catch (e) {
      //  Un cookie refusé par le navigateur ne doit jamais casser la page.
      //  Le tunnel ne mesurera pas, c'est tout ce qui doit arriver.
    }
  }

  function synchroniser() {
    var valeur = null;
    try { valeur = localStorage.getItem(CLE_LOCALE); } catch (e) { return; }
    ecrireCookie(valeur);   // null efface le cookie : aucun choix, aucune mesure
  }

  //  1. L'ÉTAT ACTUEL, TOUT DE SUITE.
  //     C'est ce qui donne le cookie aux visiteurs ayant déjà accepté
  //     AVANT la pose de ce fichier. Sans cette ligne, eux seuls ne
  //     l'auraient jamais — et ce sont les plus nombreux.
  synchroniser();

  //  2. CHAQUE NOUVEAU CHOIX.
  //     Le bandeau émet « dlyr:consent » à chaque clic, et l'écran
  //     « Gérer les cookies » repasse par le même bandeau : tout
  //     changement passe donc par ici.
  window.addEventListener('dlyr:consent', function (e) {
    ecrireCookie(e && e.detail ? e.detail : null);
  });

  //  3. LE RETRAIT, DÈS LE CLIC.
  //     « Gérer les cookies » efface le choix local puis réaffiche le
  //     bandeau. Entre les deux, le visiteur peut fermer l'onglet sans
  //     rien choisir : sans cette ligne, le cookie garderait un « oui »
  //     que le site, lui, a déjà oublié. On efface donc immédiatement, et
  //     le nouveau choix réécrira.
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href="#gerer-cookies"]');
    if (a) ecrireCookie(null);
  });

  //  4. UN AUTRE ONGLET.
  //     Accepter dans un onglet et réserver depuis un autre est un
  //     parcours banal. L'événement « storage » ne se déclenche que dans
  //     les AUTRES onglets — c'est exactement ce qu'il nous faut.
  window.addEventListener('storage', function (e) {
    if (e && e.key === CLE_LOCALE) synchroniser();
  });
})();
