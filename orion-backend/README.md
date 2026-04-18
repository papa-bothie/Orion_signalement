# 🛡️ ORION Backend — API de Signalement JOJ 2026

Backend NestJS pour la plateforme ORION de gestion des incidents lors des Jeux Olympiques de la Jeunesse 2026 au Sénégal.

## 📦 Stack Technique

| Composant       | Technologie               |
|-----------------|---------------------------|
| Runtime         | Node.js 18+               |
| Framework       | NestJS 11                 |
| Langage         | TypeScript (strict)       |
| Base de données | PostgreSQL                |
| ORM             | TypeORM                   |
| Validation      | class-validator            |
| Documentation   | Swagger / OpenAPI          |

---

## 🚀 Démarrage Rapide

### 1. Prérequis

- **Node.js** v18+
- **PostgreSQL** 14+ (en local ou via Docker)

### 2. Installer PostgreSQL (si pas déjà fait)

```bash
# Option Docker (recommandé)
docker run -d \
  --name orion-postgres \
  -e POSTGRES_USER=orion_user \
  -e POSTGRES_PASSWORD=orion_secret_2026 \
  -e POSTGRES_DB=orion_signalement \
  -p 5432:5432 \
  postgres:16-alpine

# Option manuelle : exécuter le script SQL
sudo -u postgres psql -f scripts/init-db.sql
```

### 3. Configurer l'environnement

```bash
cp .env.example .env
# Modifier .env avec vos paramètres PostgreSQL
```

### 4. Installer les dépendances et lancer

```bash
npm install
npm run start:dev
```

### 5. Vérifier

- **API** : http://localhost:3000/api/v1
- **Swagger** : http://localhost:3000/api/docs

---

## 🗂️ Architecture du Projet

```
src/
├── common/
│   ├── enums/                   # Statuts, types, priorités
│   ├── filters/                 # Filtre global d'exceptions
│   ├── interceptors/            # Réponse JSON uniforme
│   └── seed/                    # Données de test (dev)
├── modules/
│   ├── incidents/
│   │   ├── controllers/         # Endpoints REST
│   │   ├── dto/                 # Validation des entrées
│   │   ├── entities/            # Entité TypeORM
│   │   ├── services/            # Logique métier
│   │   └── incidents.module.ts
│   ├── agents/
│   │   ├── controllers/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── services/
│   │   └── agents.module.ts
│   └── historique/
│       └── entities/            # Journal d'audit
├── app.module.ts                # Module racine
└── main.ts                      # Bootstrap
```

---

## 📡 Endpoints API

### Incidents (`/api/v1/incidents`)

| Méthode | Route                          | Description                     |
|---------|--------------------------------|---------------------------------|
| `POST`  | `/incidents`                   | Créer un signalement (citoyen)  |
| `GET`   | `/incidents`                   | Liste paginée + filtres         |
| `GET`   | `/incidents/statistics`        | Compteurs par statut/type       |
| `GET`   | `/incidents/:id`               | Détails d'un incident           |
| `GET`   | `/incidents/reference/:ref`    | Recherche par référence ORN     |
| `PUT`   | `/incidents/:id`               | Mettre à jour (dashboard)       |
| `GET`   | `/incidents/:id/historique`    | Historique complet              |

### Agents (`/api/v1/agents`)

| Méthode | Route                 | Description              |
|---------|-----------------------|--------------------------|
| `POST`  | `/agents`             | Créer un agent           |
| `GET`   | `/agents`             | Liste des agents         |
| `GET`   | `/agents/disponibles` | Agents disponibles       |
| `GET`   | `/agents/:id`         | Détails d'un agent       |
| `PUT`   | `/agents/:id`         | Mettre à jour un agent   |

---

## 🔗 Scripts

```bash
npm run start:dev    # Développement (hot-reload)
npm run build        # Compilation
npm run start:prod   # Production
npm run test         # Tests unitaires
npm run lint         # Linting
```
