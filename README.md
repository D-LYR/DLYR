# D'LYR — Site vitrine

Site statique du centre de loisir VR D'LYR (Colombes) : jeux VR free-roaming, fléchettes connectées, évènements, bar & snack.

## Structure

```
├── index.html              Accueil
├── catalogue.html          Catalogue des expériences VR
├── jeu-*.html              Fiches jeux (9)
├── flechettes.html          Fléchettes
├── evenements.html         Évènements & privatisation
├── entreprises.html        Team building / séminaires
├── offrir.html             Cartes cadeaux
├── snack-bar.html          Bar & Snack
├── faq.html                FAQ
├── cgv.html, mentions-legales.html, politique-confidentialite.html
├── 404.html                Page introuvable
├── en/                     Versions anglaises (mêmes pages)
├── css/                    Styles (styles.css = base commune + 1 fichier par page)
├── js/                     Scripts (site.js = shell commun + 1 fichier par page)
├── uploads/                Médias (images, vidéos) — noms ASCII sans espaces
├── robots.txt, sitemap.xml, site.webmanifest
```

## Déploiement

Site 100 % statique : aucun build. Servir la racine telle quelle
(GitHub Pages, Cloudflare Pages, Netlify…).
