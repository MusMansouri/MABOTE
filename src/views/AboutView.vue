<!-- AboutSection.vue -->
<template>
  <section class="py-5 bg-light">
    <div class="container">
      <!-- ===== Titre principal ===== -->
      <header class="text-center mb-5">
        <h1 class="display-5 fw-bold brand-title mb-3">
          Votre voyage vers une peau éclatante commence ici
        </h1>
        <p class="lead brand-text mb-0">
          Chez Glisten, nous combinons science, soin et expertise pour révéler
          le meilleur de votre peau.
        </p>
      </header>

      <!-- ===== Image + description ===== -->
      <div class="row gy-4 align-items-center">
        <!-- image -->
        <div class="col-12 col-md-6">
          <img
            src="@/assets/about.png"
            alt="Dermatologue examinant la peau d'un client"
            class="img-fluid rounded-4 shadow-sm"
            loading="lazy"
          />
        </div>

        <!-- complément d’info -->
        <div class="col-12 col-md-6">
          <h2 class="h4 fw-semibold mb-3">Pourquoi choisir Glisten&nbsp;?</h2>
          <ul class="list-unstyled lh-lg">
            <li>
              ✓ Plans de traitement personnalisés basés sur la science
              dermatologique
            </li>
            <li>✓ Technologie de pointe et spécialistes certifiés</li>
            <li>
              ✓ Approche holistique : soins de la peau, nutrition, style de vie
            </li>
          </ul>

          <router-link
            to="/contact"
            class="btn btn-primary rounded-pill px-4 mt-3 d-flex align-items-center"
            aria-label="Prendre rendez-vous"
          >
            <i class="bi bi-calendar-check me-2"></i>
            Prendre rendez-vous
          </router-link>
        </div>
      </div>

      <!-- Section feedbacks clients -->
      <div class="row mt-5">
        <div class="col-12">
          <h2 class="h4 fw-semibold mb-4 text-center">
            Ils nous ont fait confiance
          </h2>
          <div class="d-flex flex-wrap justify-content-center gap-4">
            <div
              v-for="fb in feedbacks"
              :key="fb.id"
              class="card shadow-sm p-3 mb-3"
              style="max-width: 320px; min-width: 220px"
            >
              <div class="d-flex align-items-center mb-2 flex-column">
                <!-- photo ici -->
                <img
                  v-if="fb.photo"
                  :src="fb.photo"
                  alt="photo feedback"
                  style="
                    width: 96px;
                    height: 96px;
                    object-fit: cover;
                    border-radius: 50%;
                    margin-right: 0;
                    margin-bottom: 12px;
                    box-shadow: 0 2px 12px 0 rgba(185, 108, 83, 0.13);
                    border: 3px solid #b96c53;
                    display: block;
                    margin-left: auto;
                    margin-right: auto;
                  "
                />
                <span class="fw-bold mt-2">{{ getUserName(fb.userId) }}</span>
              </div>
              <div class="mb-2">"{{ fb.message }}"</div>
              <div class="text-muted small">
                {{ new Date(fb.createdAt).toLocaleDateString() }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// aucun script nécessaire pour ce bloc statique
import feedbacksData from "@/data/feedbacks.json";
import usersData from "@/data/users.json";
import { ref } from "vue";
const feedbacks = ref([...feedbacksData]);
const users = ref([...usersData]);
function getUserName(userId) {
  const user = users.value.find((u) => u.id === userId);
  if (!user) return "Utilisateur";
  return (user.firstName || "") + " " + (user.lastName || "");
}
</script>

<style scoped>
/* ========= palette maison ========= */
:root {
  --brand-primary: #b96c53;
  --brand-dark: #45241b;
}

/* titres & texte */
.brand-title {
  color: var(--brand-primary);
}
.brand-text {
  color: var(--brand-dark);
}

/* petite retouche sur les puces */
ul li::marker {
  color: var(--brand-primary);
}

/* Responsive layout improvements */
@media (max-width: 991.98px) {
  .row.align-items-center {
    flex-direction: column;
    gap: 2rem;
  }
  .col-12.col-md-6 {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }
  .col-12.col-md-6:last-child {
    background: #fff;
    border-radius: 1.5rem;
    box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
    padding: 2rem 1.5rem 1.5rem 1.5rem;
    margin-top: 1.5rem;
    text-align: center;
  }
  .brand-title,
  .brand-text {
    text-align: center;
  }
  .btn {
    display: inline-flex;
    margin: 0 auto;
  }
}

@media (max-width: 576px) {
  .col-12.col-md-6:last-child {
    padding: 1.2rem 0.5rem 1.5rem 0.5rem;
  }
  .brand-title {
    font-size: 1.5rem;
  }
  .brand-text {
    font-size: 1rem;
  }
}
</style>
