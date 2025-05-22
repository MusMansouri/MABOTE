<!-- ConseilView.vue -->
<template>
  <section class="py-5 bg-light">
    <header class="text-center mb-5">
      <h1 class="fw-bold display-5 mb-3">Conseils</h1>
      <p class="lead mb-0">
        Découvrez nos derniers conseils et astuces pour prendre soin de votre
        peau.
      </p>
    </header>
    <div class="container">
      <div
        v-if="conseils.length === 0"
        class="alert alert-info text-center mb-4"
      >
        Aucun conseil à afficher pour le moment.
      </div>
      <div
        v-else
        class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center"
      >
        <div v-for="conseil in conseils" :key="conseil.id" class="col d-flex">
          <ConseilCard :conseil="conseil" class="w-100" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
import ConseilCard from "@/components/ConseilCard.vue";

const store = useStore();
const conseils = computed(() => store.getters["conseils/allConseils"] || []);

onMounted(() => {
  store.dispatch("conseils/fetchConseils");
});
</script>

<style scoped>
h1,
h2 {
  color: #b96c53;
}
.card-img-top {
  object-fit: cover;
  height: 220px;
}
@media (max-width: 600px) {
  .card-img-top {
    height: 120px;
  }
  .card-body {
    padding: 0.7rem 0.5rem;
  }
}
.conseil-card-link:hover .conseil-card-hover,
.conseil-card-link:focus .conseil-card-hover {
  box-shadow: 0 6px 24px 0 rgba(185, 108, 83, 0.13);
  border: 1.5px solid #b96c53;
  transition: box-shadow 0.18s, border 0.18s;
}
</style>
