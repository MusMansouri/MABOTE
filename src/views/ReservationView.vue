<template>
  <div class="container py-5">
    <h2 class="mb-4">Réserver un rituel</h2>
    <!-- Étape 1 : Choix du rituel -->
    <div class="mb-4">
      <label for="ritualSelect" class="form-label">Rituel *</label>
      <select
        id="ritualSelect"
        v-model="selectedRitualId"
        class="form-select"
        required
      >
        <option value="" disabled>-- Sélectionner --</option>
        <option v-for="rit in rituals" :key="rit.id" :value="rit.id">
          {{ rit.name }}
        </option>
      </select>
    </div>

    <!-- Étape 2 : Calendrier -->
    <div v-if="selectedRitualId" class="calendar-container mb-4">
      <div class="calendar">
        <div class="calendar-header">
          <button class="btn btn-outline-secondary" @click="prevMonth">
            &lt;
          </button>
          <h3>{{ currentMonthName }} {{ currentYear }}</h3>
          <button class="btn btn-outline-secondary" @click="nextMonth">
            &gt;
          </button>
        </div>
        <div class="calendar-grid">
          <div class="day-header" v-for="day in daysOfWeek" :key="day">
            {{ day }}
          </div>
          <div
            v-for="day in daysInMonth"
            :key="day.date"
            class="calendar-day"
            :class="{
              available: day.hasAvailability,
              selected: selectedDate === day.date,
            }"
            @click="day.hasAvailability && selectDate(day)"
            :style="
              !day.hasAvailability ? 'pointer-events: none; opacity: 0.5;' : ''
            "
          >
            <span>{{ day.day }}</span>
            <div v-if="day.hasAvailability" class="slots-indicator"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Étape 3 : Créneaux -->
    <div v-if="selectedDate" class="slots-container mb-4">
      <h4>Créneaux pour le {{ formatDate(selectedDate) }}</h4>
      <div v-if="availableSlots.length > 0" class="d-flex flex-wrap gap-2">
        <button
          v-for="slot in availableSlots"
          :key="slot"
          class="btn"
          :class="{
            'btn-outline-primary':
              selectedSlot !== slot && !reservedSlots.includes(slot),
            'btn-primary': selectedSlot === slot,
            'btn-secondary': reservedSlots.includes(slot),
          }"
          @click="!reservedSlots.includes(slot) && selectSlot(slot)"
          :disabled="reservedSlots.includes(slot)"
        >
          {{ slot }}
          <span v-if="reservedSlots.includes(slot)"> (Réservé)</span>
        </button>
      </div>
      <div v-else class="alert alert-info">
        Aucun créneau disponible pour cette date.
      </div>
    </div>

    <!-- Étape 4 : Formulaire -->
    <div v-if="selectedSlot" class="reservation-form mt-4">
      <form @submit.prevent="submitReservation" class="user-info-form">
        <div v-if="!isAuthenticated || isAdmin" class="row">
          <div class="col-md-6 mb-3">
            <label for="firstName" class="form-label">Prénom *</label>
            <input
              id="firstName"
              v-model="userInfo.firstName"
              type="text"
              class="form-control"
              required
            />
          </div>
          <div class="col-md-6 mb-3">
            <label for="lastName" class="form-label">Nom *</label>
            <input
              id="lastName"
              v-model="userInfo.lastName"
              type="text"
              class="form-control"
              required
            />
          </div>
          <div class="col-md-6 mb-3">
            <label for="email" class="form-label">Email *</label>
            <input
              id="email"
              v-model="userInfo.email"
              type="email"
              class="form-control"
              required
            />
          </div>
          <div class="col-md-6 mb-3">
            <label for="phone" class="form-label">Téléphone *</label>
            <input
              id="phone"
              v-model="userInfo.phone"
              type="tel"
              class="form-control"
              required
            />
          </div>
        </div>
        <div v-else class="mb-3">
          <!-- Alerte supprimée comme demandé -->
        </div>
        <button
          type="submit"
          class="btn btn-success"
          :disabled="loading || !canSubmit"
        >
          Confirmer le rendez-vous
        </button>
        <div v-if="formError" class="text-danger mt-2">{{ formError }}</div>
      </form>
    </div>

    <div v-if="confirmationMessage" class="alert alert-success mt-4">
      {{ confirmationMessage }}
    </div>
    <div v-if="error" class="alert alert-danger mt-4">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

const store = useStore();
const route = useRoute();

const rituals = computed(() => store.getters["rituals/allRituals"]);
const availabilities = computed(
  () => store.getters["appointments/availabilities"]
);
const isAuthenticated = computed(() => store.getters["auth/isAuthenticated"]);
const user = computed(() => store.getters["auth/user"]);
const isAdmin = computed(() => store.getters["auth/isAdmin"]);

const selectedRitualId = ref(
  route.params.ritualId ? Number(route.params.ritualId) : ""
);
const selectedDate = ref("");
const selectedSlot = ref("");
const confirmationMessage = ref("");
const error = ref("");
const formError = ref("");
const loading = ref(false);

const userInfo = ref({ firstName: "", lastName: "", email: "", phone: "" });

// Préremplir pour utilisateur connecté
watch(
  [isAuthenticated, user, isAdmin],
  ([auth, u, admin]) => {
    if (auth && u && !admin) {
      userInfo.value.firstName = u.firstName || "";
      userInfo.value.lastName = u.lastName || "";
      userInfo.value.email = u.email || "";
      userInfo.value.phone = u.phone || "";
    } else {
      userInfo.value = { firstName: "", lastName: "", email: "", phone: "" };
    }
  },
  { immediate: true }
);

