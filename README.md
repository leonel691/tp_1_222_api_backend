# tp1_222 — API REST Articles (Blog)

API backend pour la gestion d’articles de blog : Express 5, Prisma ORM, MongoDB, validation des entrées et documentation OpenAPI (Swagger).

## Prérequis

- **Node.js** 20+ (recommandé : LTS)
- Une base **MongoDB** accessible (local ou [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

## Installation

```bash
npm install
```

`postinstall` exécute automatiquement `prisma generate` pour générer le client Prisma.

## Configuration

Crée un fichier **`.env`** à la racine du projet (tu peux t’inspirer de l’exemple ci‑dessous) :

| Variable        | Description |
|----------------|-------------|
| `PORT`         | Port HTTP du serveur (défaut : `3000`) |
| `DATABASE_URL` | URL MongoDB Prisma. Le **nom de la base** se place dans le chemin de l’URL, par ex. `mongodb+srv://USER:PASS@HOST/api222?...` pour utiliser la base `api222`. |
| `BASE_URL`     | *(optionnel)* URL publique de l’API, utilisée dans Swagger (défaut : `http://localhost:3000`) |
| `NODE_ENV`     | *(optionnel)* `development` ou `production` |

Exemple (à adapter avec tes identifiants) :

```env
PORT=3000
DATABASE_URL="mongodb+srv://USER:MOT_DE_PASSE@cluster.mongodb.net/api222?appName=Cluster0"
```

Synchronise le schéma Prisma avec la base (première fois ou après modification du schéma) :

```bash
npx prisma db push
```

## Scripts

| Commande        | Rôle |
|----------------|------|
| `npm start`    | Lance le serveur avec Node |
| `npm run dev`  | Lance le serveur avec rechargement automatique (nodemon) |

## Démarrage

```bash
npm run dev
```

Le serveur écoute sur `http://localhost:PORT` (par défaut **3000**). Au démarrage, la connexion MongoDB est vérifiée (`prisma.$connect()`).

---

## Documentation interactive (Swagger)

Une fois le serveur démarré :

**[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

Tu y trouves la spécification OpenAPI, les schémas JSON et la possibilité d’essayer les requêtes.

---

## Référence de l’API

Base URL : `http://localhost:3000` (ou ta `BASE_URL`).

### Accueil

| Méthode | Chemin | Description |
|--------|--------|-------------|
| `GET`  | `/`    | Message de bienvenue JSON |

**Réponse exemple** (`200`) :

```json
{ "message": "salut et bienvenu sur mon api backend" }
```

### Articles (`/api/articles`)

Toutes les réponses sont en JSON (`Content-Type: application/json`). Les corps de requête doivent être du JSON valide.

| Méthode | Chemin | Description |
|--------|--------|-------------|
| `GET`  | `/api/articles` | Liste des articles. **Query optionnelles** : `categorie`, `auteur`, `date` (jour au format `YYYY-MM-DD`) |
| `GET`  | `/api/articles/search?query=...` | Recherche texte sur le titre et le contenu (`query` : min. 2 caractères). **À déclarer avant** `/:id` côté routeur : déjà géré dans le code. |
| `POST` | `/api/articles` | Création d’un article |
| `GET`  | `/api/articles/:id` | Détail d’un article par identifiant MongoDB |
| `PUT`  | `/api/articles/:id` | Mise à jour partielle (titre, contenu, catégorie, tags, date) |
| `DELETE` | `/api/articles/:id` | Suppression |

#### Création — corps attendu (`POST /api/articles`)

Champs requis : `titre`, `contenu`, `auteur`, `categorie`.  
Optionnels : `date` (ISO 8601), `tags` (tableau de chaînes).

Contraintes principales (express-validator) :

- `titre` : 3–255 caractères  
- `contenu` : au moins 10 caractères  
- `auteur` : 2–100 caractères  

**Réponse création** : `201` avec `success`, `message`, `data` (article créé).

#### Liste / recherche — réponses typiques

- `200` : `{ "success": true, "count": <nombre>, "data": [ ... ] }`  
- Pour la recherche : champ supplémentaire `query` avec le terme utilisé.

#### Erreurs fréquentes

- `400` : validation échouée ou ID invalide  
- `404` : article introuvable  
- `500` : erreur serveur  

---

## Exemples avec `curl`

Remplace `ID` par un identifiant MongoDB valide.

```bash
# Accueil
curl -s http://localhost:3000/

# Liste
curl -s http://localhost:3000/api/articles

# Filtre par catégorie
curl -s "http://localhost:3000/api/articles?categorie=Tech"

# Recherche
curl -s "http://localhost:3000/api/articles/search?query=prisma"

# Création
curl -s -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{"titre":"Mon titre","contenu":"Contenu assez long pour passer la validation.","auteur":"Jean","categorie":"Tech","tags":["api"]}'

# Détail
curl -s http://localhost:3000/api/articles/ID

# Mise à jour
curl -s -X PUT http://localhost:3000/api/articles/ID \
  -H "Content-Type: application/json" \
  -d '{"titre":"Nouveau titre"}'

# Suppression
curl -s -X DELETE http://localhost:3000/api/articles/ID
```

---

## Structure du projet (aperçu)

- `index.js` — point d’entrée Express, CORS, Swagger UI, routes  
- `prisma/schema.prisma` — modèle `Article` (MongoDB)  
- `src/config/` — Prisma client, spec Swagger  
- `src/routes/articles.js` — routes articles  
- `src/controllers/` — logique HTTP  
- `src/models/Article.js` — accès données via Prisma  
- `src/middlewares/validators.js` — règles express-validator  

---

## Licence

ISC
