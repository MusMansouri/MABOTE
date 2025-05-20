<template>
  <div class="admin-appointment-manager">
    <h2 class="mb-4">Ajouter une disponibilité</h2>
    <div class="row g-4">
      <div class="col-12 col-lg-6">
        <form @submit.prevent="handleAddAvailability">
          <div class="mb-3">
            <label for="availabilityDate" class="form-label">Date</label>
            <input
              v-model="newAvailability.date"
              type="date"
              class="form-control"
              id="availabilityDate"
              required
            />
          </div>
          <div class="mb-3">
            <label for="availabilityStartTime" class="form-label"
              >Heure de début</label
            >
            <input
              v-model="newAvailability.startTime"
              type="time"
              class="form-control"
              id="availabilityStartTime"
              required
            />
          </div>
          <div class="mb-3">
            <label for="availabilityEndTime" class="form-label"
              >Heure de fin</label
            >
            <input
              v-model="newAvailability.endTime"
              type="time"
              class="form-control"
              id="availabilityEndTime"
              required
            />
          </div>
          <button type="submit" class="btn btn-primary w-100">
            Ajouter la disponibilité
          </button>
        </form>
        <div v-if="addMessage" class="alert alert-success mt-3">
          {{ addMessage }}
        </div>
        <div v-if="addError" class="alert alert-danger mt-3">
          {{ addError }}
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <h3 class="mb-3">Disponibilités</h3>
        <ul class="list-group">
          <li
            v-for="availability in sortedAvailabilities"
            :key="availability.id"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>
              {{ formatDate(availability.date) }} :
              {{ availability.startTime }} - {{ availability.endTime }}
              <!-- Affiche une icône si un RDV existe ce jour -->
              <span
                v-if="hasAppointmentOnDate(availability.date)"
                class="ms-2"
                title="Rendez-vous prévu"
              >
                <i class="bi bi-calendar-event text-success"></i>
              </span>
            </span>
            <button
              @click="confirmDeleteAvailability(availability.id)"
              class="btn btn-danger btn-sm"
              :aria-label="'Supprimer la disponibilité du ' + availability.date"
            >
              <i class="bi bi-trash"></i>
            </button>
          </li>
        </ul>
        <div
          v-if="sortedAvailabilities.length === 0"
          class="alert alert-info mt-3"
        >
          Aucune disponibilité pour le moment.
        </div>
        <!-- Liste des dates avec au moins un rendez-vous -->
        <div v-if="datesWithAppointments.length" class="mt-4">
          <h5>Dates avec rendez-vous :</h5>
          <ul class="list-group">
            <li
              v-for="date in datesWithAppointments"
              :key="date"
              class="list-group-item"
            >
              <i class="bi bi-calendar-check text-primary me-1"></i>
              {{ formatDate(date) }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <h2 class="mt-5 mb-4">Upcoming Appointments</h2>
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Client</th>
            <th>Ritual</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="appointment in appointments.filter(
              (a) => a.status !== 'cancelled'
            )"
            :key="appointment.id"
          >
            <td>{{ appointment.date }}</td>
            <td>{{ appointment.time }}</td>
            <td>{{ appointment.clientName }}</td>
            <td>{{ appointment.ritualName }}</td>
            <td>
              <span
                :class="{
                  'badge bg-success': appointment.status === 'confirmed',
                  'badge bg-warning': appointment.status === 'pending',
                  'badge bg-danger': appointment.status === 'cancelled',
                }"
                >{{ appointment.status }}</span
              >
            </td>
            <td>
              <button
                @click="cancelAppointment(appointment.id)"
                class="btn btn-warning btn-sm"
                :aria-label="
                  'Annuler le rendez-vous du ' +
                  appointment.date +
                  ' à ' +
                  appointment.time
                "
              >
                <i class="bi bi-x-circle"></i>
                Cancel
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const newAvailability = ref({ date: "", startTime: "", endTime: "" });
const addMessage = ref("");
const addError = ref("");

const availabilities = computed(
  () => store.getters["appointments/availabilities"]
);

const sortedAvailabilities = computed(() =>
  [...availabilities.value].sort(
    (a, b) =>
      a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)
  )
);

const appointments = computed(
  () => store.getters["appointments/allAppointments"]
);

// Renvoie true si au moins un rendez-vous existe ce jour-là
function hasAppointmentOnDate(date) {
  return appointments.value.some(
    (a) => a.date === date && a.status !== "cancelled"
  );
}

// Liste unique des dates où il y a au moins un rendez-vous
const datesWithAppointments = computed(() => {
  const set = new Set();
  appointments.value.forEach((a) => {
    if (a.status !== "cancelled") set.add(a.date);
  });
  return Array.from(set).sort();
});

const addAvailability = (data) =>
  store.dispatch("appointments/addAvailability", data);
const deleteAvailability = (id) =>
  store.dispatch("appointments/deleteAvailability", id);
const cancelAppointment = (id) =>
  store.dispatch("appointments/cancelAppointment", id);

const handleAddAvailability = async () => {
  addMessage.value = "";
  addError.value = "";
  // Validation : pas de doublon même date et horaires
  const exists = availabilities.value.some(
    (a) =>
      a.date === newAvailability.value.date &&
      a.startTime === newAvailability.value.startTime &&
      a.endTime === newAvailability.value.endTime
  );
  if (exists) {
    addError.value = "Cette disponibilité existe déjà.";
    return;
  }
  try {
    await addAvailability({ ...newAvailability.value });
    addMessage.value = "Disponibilité ajoutée avec succès.";
    newAvailability.value = { date: "", startTime: "", endTime: "" };
    setTimeout(() => (addMessage.value = ""), 2000);
  } catch (e) {
    addError.value = "Erreur lors de l'ajout de la disponibilité.";
  }
};

function confirmDeleteAvailability(id) {
  if (confirm("Supprimer cette disponibilité ?")) {
    deleteAvailability(id);
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}
</script>

<style scoped>
@media (max-width: 768px) {
  .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
}
</style>
