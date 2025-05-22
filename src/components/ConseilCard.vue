<template>
  <div class="conseil-card shadow-sm">
    <div class="conseil-img-wrapper">
      <img
        :src="conseil.img || require('../assets/rit.png')"
        class="conseil-img"
        :alt="'Image du conseil ' + conseil.name"
        @error="onImgError"
      />
    </div>
    <div class="conseil-content">
      <h3 class="conseil-title">{{ conseil.name }}</h3>
      <span class="conseil-badge">{{ conseil.role }}</span>
      <p class="conseil-description">{{ conseil.description }}</p>
      <router-link
        v-if="
          conseil.id !== undefined && conseil.id !== null && conseil.id !== ''
        "
        :to="{ name: 'ConseilDetail', params: { id: conseil.id } }"
        class="conseil-btn"
        :aria-label="'Voir le détail du conseil ' + conseil.name"
      >
        <i class="bi bi-info-circle me-1"></i>
        Détail
      </router-link>
      <button v-else disabled class="conseil-btn conseil-btn-disabled">
        <i class="bi bi-info-circle me-1"></i>
        Détail indisponible
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  conseil: {
    type: Object,
    required: true,
  },
});

function onImgError(e) {
  e.target.src = require("../assets/rit.png");
}
</script>

<style scoped>
.conseil-card {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px 0 rgba(185, 108, 83, 0.1);
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.18s, border 0.18s;
  min-width: 260px;
  max-width: 340px;
  margin: 0 auto;
}
.conseil-img-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 110px;
  height: 110px;
  margin-bottom: 1.2rem;
  border-radius: 50%;
  background: #f8f8f8;
  box-shadow: 0 2px 8px 0 rgba(185, 108, 83, 0.07);
}
.conseil-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 1px 4px 0 rgba(185, 108, 83, 0.1);
}
.conseil-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #b96c53;
  margin-bottom: 0.3rem;
  text-align: center;
}
.conseil-badge {
  display: inline-block;
  background: #f7e3db;
  color: #b96c53;
  border-radius: 1rem;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.25em 1em;
  margin-bottom: 0.7rem;
}
.conseil-description {
  color: #6c757d;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 1.2rem;
  min-height: 48px;
}
.conseil-btn {
  display: block;
  width: 100%;
  background: #b96c53;
  color: #fff;
  border: none;
  border-radius: 2rem;
  padding: 0.6em 0;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: background 0.18s;
  margin-top: 0.2rem;
}
.conseil-btn:hover,
.conseil-btn:focus {
  background: #a05a43;
  color: #fff;
}
.conseil-btn-disabled {
  background: #e0e0e0;
  color: #aaa;
  cursor: not-allowed;
}
</style>
