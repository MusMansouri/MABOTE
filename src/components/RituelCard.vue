<template>
  <div class="card" style="width: 18rem">
    <img
      :src="rituel.image || require('../assets/rit.png')"
      class="card-img-top"
      alt="Image du rituel {{ rituel.name }}"
      @error="onImgError"
    />
    <div class="card-body">
      <h5 class="card-title text-center">{{ rituel.name }}</h5>
      <p class="card-text text-center">
        {{ rituel.description }}
      </p>
      <router-link
        :to="{ name: 'Reservation', params: { ritualId: rituel.id } }"
        class="btn btn-primary"
        :aria-label="'Prendre rendez-vous pour le rituel ' + rituel.name"
      >
        <i class="bi bi-calendar-plus me-1"></i>
        Prendre RDV
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  rituel: {
    type: Object,
    required: true,
  },
});

function onImgError(e) {
  e.target.src = require("../assets/rit.png");
}
</script>

<style scoped>
.card-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.card-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.card-text {
  font-size: 0.95rem;
  color: #6c757d;
  margin-bottom: 1rem;
}

.btn {
  margin-top: 0.5rem;
}
</style>
