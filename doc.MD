# MABÔTÉ - Plateforme de réservation de rituels de beauté

> **Version pédagogique** – application front‑end 100 % Vue 3 (SPA), sans back‑end réel ; données mockées en JSON. Destiné à prouver la maîtrise d’une architecture Vue moderne dans le cadre d’une soutenance de doctorat.

---

## Table des matières

1. [Présentation générale](#présentation-générale)
2. [Objectifs pédagogiques & fonctionnels](#objectifs-pédagogiques--fonctionnels)
3. [Fonctionnalités détaillées](#fonctionnalités-détaillées)

   * [Accueil](#accueil)
   * [Catalogue des Rituels](#catalogue-des-rituels)
   * [Réservation](#réservation)
   * [Tableau de bord Client](#tableau-de-bord-client)
   * [Tableau de bord Admin](#tableau-de-bord-admin)
   * [Conseils Beauté](#conseils-beauté)
   * [Contact](#contact)
   * [Authentification](#authentification)
   * [Navigation Globale](#navigation-globale)
4. [Architecture technique](#architecture-technique)
5. [Gestion d’état (Vuex) – exemples](#gestion-détat-vuex--exemples)
6. [Routing & sécurité côté client](#routing--sécurité-côté-client)
7. [Composables – exemples](#composables--exemples)
8. [Algorithmes clés](#algorithmes-clés)
9. [Technologies utilisées](#technologies-utilisées)
10. [Installation & exécution](#installation--exécution)
11. [Déploiement](#déploiement)
12. [Contribution](#contribution)
13. [Licence](#licence)

---

## Présentation générale

*MABÔTÉ* est une **application monopage Vue 3** simulant une plateforme de réservation de soins et rituels de beauté : consultation des prestations, prise de rendez‑vous, espace personnel client et tableau de bord administrateur. Les données proviennent de fichiers JSON embarqués $aucune API externe$, ce qui permet de se concentrer sur le front‑end et l’architecture Vue moderne (Composition API, Vuex 4, Vue Router 4).

<p align="center"><em>Vue synthétique du flux utilisateur&nbsp;: Accueil → Rituels → Réservation → <small>(login)</small> → Dashboard&nbsp;Client/Admin</em></p>

---

## Objectifs pédagogiques & fonctionnels

| Catégorie        | Détails                                                                                                                                                                                                                                                                                         |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fonctionnels** | - Parcourir un catalogue de rituels<br>- Réserver un créneau horaire<br>- Espace client pour gérer profil & rendez‑vous<br>- Back‑office admin complet (CRUD sur toutes les entités)<br>- Articles de conseils beauté & page contact                                                            |
| **Pédagogiques** | - Illustrer la structure d’un **projet Vue 3** propre<br>- Démontrer **Vuex** : modules, actions, mutations, getters<br>- Mettre en œuvre **guards de route** et rôles utilisateur<br>- Factoriser la logique grâce aux **composables**<br>- Utiliser **Bootstrap 5** pour un design responsive |

---

## Fonctionnalités détaillées

### Accueil

Page vitrine (`HomeView.vue`). Contenu statique + Call‑to‑Action vers les rituels et l’inscription.

```html
<!-- Extrait simplifié -->
<section class="hero text-center py-5">
  <h1 class="display-4 fw-bold">Prenez soin de vous,</h1>
  <p class="lead">Réservez votre rituel de beauté en un clic&nbsp;!</p>
  <router-link to="/rituels" class="btn btn-primary btn-lg">Découvrir nos rituels</router-link>
</section>
```

### Catalogue des Rituels

Liste dynamique (`RituelsView.vue`) affichant chaque rituel via `RituelCard.vue` :

```vue
<template>
  <div class="row g-4">
    <RituelCard v-for="rituel in rituals" :key="rituel.id" :rituel="rituel" />
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'
import RituelCard from '@/components/RituelCard.vue'

const store = useStore()
const rituals = computed(() => store.getters['rituals/allRituals'])
</script>
```

### Réservation

Page cœur de l’app : sélection date \→ génération créneaux \→ confirmation.

```js
// generateSlots.js – utilitaire Composition API
export function generateSlots(start = '09:00', end = '18:00', step = 30) {
  const slots = []
  let [h, m] = start.split(':').map(Number)
  const [endH, endM] = end.split(':').map(Number)
  while (h < endH || (h === endH && m < endM)) {
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    m += step
    if (m >= 60) { h++; m -= 60 }
  }
  return slots
}
```

Dans `ReservationView.vue`, on filtre ces créneaux avec :

```js
const availableSlots = computed(() => {
  return generateSlots().filter(s =>
    !appointments.value.some(a => a.date === selectedDate.value && a.time === s)
  )
})
```

Soumission d’une réservation :

```js
async function book() {
  if (!store.getters['auth/isAuthenticated']) {
    router.push('/login')
    return
  }
  await store.dispatch('appointments/addAppointment', {
    userId: store.getters['auth/user'].id,
    ritualId: route.params.ritualId,
    date: selectedDate.value,
    time: selectedSlot.value,
    status: 'confirmed'
  })
  toast.success('Réservation confirmée !')
}
```

### Tableau de bord Client

`ClientDashboard.vue` combine profil & rendez‑vous :

```vue
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const me = computed(() => store.getters['auth/user'])
const myAppointments = computed(() =>
  store.getters['appointments/myAppointments']
)
</script>
```

Affichage groupé par date :

```html
<div v-for="(dayAppts, date) in grouped" :key="date" class="mb-4">
  <h5>{{ date }}</h5>
  <ul class="list-group">
    <li v-for="a in dayAppts" :key="a.id" class="list-group-item d-flex justify-content-between align-items-center">
      {{ nameOfRitual(a.ritualId) }} – {{ a.time }}
      <button class="btn btn-outline-danger btn-sm" @click="cancel(a.id)">Annuler</button>
    </li>
  </ul>
</div>
```

### Tableau de bord Admin

Sections CRUD (rituels, conseils, utilisateurs, rendez‑vous, disponibilités) accessibles via onglets.

Ex. ajout d’un rituel :

```js
async function addRituel() {
  await store.dispatch('rituals/addRitual', newRituel.value)
  newRituel.value = { name: '', description: '', duration: 60, price: 0, image: '' }
}
```

### Conseils Beauté

`ConseilView.vue` **liste** → `ConseilDetailView.vue` **détail**.

```vue
<router-link :to="{ name: 'ConseilDetail', params: { id: conseil.id } }">
  <img :src="conseil.image" class="card-img-top" />
</router-link>
```

### Contact

Formulaire validé côté client :

```vue
<form @submit.prevent="submit">
  <input v-model="name" required class="form-control mb-2" placeholder="Nom" />
  <input v-model="email" type="email" required class="form-control mb-2" placeholder="Email" />
  <textarea v-model="message" required class="form-control mb-2" rows="4"/>
  <button class="btn btn-primary" type="submit">Envoyer</button>
</form>
```

### Authentification

Login / Register via module Vuex `auth` :

```js
// auth.js (extrait)
const actions = {
  login({ commit, rootState }, { email, password }) {
    const user = rootState.users.users.find(u => u.email === email && u.password === password)
    if (!user) throw new Error('Credentials')
    commit('SET_USER', user)
  },
  register({ commit, rootState }, payload) {
    const id = Date.now()
    const newUser = { ...payload, id, role: 'client' }
    rootState.users.users.push(newUser)
    commit('SET_USER', newUser)
  }
}
```

### Navigation Globale

`NavBar.vue` affiche/masque les liens selon :

```html
<li v-if="!isAuthenticated" class="nav-item"><router-link to="/login">Connexion</router-link></li>
<li v-else class="nav-item dropdown">
  <a class="dropdown-toggle" role="button" data-bs-toggle="dropdown">{{ user.name }}</a>
  <ul class="dropdown-menu">
    <li v-if="isAdmin"><router-link to="/admin" class="dropdown-item">Admin</router-link></li>
    <li v-else><router-link to="/client" class="dropdown-item">Tableau de bord</router-link></li>
    <li><a @click="logout" class="dropdown-item">Déconnexion</a></li>
  </ul>
</li>
```

---

## Architecture technique

```text
mabote-frontend/
├─ public/
├─ src/
│  ├─ assets/
│  ├─ components/      # NavBar, Footer, RituelCard, BaseForm, ...
│  ├─ composables/     # useAuth, useRituals, useFormValidation, ...
│  ├─ data/            # *.json (mock DB)
│  ├─ router/          # index.js (routes + guards)
│  ├─ store/           # modules (auth, users, rituals, conseils, appointments, availabilities)
│  ├─ views/           # HomeView, RituelsView, ReservationView, ...
│  ├─ App.vue
│  └─ main.js
└─ package.json
```

### Point d’entrée – `main.js`

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.min.css'

createApp(App).use(store).use(router).mount('#app')
```

---

## Gestion d’état (Vuex) – exemples

### Module `rituals.js`

```js
import ritualsData from '@/data/rituals.json'
export default {
  namespaced: true,
  state: () => ({ rituals: [...ritualsData] }),
  getters: {
    allRituals: (state) => state.rituals,
    getById: (state) => (id) => state.rituals.find(r => r.id === id)
  },
  mutations: {
    ADD_RITUAL(state, ritual) {
      state.rituals.push({ ...ritual, id: Date.now() })
    }
  },
  actions: {
    addRitual({ commit }, ritual) { commit('ADD_RITUAL', ritual) }
  }
}
```

---

## Routing & sécurité côté client

```js
// router/index.js – extrait
const routes = [
  { path: '/', component: HomeView },
  { path: '/rituels', component: RituelsView },
  { path: '/reservation/:ritualId', component: ReservationView, meta: { requiresAuth: true } },
  { path: '/client', component: ClientDashboard, meta: { requiresAuth: true } },
  { path: '/admin', component: AdminDashboard, meta: { requiresAuth: true, requiresAdmin: true } },
  // ...
]

router.beforeEach((to, _, next) => {
  const auth = store.getters['auth/isAuthenticated']
  const admin = store.getters['auth/isAdmin']
  if (to.meta.requiresAuth && !auth) return next('/login')
  if (to.meta.requiresAdmin && !admin) return next('/client')
  next()
})
```

---

## Composables – exemples

### `useAuth.js`

```js
import { computed } from 'vue'
import { useStore } from 'vuex'

export function useAuth() {
  const store = useStore()
  const user = computed(() => store.getters['auth/user'])
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  return { user, isAuthenticated, isAdmin }
}
```

### `useFormValidation.js` (simplifié)

```js
export function useFormValidation(state, rules) {
  const errors = reactive({})
  const validate = () => {
    for (const [field, rule] of Object.entries(rules)) {
      errors[field] = rule(state[field]) ? '' : 'Invalide'
    }
    return !Object.values(errors).some(Boolean)
  }
  return { errors, validate }
}
```

---

## Algorithmes clés

| Fonction              | Rôle                                                | Emplacement                      |
| --------------------- | --------------------------------------------------- | -------------------------------- |
| `generateSlots()`     | Générer créneaux horaires entre deux heures données | `src/composables/useSlots.js`    |
| `groupedAppointments` | Grouper RDV par date pour l’UI                      | `ClientDashboard.vue` (computed) |
| `login/register`      | Authentification sans back‑end                      | `store/modules/auth.js`          |

---

## Technologies utilisées

* **Vue 3** (+ Composition API)
* **Vuex 4**
* **Vue Router 4**
* **Bootstrap 5**
* **Vite** (bundler)
* **Node 16+ / npm 8+**

---

## Installation & exécution

```bash
# 1. Clonage
$ git clone https://github.com/MusMansouri/MABOTE.git
$ cd MABOTE/mabote-frontend

# 2. Dépendances
$ npm install

# 3. Mode développement
$ npm run dev        # ouvre http://localhost:5173

# 4. Build production
$ npm run build      # génère dist/
```

---

## Déploiement

Servez le dossier `dist/` sur un hébergement statique :

```bash
$ npm install -g serve
$ serve -s dist       # http://localhost:3000
```

Compatible GitHub Pages, Netlify, Vercel, etc.

---

## Contribution

1. Fork → branche feature → PR.
2. Merci de respecter l’architecture et le style ; créez un module Vuex ou un composable si nécessaire.
3. Pas de dépendances supplémentaires lourdes sans discussion préalable.

---

## Licence

Code publié sous licence **MIT**. Vous êtes libres de l’utiliser, le modifier et le partager avec attribution.
