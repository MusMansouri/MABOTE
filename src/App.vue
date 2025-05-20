<template>
  <div id="app">
    <NavBar />
    <router-view />
    <Footer />
  </div>
</template>
<script setup>
import { onMounted } from "vue";
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
