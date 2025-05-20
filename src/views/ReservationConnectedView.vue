<template>
  <div class="container py-5">
    <h2 class="mb-4">Réserver le rituel : {{ ritual?.name }}</h2>
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
const confirmationMessage = ref("");
const loading = ref(false);

const userInfo = ref({
  name: "",
  email: "",
  phone: "",
});

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
      time: selectedSlot.value,
      userInfo: { ...userInfo.value },
    });
    confirmationMessage.value = `Votre rendez-vous pour le rituel "${ritual.value.name}" a été confirmé.`;
  } finally {
    loading.value = false;
  }
}
</script>
