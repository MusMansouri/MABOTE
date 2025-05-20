<template>
  <div class="container py-5">
    <h2 class="mb-4">Réserver le rituel : {{ ritual?.name }}</h2>
    <div class="calendar-container">
      <div class="calendar">
        <div class="calendar-header">
          <button class="btn btn-outline-secondary" @click="prevMonth">
            <i class="bi bi-chevron-left"><</i>
          </button>
          <h3>{{ currentMonthName }} {{ currentYear }}</h3>
          <button class="btn btn-outline-secondary" @click="nextMonth">
            <i class="bi bi-chevron-right"> ></i>
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
              'has-slots': day.slots.length > 0,
              selected: selectedDate === day.date,
            }"
            @click="selectDate(day)"
          >
            <span>{{ day.day }}</span>
            <div v-if="day.slots.length > 0" class="slots-indicator"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedDate" class="slots-container mt-4">
      <h4>Créneaux disponibles pour le {{ formatDate(selectedDate) }}</h4>
      <div v-if="availableSlots.length > 0" class="d-flex flex-wrap gap-2">
        <button
          v-for="slot in availableSlots"
          :key="slot"
          class="btn"
          :class="{
            'btn-outline-primary': selectedSlot !== slot,
            'btn-primary': selectedSlot === slot,
          }"
          @click="selectSlot(slot)"
        >
          {{ slot }}
        </button>
      </div>
      <div v-else class="alert alert-info">
        Aucun créneau disponible pour cette date.
      </div>
    </div>

    <!-- Formulaire de réservation -->
    <div v-if="selectedSlot" class="reservation-form mt-4">
      <!-- Bouton de confirmation pour les utilisateurs connectés -->
      <div v-if="isAuthenticated" class="mt-4">
        <button
          class="btn btn-success"
          @click="confirmReservation"
          :disabled="loading"
        >
          Confirmer le rendez-vous
        </button>
      </div>

      <!-- Formulaire pour les utilisateurs non connectés -->
      <div v-else class="user-info-form mt-4">
        <form @submit.prevent="confirmReservation">
          <div class="mb-3">
            <label for="firstName" class="form-label">Prénom *</label>
            <input
              id="firstName"
              v-model="userInfo.firstName"
              type="text"
              class="form-control"
              required
              :readonly="isAuthenticated"
            />
          </div>
          <div class="mb-3">
            <label for="lastName" class="form-label">Nom *</label>
            <input
              id="lastName"
              v-model="userInfo.lastName"
              type="text"
              class="form-control"
              required
              :readonly="isAuthenticated"
            />
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email *</label>
            <input
              id="email"
              v-model="userInfo.email"
              type="email"
              class="form-control"
              required
              :readonly="isAuthenticated"
            />
          </div>
          <div class="mb-3">
            <label for="phone" class="form-label">Téléphone *</label>
            <input
              id="phone"
              v-model="userInfo.phone"
              type="tel"
              class="form-control"
              required
              :readonly="isAuthenticated"
            />
          </div>
          <button type="submit" class="btn btn-success" :disabled="loading">
            Confirmer le rendez-vous
          </button>
        </form>
      </div>
    </div>

    <div v-if="confirmationMessage" class="alert alert-success mt-4">
      {{ confirmationMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const route = useRoute();
const router = useRouter();

const ritual = computed(() =>
  store.getters["rituals/allRituals"].find(
    (r) => r.id === Number(route.params.ritualId)
  )
);
const availabilities = computed(
  () => store.getters["appointments/availabilities"]
);

const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());
const selectedDate = ref("");
const selectedSlot = ref("");
const confirmationMessage = ref("");
const isAuthenticated = computed(() => store.getters["auth/isAuthenticated"]);
const user = computed(() => store.getters["auth/user"]);
const showForm = ref(false);
const loading = ref(false);
const error = ref("");

const userInfo = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
});

