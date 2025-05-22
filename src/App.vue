<template>
  <div id="app">
    <NavBar />
    <div
      v-if="logoutMessage"
      class="alert alert-warning text-center"
      style="position: fixed; top: 10px; left: 0; right: 0; z-index: 2000"
    >
      {{ logoutMessage }}
      <button class="btn btn-sm btn-link" @click="clearLogoutMessage">
        Fermer
      </button>
    </div>
    <router-view />
    <Footer />
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useStore } from "vuex"; // Correction ici
import { useStoreHelpers } from "@/composables/useStoreHelpers";
import NavBar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";
import "@/assets/buttons.css"; // Ajout du style global pour les boutons

const {
  fetchRituals,
  fetchConseils,
  fetchAppointments,
  fetchAvailabilities,
  fetchUsers,
} = useStoreHelpers();
const store = useStore();
const logoutMessage = computed(() => store.getters["auth/logoutMessage"]);

function clearLogoutMessage() {
  store.dispatch("auth/clearLogoutMessage");
}

onMounted(async () => {
  try {
    await Promise.all([
      fetchRituals(),
      fetchConseils(),
      fetchAppointments(),
      fetchAvailabilities(),
      fetchUsers(),
    ]);
  } catch (error) {
    console.error("Erreur lors du chargement des données :", error);
  }
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  background-image: url("./assets/back.png");
  background-size: contain;
}
</style>
