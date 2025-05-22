<template>
  <div class="container py-5">
    <h2 class="mb-4">Réserver le rituel : {{ ritual?.name }}</h2>
    <div class="date-time-selector mb-4">
      <label for="date" class="form-label">Date *</label>
      <input
        id="date"
        v-model="selectedDate"
        type="date"
        class="form-control"
        @change="fetchAvailableSlots"
        required
      />
    </div>
    <div class="available-slots mb-4" v-if="availableSlots.length">
      <label class="form-label">Créneaux disponibles *</label>
      <div
        v-for="slot in availableSlots"
        :key="slot"
        class="form-check"
        @click="toggleSlotSelection(slot)"
      >
        <input
          class="form-check-input"
          type="checkbox"
          :id="`slot-${slot}`"
          :value="slot"
          v-model="selectedSlots"
        />
        <label class="form-check-label" :for="`slot-${slot}`">
          {{ slot }}
        </label>
      </div>
    </div>
    <div v-if="selectedSlots.length" class="reservation-form mt-4">
      <form @submit.prevent="confirmReservation">
        <div class="mb-3">
          <label for="name" class="form-label">Nom complet *</label>
          <input
            id="name"
            v-model="guestInfo.name"
            type="text"
            class="form-control"
            required
          />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email *</label>
          <input
            id="email"
            v-model="guestInfo.email"
            type="email"
            class="form-control"
            required
          />
        </div>
        <div class="mb-3">
          <label for="phone" class="form-label">Téléphone</label>
          <input
            id="phone"
            v-model="guestInfo.phone"
            type="tel"
            class="form-control"
          />
        </div>
        <button type="submit" class="btn btn-success" :disabled="loading">
          Confirmer le rendez-vous
        </button>
      </form>
    </div>
    <div v-if="confirmationMessage" class="alert alert-success mt-4">
      {{ confirmationMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const route = useRoute();

const ritual = computed(() =>
  store.getters["rituals/allRituals"].find(
    (r) => r.id === Number(route.params.ritualId)
  )
);

const selectedDate = ref("");
const selectedSlots = ref([]);
const availableSlots = ref([]);
const confirmationMessage = ref("");
const loading = ref(false);

const guestInfo = ref({
  name: "",
  email: "",
  phone: "",
});

watch(selectedDate, () => {
  if (selectedDate.value) {
    fetchAvailableSlots();
  }
});

async function fetchAvailableSlots() {
  // Remplacez ceci par l'appel réel à votre action Vuex pour obtenir les créneaux disponibles
  const slots = await store.dispatch("appointments/fetchAvailableSlots", {
    ritualId: ritual.value.id,
    date: selectedDate.value,
  });
  availableSlots.value = slots;
}

function toggleSlotSelection(slot) {
  const index = selectedSlots.value.indexOf(slot);
  if (index === -1) {
    selectedSlots.value.push(slot);
  } else {
    selectedSlots.value.splice(index, 1);
  }
}

async function confirmReservation() {
  loading.value = true;
  try {
    await store.dispatch("appointments/addAppointment", {
      ritualId: ritual.value.id,
      date: selectedDate.value,
      heure: selectedSlots.value.join(", "), // En supposant que vous vouliez enregistrer les heures sélectionnées
      guestInfo: { ...guestInfo.value },
    });
    confirmationMessage.value = `Votre rendez-vous pour le rituel "${ritual.value.name}" a été confirmé.`;
  } finally {
    loading.value = false;
  }
}
</script>