// Préremplissage réactif pour l'utilisateur connecté
watch(
  [isAuthenticated, user],
  ([auth, u]) => {
    if (auth && u) {
      userInfo.value.firstName = u.firstName || "";
      userInfo.value.lastName = u.lastName || "";
      userInfo.value.email = u.email || "";
      userInfo.value.phone = u.phone || "";
    } else if (!auth) {
      userInfo.value.firstName = "";
      userInfo.value.lastName = "";
      userInfo.value.email = "";
      userInfo.value.phone = "";
    }
  },
  { immediate: true }
);

const isUserInfoValid = computed(() => {
  return (
    userInfo.value.firstName &&
    userInfo.value.lastName &&
    isValidEmail(userInfo.value.email)
  );
});

const canConfirm = computed(() => {
  if (isAuthenticated.value) return !!selectedSlot;
  return !!selectedSlot && isUserInfoValid.value;
});

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
const currentMonthName = computed(() => monthNames[currentMonth.value]);

const daysInMonth = computed(() => {
  const days = [];
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);

  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(currentYear.value, currentMonth.value, i);
    const dateString = date.toISOString().split("T")[0];
    const slots = availabilities.value
      .filter((a) => a.date === dateString)
      .flatMap((a) => generateSlots(a.startTime, a.endTime));
    days.push({ day: i, date: dateString, slots });
  }
  return days;
});

const availableSlots = computed(() => {
  const availability = availabilities.value.find(
    (a) => a.date === selectedDate.value
  );
  if (!availability) return [];
  return generateSlots(availability.startTime, availability.endTime);
});

function generateSlots(startTime, endTime) {
  const slots = [];
  let currentTime = startTime;
  while (currentTime < endTime) {
    slots.push(currentTime);
    const [hours, minutes] = currentTime.split(":").map(Number);
    currentTime = new Date(0, 0, 0, hours, minutes + 30)
      .toTimeString()
      .slice(0, 5);
  }
  return slots;
}

function selectDate(day) {
  if (day.slots.length > 0) {
    selectedDate.value = day.date;
    selectedSlot.value = "";
    showForm.value = false;
    error.value = "";
  }
}

function selectSlot(slot) {
  selectedSlot.value = slot;
  error.value = "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function confirmReservation() {
  error.value = "";
  if (!selectedSlot.value) {
    error.value = "Veuillez sélectionner un créneau horaire.";
    return;
  }

  loading.value = true;
  try {
    const appointmentData = {
      ritualId: ritual.value.id,
      ritualName: ritual.value.name,
      date: selectedDate.value,
      time: selectedSlot.value,
      status: "pending",
      userId: user.value?.id, // Ajout de l'ID utilisateur
      userInfo: isAuthenticated.value
        ? {
            name: user.value.name,
            email: user.value.email,
            phone: user.value.phone,
          }
        : { ...userInfo.value },
    };

    await store.dispatch("appointments/addAppointment", appointmentData);
    confirmationMessage.value = `Votre rendez-vous pour le rituel "${
      ritual.value.name
    }" a été confirmé le ${formatDate(selectedDate.value)} à ${
      selectedSlot.value
    }.`;
    resetSelection();
  } catch (e) {
    error.value =
      e.message || "Une erreur est survenue lors de la réservation.";
  } finally {
    loading.value = false;
  }
}

function handleConfirmClick() {
  if (isAuthenticated.value) {
    confirmReservation();
  }
}

function cancelForm() {
  showForm.value = false;
  error.value = "";
}

function resetSelection() {
  selectedDate.value = "";
  selectedSlot.value = "";
  if (!isAuthenticated.value) {
    userInfo.value = { firstName: "", lastName: "", email: "", phone: "" };
  }
  showForm.value = false;
  error.value = "";
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

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

onMounted(() => {
  store.dispatch("appointments/fetchAvailabilities");
  store.dispatch("rituals/fetchRituals");
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
  cursor: pointer;
}

.calendar-day.has-slots {
  background-color: #e7f5ff;
}

.calendar-day.selected {
  background-color: #4caf50;
  color: white;
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

.user-options {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.user-info-form {
  max-width: 600px;
  margin: 0 auto;
}

.is-invalid {
  border-color: #dc3545;
}
</style>
