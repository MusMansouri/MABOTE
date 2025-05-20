<!-- AppNavbar.vue -->
<template>
  <nav class="navbar navbar-expand-lg bg-secondary-subtle shadow-sm">
    <div class="container-fluid">
      <!-- Logo → lien vers "/" -->
      <router-link to="/" class="navbar-brand d-flex align-items-center gap-2">
        <img
          src="@/assets/logo.png"
          alt="Logo Ma Boté"
          height="64"
          class="ms-lg-3"
        />
        MABÔTÉ
      </router-link>

      <!-- Bouton hamburger -->
      <button
        class="navbar-toggler border-0"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasNavbar"
        aria-controls="offcanvasNavbar"
        aria-label="Menu"
      >
        <span class="navbar-toggler-icon">
          <!-- fallback burger en CSS si les icônes ne sont pas chargées -->
        </span>
      </button>

      <!-- Off-canvas -->
      <div
        class="offcanvas offcanvas-end bg-secondary-subtle"
        tabindex="-1"
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
      >
        <div class="offcanvas-header">
          <h5 class="offcanvas-title fw-bold mb-0" id="offcanvasNavbarLabel">
            MABÔTÉ
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Fermer"
          ></button>
        </div>

        <div class="offcanvas-body">
          <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
            <li v-for="link in links" :key="link.to" class="nav-item">
              <router-link
                class="nav-link nav-pill"
                :to="link.to"
                @click="hideOffcanvas"
                :aria-current="$route.path === link.to ? 'page' : undefined"
                :tabindex="$route.path === link.to ? -1 : 0"
                :aria-label="link.label"
                exact-active-class="nav-pill-active"
              >
                {{ link.label }}
              </router-link>
            </li>

            <!-- Affichage conditionnel selon l'état de connexion -->
            <template v-if="user">
              <li class="nav-item" v-if="isAdmin()">
                <router-link
                  to="/admin"
                  class="nav-link nav-pill"
                  @click="hideOffcanvas"
                  aria-label="Aller à la page admin"
                  >Admin</router-link
                >
              </li>
              <li class="nav-item" v-if="isClient()">
                <router-link
                  to="/client"
                  class="nav-link nav-pill"
                  @click="hideOffcanvas"
                  aria-label="Aller à la page compte"
                  >Compte</router-link
                >
              </li>
              <li class="nav-item">
                <a
                  href="#"
                  class="nav-link nav-pill"
                  @click="handleLogout"
                  aria-label="Déconnexion"
                  >Déconnexion</a
                >
              </li>
            </template>
            <template v-else>
              <li class="nav-item">
                <router-link
                  to="/login"
                  class="nav-link nav-pill"
                  @click="hideOffcanvas"
                  aria-label="Aller à la page connexion"
                  >Connexion</router-link
                >
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { Offcanvas } from "bootstrap";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

const user = computed(() => store.getters["auth/user"]);
const isAdmin = () => store.getters["auth/isAdmin"];
const isClient = () => store.getters["auth/isClient"];
const handleLogout = () => store.dispatch("auth/logout");

/* ===== liens de navigation ===== */
const links = [
  { to: "/", label: "Accueil" },
  { to: "/about", label: "À Propos" },
  { to: "/rituels", label: "Rituels" },
  { to: "/conseils", label: "Conseils" },
  { to: "/contact", label: "Contact" },
];

/* ===== fermeture de l'off-canvas après clic ===== */
let offcanvasInstance;
onMounted(() => {
  // Bootstrap offcanvas
  const offcanvasElement = document.getElementById("offcanvasNavbar");
  if (offcanvasElement) {
    offcanvasInstance = new Offcanvas(offcanvasElement);
  }
});

function hideOffcanvas() {
  if (offcanvasInstance) {
    offcanvasInstance.hide();
  }
}
</script>

<style scoped>
/* ---- palette de marque et arrondis cohérents ---- */
:root {
  --brand-main: #b96c53;
  --brand-dark: #2f0c03;
}
.nav-pill {
  display: inline-block;
  width: 100px;
  margin: 0 0.25rem 0.75rem;
  padding: 0.6rem 1rem;
  text-align: center;
  font-family: "Baskervville", serif;
  color: #2f0c03;
  background: var(--brand-main);
  border-radius: 1rem;
  transition: background 0.2s;
}
.nav-pill.router-link-exact-active {
  background: var(--brand-dark);
}
.nav-pill-active,
.nav-pill.router-link-exact-active {
  background: #2f0c03;
  color: #fff;
  font-weight: bold;
  outline: 2px solid #b96c53;
}
.nav-link:focus {
  outline: 2px solid #b96c53;
}
.nav-pill:hover,
.nav-pill:focus {
  background: #a45947;
}
.navbar-brand {
  margin-left: 100px;
}

/* logo légerement plus petit sur mobile */
@media (max-width: 576px) {
  img[alt^="Logo"] {
    height: 52px;
  }
}
</style>
