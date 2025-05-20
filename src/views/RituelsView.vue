<template>
  <div class="container py-5 rituels-container">
    <h1 class="mb-4 text-center">Nos Rituels</h1>
    <div v-if="loading" class="text-center my-3">
      <div class="spinner-border text-primary" role="status"></div>
    </div>
    <div v-else>
      <div v-if="rituals.length === 0" class="alert alert-info text-center">
        Aucun rituel disponible pour le moment.
      </div>
      <div
        v-else
        class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center"
      >
        <div v-for="ritual in rituals" :key="ritual.id" class="col d-flex">
          <div class="card h-100 shadow-sm w-100 rituel-card">
            <img
              v-if="ritual.image"
              :src="ritual.image"
              class="card-img-top"
              alt="Image du rituel"
              style="
                object-fit: cover;
                height: 180px;
                border-top-left-radius: 1.25rem;
                border-top-right-radius: 1.25rem;
              "
            />
            <div class="card-body d-flex flex-column justify-content-between">
              <div>
                <h5 class="card-title text-center">{{ ritual.name }}</h5>
                <p class="card-text text-center">{{ ritual.description }}</p>
                <ul class="list-unstyled mb-3 text-center">
                  <li><strong>Durée:</strong> {{ ritual.duration }} min</li>
                  <li><strong>Prix:</strong> {{ ritual.price }} €</li>
                </ul>
              </div>
              <div class="d-flex justify-content-center mt-auto">
                <router-link
                  :to="{ name: 'Reservation', params: { ritualId: ritual.id } }"
                  class="btn btn-outline-primary mt-3 d-flex align-items-center"
                  aria-label="Réserver le rituel {{ ritual.name }}"
                >
                  <i class="bi bi-calendar-plus me-2"></i>
                  Réserver
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const loading = ref(true);
const rituals = computed(() => store.getters["rituals/allRituals"]);

onMounted(async () => {
  await store.dispatch("rituals/fetchRituals");
  loading.value = false;
});
</script>

<style scoped>
.rituels-container {
  max-width: 1100px;
  margin: 0 auto;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.card.rituel-card {
  background: #fff;
  border-radius: 1.25rem;
  box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
  padding: 0.5rem 0.5rem 1.5rem 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.card-img-top {
  width: 100%;
  object-fit: cover;
  height: 180px;
  border-top-left-radius: 1.25rem;
  border-top-right-radius: 1.25rem;
}
.card-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #b96c53;
}
.card-text {
  font-size: 1.05rem;
  color: #45241b;
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-dialog {
  background: #fff;
  border-radius: 1rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 4px 32px 0 rgba(185, 108, 83, 0.13);
}
@media (max-width: 991.98px) {
  .rituels-container {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  .card.rituel-card {
    margin-bottom: 1.5rem;
  }
}
@media (max-width: 600px) {
  .rituels-container {
    padding: 4px;
  }
  .card-title {
    font-size: 1.05rem;
  }
  .card-text {
    font-size: 0.93rem;
  }
  .card.rituel-card {
    padding: 0.3rem 0.1rem 0.7rem 0.1rem;
  }
  .card-img-top {
    height: 120px;
  }
}
</style>
