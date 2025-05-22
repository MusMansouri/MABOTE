# Tutoriel : Reconstruire le Projet "Mabote" avec Vue.js de Zéro

Bienvenue dans ce tutoriel complet où nous allons reconstruire pas à pas une application web similaire au projet "Mabote". Ce guide est conçu pour les débutants et vous accompagnera à travers chaque étape avec des explications claires, du code commenté et des conseils de bonnes pratiques.

**Objectif du projet :** Créer une application de gestion de rendez-vous (inspirée par "Mabote") avec des fonctionnalités pour les clients et les administrateurs.

**Technologies que nous allons utiliser :**

- **Vue.js (version 3)** : Un framework JavaScript progressif pour construire des interfaces utilisateur.
- **Vue Router** : Pour la gestion de la navigation et des routes côté client.
- **Vuex (ou Pinia)** : Pour la gestion d'état centralisée (nous illustrerons avec les concepts de Vuex, Pinia étant la recommandation actuelle pour les nouveaux projets Vue 3).
- **JavaScript (ES6+)** : Le langage de programmation principal.
- **HTML5 & CSS3** : Pour la structure et le style de l'application.
- **Node.js & npm/yarn** : Pour la gestion des dépendances et l'environnement de développement.

**Prérequis :**

- Connaissances de base en HTML, CSS et JavaScript.
- Node.js et npm (ou yarn) installés sur votre machine.
- Un éditeur de code (VS Code est recommandé).

---

## Table des Matières

