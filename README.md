# D'LYR — Site vitrine

Site statique du centre de loisir VR D'LYR (Colombes) : jeux VR free-roaming, fléchettes connectées, évènements, bar & snack.

## Structure

```
├── index.html              Accueil
├── catalogue.html          Catalogue des expériences VR
├── jeu-*.html              Fiches jeux (11)
├── soiree-decouverte.html  Soirée découverte
├── flechettes.html         Fléchettes
├── evenements.html         Évènements & privatisation
├── entreprises.html        Team building / séminaires
├── offrir.html             Cartes cadeaux
├── snack-bar.html          Bar & Snack
├── faq.html, contact.html
├── cgv.html, mentions-legales.html, politique-confidentialite.html
├── inauguration.html       Invitation autonome (noindex)
├── 404.html                Page introuvable
├── en/                     Versions anglaises (mêmes noms de fichiers)
├── css/                    styles.css = base commune, pages.css = pages internes,
│                           + 1 fichier par page ou famille de pages
├── js/
│   ├── site.js             Shell commun (en-tête, pied de page, réservation)
│   ├── games-data.js       Données des jeux VR
│   ├── <page>.js           1 script par page (home, catalogue, jeux, faq…)
│   └── i18n/               Moteur de traduction (i18n.js) + dictionnaires FR → EN
├── uploads/                Médias — noms en minuscules, ASCII, sans espaces
│   ├── brand/              Logos, favicon, icônes, badge (image de partage)
│   ├── decor/              Textures graphiques (bois-rond)
│   ├── equipe/             Photos des fondateurs
│   ├── lieu/               Façade, bar, lounge, espace snack
│   ├── home/               Visuels propres à l'accueil
│   ├── evenements/         Visuels évènements & entreprises
│   ├── flechettes/         Visuels fléchettes
│   └── experiences/<jeu>/  <jeu>-affiche.(jpg|png)
├── robots.txt, sitemap.xml, site.webmanifest
```

Les URL des pages (racine et `en/`) sont publiques et référencées : ne pas
renommer ni déplacer les fichiers `.html`.

## Déploiement

Site 100 % statique : aucun build. Servir la racine telle quelle
(GitHub Pages, Cloudflare Pages, Netlify…).
