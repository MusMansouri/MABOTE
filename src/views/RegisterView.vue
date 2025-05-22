<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-body p-4">
            <h2 class="text-center mb-4">Inscription</h2>
            <div v-if="errorMessage" class="alert alert-danger text-center">
              {{ errorMessage }}
            </div>
            <div v-if="loading" class="text-center my-3">
              <div class="spinner-border text-primary" role="status"></div>
            </div>
            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label for="firstName" class="form-label">Prénom</label>
                <input
                  v-model="firstName"
                  type="text"
                  class="form-control"
                  id="firstName"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="lastName" class="form-label">Nom</label>
                <input
                  v-model="lastName"
                  type="text"
                  class="form-control"
                  id="lastName"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  v-model="email"
                  type="email"
                  class="form-control"
                  id="email"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Mot de passe</label>
                <input
                  v-model="password"
                  type="password"
                  class="form-control"
                  id="password"
                  required
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
                />
              </div>
              <div class="d-grid gap-2">
                <button
                  type="submit"
                  class="btn btn-primary rounded-pill d-flex align-items-center justify-content-center"
                  :disabled="loading"
                  aria-label="S'inscrire"
                >
                  <i class="bi bi-person-plus me-2"></i>
                  S'inscrire
                </button>
              </div>
              <p class="text-center mt-3">
                Déjà inscrit?
                <router-link to="/login">Se connecter</router-link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const loading = ref(false);
const router = useRouter();
const store = useStore();

const handleRegister = async () => {
  errorMessage.value = "";
  loading.value = true;
  try {
    await store.dispatch("auth/register", {
      nom: lastName.value, // Correction : nom = lastName
      prenom: firstName.value, // Correction : prenom = firstName
      email: email.value,
      password: password.value,
    });
    // Connexion automatique après inscription
    const success = await store.dispatch("auth/login", {
      email: email.value,
      password: password.value,
    });
    if (success) {
      if (store.getters["auth/isAdmin"]) {
        router.push("/admin");
      } else {
        router.push("/client");
      }
    } else {
      router.push("/login");
    }
  } catch (error) {
    errorMessage.value =
      error?.response?.data?.error || "Erreur lors de l'inscription.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped></style>
