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
        class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center"
      >
        <div v-for="conseil in conseils" :key="conseil.id" class="col d-flex">
          <router-link
            :to="`/conseils/${conseil.id}`"
            class="w-100 text-decoration-none conseil-card-link"
            style="color: inherit"
          >
            <article class="card h-100 shadow-sm w-100 conseil-card-hover">
              <img
                v-if="conseil.img"
                :src="conseil.img"
                :alt="conseil.name"
                class="card-img-top"
              />
              <div class="card-body d-flex flex-column justify-content-between">
                <div>
                  <h3 class="h6 fw-bold mb-1 text-center">
                    {{ conseil.name }}
                  </h3>
                  <p class="small text-muted mb-0 text-center">
                    {{ conseil.role }}
                  </p>
                  <p class="mt-2 text-center" v-if="conseil.description">
                    {{ conseil.description }}
                  </p>
                </div>
              </div>
            </article>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useStore } from "vuex";

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