1.  [Introduction et Configuration du Projet](#1-introduction-et-configuration-du-projet)
2.  [Les Fondamentaux de Vue.js](#2-les-fondamentaux-de-vuejs)
3.  [Construction de la Structure de Base (Layout)](#3-construction-de-la-structure-de-base-layout)
4.  [Mise en Place du Routage avec Vue Router](#4-mise-en-place-du-routage-avec-vue-router)
5.  [Gestion de l'État avec Vuex/Pinia](#5-gestion-de-létat-avec-vuexpinia)
6.  [Création des Vues et Composants Principaux](#6-création-des-vues-et-composants-principaux)
7.  [Gestion des Données (Simulée)](#7-gestion-des-données-simulée)
8.  [Utilisation des Composables (Composition API)](#8-utilisation-des-composables-composition-api)
9.  [Fonctionnalités Clés (Exemples)](#9-fonctionnalités-clés-exemples)
    - Authentification Utilisateur
    - Gestion des Rendez-vous
10. [Bonnes Pratiques](#10-bonnes-pratiques)
11. [Conclusion et Prochaines Étapes](#11-conclusion-et-prochaines-étapes)
12. [Gestion des Réservations et Disponibilités](#12-gestion-des-réservations-et-disponibilités)
13. [Notifications et Toasts](#13-notifications-et-toasts)

---

## 1. Introduction et Configuration du Projet

### 1.1 Qu'est-ce que Vue.js ?

Vue.js est un framework JavaScript open-source utilisé pour construire des interfaces utilisateur interactives. Il est connu pour sa simplicité, sa flexibilité et ses performances.

### 1.2 Installation de Vue CLI

Vue CLI est un outil en ligne de commande standard pour le développement rapide d'applications Vue.js.
Pour l'installer (si vous ne l'avez pas déjà) :

```bash
npm install -g @vue/cli
# OU
yarn global add @vue/cli
```

### 1.3 Création d'un Nouveau Projet Vue

Ouvrez votre terminal et naviguez jusqu'au répertoire où vous souhaitez créer votre projet. Ensuite, exécutez :

```bash
vue create mabote-tutorial
```

Suivez les instructions à l'écran. Pour ce tutoriel, nous allons choisir "Manually select features" et sélectionner :

- Babel
- Router (Vue Router)
- Vuex (ou Pinia si vous préférez, les concepts sont similaires pour la gestion d'état)
- Linter / Formatter (ESLint + Prettier est un bon choix)

Choisissez la version 3.x de Vue.

Une fois le projet créé, naviguez dans le répertoire du projet :

```bash
cd mabote-tutorial
```

Et lancez le serveur de développement :

```bash
npm run serve
# OU
yarn serve
```

Ouvrez votre navigateur à l'adresse indiquée (généralement `http://localhost:8080`).

### 1.4 Structure du Projet Initial

Après la création, votre projet aura une structure similaire à celle-ci :

```
mabote-tutorial/
├── node_modules/      # Dépendances du projet
├── public/            # Fichiers statiques (index.html, favicon.ico)
│   ├── favicon.ico
│   └── index.html
├── src/               # Code source de votre application
│   ├── assets/        # Ressources statiques (images, polices, etc.)
│   ├── components/    # Composants Vue réutilisables
│   ├── router/        # Configuration de Vue Router
│   │   └── index.js
│   ├── store/         # Configuration de Vuex/Pinia
│   │   └── index.js
│   ├── views/         # Composants Vue représentant les pages/vues
│   ├── App.vue        # Composant racine de l'application
│   └── main.js        # Point d'entrée de l'application
├── .eslintrc.js       # Configuration ESLint
├── .gitignore         # Fichiers à ignorer par Git
├── babel.config.js    # Configuration Babel
├── package.json       # Informations sur le projet, dépendances, scripts
└── README.md
```

Dans le projet "Mabote" original, on trouve des fichiers `jsconfig.json` (pour la configuration JavaScript, souvent utilisé pour aider les IDE avec les alias de chemin) et une structure de données locales dans `src/data/`. Nous pourrons ajouter cela plus tard.

### 1.5 Le Fichier `main.js`

C'est le point d'entrée de votre application. Il initialise l'instance de Vue et monte le composant racine `App.vue`.

```javascript
// src/main.js (Exemple avec Vue 3, Vue Router, Vuex)
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // Notre fichier de routage
import store from "./store"; // Notre store Vuex

// Crée l'application Vue
const app = createApp(App);

// Utilise les plugins
app.use(store);
app.use(router);

// Monte l'application sur l'élément #app dans public/index.html
app.mount("#app");
```

Dans le projet "Mabote", `main.js` pourrait également importer des fichiers CSS globaux ou d'autres plugins.

---

## 2. Les Fondamentaux de Vue.js

### 2.1 Composants Single File Components (SFC - `.vue`)

Les composants Vue sont la base de toute application Vue. Un fichier `.vue` (SFC) encapsule le template HTML, la logique JavaScript et le style CSS d'un composant.

Structure typique d'un fichier `.vue` :

```vue
<template>
  <!-- Structure HTML du composant -->
  <div class="mon-composant">
    <p>{{ message }}</p>
    <button @click="changerMessage">Changer Message</button>
  </div>
</template>

<script>
// Logique JavaScript du composant (Composition API avec <script setup>)
import { ref } from "vue";

const message = ref("Bonjour Vue!");

function changerMessage() {
  message.value = "Message changé !";
}

// Ou avec Options API (plus traditionnel pour Vue 2, mais toujours supporté)
/*
export default {
  name: 'MonComposant',
  data() {
    return {
      message: 'Bonjour Vue!'
    }
  },
  methods: {
    changerMessage() {
      this.message = 'Message changé !'
    }
  }
}
*/
</script>

<style scoped>
/* Styles CSS spécifiques à ce composant */
.mon-composant {
  padding: 10px;
  border: 1px solid #ccc;
}
p {
  color: blue;
}
/* L'attribut "scoped" assure que les styles ne s'appliquent qu'à ce composant */
</style>
```

### 2.2 Template Syntax

- **Interpolation de texte** : `{{ expressionJS }}`
- **Attributs dynamiques** : `v-bind:attribut="valeur"` ou `:attribut="valeur"`
  - Exemple : `<img :src="cheminImage">`
- **Écouteurs d'événements** : `v-on:evenement="methode"` ou `@evenement="methode"`
  - Exemple : `<button @click="incrementerCompteur">`

### 2.3 Directives

Les directives sont des attributs spéciaux avec le préfixe `v-`.

- `v-if`, `v-else-if`, `v-else` : Rendu conditionnel.
- `v-show` : Rendu conditionnel (bascule la propriété CSS `display`).
- `v-for` : Rendu de listes.
  - Exemple : `<li v-for="item in items" :key="item.id">{{ item.texte }}</li>`
- `v-model` : Liaison de données bidirectionnelle sur les éléments de formulaire.
  - Exemple : `<input type="text" v-model="nomUtilisateur">`

### 2.4 Réactivité : `ref` et `reactive` (Composition API)

Avec la Composition API (généralement utilisée dans `<script setup>`), vous utilisez `ref` pour les types primitifs et `reactive` pour les objets.

```vue
<script setup>
import { ref, reactive } from "vue";

const compteur = ref(0); // Pour les types primitifs (Number, String, Boolean)
const utilisateur = reactive({ nom: "Dupont", prenom: "Jean" }); // Pour les objets

function incrementer() {
  compteur.value++; // Accès via .value pour les refs
}

function changerNom() {
  utilisateur.nom = "Martin"; // Accès direct pour les objets réactifs
}
</script>
```

### 2.5 Propriétés Calculées (`computed`)

Pour des données dérivées qui dépendent d'autres données réactives.

```vue
<script setup>
import { ref, computed } from "vue";

const prenom = ref("Alice");
const nom = ref("Wonderland");

const nomComplet = computed(() => {
  return `${prenom.value} ${nom.value}`;
});
</script>

<template>
  <p>Nom complet : {{ nomComplet }}</p>
</template>
```

### 2.6 Observateurs (`watch`)

Pour exécuter du code en réponse à des changements de données.

```vue
<script setup>
import { ref, watch } from "vue";

const question = ref("");
const reponse = ref("Posez une question...");

watch(question, async (nouvelleQuestion, ancienneQuestion) => {
  if (nouvelleQuestion.includes("?")) {
    reponse.value = "Je réfléchis...";
    // Simuler un appel API
    setTimeout(() => {
      reponse.value = "La réponse est 42.";
    }, 1000);
  }
});
</script>

<template>
  <input v-model="question" placeholder="Posez une question avec un '?'" />
  <p>{{ reponse }}</p>
</template>
```

### 2.7 Props (Propriétés)

Pour passer des données d'un composant parent à un composant enfant.

```vue
<!-- Composant Enfant: MessageAlerte.vue -->
<template>
  <div :class="['alert', type]">
    {{ message }}
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "info", // 'info', 'success', 'error'
  },
});
</script>

<style scoped>
.alert {
  padding: 10px;
  border-radius: 4px;
}
.info {
  background-color: lightblue;
}
.success {
  background-color: lightgreen;
}
.error {
  background-color: lightcoral;
}
</style>
```

```vue
<!-- Composant Parent -->
<template>
  <MessageAlerte message="Ceci est une information importante." type="info" />
  <MessageAlerte :message="texteErreur" type="error" />
</template>

<script setup>
import MessageAlerte from "./MessageAlerte.vue";
import { ref } from "vue";

const texteErreur = ref("Une erreur est survenue.");
</script>
```

### 2.8 Événements Personnalisés (`emits`)

Pour communiquer des données d'un composant enfant à un composant parent.

```vue
<!-- Composant Enfant: MonBouton.vue -->
<template>
  <button @click="handleClick">Cliquez-moi</button>
</template>

<script setup>
const emit = defineEmits(["monClic"]); // Déclare les événements émis

function handleClick() {
  emit("monClic", "Donnée de l'événement"); // Émet l'événement avec une donnée optionnelle
}
</script>
```

```vue
<!-- Composant Parent -->
<template>
  <MonBouton @mon-clic="gererClicEnfant" />
  <p>Message de l'enfant : {{ messageEnfant }}</p>
</template>

<script setup>
import MonBouton from "./MonBouton.vue";
import { ref } from "vue";

const messageEnfant = ref("");

function gererClicEnfant(payload) {
  messageEnfant.value = payload;
}
</script>
```

### 2.9 Cycle de Vie des Composants

Les composants Vue passent par différentes phases (création, montage, mise à jour, démontage). Vous pouvez exécuter du code à ces moments-là.
Principaux hooks (Composition API) :

- `onMounted()`: Après que le composant a été inséré dans le DOM.
- `onUpdated()`: Après une mise à jour du composant due à un changement de données réactives.
- `onUnmounted()`: Juste avant que le composant ne soit retiré du DOM.

```vue
<script setup>
import { onMounted, onUnmounted, ref } from "vue";

const message = ref("Chargement...");

onMounted(() => {
  console.log("Composant monté !");
  message.value = "Composant prêt.";
  // Idéal pour les appels API initiaux, initialisation de bibliothèques tierces
});

onUnmounted(() => {
  console.log("Composant démonté !");
  // Idéal pour nettoyer (ex: `removeEventListener`, `clearInterval`)
});
</script>
```

---

## 3. Construction de la Structure de Base (Layout)

### 3.1 Le Composant Racine `App.vue`

`App.vue` est le composant principal qui contiendra la structure globale de votre application, comme la barre de navigation, le pied de page, et la zone où le contenu des routes sera affiché.

```vue
// src/App.vue
<template>
  <div id="app-layout">
    <NavBar />
    <!-- Notre future barre de navigation -->
    <main class="main-content">
      <router-view />
      <!-- Vue Router injectera ici le composant de la route actuelle -->
    </main>
    <Footer />
    <!-- Notre futur pied de page -->
  </div>
</template>

<script setup>
// Importez vos composants NavBar et Footer une fois créés
import NavBar from "./components/NavBar.vue";
import Footer from "./components/Footer.vue";

// Pas besoin de déclarer les composants dans `components` avec <script setup>
// s'ils sont importés et utilisés dans le template.
</script>

<style>
/* Styles globaux ou pour le layout principal */
body {
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1; /* Permet au contenu principal de prendre l'espace restant */
  padding: 20px; /* Exemple de padding */
}

/* Vous pouvez importer un fichier CSS global ici si nécessaire */
/* @import './assets/css/global.css'; */
/* Dans le projet Mabote, il y a `buttons.css` dans `src/assets/` */
/* On pourrait l'importer ici ou dans main.js */
</style>
```

### 3.2 Création du Composant `NavBar.vue`

Créez un fichier `src/components/NavBar.vue`.

```vue
// src/components/NavBar.vue
<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-logo">
        <!-- Le logo.png du projet Mabote est dans src/assets/ -->
        <img src="@/assets/logo.png" alt="Logo Mabote" />
      </router-link>
    </div>
    <ul class="navbar-links">
      <li><router-link to="/">Accueil</router-link></li>
      <li><router-link to="/rituels">Rituels</router-link></li>
      <li><router-link to="/conseils">Conseils</router-link></li>
      <li><router-link to="/about">À Propos</router-link></li>
      <li><router-link to="/contact">Contact</router-link></li>
      <!-- Liens conditionnels pour connexion/inscription/dashboard -->
      <li v-if="!isLoggedIn">
        <router-link to="/login">Connexion</router-link>
      </li>
      <li v-if="isLoggedIn">
        <router-link to="/dashboard">Mon Espace</router-link>
      </li>
      <li v-if="isLoggedIn"><button @click="logout">Déconnexion</button></li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex"; // Ou Pinia
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

// Supposons que votre store d'authentification a un getter `isLoggedIn`
// et une action `logoutUser`
const isLoggedIn = computed(() => store.getters["auth/isLoggedIn"]); // Exemple avec module 'auth'

function logout() {
  store.dispatch("auth/logoutUser").then(() => {
    router.push("/login");
  });
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f8f8; /* Adaptez la couleur */
  padding: 10px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-logo img {
  height: 40px; /* Adaptez la taille */
}

.navbar-links {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
}

.navbar-links li {
  margin-left: 20px;
}

.navbar-links a,
.navbar-links button {
  text-decoration: none;
  color: #333;
  font-weight: bold;
  background: none;
  border: none;
  cursor: pointer;
}

.navbar-links a:hover,
.navbar-links button:hover {
  color: #007bff; /* Adaptez la couleur */
}

/* Style pour le lien actif (router-link-exact-active est une classe ajoutée par Vue Router) */
.navbar-links .router-link-exact-active {
  color: #007bff; /* Adaptez la couleur */
  border-bottom: 2px solid #007bff;
}
</style>
```

**Note sur `@/assets/logo.png`**: L'alias `@` dans Vue CLI pointe vers le répertoire `src/`. Assurez-vous d'avoir une image `logo.png` dans `src/assets/`.

### 3.3 Création du Composant `Footer.vue`

Créez un fichier `src/components/Footer.vue`.

```vue
// src/components/Footer.vue
<template>
  <footer class="app-footer">
    <p>&copy; {{ currentYear }} Mabote Tutorial. Tous droits réservés.</p>
    <div class="social-links">
      <!-- Les icônes SVG du projet Mabote sont dans src/assets/ -->
      <a href="#"><img src="@/assets/facebook.svg" alt="Facebook" /></a>
      <a href="#"><img src="@/assets/instagram.svg" alt="Instagram" /></a>
      <a href="#"><img src="@/assets/twitter-x.svg" alt="Twitter" /></a>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.app-footer {
  background-color: #333; /* Adaptez la couleur */
  color: white;
  text-align: center;
  padding: 20px;
}

.social-links img {
  width: 24px; /* Adaptez la taille */
  height: 24px;
  margin: 0 10px;
  filter: invert(
    1
  ); /* Si les SVGs sont noirs, pour les rendre blancs sur fond sombre */
}
</style>
```

N'oubliez pas de placer les fichiers SVG (`facebook.svg`, `instagram.svg`, `twitter-x.svg`) dans `src/assets/`.

### 3.4 Styles Globaux et CSS

Dans le projet "Mabote", il y a un fichier `buttons.css` dans `src/assets/`. Vous pouvez l'importer dans `src/main.js` ou dans la section `<style>` de `App.vue` (sans `scoped`).

```javascript
// src/main.js (ajout de l'import CSS)
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/buttons.css"; // Importez votre CSS ici

createApp(App).use(store).use(router).mount("#app");
```

Ou dans `App.vue`:

```vue
// src/App.vue // ... template et script ...
<style>
@import "./assets/buttons.css"; /* Importation dans les styles globaux de App.vue */

/* ... autres styles globaux ... */
</style>
```

---

## 4. Mise en Place du Routage avec Vue Router

Vue Router permet de naviguer entre différentes "pages" de votre application sans recharger la page entière.

### 4.1 Configuration de `src/router/index.js`

Ce fichier a été généré par Vue CLI si vous avez sélectionné Router. Modifions-le pour nos besoins.

```javascript
// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue"; // Vue pour la page d'accueil

// Importez les autres vues au fur et à mesure que vous les créez
// Exemple:
// import AboutView from '../views/AboutView.vue'
// import LoginView from '../views/LoginView.vue'
// import RituelsView from '../views/RituelsView.vue'
// etc.

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // Route-level code-splitting (lazy loading)
    // Ceci génère un chunk séparé (about.[hash].js) pour cette route
    // qui est chargé à la demande lorsque la route est visitée.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/LoginView.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () =>
      import(/* webpackChunkName: "register" */ "../views/RegisterView.vue"),
  },
  {
    path: "/rituels",
    name: "rituels",
    component: () =>
      import(/* webpackChunkName: "rituels" */ "../views/RituelsView.vue"),
  },
  {
    path: "/conseils",
    name: "conseils",
    component: () =>
      import(/* webpackChunkName: "conseils" */ "../views/ConseilView.vue"),
  },
  {
    path: "/conseil/:id", // Route avec paramètre dynamique
    name: "conseil-detail",
    component: () =>
      import(
        /* webpackChunkName: "conseil-detail" */ "../views/ConseilDetailView.vue"
      ),
    props: true, // Passe les paramètres de route comme props au composant
  },
  {
    path: "/contact",
    name: "contact",
    component: () =>
      import(/* webpackChunkName: "contact" */ "../views/ContactView.vue"),
  },
  // Routes protégées (exemple)
  {
    path: "/dashboard",
    name: "dashboard", // Pourrait rediriger vers ClientDashboard ou AdminDashboard
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ "../views/ClientDashboard.vue"
      ), // Exemple
    meta: { requiresAuth: true }, // Méta-information pour les gardes de navigation
  },
  {
    path: "/admin",
    name: "admin-dashboard",
    component: () =>
      import(
        /* webpackChunkName: "admin-dashboard" */ "../views/AdminDashboard.vue"
      ),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  // Ajoutez ici les autres routes du projet Mabote:
  // ReservationView, ReservationConnectedView, ReservationGuestView, etc.
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL), // Mode historique HTML5
  routes,
});

// Garde de navigation (Navigation Guard)
router.beforeEach((to, from, next) => {
  const store = router.app.$store; // Accès au store (si Vuex est configuré sur l'instance de l'app)
  // Ou importez directement le store si vous n'utilisez pas Vuex de cette manière
  // import store from '../store'

  const isLoggedIn = store.getters["auth/isLoggedIn"]; // Exemple
  const userRole = store.getters["auth/userRole"]; // Exemple ('client', 'admin')

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      next({ name: "login", query: { redirect: to.fullPath } }); // Redirige vers login si non connecté
    } else {
      if (to.matched.some((record) => record.meta.requiresAdmin)) {
        if (userRole === "admin") {
          next(); // Autorisé si admin
        } else {
          next({ name: "home" }); // Non admin, redirige vers l'accueil ou une page d'erreur
        }
      } else {
        next(); // Autorisé pour les routes nécessitant juste une connexion
      }
    }
  } else {
    next(); // Toujours autoriser la navigation vers les routes publiques
  }
});

export default router;
```

**Important :** Pour que `router.app.$store` fonctionne dans `beforeEach`, Vuex doit être correctement initialisé et l'instance de l'application doit être disponible pour le routeur. Une manière plus découplée est d'importer directement le store : `import store from '../store'`.

### 4.2 Création des Composants de Vue (Views)

Créez les fichiers correspondants dans `src/views/`. Par exemple, `src/views/HomeView.vue`:

```vue
// src/views/HomeView.vue
<template>
  <div class="home">
    <h1>Bienvenue sur Mabote Tutorial</h1>
    <p>Votre plateforme de bien-être et de rituels.</p>
    <!-- Contenu spécifique à la page d'accueil -->
    <img src="@/assets/main.png" alt="Image principale" class="hero-image" />
  </div>
</template>

<script setup>
// Logique spécifique à la page d'accueil si nécessaire
// Par exemple, charger des données à afficher
</script>

<style scoped>
.home {
  text-align: center;
}
.hero-image {
  max-width: 100%;
  height: auto;
  margin-top: 20px;
}
</style>
```

Créez de même des fichiers de base pour `AboutView.vue`, `LoginView.vue`, etc., en vous inspirant des noms de fichiers du projet "Mabote".

### 4.3 Utilisation de `<router-link>` et `<router-view>`

- `<router-link to="/chemin">Lien</router-link>` : Utilisé pour la navigation. Il est rendu comme une balise `<a>`.
- `<router-view />` : Espace réservé où le composant de la route actuelle sera affiché. Nous l'avons déjà placé dans `App.vue`.

---

## 5. Gestion de l'État avec Vuex/Pinia

Pour les applications complexes, il est utile d'avoir un magasin centralisé (store) pour gérer l'état de l'application. Vuex est la solution traditionnelle, Pinia est la nouvelle recommandation officielle pour Vue 3. Nous allons esquisser une structure de type Vuex, car elle est présente dans le projet "Mabote".

### 5.1 Configuration de `src/store/index.js`

Si vous avez choisi Vuex lors de la création du projet, ce fichier existe.

```javascript
// src/store/index.js
import { createStore } from "vuex";

// Importez vos modules ici (un par fonctionnalité majeure)
import auth from "./modules/auth";
import appointments from "./modules/appointments";
import rituals from "./modules/rituals";
import conseils from "./modules/conseils";
import users from "./modules/users"; // Si vous gérez les utilisateurs via Vuex

export default createStore({
  state: {
    // État global de l'application (si nécessaire, sinon préférez les modules)
    isLoading: false,
    globalError: null,
  },
  getters: {
    // Getters globaux
    isLoading: (state) => state.isLoading,
    globalError: (state) => state.globalError,
  },
  mutations: {
    // Mutations globales
    SET_LOADING(state, status) {
      state.isLoading = status;
    },
    SET_GLOBAL_ERROR(state, error) {
      state.globalError = error;
    },
  },
  actions: {
    // Actions globales
    showLoading({ commit }) {
      commit("SET_LOADING", true);
    },
    hideLoading({ commit }) {
      commit("SET_LOADING", false);
    },
  },
  modules: {
    // Enregistrez vos modules ici
    auth,
    appointments,
    rituals,
    conseils,
    users,
  },
});
```

### 5.2 Création d'un Module Vuex (Exemple : `auth.js`)

Créez un répertoire `src/store/modules/` et ajoutez-y vos fichiers de module.

```javascript
// src/store/modules/auth.js

// Simuler une API d'authentification et des données utilisateur
// Dans une vraie application, vous feriez des appels API ici.
// Le projet Mabote utilise src/data/users.json, nous allons simuler cela.
import usersData from "@/data/users.json"; // Assurez-vous que ce chemin est correct et que le fichier existe

const state = {
  user: JSON.parse(localStorage.getItem("user")) || null, // Utilisateur connecté
  token: localStorage.getItem("token") || null, // Token d'authentification
  status: "",
};

const getters = {
  isLoggedIn: (state) => !!state.token,
  currentUser: (state) => state.user,
  authStatus: (state) => state.status,
  userRole: (state) => (state.user ? state.user.role : null), // 'client' ou 'admin'
};

const actions = {
  async login({ commit }, credentials) {
    commit("AUTH_REQUEST");
    // Simuler un appel API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = usersData.find(
          (u) =>
            u.email === credentials.email && u.password === credentials.password
        );
        if (user) {
          const token =
            "fake-jwt-token-" + Math.random().toString(36).substr(2);
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user)); // Stocker l'objet utilisateur
          commit("AUTH_SUCCESS", { token, user });
          resolve(user);
        } else {
          commit("AUTH_ERROR");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          reject("Identifiants incorrects");
        }
      }, 1000);
    });
  },
  async register({ commit }, userData) {
    commit("REGISTER_REQUEST");
    // Simuler un appel API pour l'inscription
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = usersData.find((u) => u.email === userData.email);
        if (existingUser) {
          commit("REGISTER_ERROR");
          reject("Cet email est déjà utilisé.");
          return;
        }
        // Simuler la création d'un nouvel utilisateur
        const newUser = {
          id: usersData.length + 1, // Simple ID
          ...userData,
          role: "client", // Par défaut
        };
        // Note: usersData n'est pas modifié ici car c'est une simulation.
        // Dans une vraie app, vous ajouteriez à la base de données.
        // Pour la simulation, on peut considérer que l'utilisateur est créé.
        // On ne va pas le connecter automatiquement ici pour simplifier.
        commit("REGISTER_SUCCESS");
        resolve(newUser);
      }, 1000);
    });
  },
  logoutUser({ commit }) {
    commit("LOGOUT");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Pas besoin de retourner une promesse si c'est synchrone après commit
  },
};

const mutations = {
  AUTH_REQUEST(state) {
    state.status = "loading";
  },
  AUTH_SUCCESS(state, { token, user }) {
    state.status = "success";
    state.token = token;
    state.user = user;
  },
  AUTH_ERROR(state) {
    state.status = "error";
  },
  REGISTER_REQUEST(state) {
    state.status = "registering";
  },
  REGISTER_SUCCESS(state) {
    state.status = "registered";
  },
  REGISTER_ERROR(state) {
    state.status = "register_error";
  },
  LOGOUT(state) {
    state.status = "";
    state.token = null;
    state.user = null;
  },
};

export default {
  namespaced: true, // Important pour les modules !
  state,
  getters,
  actions,
  mutations,
};
```

**Note sur `users.json`**: Créez un fichier `src/data/users.json` avec un format similaire à celui-ci pour que l'exemple fonctionne :

```json
// src/data/users.json
[
  {
    "id": 1,
    "nom": "Admin",
    "prenom": "Super",
    "email": "admin@mabote.com",
    "password": "password123",
    "role": "admin"
  },
  {
    "id": 2,
    "nom": "Client",
    "prenom": "Test",
    "email": "client@mabote.com",
    "password": "password123",
    "role": "client"
  }
]
```

### 5.3 Utilisation du Store dans les Composants

```vue
<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

// Accéder à l'état (namespaced)
const currentUser = computed(() => store.state.auth.user); // Si 'auth' est le nom du module

// Utiliser les getters (namespaced)
const isLoggedIn = computed(() => store.getters["auth/isLoggedIn"]);

// Dispatcher des actions (namespaced)
function handleLogin(credentials) {
  store
    .dispatch("auth/login", credentials)
    .then(() => {
      // Redirection ou autre logique après succès
    })
    .catch((error) => {
      // Gérer l'erreur
    });
}

// Commiter des mutations (généralement fait depuis les actions)
// store.commit('auth/SET_USER', userData) // Exemple direct, mais préférez les actions
</script>
```

Le projet "Mabote" utilise `useStoreHelpers.js`. C'est probablement un composable qui simplifie l'accès à mapState, mapGetters, etc., ou qui fournit des fonctions utilitaires pour interagir avec le store.

---

## 6. Création des Vues et Composants Principaux

Maintenant, nous allons créer quelques vues et composants clés, en nous inspirant de la structure du projet "Mabote".

### 6.1 `LoginView.vue`

```vue
// src/views/LoginView.vue
<template>
  <div class="login-view">
    <h2>Connexion</h2>
    <form @submit.prevent="submitLogin">
      <div class="form-group">
        <label for="email">Email :</label>
        <input type="email" id="email" v-model="credentials.email" required />
      </div>
      <div class="form-group">
        <label for="password">Mot de passe :</label>
        <input
          type="password"
          id="password"
          v-model="credentials.password"
          required
        />
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? "Connexion en cours..." : "Se connecter" }}
      </button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
    <p>
      Pas encore de compte ?
      <router-link to="/register">Inscrivez-vous</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

const store = useStore();
const router = useRouter();
const route = useRoute();

const credentials = reactive({
  email: "",
  password: "",
});

const error = ref(null);

const isLoading = computed(() => store.state.auth.status === "loading");

async function submitLogin() {
  error.value = null;
  try {
    await store.dispatch("auth/login", credentials);
    // Redirection après connexion réussie
    // Si une redirection était demandée (ex: accès à une page protégée)
    const redirectPath = route.query.redirect || "/";
    router.push(redirectPath);
  } catch (err) {
    error.value =
      err.message || "Une erreur est survenue lors de la connexion.";
  }
}
</script>

<style scoped>
.login-view {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
}
.form-group input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  background-color: #aaa;
}
.error-message {
  color: red;
  margin-top: 10px;
}
</style>
```

Créez un `RegisterView.vue` sur le même modèle.

### 6.2 `RituelCard.vue` (Exemple de composant réutilisable)

Ce composant afficherait les informations d'un rituel.

```vue
// src/components/RituelCard.vue
<template>
  <div class="rituel-card">
    <img :src="imageSource" :alt="rituel.nom" class="rituel-image" />
    <h3>{{ rituel.nom }}</h3>
    <p class="rituel-description">{{ rituel.description_courte }}</p>
    <p class="rituel-prix">{{ rituel.prix }} €</p>
    <router-link :to="`/rituel/${rituel.id}`" class="btn-details"
      >Voir détails</router-link
    >
    <!-- Ou un bouton pour ajouter au panier/réserver -->
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  rituel: {
    type: Object,
    required: true,
  },
});

// Gérer les images. Le projet Mabote a p1.png, p2.png, etc. dans src/assets
// On peut supposer que rituel.image contient le nom du fichier (ex: 'p1.png')
const imageSource = computed(() => {
  try {
    // Attention: `import()` dynamique dans `src` est complexe avec Vite/Webpack pour les assets statiques
    // Une meilleure approche est de mettre les images dans `public/images/` et d'utiliser un chemin absolu
    // ou de les importer statiquement si les noms sont connus à l'avance.
    // Pour cet exemple, on va supposer que les images sont dans public/img/rituels/
    // return `/img/rituels/${props.rituel.image}`;

    // Si les images sont dans src/assets et que vous utilisez Vite ou Webpack configuré pour cela :
    // Cette méthode est plus fiable avec Vite/Webpack pour les assets dans src/
    return new URL(`../assets/${props.rituel.image}`, import.meta.url).href;
  } catch (e) {
    return new URL(`../assets/default-ritual.png`, import.meta.url).href; // Image par défaut
  }
});
</script>

<style scoped>
.rituel-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  margin: 10px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 250px; /* Exemple de largeur */
}
.rituel-image {
  width: 100%;
  max-height: 150px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 10px;
}
.rituel-description {
  font-size: 0.9em;
  color: #555;
  min-height: 60px; /* Pour aligner les cartes */
}
.rituel-prix {
  font-weight: bold;
  color: #007bff;
  margin: 10px 0;
}
.btn-details {
  /* Utilisez les styles de buttons.css ou définissez-les ici */
  display: inline-block;
  padding: 8px 15px;
  background-color: #5cb85c;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}
</style>
```

Assurez-vous d'avoir une image par défaut `default-ritual.png` dans `src/assets/` si vous utilisez cette logique.

### 6.3 `RituelsView.vue`

Cette vue afficherait une liste de `RituelCard`.

```vue
// src/views/RituelsView.vue
<template>
  <div class="rituels-view">
    <h2>Nos Rituels</h2>
    <div v-if="isLoading" class="loading">Chargement des rituels...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div class="rituels-list" v-if="!isLoading && !error && rituels.length">
      <RituelCard v-for="rituel in rituels" :key="rituel.id" :rituel="rituel" />
    </div>
    <div v-if="!isLoading && !error && !rituels.length">
      Aucun rituel disponible pour le moment.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import RituelCard from "@/components/RituelCard.vue"; // Assurez-vous que le chemin est correct

const store = useStore();

// Accéder aux rituels depuis le store (supposant un module 'rituals')
const rituels = computed(() => store.state.rituals.items);
const isLoading = computed(() => store.state.rituals.isLoading);
const error = computed(() => store.state.rituals.error);

onMounted(() => {
  // Dispatch une action pour charger les rituels si ce n'est pas déjà fait
  // ou si on veut rafraîchir les données.
  if (!rituels.value.length) {
    // Charger seulement si la liste est vide
    store.dispatch("rituals/fetchRituels");
  }
});
</script>

<style scoped>
.rituels-view {
  padding: 20px;
}
.rituels-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* Espace entre les cartes */
  justify-content: center; /* Centre les cartes si l'espace n'est pas plein */
}
.loading,
.error {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
}
.error {
  color: red;
}
</style>
```

Vous devrez créer un module Vuex `src/store/modules/rituals.js` similaire à `auth.js` pour gérer l'état des rituels (chargement, items, erreurs) et une action `fetchRituels` qui, pour l'instant, lira les données depuis `src/data/rituals.json`.

---

## 7. Gestion des Données (Simulée)

> **Remarque :**  
> Si vous avez finalisé la migration vers l'API backend, toutes les opérations de récupération, ajout, modification ou suppression de données (rendez-vous, rituels, conseils, etc.) doivent désormais passer par des appels HTTP à l'API (via axios), et non plus par la lecture de fichiers JSON locaux.  
> Les exemples ci-dessous sont à adapter pour utiliser les actions Vuex qui appellent l'API.

Le projet "Mabote" utilise des fichiers JSON locaux dans `src/data/` (e.g., `appointments.json`, `rituals.json`). Pour notre tutoriel, nous allons simuler la récupération de ces données.

### 7.1 Création des Fichiers de Données

Créez le répertoire `src/data/` et ajoutez-y des fichiers JSON. Par exemple :

```json
// src/data/rituals.json
[
  {
    "id": 1,
    "nom": "Rituel de Relaxation Profonde",
    "description_courte": "Un voyage sensoriel pour apaiser le corps et l'esprit.",
    "description_longue": "Ce rituel combine des techniques de massage doux, d'aromathérapie et de méditation guidée pour une relaxation totale.",
    "prix": 75,
    "duree_minutes": 60,
    "image": "p1.png"
  },
  {
    "id": 2,
    "nom": "Soin Énergisant Matinal",
    "description_courte": "Boostez votre journée avec ce soin vivifiant.",
    "description_longue": "Un mélange de techniques de friction, d'huiles essentielles stimulantes et de points de pression pour réveiller votre énergie vitale.",
    "prix": 60,
    "duree_minutes": 45,
    "image": "p2.png"
  }
  // ... autres rituels
]
```

Créez des fichiers similaires pour `conseils.json`, `appointments.json`, etc.

### 7.2 Module Vuex pour les Rituels (`rituals.js`)

> **À adapter pour l'API :**  
> Remplacez l'import des données locales par des appels axios à l'API backend dans vos actions Vuex.

```javascript
// src/store/modules/rituals.js
import ritualsData from "@/data/rituals.json"; // Importez vos données

const state = {
  items: [],
  isLoading: false,
  error: null,
};

const getters = {
  allRituels: (state) => state.items,
  getRituelById: (state) => (id) => {
    return state.items.find((rituel) => rituel.id === parseInt(id));
  },
};

const actions = {
  async fetchRituels({ commit }) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);
    // Simuler un appel API
    return new Promise((resolve) => {
      setTimeout(() => {
        commit("SET_RITUELS", ritualsData);
        commit("SET_LOADING", false);
        resolve(ritualsData);
      }, 500); // Simuler une latence réseau
    });
  },
  // Ajoutez d'autres actions si nécessaire (addRituel, updateRituel, etc.)
};

const mutations = {
  SET_RITUELS(state, rituels) {
    state.items = rituels;
  },
  SET_LOADING(state, status) {
    state.isLoading = status;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  // Ajoutez d'autres mutations
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
```

N'oubliez pas d'enregistrer ce module dans `src/store/index.js`. Faites de même pour les conseils, rendez-vous, etc.

---

## 8. Utilisation des Composables (Composition API)

Les Composables sont des fonctions qui encapsulent et réutilisent de la logique avec état en utilisant la Composition API de Vue. Le projet "Mabote" a un répertoire `src/composables/` (e.g., `useAuth.js`, `useAppointments.js`).

### 8.1 Exemple : `useAuth.js`

Ce composable pourrait simplifier l'interaction avec le module Vuex `auth`.

```javascript
// src/composables/useAuth.js
import { computed } from "vue";
import { useStore } from "vuex";

export function useAuth() {
  const store = useStore();

  const user = computed(() => store.state.auth.user);
  const isLoggedIn = computed(() => store.getters["auth/isLoggedIn"]);
  const authStatus = computed(() => store.state.auth.status);
  const userRole = computed(() => store.getters["auth/userRole"]);

  const login = (credentials) => {
    return store.dispatch("auth/login", credentials);
  };

  const register = (userData) => {
    return store.dispatch("auth/register", userData);
  };

  const logout = () => {
    // Pas besoin de retourner la promesse si l'action logoutUser ne retourne rien
    // ou si on ne veut pas la chaîner.
    store.dispatch("auth/logoutUser");
  };

  return {
    user,
    isLoggedIn,
    authStatus,
    userRole,
    login,
    register,
    logout,
  };
}
```

### 8.2 Utilisation du Composable dans un Composant

```vue
// Exemple dans LoginView.vue ou NavBar.vue
<script setup>
import { useAuth } from "@/composables/useAuth"; // Assurez-vous que le chemin est correct
import { ref, reactive } from "vue";
import { useRouter } from "vue-router"; // Si redirection nécessaire

const { login, isLoggedIn, authStatus } = useAuth();
const router = useRouter(); // Si redirection nécessaire

const credentials = reactive({ email: "", password: "" });
const error = ref(null);

async function submitLogin() {
  error.value = null;
  try {
    await login(credentials);
    if (isLoggedIn.value) {
      router.push("/"); // Rediriger vers l'accueil
    }
  } catch (err) {
    error.value = err.message || "Erreur de connexion.";
  }
}
</script>

<template>
  <!-- ... formulaire de connexion ... -->
  <button type="submit" :disabled="authStatus === 'loading'">
    {{ authStatus === "loading" ? "Connexion..." : "Se connecter" }}
  </button>
  <p v-if="error">{{ error }}</p>
</template>
```

Créez d'autres composables (`useAppointments.js`, `useConseils.js`) sur ce modèle pour interagir avec leurs modules Vuex respectifs.

---

## 9. Fonctionnalités Clés (Exemples)

### 9.1 Authentification Utilisateur

Nous avons déjà couvert une grande partie avec `LoginView.vue`, `RegisterView.vue`, le module `auth.js` et le composable `useAuth.js`.
N'oubliez pas les gardes de navigation dans `src/router/index.js` pour protéger les routes.

### 9.2 Gestion des Rendez-vous (Esquisse)

Cette fonctionnalité serait plus complexe. Elle impliquerait :

- **Vues :**
  - `ReservationView.vue` : Pour prendre un rendez-vous.
  - `ClientDashboard.vue` : Pour voir ses rendez-vous (composant `ClientAppointmentManager.vue`).
  - `AdminDashboard.vue` : Pour gérer tous les rendez-vous (composant `AdminAppointmentManager.vue`).
- **Module Vuex `appointments.js` :**
  - État : liste des rendez-vous, disponibilités.
  - Actions : `fetchAppointments`, `createAppointment`, `cancelAppointment`, `fetchAvailabilities`.
  - Mutations : pour mettre à jour l'état.
- **Composable `useAppointments.js` :** Pour interagir avec le module Vuex.
- **Données :** `appointments.json`, `availabilities.json`.

**Exemple de `ClientAppointmentManager.vue` (très simplifié) :**

```vue
// src/components/ClientAppointmentManager.vue
<template>
  <div class="appointment-manager">
    <h4>Mes Rendez-vous</h4>
    <div v-if="isLoading">Chargement...</div>
    <ul v-if="!isLoading && userAppointments.length">
      <li v-for="rdv in userAppointments" :key="rdv.id">
        {{ rdv.date }} à {{ rdv.heure }} - {{ rdv.serviceNom }}
        <button @click="cancel(rdv.id)">Annuler</button>
      </li>
    </ul>
    <p v-if="!isLoading && !userAppointments.length">
      Vous n'avez aucun rendez-vous.
    </p>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
// Supposons un composable useAppointments et useAuth
import { useAppointments } from "@/composables/useAppointments";
import { useAuth } from "@/composables/useAuth";

const {
  userAppointments,
  isLoading,
  fetchUserAppointments,
  cancelAppointment,
} = useAppointments();
const { user } = useAuth();

onMounted(() => {
  if (user.value) {
    fetchUserAppointments(user.value.id);
  }
});

function cancel(appointmentId) {
  if (confirm("Voulez-vous vraiment annuler ce rendez-vous ?")) {
    cancelAppointment(appointmentId)
      .then(() => {
        // Afficher un message de succès (Toast.vue)
        // Rafraîchir la liste si nécessaire (dépend de l'implémentation de cancelAppointment)
      })
      .catch((err) => {
        // Afficher une erreur
      });
  }
}
</script>

<style scoped>
/* Styles pour le gestionnaire de rendez-vous */
</style>
```

Vous devrez implémenter la logique correspondante dans `useAppointments.js` et le module Vuex `appointments.js`, en lisant/modifiant (simulé) `appointments.json`.

---

## 10. Bonnes Pratiques

- **Organisation des Fichiers :** Gardez une structure de projet claire (séparation des composants, vues, store, composables, assets, data).
- **Nommage Cohérent :** Utilisez des conventions de nommage claires (PascalCase pour les composants Vue, camelCase pour les variables et fonctions JavaScript).
- **Composants Réutilisables :** Décomposez votre interface en petits composants réutilisables.
- **Props et Événements :** Utilisez les props pour passer des données vers le bas et les événements pour communiquer vers le haut. Évitez de modifier directement les props dans un enfant.
- **Composition API :** Privilégiez la Composition API pour une meilleure organisation de la logique dans les composants complexes.
- **Gestion d'État :** Utilisez Vuex/Pinia pour l'état partagé ou complexe. Pour l'état local au composant, `ref` et `reactive` suffisent.
- **Code Commenté :** Commentez votre code, surtout les parties complexes ou la logique métier.
- **Lazy Loading pour les Routes :** Utilisez `() => import(...)` pour les composants de route afin d'améliorer le temps de chargement initial.
- **Gestion des Erreurs :** Prévoyez une gestion des erreurs pour les appels API (même simulés) et affichez des messages clairs à l'utilisateur (le projet "Mabote" a un `Toast.vue` pour cela).
- **Tests :** (Non couvert ici) Pour un projet réel, écrivez des tests unitaires et d'intégration.
- **Accessibilité (a11y) :** Pensez à rendre votre application accessible (attributs ARIA, contraste des couleurs, navigation clavier).

---

## 11. Conclusion et Prochaines Étapes

Félicitations ! Si vous avez suivi ce guide, vous avez maintenant une base solide pour construire une application Vue.js inspirée du projet "Mabote". Vous avez appris à configurer un projet, à utiliser les concepts fondamentaux de Vue, à gérer la navigation avec Vue Router, à centraliser l'état avec Vuex, et à structurer votre code de manière modulaire.

**Prochaines Étapes :**

- **Compléter toutes les fonctionnalités :** Implémentez toutes les vues, composants et logiques manquants du projet "Mabote".
- **Améliorer le Style :** Peaufinez le CSS pour correspondre davantage à l'esthétique souhaitée.
- **Validation des Formulaires :** Ajoutez une validation plus robuste aux formulaires (par exemple, avec des bibliothèques comme Vuelidate ou Yup).
- **Connecter à un Backend Réel :** Remplacez la simulation de données JSON par des appels à une véritable API backend (Node.js/Express, Firebase, Supabase, etc.).
- **Tests :** Apprenez à écrire des tests pour vos composants et votre logique.
- **Déploiement :** Explorez les options pour déployer votre application Vue.js (Netlify, Vercel, GitHub Pages, serveur dédié).

Continuez à explorer la documentation de Vue.js et de son écosystème. La pratique est la clé pour maîtriser le développement web. Bonne continuation !

---

## 0. Configuration de jsconfig.json

Pour simplifier les imports avec l’alias `@` (pointant vers `src/`), créez ou mettez à jour votre `jsconfig.json` à la racine :

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"]
    }
  },
  "include": ["src"]
}
```

---

## Installation des dépendances supplémentaires

Avant de commencer, assurez-vous d’installer toutes les dépendances nécessaires :

```bash
npm install axios bootstrap
npm install --save-dev @vue/cli-plugin-babel @vue/cli-plugin-eslint
```

Si vous souhaitez utiliser Pinia (gestion d’état moderne) :

```bash
npm install pinia
```

N’oubliez pas d’importer Bootstrap dans `src/main.js` :

```js
import "bootstrap/dist/css/bootstrap.min.css";
```

---

## Exemple minimal de Toast.vue

Créez le fichier `src/components/Toast.vue` si ce n’est pas déjà fait :

```vue
<template>
  <div v-if="config" :class="['toast', config.type]">
    {{ config.message }}
  </div>
</template>

<script setup>
const props = defineProps({
  config: Object,
});
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #333;
  color: #fff;
  padding: 16px 24px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  font-size: 1rem;
}
.toast.success {
  background: #28a745;
}
.toast.error {
  background: #dc3545;
}
.toast.info {
  background: #007bff;
}
</style>
```

---

## Vérification des fichiers de données

Vérifiez que les fichiers suivants existent dans `src/data/` :

- `users.json`
- `rituals.json`
- `appointments.json`
- `availabilities.json`
- `conseils.json`
- `feedbacks.json`

---

Pour les tests unitaires, consultez la documentation officielle de Vue ou des outils comme Jest ou Vitest pour démarrer rapidement.
