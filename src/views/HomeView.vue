<!-- HomePage.vue -->
<template>
  <section class="hero-section position-relative overflow-hidden">
    <div class="container py-5">
      <div class="row align-items-center g-5">
        <div class="col-12 col-lg-6 order-1 order-lg-1">

          <h1 class="display-4 display-lg-3 fw-bold mb-4 brand-title">
            Prenez soin de votre peau,<br />
            Prenez soin de votre<br />
            Beauté
          </h1>
          <p
            class="fs-6 fs-lg-5 lh-lg text-center text-lg-start mb-4 brand-text"
          >
            Les meilleurs dermatologues de notre clinique de soins de la peau
            offrent des services esthétiques de qualité.
          </p>
          <div
            class="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start"
          >

            <router-link
              to="/rituels"
              class="btn btn-outline-primary btn-lg rounded-pill px-4 py-2 d-flex align-items-center hero-btn"
              aria-label="Voir nos rituels"
            >
              <i class="bi bi-stars me-2"></i>
              Nos rituels
            </router-link>
            <router-link
              to="/contact"
              class="btn btn-outline-secondary btn-lg rounded-pill px-4 py-2 d-flex align-items-center hero-btn"
              aria-label="Nous contacter"
            >
              <i class="bi bi-envelope me-2"></i>
              Contact
            </router-link>
            <router-link
              to="/conseils"
              class="btn btn-outline-success btn-lg rounded-pill px-4 py-2 d-flex align-items-center hero-btn"
              aria-label="Voir nos conseils"
            >
              <i class="bi bi-lightbulb me-2"></i>
              Conseils
            </router-link>
          </div>
        </div>
        <div
          class="col-12 col-lg-6 order-2 order-lg-2 text-center hero-img-col"
        >
          <div class="hero-img-wrapper position-relative">
            <img
              src="@/assets/image380.png"
              alt="Illustration de traitement de soin de la peau"
              class="img-fluid hero-img"
              loading="lazy"
            />
            <div class="hero-img-overlay"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="hero-wave"></div>
  </section>
</template>

<script setup></script>

<style scoped>
.hero-section {
  background: linear-gradient(120deg, #fff6f1 0%, #ffeaea 100%);
  min-height: 520px;
  position: relative;
  z-index: 1;
}
.badge-hero {
  background: #ffeaea;
  color: #b96c53;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 1rem;
  padding: 0.4rem 1.2rem;
  letter-spacing: 0.03em;
  box-shadow: 0 2px 8px 0 rgba(185, 108, 83, 0.07);
}
.brand-title {
  color: #b96c53;
  text-shadow: 0 2px 8px rgba(185, 108, 83, 0.07);
}
.brand-text {
  color: #45241b;
}
.hero-img-wrapper {
  position: relative;
  display: inline-block;
  max-width: 420px;
  width: 100%;
}
.hero-img {
  border-radius: 2rem;
  box-shadow: 0 4px 32px 0 rgba(185, 108, 83, 0.09);
  opacity: 0.92;
  width: 100%;
  height: auto;
  z-index: 1;
  position: relative;
}
.hero-img-overlay {
  position: absolute;
  inset: 0;
  border-radius: 2rem;
  background: linear-gradient(
    120deg,
    rgba(255, 246, 241, 0.7) 0%,
    rgba(255, 234, 234, 0.7) 100%
  );
  z-index: 2;
  pointer-events: none;
}
.hero-wave {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 60px;
  background: linear-gradient(180deg, rgba(255, 234, 234, 0.2) 0%, #fff 100%);
  border-bottom-left-radius: 100% 30px;
  border-bottom-right-radius: 100% 30px;
  z-index: 0;
}
.hero-btn {
  box-shadow: 0 2px 8px 0 rgba(185, 108, 83, 0.07);
  transition: transform 0.18s, box-shadow 0.18s;
}
.hero-btn:hover,
.hero-btn:focus {
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 6px 24px 0 rgba(185, 108, 83, 0.13);
}
@media (max-width: 991.98px) {
  .hero-section {
    padding-bottom: 2.5rem;
    min-height: 400px;
  }
  .hero-img-wrapper {
    max-width: 320px;
  }
}
@media (max-width: 768px) {
  .brand-title {
    font-size: 1.3rem;
  }
  .brand-text {
    font-size: 0.95rem;
  }
  .hero-section {
    min-height: 260px;
    padding-bottom: 1.2rem;
  }
  .hero-img-wrapper {
    max-width: 160px;
  }
  .hero-img-col {
    margin-top: 1rem;
  }
}
</style>
