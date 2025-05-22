<template>
  <div class="container py-5">
    <h2 class="mb-4">Réserver le rituel : {{ ritual?.name }}</h2>

    <!-- Étape 1 : Calendrier -->
    <div class="calendar-container mb-4">
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
          </div>
        </div>
      </div>
    </div>

    <!-- Étape 2 : Créneaux -->
    <div v-if="selectedDate" class="slots-container mb-4">
      <h4>Créneaux pour le {{ formatDate(selectedDate) }}</h4>
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

    <!-- Étape 3 : Formulaire -->
    <div v-if="selectedSlot" class="reservation-form mt-4">
      <form @submit.prevent="confirmReservation">
        <div class="mb-3">
          <label for="name" class="form-label">Nom complet *</label>
          <input
            id="name"
            v-model="userInfo.name"
            type="text"
            class="form-control"
            required
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
          />
        </div>
        <div class="mb-3">
          <label for="phone" class="form-label">Téléphone</label>
          <input
            id="phone"
            v-model="userInfo.phone"
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
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const route = useRoute();

const ritual = computed(() =>
  store.getters["rituals/allRituals"].find(
    (r) => r.id === Number(route.params.ritualId)
  )
);

const selectedSlot = ref("");
const selectedDate = ref("");
const confirmationMessage = ref("");
const loading = ref(false);

const userInfo = ref({
  name: "",
  email: "",
  phone: "",
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
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());
const currentMonthName = computed(() => monthNames[currentMonth.value]);

const daysInMonth = computed(() => {
  if (!ritual.value) return [];
  const days = [];
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(currentYear.value, currentMonth.value, i);
    const dateString = date.toISOString().split("T")[0];
    const hasAvailability = store.getters["appointments/availabilities"].some(
      (a) => a.ritualId === ritual.value.id && a.date === dateString
    );
    days.push({ day: i, date: dateString, hasAvailability });
  }
  return days;
});

const availableSlots = computed(() => {
  if (!selectedDate.value) return [];
  const availability = store.getters["appointments/availabilities"].find(
    (a) => a.ritualId === ritual.value.id && a.date === selectedDate.value
  );
  if (!availability) return [];
  return generateSlots(availability.startTime, availability.endTime);
});

function generateSlots(startTime, endTime) {
  const slots = [];
  let currentTime = startTime;
  while (currentTime < endTime) {
    slots.push(currentTime);
    const [h, m] = currentTime.split(":").map(Number);
    const next = new Date(0, 0, 0, h, m + 30);
    currentTime = next.toTimeString().slice(0, 5);
  }
  return slots;
}

function selectDate(day) {
  if (day.hasAvailability) {
    selectedDate.value = day.date;
    selectedSlot.value = "";
  }
}

function selectSlot(slot) {
  selectedSlot.value = slot;
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
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
  const user = store.getters["auth/user"];
  if (user) {
    userInfo.value.name = user.name;
    userInfo.value.email = user.email;
    userInfo.value.phone = user.phone || "";
  }
});

async function confirmReservation() {
  loading.value = true;
  try {
    await store.dispatch("appointments/addAppointment", {
      ritualId: ritual.value.id,
      date: new Date().toISOString().split("T")[0], // Exemple de date
      heure: selectedSlot.value,
      userInfo: { ...userInfo.value },
    });
    confirmationMessage.value = `Votre rendez-vous pour le rituel "${ritual.value.name}" a été confirmé.`;
  } finally {
    loading.value = false;
  }
}
</script>