const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const monthNames = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());
const currentMonthName = computed(() => monthNames[currentMonth.value]);

// Génère les jours du mois avec indication de disponibilité (sans filtrer par rituel)
const daysInMonth = computed(() => {
  const days = [];
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(currentYear.value, currentMonth.value, i);
    const dateString = date.toISOString().split("T")[0];
    const hasAvailability = availabilities.value.some(
      (a) => a.date === dateString
    );
    days.push({ day: i, date: dateString, hasAvailability });
  }
  return days;
});

// Créneaux déjà réservés pour la date sélectionnée
const reservedSlots = computed(() => {
  if (!selectedDate.value) return [];
  return store.getters["appointments/allAppointments"]
    .filter((a) => a.date === selectedDate.value && a.status !== "cancelled")
    .map((a) => a.heure?.slice(0, 5)); // format "HH:MM"
});

// Créneaux disponibles pour la date sélectionnée (sans filtrer par rituel)
const availableSlots = computed(() => {
  if (!selectedDate.value) return [];
  const availability = availabilities.value.find(
    (a) => a.date === selectedDate.value
  );
  if (!availability) return [];
  return generateSlots(availability.startTime, availability.endTime);
});

function generateSlots(startTime, endTime) {
  if (!startTime || !endTime) return [];
  const slots = [];
  let [h, m] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);
  while (h < endH || (h === endH && m < endM)) {
    const slot = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    slots.push(slot);
    m += 30;
    if (m >= 60) {
      h += 1;
      m -= 60;
    }
  }
  return slots;
}

function selectDate(day) {
  if (day.hasAvailability) {
    selectedDate.value = day.date;
    selectedSlot.value = "";
    error.value = "";
    confirmationMessage.value = "";
  }
}

function selectSlot(slot) {
  selectedSlot.value = slot;
  error.value = "";
  confirmationMessage.value = "";
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

const isUserInfoValid = computed(() => {
  if (isAuthenticated.value && !isAdmin.value) return true;
  return (
    userInfo.value.firstName &&
    userInfo.value.lastName &&
    isValidEmail(userInfo.value.email) &&
    userInfo.value.phone
  );
});

const canSubmit = computed(() => {
  return (
    selectedRitualId.value &&
    selectedDate.value &&
    selectedSlot.value &&
    isUserInfoValid.value
  );
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function submitReservation() {
  formError.value = "";
  error.value = "";
  confirmationMessage.value = "";
  if (!canSubmit.value) {
    formError.value = "Veuillez remplir tous les champs obligatoires.";
    return;
  }
  loading.value = true;
  try {
    const ritual = rituals.value.find((r) => r.id === selectedRitualId.value);
    // Respecte la casse de la base : UserId et RitualId
    const payload = {
      ritualId: selectedRitualId.value, // correction ici
      date: selectedDate.value,
      heure: selectedSlot.value + ":00",
      status: "pending",
      telephone: userInfo.value.phone,
    };
    if (isAuthenticated.value && !isAdmin.value && user.value?.id) {
      payload.userId = user.value.id; // correction ici
    } else {
      payload.userId = null;
      payload.userInfo = {
        name: `${userInfo.value.firstName} ${userInfo.value.lastName}`.trim(),
        email: userInfo.value.email,
        phone: userInfo.value.phone,
      };
    }
    await store.dispatch("appointments/addAppointment", payload);
    confirmationMessage.value = `Votre rendez-vous pour le rituel "${
      ritual.name
    }" est confirmé le ${formatDate(selectedDate.value)} à ${
      selectedSlot.value
    }.`;
    resetForm();
  } catch (e) {
    let backendMsg = "";
    if (e.response && e.response.data) {
      backendMsg = JSON.stringify(e.response.data);
    } else if (e.message) {
      backendMsg = e.message;
    } else {
      backendMsg = "Erreur inconnue";
    }
    error.value = "Erreur lors de la réservation : " + backendMsg;
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  selectedDate.value = "";
  selectedSlot.value = "";
  if (!isAuthenticated.value || isAdmin.value) {
    userInfo.value = { firstName: "", lastName: "", email: "", phone: "" };
  }
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
}

onMounted(() => {
  store.dispatch("rituals/fetchRituals");
  store.dispatch("appointments/fetchAvailabilities");
});
</script>

<style scoped>
.calendar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}
.calendar {
  width: 100%;
  max-width: 600px;
}
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}
.day-header {
  text-align: center;
  font-weight: bold;
}
.calendar-day {
  text-align: center;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  transition: background 0.2s, border 0.2s;
}
.calendar-day.available {
  background-color: #b2f2bb;
  border: 2px solid #51cf66;
  color: #222;
  cursor: pointer;
}
.calendar-day.available:hover {
  background-color: #51cf66;
  color: #fff;
}
.calendar-day.selected {
  background-color: #4caf50;
  color: white;
}
.calendar-day:not(.available) {
  cursor: default;
  opacity: 0.5;
}
.slots-indicator {
  margin-top: 0.5rem;
  width: 8px;
  height: 8px;
  background-color: #007bff;
  border-radius: 50%;
  margin-left: auto;
  margin-right: auto;
}
.user-info-form {
  max-width: 600px;
  margin: 0 auto;
}
</style>
