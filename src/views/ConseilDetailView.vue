<template>
  <section class="py-5 bg-light min-vh-100">
    <div class="container">
      <router-link to="/conseils" class="btn btn-link mb-4">
        <i class="bi bi-arrow-left"></i> Retour à la liste des conseils
      </router-link>
      <div v-if="conseil" class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow-sm p-4">
            <img
              v-if="conseil.img"
              :src="conseil.img"
              :alt="conseil.name"
              class="card-img-top mb-3"
              style="max-height: 260px; object-fit: cover"
            />
            <h1 class="h4 fw-bold mb-2">{{ conseil.name }}</h1>
            <p class="text-muted mb-1">{{ conseil.role }}</p>
            <p class="mb-3">{{ conseil.description }}</p>
            <div v-if="conseil.photo">
              <img
                :src="conseil.photo"
                :alt="conseil.name"
                style="width: 60px; height: 60px; border-radius: 50%"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-5">
        <div class="spinner-border text-primary"></div>
        <p class="mt-3">Chargement du conseil...</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const route = useRoute();
const store = useStore();
const conseils = computed(() => store.getters["conseils/allConseils"] || []);
const conseil = ref(null);

onMounted(async () => {
  await store.dispatch("conseils/fetchConseils");
  conseil.value = conseils.value.find((c) => String(c.id) === route.params.id);
});
</script>
