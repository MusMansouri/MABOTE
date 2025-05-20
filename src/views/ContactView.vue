<!-- ContactPage.vue -->
<template>
  <section class="container py-5">
    <!-- ========= SECTION 1 : introduction + réseaux sociaux ========= -->
    <div class="text-center mb-5">
      <h1 class="fw-bold display-5 mb-3">Contactez-nous</h1>
      <p class="lead mb-1">
        Nous sommes là pour répondre à toutes vos questions et vous aider à
        atteindre vos objectifs de soins de la peau.
      </p>
      <p class="mb-1">
        📞 Appelez-nous : <a href="tel:+26547851245">+2 654 785 1245</a>
      </p>
      <p class="mb-4">
        🏢 Visitez notre magasin : Chicago HQ, Estica Cop.<br />Macomb, MI 48042
      </p>

      <div class="d-flex justify-content-center gap-3 flex-wrap">
        <a
          class="btn btn-outline-primary rounded-pill px-4 d-flex align-items-center"
          href="https://facebook.com/"
          target="_blank"
          rel="noopener"
          aria-label="Facebook"
        >
          <img
            src="@/assets/facebook.svg"
            alt="Facebook"
            width="24"
            height="24"
            style="display: block; margin-right: 0.5em"
          />
          Facebook
        </a>
        <a
          class="btn btn-outline-danger rounded-pill px-4 d-flex align-items-center"
          href="https://instagram.com/"
          target="_blank"
          rel="noopener"
          aria-label="Instagram"
        >
          <img
            src="@/assets/instagram.svg"
            alt="Instagram"
            width="24"
            height="24"
            style="display: block; margin-right: 0.5em"
          />
          Instagram
        </a>
        <a
          class="btn btn-outline-warning rounded-pill px-4 d-flex align-items-center"
          href="https://snapchat.com/"
          target="_blank"
          rel="noopener"
          aria-label="Snapchat"
        >
          <img
            src="@/assets/snapchat.svg"
            alt="Snapchat"
            width="24"
            height="24"
            style="display: block; margin-right: 0.5em"
          />
          Snapchat
        </a>
        <a
          class="btn btn-outline-dark rounded-pill px-4 d-flex align-items-center"
          href="https://twitter.com/"
          target="_blank"
          rel="noopener"
          aria-label="X-Twitter"
        >
          <img
            src="@/assets/twitter-x.svg"
            alt="X (Twitter)"
            width="24"
            height="24"
            style="display: block; margin-right: 0.5em"
          />
          X-Twitter
        </a>
      </div>
    </div>

    <!-- ========= SECTION 2 : image + formulaire ========= -->
    <div class="row align-items-center gy-5">
      <!-- image : 100 % largeur sur mobile, 6 / 12 ≥ lg -->
      <div class="col-12 col-lg-6 text-center">
        <img
          src="@/assets/contact.png"
          alt="Personne parlant au téléphone"
          class="img-fluid shadow rounded-4"
        />
      </div>

      <!-- formulaire : 100 % largeur sur mobile, 6 / 12 ≥ lg -->
      <div class="col-12 col-lg-6">
        <form
          class="vstack gap-3 needs-validation"
          @submit.prevent="submitForm"
          novalidate
        >
          <div class="row g-3">
            <div class="col-12 col-md-6">
              <label for="firstName" class="form-label">Prénom</label>
              <input
                type="text"
                id="firstName"
                v-model="firstName"
                class="form-control"
                :class="{ 'is-invalid': errors.firstName }"
                required
              />
              <div v-if="errors.firstName" class="invalid-feedback">
                {{ errors.firstName }}
              </div>
            </div>

            <div class="col-12 col-md-6">
              <label for="lastName" class="form-label">Nom</label>
              <input
                type="text"
                id="lastName"
                v-model="lastName"
                class="form-control"
                :class="{ 'is-invalid': errors.lastName }"
                required
              />
              <div v-if="errors.lastName" class="invalid-feedback">
                {{ errors.lastName }}
              </div>
            </div>
          </div>

          <div>
            <label for="email" class="form-label">E-mail</label>
            <input
              type="email"
              id="email"
              v-model="email"
              class="form-control"
              :class="{ 'is-invalid': errors.email }"
              required
            />
            <div v-if="errors.email" class="invalid-feedback">
              {{ errors.email }}
            </div>
          </div>

          <div>
            <label for="tel" class="form-label">Numéro de téléphone</label>
            <input type="tel" id="tel" v-model="tel" class="form-control" />
          </div>

          <div>
            <label for="message" class="form-label">Message</label>
            <textarea
              id="message"
              v-model="message"
              rows="4"
              class="form-control"
              :class="{ 'is-invalid': errors.message }"
              required
            ></textarea>
            <div v-if="errors.message" class="invalid-feedback">
              {{ errors.message }}
            </div>
          </div>

          <button
            class="btn btn-primary rounded-pill d-flex align-items-center mt-2"
            type="submit"
            aria-label="Envoyer le message"
          >
            <i class="bi bi-send me-2"></i>
            Envoyer
          </button>
        </form>
      </div>
    </div>

    <!-- ========= SECTION 3 : FAQ accordéon ========= -->
    <div class="mt-5">
      <h2 class="h4 fw-semibold text-center mb-4">
        Questions Fréquemment Posées
      </h2>

      <div class="accordion accordion-flush" id="faq">
        <div class="accordion-item">
          <h2 class="accordion-header" id="q1">
            <button
              class="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#a1"
              aria-expanded="true"
              aria-controls="a1"
            >
              Élément d'accordéon #1
            </button>
          </h2>
          <div
            id="a1"
            class="accordion-collapse collapse show"
            data-bs-parent="#faq"
            aria-labelledby="q1"
          >
            <div class="accordion-body">
              Un rituel de purification est une pratique visant à nettoyer le
              corps et l'esprit pour retrouver équilibre et sérénité.
            </div>
          </div>
        </div>

        <div class="accordion-item">
          <h2 class="accordion-header" id="q2">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#a2"
              aria-expanded="false"
              aria-controls="a2"
            >
              Élément d'accordéon #2
            </button>
          </h2>
          <div
            id="a2"
            class="accordion-collapse collapse"
            data-bs-parent="#faq"
            aria-labelledby="q2"
          >
            <div class="accordion-body">
              Oui, nos soins sont adaptés à tous les types de peau.
            </div>
          </div>
        </div>

        <div class="accordion-item">
          <h2 class="accordion-header" id="q3">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#a3"
              aria-expanded="false"
              aria-controls="a3"
            >
              Élément d'accordéon #3
            </button>
          </h2>
          <div
            id="a3"
            class="accordion-collapse collapse"
            data-bs-parent="#faq"
            aria-labelledby="q3"
          >
            <div class="accordion-body">
              La durée varie selon le rituel choisi, généralement entre 45 et 90
              minutes.
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const tel = ref("");
const message = ref("");

const errors = ref({});

const validateForm = () => {
  errors.value = {};

  if (!firstName.value) {
    errors.value.firstName = "First name is required.";
  }
  if (!lastName.value) {
    errors.value.lastName = "Last name is required.";
  }
  if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
    errors.value.email = "A valid email is required.";
  }
  if (!message.value) {
    errors.value.message = "Message is required.";
  }

  return Object.keys(errors.value).length === 0;
};

const submitForm = () => {
  if (validateForm()) {
    // Handle form submission
    console.log("Form submitted:", {
      firstName,
      lastName,
      email,
      tel,
      message,
    });
  }
};
</script>

<style scoped>
/* Un mini-thème maison (facultatif) */
h1 {
  color: #b96c53;
}
</style>
