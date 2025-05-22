<template>
  <div class="client-appointment-manager">
    <h2 class="mb-4">Réserver un rendez-vous</h2>
    <div class="row g-4">
      <div class="col-12 col-lg-6">
        <!-- Sélection du rituel -->
        <div class="mb-3">
          <label for="ritualSelect" class="form-label"
            >Choisissez un rituel</label
          >
          <select
            v-model="selectedRitualId"
            class="form-select"
            id="ritualSelect"
          >
            <option disabled value="">-- Sélectionnez un rituel --</option>
            <option
              v-for="ritual in rituals"
              :key="ritual.id"
              :value="ritual.id"
            >
              {{ ritual.name }} ({{ ritual.duration }} min,
              {{ ritual.price }} €)
            </option>
          </select>
        </div>

        <!-- Sélection du jour -->
        <div class="mb-3">
          <label class="form-label">Choisissez une date</label>
          <div class="d-flex flex-wrap gap-2">
            <button
              v-for="a in filteredAvailabilities"
              :key="a.id"
              :class="[
                'btn',
                selectedDate === a.date ? 'btn-primary' : 'btn-outline-primary',
              ]"
              @click="selectDate(a.date)"
            >
              {{ formatDate(a.date) }}
            </button>
          </div>
        </div>

        <!-- Créneaux horaires -->
        <div v-if="selectedDate && selectedRitualId" class="mb-3">
          <label class="form-label">Créneaux disponibles</label>
          <div v-if="availableSlots.length > 0" class="slots-grid">
            <button
              v-for="slot in availableSlots"
              :key="slot"
              class="btn btn-outline-success slot-btn"
              @click="bookAppointment(slot)"
              :disabled="loading"
            >
              <i class="bi bi-calendar-plus me-1"></i>
              {{ slot }}
            </button>
          </div>
          <div v-else class="alert alert-info mt-2">
            Aucun créneau disponible pour cette date.
          </div>
        </div>
        <div v-if="bookingMessage" class="alert alert-success mt-3">
          {{ bookingMessage }}
        </div>
        <div v-if="loading" class="text-center my-3">
          <div class="spinner-border text-primary" role="status"></div>
        </div>
        <div
          v-if="toastMessage"
          class="toast align-items-center text-bg-success show mb-3"
          style="position: absolute; right: 1rem; top: 1rem"
        >
          <div class="d-flex">
            <div class="toast-body">{{ toastMessage }}</div>
            <button
              type="button"
              class="btn-close btn-close-white me-2 m-auto"
              @click="toastMessage = ''"
            ></button>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-6">
        <h2 class="mb-3">Mes rendez-vous</h2>
        <ul class="list-group">
          <li
            v-for="appointment in myAppointments.filter(
              (a) => a.status !== 'cancelled'
            )"
            :key="appointment.id"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>
              <strong>{{ appointment.ritualName }}</strong>
              <br />
              {{ formatDate(appointment.date) }} à {{ appointment.time }}
              <span class="badge bg-secondary ms-2">{{
                appointment.status
              }}</span>
            </span>
            <button
              @click="cancelAppointment(appointment.id)"
              class="btn btn-warning btn-sm"
              :disabled="loading"
            >
              <i class="bi bi-x-circle me-1"></i>
              Annuler
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";

const store = useStore();

const availabilities = computed(
  () => store.getters["appointments/availabilities"]
);
const myAppointments = computed(
  () => store.getters["appointments/myAppointments"]
);
const rituals = computed(() => store.getters["rituals/allRituals"]);

const selectedRitualId = ref("");
const selectedDate = ref("");
const bookingMessage = ref("");
const loading = ref(false);
const toastMessage = ref("");

// Filtrer les disponibilités selon le rituel sélectionné
const filteredAvailabilities = computed(() => {
  if (!selectedRitualId.value) return [];
  return availabilities.value.filter(
    (a) => String(a.ritualId) === String(selectedRitualId.value)
  );
});

// Créneaux disponibles selon la disponibilité et la durée du rituel
const availableSlots = computed(() => {
  if (!selectedDate.value || !selectedRitualId.value) return [];
  const availability = availabilities.value.find(
    (a) =>
      a.date === selectedDate.value &&
      String(a.ritualId) === String(selectedRitualId.value)
  );
  if (!availability) return [];
  const ritual = rituals.value.find(
    (r) => String(r.id) === String(selectedRitualId.value)
  );
  const duration = ritual ? ritual.duration : 60;
  const slots = [];
  let currentTime = new Date(`${selectedDate.value}T${availability.startTime}`);
  const endTime = new Date(`${selectedDate.value}T${availability.endTime}`);
  while (currentTime.getTime() + duration * 60000 <= endTime.getTime()) {
    const slot = currentTime.toTimeString().slice(0, 5);
    const isTaken = myAppointments.value.some(
      (app) =>
        app.date === selectedDate.value &&
        app.time === slot &&
        app.status !== "cancelled"
    );
    if (!isTaken) {
      slots.push(slot);
    }
    currentTime.setMinutes(currentTime.getMinutes() + 30);
  }
  return slots;
});

const selectDate = (date) => {
  selectedDate.value = date;
  bookingMessage.value = "";
};

const bookAppointment = async (slot) => {
  loading.value = true;
  try {
    const ritual = rituals.value.find(
      (r) => String(r.id) === String(selectedRitualId.value)
    );
    if (!ritual) return;
    await store.dispatch("appointments/addAppointment", {
      date: selectedDate.value,
      heure: slot,
      ritualId: ritual.id,
    });
    toastMessage.value = `Votre rendez-vous pour "${
      ritual.name
    }" est réservé le ${formatDate(selectedDate.value)} à ${slot}.`;
    bookingMessage.value = toastMessage.value;
    setTimeout(() => (toastMessage.value = ""), 2500);
  } finally {
    loading.value = false;
  }
};

const cancelAppointment = (id) =>
  store.dispatch("appointments/cancelAppointment", id);

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

// Rafraîchir les données au montage
watch(
  () => selectedRitualId.value,
  () => {
    selectedDate.value = "";
    bookingMessage.value = "";
  }
);
</script>

<style scoped>
.slots-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.slot-btn {
  min-width: 90px;
  margin-bottom: 0.5rem;
}
@media (max-width: 768px) {
  .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
}
</style>
