<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-body p-4">
            <h2 class="text-center mb-4">Inscription</h2>
            <div class="alert alert-info text-center mb-3">
              (Inscription simulée côté front, aucune donnée n’est envoyée à un
              serveur.)
            </div>
            <div v-if="errorMessage" class="alert alert-danger text-center">
              {{ errorMessage }}
            </div>
            <div v-if="loading" class="text-center my-3">
              <div class="spinner-border text-primary" role="status"></div>
            </div>
            <form @submit.prevent="registerUser">
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
                <label for="confirmPassword" class="form-label"
                  >Confirmer le mot de passe</label
                >
                <input
                  v-model="confirmPassword"
                  type="password"
                  class="form-control"
                  id="confirmPassword"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="phone" class="form-label">Téléphone</label>
                <input
                  v-model="phone"
                  type="tel"
                  class="form-control"
                  id="phone"
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
const confirmPassword = ref("");
const phone = ref("");
const errorMessage = ref("");
const loading = ref(false);
const router = useRouter();
const store = useStore();

function registerUser() {
  errorMessage.value = "";
  loading.value = true;
  setTimeout(() => {
    if (password.value !== confirmPassword.value) {
      errorMessage.value = "Les mots de passe ne correspondent pas";
      loading.value = false;
      return;
    }
    const success = store.dispatch("auth/register", {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      phone: phone.value,
    });
    if (!success) {
      errorMessage.value = "Cet email est déjà utilisé.";
      loading.value = false;
      return;
    }
    router.push("/client");
  }, 700);
}
</script>

<style scoped></style>
