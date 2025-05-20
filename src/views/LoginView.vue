<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-body p-4">
            <h2 class="text-center mb-4">Connexion</h2>
            <div class="alert alert-info text-center mb-3">
              (Connexion simulée côté front, aucune donnée n’est envoyée à un
              serveur.)
            </div>
            <div v-if="errorMessage" class="alert alert-danger">
              {{ errorMessage }}
            </div>
            <div v-if="loading" class="text-center my-3">
              <div class="spinner-border text-primary" role="status"></div>
            </div>
            <form @submit.prevent="handleLogin">
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
              <div class="d-grid gap-2">
                <button
                  type="submit"
                  class="btn btn-primary rounded-pill d-flex align-items-center justify-content-center"
                  aria-label="Se connecter"
                >
                  <i class="bi bi-box-arrow-in-right me-2"></i>
                  Se connecter
                </button>
              </div>
              <p class="text-center mt-3">
                Pas encore de compte?
                <router-link to="/register">S'inscrire</router-link>
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

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const loading = ref(false);
const router = useRouter();
const store = useStore();

const handleLogin = async () => {
  errorMessage.value = "";
  loading.value = true;

  const success = await store.dispatch("auth/login", {
    email: email.value.trim(),
    password: password.value,
  });

  loading.value = false;

  if (success) {
    if (store.getters["auth/isAdmin"]) {
      router.push("/admin");
    } else if (store.getters["auth/isClient"]) {
      router.push("/client");
    }
  } else {
    errorMessage.value = "Email ou mot de passe incorrect";
  }
};
</script>

<style scoped></style>
