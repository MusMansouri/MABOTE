# MABÔTÉ Frontend – Cours Complet et Documentation Technique

## Table des Matières

1. [Introduction pédagogique](#introduction-pédagogique)
2. [Prérequis et Installation](#prérequis-et-installation)
3. [Structure du Projet et Organisation des Dossiers](#structure-du-projet-et-organisation-des-dossiers)
4. [Architecture Vue 3 : Concepts et Patterns](#architecture-vue-3--concepts-et-patterns)
5. [Vuex : Gestion de l'État Centralisé](#vuex--gestion-de-létat-centralisé)
6. [Composables : Réutilisation de la Logique Métier](#composables--réutilisation-de-la-logique-métier)
7. [Pages et Composants : Analyse Fonctionnelle et Code Commenté](#pages-et-composants--analyse-fonctionnelle-et-code-commenté)
8. [Gestion des Données Mockées (JSON) : Structure et Utilisation](#gestion-des-données-mockées-json--structure-et-utilisation)
9. [Sécurité, Authentification et Rôles](#sécurité-authentification-et-rôles)
10. [Expérience Utilisateur, Accessibilité et UX](#expérience-utilisateur-accessibilité-et-ux)
11. [Tests, Bonnes Pratiques et Conseils](#tests-bonnes-pratiques-et-conseils)
12. [Annexes : Diagrammes, FAQ, Cas d'Usage](#annexes--diagrammes-faq-cas-dusage)

---

## Introduction pédagogique

Bienvenue dans le projet **MABÔTÉ** !  
Ce document est conçu comme un **cours avancé** sur la conception d'une application Vue 3 professionnelle, avec gestion d'état, logique métier réutilisable, gestion de rôles, et manipulation de données mockées.  
Chaque section détaille la logique, le code, les patterns utilisés, et explique étape par étape comment chaque partie fonctionne, pour que vous puissiez apprendre, comprendre, et réutiliser ces concepts dans vos propres projets.

---

## Prérequis et Installation

### Prérequis

- Node.js >= 16.x
- npm >= 8.x
- Connaissances solides en JavaScript moderne (ES6+)
- Notions de base sur Vue.js, Vuex, Vue Router

### Installation

```bash
git clone <url-du-repo>
cd mabote-frontend
npm install
npm run dev
```

---

## Structure du Projet et Organisation des Dossiers

```
frontend/
├── src/
│   ├── assets/          # Images, logos, illustrations
│   ├── components/      # Composants réutilisables (NavBar, Footer, Card, etc.)
│   ├── composables/     # Logique métier réutilisable (useAuth, useRituals, etc.)
│   ├── data/            # Données mockées (JSON)
│   ├── router/          # Configuration des routes (index.js)
│   ├── store/           # Modules Vuex (auth, users, conseils, appointments, rituals)
│   ├── views/           # Pages principales (HomeView, RituelsView, etc.)
│   └── App.vue          # Composant racine
```

**Explication** :  
- **components/** : Petits blocs réutilisables, découplés, testables.
- **composables/** : Fonctions qui encapsulent une logique métier réutilisable (pattern Composition API).
- **data/** : Fichiers JSON qui simulent une base de données.
- **store/** : Modules Vuex, un par entité métier.
- **views/** : Pages principales, orchestrant les composants et la logique métier.
- **router/** : Déclaration des routes, gestion des guards et des rôles.

---

## Architecture Vue 3 : Concepts et Patterns

### 1. Composants et Vues

- **Composant** : Unité de base, encapsule une UI et une logique locale.
- **Vue** : Page principale, compose plusieurs composants et gère la logique métier de haut niveau.

### 2. Communication

- **Props** : Passage de données du parent à l’enfant.
- **Emits** : Remontée d’événements de l’enfant vers le parent.
- **Exemple** :
  ```vue
  <!-- Parent -->
  <RituelCard :rituel="rituel" @book="handleBook" />
  <!-- Enfant (RituelCard.vue) -->
  <button @click="$emit('book', rituel)">Réserver</button>
  ```

### 3. Réactivité

- **ref()** : Pour les valeurs scalaires ou objets simples.
- **reactive()** : Pour les objets complexes.
- **computed()** : Pour les valeurs dérivées, automatiquement recalculées.

---

## Vuex : Gestion de l'État Centralisé

### Pourquoi Vuex ?

- Permet de partager l’état entre tous les composants.
- Garantit la cohérence et la réactivité des données.
- Sépare la logique métier (actions, mutations) de l’UI.

### Structure d’un module Vuex

```js
// src/store/modules/rituals.js
import ritualsData from "@/data/rituals.json";
const state = { rituals: [...ritualsData] };
const getters = { allRituals: (state) => state.rituals };
const mutations = {
  setRituals(state, rituals) { state.rituals = rituals; },
  ADD_RITUAL(state, ritual) { state.rituals.push({ ...ritual, id: Date.now() }); }
};
const actions = {
  fetchRituals({ commit }) { commit("setRituals", [...ritualsData]); },
  addRitual({ commit }, ritual) { commit("ADD_RITUAL", ritual); }
};
export default { namespaced: true, state, getters, mutations, actions };
```

### Utilisation dans un composant

```js
import { useStore } from "vuex";
const store = useStore();
const rituals = computed(() => store.getters["rituals/allRituals"]);
store.dispatch("rituals/addRitual", { name: "Nouveau rituel", ... });
```

---

## Composables : Réutilisation de la Logique Métier

### Qu’est-ce qu’un composable ?

Un composable est une fonction qui encapsule une logique métier réutilisable, basée sur la Composition API de Vue 3.

### Exemple : useAuth.js

```js
import { ref, computed } from "vue";
const user = ref(null);
export function useAuth() {
  const isAuthenticated = computed(() => !!user.value);
  function login(email, password) { /* ... */ }
  function logout() { user.value = null; }
  function isAdmin() { return user.value?.role === "admin"; }
  return { user, isAuthenticated, login, logout, isAdmin };
}
```

### Utilisation dans un composant

```js
import { useAuth } from "@/composables/useAuth";
const { user, isAuthenticated, login, logout, isAdmin } = useAuth();
```

---

## Pages et Composants : Analyse Fonctionnelle et Code Commenté

### App.vue

- **Responsabilité** : Point d’entrée, charge NavBar, Footer, router-view.
- **Initialisation** : Appelle tous les fetch Vuex pour hydrater l’état.
- **Code clé** :
  ```js
  // ...existing code...
  onMounted(async () => {
    await Promise.all([
      fetchRituals(),
      fetchConseils(),
      fetchAppointments(),
      fetchAvailabilities(),
      fetchUsers(),
    ]);
  });
  // ...existing code...
  ```

### NavBar.vue

- **Affichage dynamique** selon l’état de connexion et le rôle.
- **Déconnexion** :
  ```js
  const handleLogout = () => store.dispatch("auth/logout");
  ```
- **Accessibilité** : aria-labels, navigation clavier.

### Footer.vue

- **Contenu** : Liens rapides, contacts, réseaux sociaux.
- **Responsive** : S’adapte à tous les écrans.

### HomeView.vue

- **Section Hero** : Présente la marque, les valeurs, les CTA principaux.
- **Statique** : Pas de logique métier.

### RituelsView.vue & RituelCard.vue

- **Affichage** : Liste tous les rituels via RituelCard.
- **Code :**
  ```vue
  <RituelCard v-for="rituel in rituals" :key="rituel.id" :rituel="rituel" />
  ```
- **RituelCard.vue :**
  ```vue
  <template>
    <div class="card">
      <img :src="rituel.image" :alt="rituel.name" />
      <div class="card-body">
        <h5>{{ rituel.name }}</h5>
        <router-link :to="{ name: 'Reservation', params: { ritualId: rituel.id } }">Prendre RDV</router-link>
      </div>
    </div>
  </template>
  <script setup>
  defineProps({ rituel: Object });
  </script>
  ```

### ReservationView.vue

- **Fonctionnalité** : Permet à l’utilisateur de réserver un créneau pour un rituel.
- **Calendrier** : Génère dynamiquement les jours et créneaux disponibles.
- **Gestion des conflits** : Empêche la réservation d’un créneau déjà pris.
- **Formulaire** : Si connecté, bouton direct. Sinon, formulaire invité.
- **Code pour générer les créneaux :**
  ```js
  function generateSlots(startTime, endTime) {
    const slots = [];
    let currentTime = startTime;
    while (currentTime < endTime) {
      slots.push(currentTime);
      const [hours, minutes] = currentTime.split(":").map(Number);
      currentTime = new Date(0, 0, 0, hours, minutes + 30)
        .toTimeString()
        .slice(0, 5);
    }
    return slots;
  }
  ```
- **Validation de réservation :**
  ```js
  async function confirmReservation() {
    const conflict = store.getters["appointments/allAppointments"].find(
      (a) => a.date === selectedDate.value && a.time === selectedSlot.value && a.status !== "cancelled"
    );
    if (conflict) {
      error.value = "Ce créneau est déjà réservé.";
      return;
    }
    // ...ajout du rendez-vous...
  }
  ```

### ClientDashboard.vue

- **Profil utilisateur** : Affichage, modification, upload d’avatar.
- **Rituels populaires** : Top 3 des rituels.
- **Conseils beauté** : Extrait des conseils.
- **Mes rendez-vous** : Liste, annulation, modification via modal.
- **Groupement des rendez-vous :**
  ```js
  const groupedAppointments = computed(() => {
    const groups = {};
    store.getters["appointments/myAppointments"].forEach((a) => {
      if (!groups[a.date]) groups[a.date] = [];
      groups[a.date].push(a);
    });
    return groups;
  });
  ```

### AdminDashboard.vue

- **Tableau de bord complet** : Stats, gestion CRUD rituels/conseils/utilisateurs/disponibilités/rendez-vous.
- **Exemple d’ajout d’un rituel :**
  ```js
  function handleAddRitual() {
    store.dispatch("rituals/addRitual", newRitual.value);
    newRitual.value = { name: "", description: "", duration: 60, price: 0, image: "" };
  }
  ```

### ConseilView.vue & ConseilDetailView.vue

- **ConseilView** : Liste des conseils, navigation vers le détail.
- **ConseilDetailView** : Affiche le détail (image, auteur, description, type).
- **Navigation :**
  ```vue
  <router-link :to="`/conseils/${conseil.id}`">Voir le détail</router-link>
  ```

### ContactView.vue

- **Formulaire de contact** : Validation, feedback utilisateur.
- **Informations** : Téléphone, adresse, réseaux sociaux.

### LoginView.vue & RegisterView.vue

- **LoginView** : Formulaire, feedback sur erreur, redirection selon le rôle.
- **RegisterView** : Formulaire, validation des mots de passe, feedback sur email déjà utilisé.
- **Code d’inscription :**
  ```js
  function registerUser() {
    if (password.value !== confirmPassword.value) {
      errorMessage.value = "Les mots de passe ne correspondent pas";
      return;
    }
    store.dispatch("auth/register", {
      name: name.value,
      email: email.value,
      password: password.value,
    });
    router.push("/client");
  }
  ```

### BaseForm.vue

- **Formulaire générique** : Génère dynamiquement les champs à partir d’un tableau de configuration.
- **Utilisation :**
  ```vue
  <BaseForm :fields="fields" :initialData="data" @submit="handleSubmit" />
  ```

---

## Gestion des Données Mockées (JSON) : Structure et Utilisation

- **rituals.json** : Rituels (id, nom, description, durée, prix, image).
- **conseils.json** : Conseils beauté (id, nom, rôle, description, type, img, photo).
- **users.json** : Utilisateurs (id, nom, email, mot de passe, rôle, photo).
- **appointments.json** : Rendez-vous (id, userId, ritualId, date, time, status, userInfo/guestInfo).
- **availabilities.json** : Disponibilités (id, date, startTime, endTime).
- **Exemple :**
  ```json
  [
    {
      "id": 1,
      "name": "Rituel de Purification",
      "description": "Un rituel apaisant...",
      "duration": 60,
      "price": 75,
      "image": "https://example.com/images/ritual1.jpg"
    }
  ]
  ```

---

## Sécurité, Authentification et Rôles

- **Connexion** : Vérification des identifiants dans le store (aucun backend).
- **Rôles** : `admin` (accès total), `client` (accès restreint).
- **Déconnexion** : Réinitialise l’utilisateur courant.
- **Garde de navigation** : Redirige vers `/login` ou `/client` si l’accès n’est pas autorisé.
- **Protection des routes** : Les routes `/admin` et `/client` sont protégées par des meta et des guards dans le router.
- **Exemple de garde :**
  ```js
  router.beforeEach((to, from, next) => {
    const isAuthenticated = !!store.getters["auth/user"];
    const isAdmin = store.getters["auth/isAdmin"];
    if (to.meta.requiresAuth && !isAuthenticated) next("/login");
    else if (to.meta.requiresAdmin && !isAdmin) next("/client");
    else next();
  }
  ```

---

## Expérience Utilisateur, Accessibilité et UX

- **Responsive** : Bootstrap, media queries, composants adaptatifs.
- **Accessibilité** : Aria-labels, navigation clavier, contrastes respectés.
- **Feedback utilisateur** : Messages de succès/erreur, spinners, toasts, modals.
- **Navigation fluide** : Redirections automatiques selon le rôle et l’état.

---

## Tests, Bonnes Pratiques et Conseils

- **Centralisez la logique métier dans Vuex et les composables.**
- **Utilisez des props et emits pour la communication parent/enfant.**
- **Validez les données côté client (ex: email, créneaux disponibles).**
- **Commentez votre code pour faciliter la prise en main par d'autres.**
- **Utilisez les modules Vuex pour séparer les responsabilités.**
- **Adaptez les composants pour la réutilisation (ex: BaseForm).**
- **Testez les flux principaux (connexion, réservation, annulation, ajout/édition).**
- **Utilisez Bootstrap pour la cohérence UI et la responsivité.**
- **Respectez l’accessibilité (aria-labels, navigation clavier, contrastes).**
- **Structurez vos dossiers pour la clarté et la maintenabilité.**

---

## Annexes : Diagrammes, FAQ, Cas d'Usage

### Diagramme de navigation

```
Accueil → Rituels → Réservation → (Connexion/Inscription) → Dashboard Client/Admin
         ↘ Conseils → Détail Conseil
         ↘ Contact
```

### Exemple de flux de réservation

```text
1. L’utilisateur sélectionne un rituel.
2. Il choisit une date et un créneau disponible.
3. S’il est connecté, il confirme directement. Sinon, il remplit le formulaire invité.
4. Le rendez-vous est ajouté au store et visible dans le dashboard.
```

### FAQ

- **Où sont stockées les données ?**  
  Dans `/src/data/*.json`, chargées en mémoire via Vuex.

- **Peut-on modifier les données sans backend ?**  
  Oui, toutes les modifications sont en mémoire (non persistées après refresh).

- **Comment ajouter un module ?**  
  Créez un JSON dans `/src/data/`, un module Vuex dans `/src/store/modules/`, exposez les getters/actions nécessaires.

- **Comment personnaliser les styles ?**  
  Modifiez les fichiers CSS/SCSS dans les composants ou `/src/assets/`.

- **Comment déployer la démo ?**  
  `npm run build` puis servez le dossier `dist/` avec un serveur statique.

---

**Ce document est conçu comme un cours avancé et une référence scientifique pour tout projet Vue 3 professionnel.**
# MABOTE
