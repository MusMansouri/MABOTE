# Tutoriel Backend Complet : Node.js, Express, MySQL, Sequelize, JWT, Bcrypt, Dotenv

Ce guide pas à pas vous apprend à créer un backend sécurisé et professionnel pour une application de gestion de rendez-vous (type Mabote).  
Chaque étape est expliquée pour les débutants, avec des exemples de code, des conseils et des bonnes pratiques.

---

## Table des Matières

1. [Introduction et Prérequis](#1-introduction-et-prérequis)
2. [Installation et Initialisation du Projet](#2-installation-et-initialisation-du-projet)
3. [Structure du Projet Backend](#3-structure-du-projet-backend)
4. [Configuration de l’Environnement avec dotenv](#4-configuration-de-lenvironnement-avec-dotenv)
5. [Connexion à MySQL avec Sequelize](#5-connexion-à-mysql-avec-sequelize)
6. [Création des Modèles et Relations (Sequelize)](#6-création-des-modèles-et-relations-sequelize)
   - Modèle Utilisateur (User)
   - Modèle Rituel (Ritual)
   - Modèle Rendez-vous (Appointment)
   - Modèle Conseil (Conseil)
   - Modèle Feedback (Feedback)
   - Modèle Disponibilité (Availability)
7. [Services et Logique Métier](#7-services-et-logique-métier)
8. [Contrôleurs et Routage (API REST)](#8-contrôleurs-et-routage-api-rest)
   - Authentification (Register, Login)
   - Utilisateurs
   - Rituels
   - Rendez-vous
   - Conseils
   - Feedbacks
   - Disponibilités
9. [Middlewares (Authentification, Rôles, Sécurité)](#9-middlewares-authentification-rôles-sécurité)
10. [Gestion des Erreurs et Bonnes Pratiques](#10-gestion-des-erreurs-et-bonnes-pratiques)
11. [Tests de l’API (Jest, Supertest)](#11-tests-de-lapi-jest-supertest)
12. [Déploiement et Maintenance](#12-déploiement-et-maintenance)
13. [FAQ, Astuces et Ressources pour Débutants](#13-faq-astuces-et-ressources-pour-débutants)
14. [Détails d'intégration backend pour chaque entité du frontend](#détails-dintégration-backend-pour-chaque-entité-du-frontend)

---

## 1. Prérequis et installation

### Outils nécessaires

- **Node.js** (https://nodejs.org/)
- **npm** (installé avec Node.js)
- **MySQL** (https://dev.mysql.com/downloads/)
- **Postman** (pour tester l’API, https://www.postman.com/)
- **Un éditeur de code** (VS Code recommandé)

### Initialisation du projet

```bash
mkdir backend
cd backend
npm init -y
```

### Installation des dépendances

```bash
npm install express mysql2 sequelize jsonwebtoken bcrypt dotenv cors
npm install --save-dev nodemon
```

- **express** : serveur web
- **mysql2** : connecteur MySQL
- **sequelize** : ORM pour MySQL
- **jsonwebtoken** : gestion des tokens JWT
- **bcrypt** : hashage des mots de passe
- **dotenv** : gestion des variables d’environnement
- **cors** : autoriser les requêtes du frontend
- **nodemon** : relancer le serveur automatiquement en dev

---

## 2. Structure du projet

```
backend/
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── appointmentController.js
│   ├── ritualController.js
│   ├── conseilController.js
│   ├── feedbackController.js
│   └── availabilityController.js
├── models/
│   ├── User.js
│   ├── Appointment.js
│   ├── Ritual.js
│   ├── Conseil.js
│   ├── Feedback.js
│   └── Availability.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── appointments.js
│   ├── rituals.js
│   ├── conseils.js
│   ├── feedbacks.js
│   └── availabilities.js
├── middlewares/
│   ├── auth.js
│   └── role.js
├── config/
│   └── database.js
├── services/
│   ├── userService.js
│   ├── appointmentService.js
│   ├── ritualService.js
│   ├── conseilService.js
│   ├── feedbackService.js
│   └── availabilityService.js
├── .env
├── app.js
├── package.json
```

- **controllers/** : logique métier
- **models/** : définition des tables
- **routes/** : endpoints de l’API
- **middlewares/** : vérifications (auth, rôles…)
- **config/** : configuration Sequelize
- **services/** : contient la logique métier réutilisable (ex : création, recherche, suppression, règles métier)
- **.env** : variables sensibles
- **app.js** : point d’entrée

---

## 3. Configuration de l’environnement (dotenv)

Créez un fichier `.env` à la rac :

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=motdepasse
DB_NAME=mabote
JWT_SECRET=unSecretTresLong
PORT=3001
```

Dans `config/database.js` :

```js
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

module.exports = sequelize;
```

---

## 4. Connexion à MySQL avec Sequelize

Dans `app.js` :

```js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/database");

const app = express();
app.use(cors());
app.use(express.json());

sequelize
  .authenticate()
  .then(() => console.log("Connecté à MySQL"))
  .catch((err) => console.error("Erreur connexion MySQL:", err));

// Synchronisation des modèles (à faire une seule fois en prod)
sequelize.sync();

app.listen(process.env.PORT, () => {
  console.log(`Serveur backend sur http://localhost:${process.env.PORT}`);
});
```

---

## 5. Création des modèles et relations

### User

```js
// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nom: { type: DataTypes.STRING, allowNull: false },
  prenom: { type: DataTypes.STRING, allowNull: false },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: "client" },
});

module.exports = User;
```

### Ritual

```js
// models/Ritual.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Ritual = sequelize.define("Ritual", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nom: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  prix: { type: DataTypes.FLOAT, allowNull: false },
});

module.exports = Ritual;
```

### Appointment

```js
// models/Appointment.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Ritual = require("./Ritual");

const Appointment = sequelize.define("Appointment", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  heure: { type: DataTypes.STRING, allowNull: false },
});

User.hasMany(Appointment);
Appointment.belongsTo(User);

Ritual.hasMany(Appointment);
Appointment.belongsTo(Ritual);

module.exports = Appointment;
```

### Conseil

```js
// models/Conseil.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Conseil = sequelize.define("Conseil", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  img: { type: DataTypes.STRING, allowNull: true }, // image principale
  name: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  photo: { type: DataTypes.STRING, allowNull: true }, // icône ou image secondaire
  type: { type: DataTypes.STRING, allowNull: true },
});

module.exports = Conseil;
```

### Feedback

```js
// models/Feedback.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Feedback = sequelize.define("Feedback", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  message: { type: DataTypes.TEXT, allowNull: false },
  photo: { type: DataTypes.STRING, allowNull: true }, // URL ou base64
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

User.hasMany(Feedback);
Feedback.belongsTo(User);

module.exports = Feedback;
```

### Availability

```js
// models/Availability.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Availability = sequelize.define("Availability", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  startTime: { type: DataTypes.STRING, allowNull: false }, // format HH:mm
  endTime: { type: DataTypes.STRING, allowNull: false }, // format HH:mm
});

module.exports = Availability;
```

---

## 6. Authentification sécurisée (JWT & Bcrypt)

### Contrôleur d’authentification

```js
// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ nom, prenom, email, password: hash });
    res.status(201).json({ message: "Utilisateur créé", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Utilisateur non trouvé" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: "Mot de passe incorrect" });
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
```

---

## 7. Création des routes REST (CRUD)

### Auth

```js
// routes/auth.js
const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/authController");

router.post("/register", authCtrl.register);
router.post("/login", authCtrl.login);

module.exports = router;
```

### Utilisateurs, Rituels, Rendez-vous, Conseils, Feedbacks, Disponibilités

Procédez de la même façon :

- Créez un contrôleur pour chaque entité (CRUD)
- Créez une route pour chaque entité

Exemple pour les rendez-vous :

```js
// controllers/appointmentController.js
const Appointment = require("../models/Appointment");
exports.create = async (req, res) => {
  try {
    const { date, heure, RitualId } = req.body;
    const appointment = await Appointment.create({
      date,
      heure,
      RitualId,
      UserId: req.user.id, // récupéré via le middleware d’auth
    });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.getAll = async (req, res) => {
  const appointments = await Appointment.findAll({
    include: ["User", "Ritual"],
  });
  res.json(appointments);
};
```

```js
// routes/appointments.js
const express = require("express");
const router = express.Router();
const appointmentCtrl = require("../controllers/appointmentController");
const auth = require("../middlewares/auth");

router.post("/", auth, appointmentCtrl.create);
router.get("/", auth, appointmentCtrl.getAll);

module.exports = router;
```

---

## 8. Middleware d’authentification et gestion des rôles

### Auth

```js
// middlewares/auth.js
const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token manquant" });
  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Token invalide" });
  }
};
```

### Rôle

```js
// middlewares/role.js
module.exports = (role) => (req, res, next) => {
  if (req.user.role !== role)
    return res.status(403).json({ error: "Accès interdit" });
  next();
};
```

Utilisation :

```js
const role = require("../middlewares/role");
router.delete("/:id", auth, role("admin"), userCtrl.deleteUser);
```

---

## 9. Bonnes pratiques et gestion des erreurs

- **Validation des entrées** : utilisez [express-validator](https://express-validator.github.io/)
- **Gestion centralisée des erreurs** : créez un middleware d’erreur
- **Sécurité** : ajoutez [helmet](https://helmetjs.github.io/), limitez le nombre de requêtes (rate limiting)
- **Organisation** : séparez bien controllers, services, routes

---

## 10. Tests de base

### Installation

```bash
npm install --save-dev jest supertest
```

### Exemple de test

```js
// tests/auth.test.js
const request = require("supertest");
const app = require("../app");

describe("Auth", () => {
  it("should register a user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      nom: "Test",
      prenom: "User",
      email: "test@ex.com",
      password: "123456",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.user).toHaveProperty("id");
  });
});
```

---

## 11. Déploiement et maintenance

- **Préparez votre `.env` pour la production**
- **Déployez sur Railway, Render, Heroku…**
- **Sauvegardez votre base MySQL**
- **Utilisez un outil de logs (ex : morgan)**

---

## 12. FAQ et dépannage

- **Erreur de connexion MySQL** : vérifiez vos identifiants et que le serveur tourne
- **JWT invalide** : vérifiez le header Authorization et la clé secrète
- **Problèmes de CORS** : assurez-vous que le frontend est autorisé dans `cors()`
- **Documentation utile** :
  - [Sequelize](https://sequelize.org/)
  - [Express](https://expressjs.com/)
  - [JWT](https://jwt.io/)
  - [Bcrypt](https://www.npmjs.com/package/bcrypt)

---

# Conseils et explications pour débutants

Ce tutoriel a été enrichi pour t’accompagner pas à pas, même si tu n’as jamais fait de backend. Voici des explications supplémentaires, des astuces, et des rappels pour chaque étape.

## 🟢 1. Prérequis et installation

- **Node.js** : Permet d’exécuter du JavaScript côté serveur. [Télécharger Node.js](https://nodejs.org/)
- **npm** : Le gestionnaire de paquets de Node.js. Il s’installe automatiquement avec Node.js.
- **MySQL** : Base de données relationnelle. [Télécharger MySQL](https://dev.mysql.com/downloads/)
- **Postman** : Outil pour tester les requêtes HTTP (API). [Télécharger Postman](https://www.postman.com/)
- **VS Code** : Éditeur de code moderne. [Télécharger VS Code](https://code.visualstudio.com/)

**Astuce** : Après chaque installation, ferme et rouvre ton terminal pour que les commandes soient reconnues.

## 🟢 2. Structure du projet (explications)

- **controllers/** : Reçoit la requête, appelle le service, renvoie la réponse.
- **services/** : Contient la logique métier (ex : créer un utilisateur, vérifier un mot de passe).
- **models/** : Définit la structure des tables de la base de données.
- **routes/** : Définit les chemins accessibles depuis le frontend (ex : /api/auth/login).
- **middlewares/** : Fonctions qui s’exécutent avant le contrôleur (ex : vérifier le token).
- **config/** : Fichiers de configuration (connexion à la base).
- **.env** : Ne jamais partager ce fichier ! Il contient tes mots de passe.
- **app.js** : Point d’entrée, démarre le serveur.

**Schéma de fonctionnement** :

```
[Frontend] → [Route] → [Middleware] → [Controller] → [Service] → [Model] → [Base de données]
```

## 🟢 3. Utilisation de Postman

- Pour chaque route (ex : POST /api/auth/login), tu peux créer une requête dans Postman.
- Mets l’URL (ex : http://localhost:3001/api/auth/login), choisis la méthode (POST, GET…), et ajoute le body (onglet Body > raw > JSON).
- Pour les routes protégées, ajoute un header :
  - Key : Authorization
  - Value : Bearer VOTRE_TOKEN

## 🟢 4. Gestion des erreurs et débogage

- Si tu as une erreur “ECONNREFUSED” ou “ER_ACCESS_DENIED”, vérifie que MySQL tourne et que tes identifiants sont bons.
- Si tu as “Token manquant” ou “Token invalide”, vérifie que tu envoies bien le header Authorization.
- Utilise `console.log()` partout pour comprendre ce qui se passe.
- Regarde la console de ton terminal ET la réponse dans Postman.

## 🟢 5. Sécurité et bonnes pratiques

- **Ne stocke jamais de mot de passe en clair** : toujours utiliser bcrypt.
- **Ne partage jamais ton fichier .env** (ajoute-le dans .gitignore).
- **Change la valeur de JWT_SECRET** pour chaque projet.
- **Utilise helmet et rate limiting** pour protéger ton API en production.

## 🟢 6. Conseils pour la maintenance

- Fais des sauvegardes régulières de ta base de données.
- Note les commandes utiles dans un fichier README.
- Mets à jour tes dépendances régulièrement (`npm outdated` puis `npm update`).

## 🟢 7. Ressources pour aller plus loin

- [Documentation Express](https://expressjs.com/fr/)
- [Documentation Sequelize](https://sequelize.org/)
- [Documentation JWT](https://jwt.io/)
- [Documentation Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Documentation dotenv](https://www.npmjs.com/package/dotenv)
- [Tutoriel vidéo Node.js + MySQL (YouTube)](https://www.youtube.com/results?search_query=nodejs+mysql)

## 🟢 8. Astuces pour progresser

- Commence par faire fonctionner une route simple (GET /api/test qui renvoie “ok”).
- Ajoute les fonctionnalités une par une, teste-les dans Postman.
- Si tu bloques, cherche l’erreur exacte sur Google ou StackOverflow.
- Prends le temps de lire les messages d’erreur, ils sont souvent très explicites.

---

**N’aie pas peur de recommencer ou de demander de l’aide. Le backend, c’est beaucoup d’essais/erreurs au début !**

---

## Détails d'intégration backend pour chaque entité du frontend

### 1. Utilisateurs (Users)

- **Routes à prévoir** :
  - `POST /api/auth/register` : inscription
  - `POST /api/auth/login` : connexion
  - `GET /api/users/me` : profil de l'utilisateur connecté (JWT requis)
  - `GET /api/users` : liste des utilisateurs (admin)
  - `PUT /api/users/:id` : modifier un utilisateur (admin ou soi-même)
  - `DELETE /api/users/:id` : supprimer un utilisateur (admin)
- **Exemple de réponse JSON** :

```json
{
  "id": 1,
  "nom": "Admin",
  "prenom": "Super",
  "email": "admin@mabote.com",
  "role": "admin"
}
```

- **Conseil** : protège les routes sensibles avec le middleware JWT et le middleware de rôle.

### 2. Rituels (Rituals)

- **Routes à prévoir** :
  - `GET /api/rituals` : liste de tous les rituels
  - `GET /api/rituals/:id` : détail d'un rituel
  - `POST /api/rituals` : créer un rituel (admin)
  - `PUT /api/rituals/:id` : modifier un rituel (admin)
  - `DELETE /api/rituals/:id` : supprimer un rituel (admin)
- **Exemple de réponse JSON** :

```json
{
  "id": 1,
  "nom": "Rituel de Relaxation Profonde",
  "description": "Un voyage sensoriel pour apaiser le corps et l'esprit.",
  "prix": 75
}
```

- **Conseil** : adapte le modèle Sequelize pour correspondre aux champs utilisés dans le frontend.

### 3. Rendez-vous (Appointments)

- **Routes à prévoir** :
  - `GET /api/appointments` : liste des rendez-vous de l'utilisateur connecté
  - `GET /api/appointments/all` : liste de tous les rendez-vous (admin)
  - `POST /api/appointments` : créer un rendez-vous
  - `PUT /api/appointments/:id` : modifier un rendez-vous (admin ou propriétaire)
  - `DELETE /api/appointments/:id` : annuler un rendez-vous (admin ou propriétaire)
- **Exemple de réponse JSON** :

```json
{
  "id": 1,
  "date": "2025-05-20",
  "heure": "14:00",
  "UserId": 2,
  "RitualId": 1
}
```

- **Conseil** : gère les droits d'accès (un utilisateur ne peut voir/modifier que ses rendez-vous sauf admin).

### 4. Conseils (Conseils)

- **Routes à prévoir** :

  - `GET /api/conseils` : liste de tous les conseils
  - `GET /api/conseils/:id` : détail d'un conseil
  - `POST /api/conseils` : créer un conseil (admin)
  - `PUT /api/conseils/:id` : modifier un conseil (admin)
  - `DELETE /api/conseils/:id` : supprimer un conseil (admin)

- **Exemple de contrôleur Express** :

```js
// controllers/conseilController.js
const { Conseil } = require("../models/Conseil");
const { validationResult } = require("express-validator");

exports.getAll = async (req, res) => {
  const conseils = await Conseil.findAll();
  res.json(conseils);
};

exports.getOne = async (req, res) => {
  const conseil = await Conseil.findByPk(req.params.id);
  if (!conseil) return res.status(404).json({ error: "Conseil non trouvé" });
  res.json(conseil);
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const conseil = await Conseil.create(req.body);
  res.status(201).json(conseil);
};

exports.update = async (req, res) => {
  const conseil = await Conseil.findByPk(req.params.id);
  if (!conseil) return res.status(404).json({ error: "Conseil non trouvé" });
  await conseil.update(req.body);
  res.json(conseil);
};

exports.delete = async (req, res) => {
  const conseil = await Conseil.findByPk(req.params.id);
  if (!conseil) return res.status(404).json({ error: "Conseil non trouvé" });
  await conseil.destroy();
  res.json({ message: "Conseil supprimé" });
};
```

- **Exemple de validation (express-validator)** :

```js
// routes/conseils.js
const { body } = require("express-validator");
router.post(
  "/",
  auth,
  role("admin"),
  [
    body("name").notEmpty(),
    body("role").notEmpty(),
    body("description").notEmpty(),
  ],
  conseilCtrl.create
);
```

---

### 5. Feedbacks

- **Routes à prévoir** :

  - `GET /api/feedbacks` : liste de tous les feedbacks (admin)
  - `POST /api/feedbacks` : laisser un feedback (utilisateur connecté)

- **Exemple de contrôleur Express** :

```js
// controllers/feedbackController.js
const Feedback = require("../models/Feedback");
const { validationResult } = require("express-validator");

exports.getAll = async (req, res) => {
  const feedbacks = await Feedback.findAll({ include: ["User"] });
  res.json(feedbacks);
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const feedback = await Feedback.create({
    ...req.body,
    UserId: req.user.id,
  });
  res.status(201).json(feedback);
};
```

- **Exemple de validation (express-validator)** :

```js
// routes/feedbacks.js
const { body } = require("express-validator");
router.post("/", auth, [body("message").notEmpty()], feedbackCtrl.create);
```

---

### 6. Disponibilités (Availabilities)

- **Routes à prévoir** :

  - `GET /api/availabilities` : liste des créneaux disponibles
  - `POST /api/availabilities` : ajouter un créneau (admin)
  - `DELETE /api/availabilities/:id` : supprimer un créneau (admin)

- **Exemple de contrôleur Express** :

```js
// controllers/availabilityController.js
const Availability = require("../models/Availability");
const { validationResult } = require("express-validator");

exports.getAll = async (req, res) => {
  const availabilities = await Availability.findAll();
  res.json(availabilities);
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const availability = await Availability.create(req.body);
  res.status(201).json(availability);
};

exports.delete = async (req, res) => {
  const availability = await Availability.findByPk(req.params.id);
  if (!availability)
    return res.status(404).json({ error: "Créneau non trouvé" });
  await availability.destroy();
  res.json({ message: "Créneau supprimé" });
};
```

- **Exemple de validation (express-validator)** :

```js
// routes/availabilities.js
const { body } = require("express-validator");
router.post(
  "/",
  auth,
  role("admin"),
  [
    body("date").isISO8601(),
    body("startTime").notEmpty(),
    body("endTime").notEmpty(),
  ],
  availabilityCtrl.create
);
```

---

## Cours spécial : Comprendre et utiliser le seed (seeding) avec Sequelize

### Qu'est-ce qu'un seed ?

Un **seed** (ou "donnée de seed", "seeding") est un script qui insère automatiquement des données de départ dans ta base de données. Cela permet d'avoir des exemples d'utilisateurs, de rituels, de conseils, etc. dès le lancement du projet, sans avoir à tout créer à la main via l'API ou le frontend.

**Pourquoi utiliser le seed ?**

- Pour tester rapidement le frontend avec de vraies données.
- Pour montrer une démo sans base vide.
- Pour réinitialiser la base lors du développement.

### Comment créer un seed avec Sequelize ?

1. **Crée un fichier `seed.js` à la racine du dossier backend**
2. **Importe tes modèles et la connexion Sequelize**
3. **Insère des données avec `.create()` ou `.bulkCreate()`**
4. **Lance le script avec `node seed.js`**

#### Exemple de seed simple

```js
// seed.js
const sequelize = require("./config/database");
const User = require("./models/User");
const Ritual = require("./models/Ritual");
const Conseil = require("./models/Conseil");
const Feedback = require("./models/Feedback");
const Availability = require("./models/Availability");

async function seed() {
  await sequelize.sync({ force: true }); // Réinitialise la base (danger en prod !)

  // Utilisateurs
  await User.bulkCreate([
    {
      nom: "Admin",
      prenom: "Super",
      email: "admin@mabote.com",
      password: "hashedpass",
      role: "admin",
    },
    {
      nom: "Client",
      prenom: "Test",
      email: "client@mabote.com",
      password: "hashedpass",
      role: "client",
    },
  ]);

  // Rituels
  await Ritual.bulkCreate([
    { nom: "Rituel Relax", description: "Détente totale", prix: 60 },
    { nom: "Rituel Énergie", description: "Boost d'énergie", prix: 80 },
  ]);

  // Conseils
  await Conseil.bulkCreate([
    {
      name: "Peau sèche",
      role: "Hydratation",
      description:
        "Utilisez une crème hydratante riche matin et soir. Privilégiez les nettoyants doux sans savon pour éviter d'assécher davantage la peau.",
      img: "https://images.unsplash.com/photo-1601412436009-d964bd02edbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      photo: "https://cdn-icons-png.flaticon.com/512/2748/2748558.png",
      type: "Peau sèche",
    },
    {
      name: "Peau grasse",
      role: "Matifiant",
      description:
        "Utilisez un gel nettoyant purifiant et une lotion tonique sans alcool. Utilisez des produits non comédogènes et matifiants.",
      img: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      photo: "https://cdn-icons-png.flaticon.com/512/2748/2748558.png",
      type: "Peau grasse",
    },
  ]);

  // Feedbacks
  await Feedback.bulkCreate([
    {
      message: "Super expérience !",
      UserId: 2,
      photo: "",
      createdAt: new Date(),
    },
    {
      message: "Accueil chaleureux et conseils personnalisés.",
      UserId: 2,
      photo:
        "https://images.unsplash.com/photo-1513263196760-5d4e3bb8b2c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      createdAt: new Date(),
    },
  ]);

  // Disponibilités
  await Availability.bulkCreate([
    { date: "2025-05-21", startTime: "10:00", endTime: "12:00" },
    { date: "2025-05-22", startTime: "14:00", endTime: "16:00" },
  ]);

  console.log("Seed adapté aux vraies données frontend terminé !");
  process.exit();
}

seed();
```

**À adapter selon tes besoins :**

- Ajoute d'autres exemples depuis tes fichiers JSON si besoin.
- Les IDs sont fixés ici pour la cohérence avec les relations (UserId, etc.).
- Les mots de passe sont hashés avec bcrypt.
- Les URLs d'images et les textes sont fidèles à tes données frontend.

**Pour lancer le seed :**

```bash
node seed.js
```

---
