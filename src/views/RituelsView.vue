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
              @error="onImgError"
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
              <div class="d-flex justify-content-center mt-auto gap-2">
                <button
                  class="btn btn-outline-secondary"
                  @click="openModal(ritual)"
                  aria-label="'Voir les détails du rituel ' + ritual.name"
                >
                  <i class="bi bi-info-circle me-2"></i>
                  Détails
                </button>
                <router-link
                  :to="{ name: 'Reservation', params: { ritualId: ritual.id } }"
                  class="btn btn-outline-primary d-flex align-items-center"
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

    <!-- Modal rituel -->
    <div
      v-if="showModal && selectedRitual"
      class="modal-backdrop"
      @click.self="closeModal"
    >
      <div class="modal-dialog">
        <button
          type="button"
          class="modal-close-button"
          aria-label="Fermer"
          @click="closeModal"
        >
          <i class="bi bi-x-lg">X</i>
        </button>
        <div class="modal-content p-4">
          <img
            v-if="selectedRitual.image"
            :src="selectedRitual.image"
            class="modal-img mb-3"
            alt="Image du rituel"
          />
          <h3 class="modal-title mb-3 text-center">
            {{ selectedRitual.name }}
          </h3>
          <p class="modal-description mb-3">
            {{ selectedRitual.longDescription }}
          </p>
          <ul class="modal-steps mb-3">
            <li v-for="(step, idx) in selectedRitual.steps" :key="idx">
              <strong>Étape {{ idx + 1 }} :</strong> {{ step }}
            </li>
          </ul>
          <div class="modal-infos mb-3">
            <span
              ><strong>Durée :</strong> {{ selectedRitual.duration }} min</span
            >
            <span class="ms-3"
              ><strong>Prix :</strong> {{ selectedRitual.price }} €</span
            >
          </div>
          <div class="d-flex justify-content-center mb-2">
            <router-link
              :to="{
                name: 'Reservation',
                params: { ritualId: selectedRitual.id },
              }"
              class="btn btn-primary d-flex align-items-center"
              aria-label="Réserver le rituel {{ selectedRitual.name }}"
              @click="closeModal"
            >
              <i class="bi bi-calendar-plus me-2"></i>
              Réserver ce rituel
            </router-link>
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

const showModal = ref(false);
const selectedRitual = ref(null);

function openModal(ritual) {
  selectedRitual.value = ritual;
  showModal.value = true;
}
function closeModal() {
  showModal.value = false;
  selectedRitual.value = null;
}

function onImgError(e) {
  e.target.src = require("@/assets/rit.png");
}

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
  transition: box-shadow 0.2s;
}
.card.rituel-card:hover,
.card.rituel-card:focus {
  box-shadow: 0 4px 32px 0 rgba(185, 108, 83, 0.13);
  outline: 2px solid #b96c53;
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
  max-width: 450px;
  width: 100%;
  box-shadow: 0 4px 32px 0 rgba(185, 108, 83, 0.13);
  position: relative;
  animation: modalIn 0.2s;
}
@keyframes modalIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.modal-content {
  padding: 1.5rem 1.5rem 1rem 1.5rem;
}
.modal-img {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 0.75rem;
}
.modal-title {
  font-size: 1.4rem;
  font-weight: bold;
  color: #b96c53;
}
.modal-description {
  font-size: 1.05rem;
  color: #45241b;
}
.modal-steps {
  padding-left: 1rem;
  font-size: 0.98rem;
  color: #6c757d;
}
.modal-infos {
  font-size: 1.05rem;
  color: #45241b;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}
.modal-close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 2;
  background: #b96c53;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  pointer-events: auto; /* Ensure the button is clickable */
}
.modal-close-button:hover,
.modal-close-button:focus {
  background: #8e4f3d;
  transform: scale(1.1);
  outline: none;
}
.modal-close-button i {
  font-size: 1.2rem;
}
.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #b96c53;
  cursor: pointer;
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
  .modal-dialog {
    max-width: 98vw;
    padding: 0.5rem;
  }
  .modal-content {
    padding: 1rem 0.5rem 0.5rem 0.5rem;
  }
}
</style>
