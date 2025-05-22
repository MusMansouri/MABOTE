<!-- HeroSection.vue -->
<template>
  <section class="hero">
    <!-- Image de gauche -->
    <div
      class="hero__img"
      :style="{
        backgroundImage: `url(${handImg})`,
      }"
    />

    <!-- Contenu de droite -->
    <div class="hero__content">
      <h1>Let’s Begin Your Skincare<br />Journey</h1>
      <p>
        Ready to achieve radiant, healthy skin? Let us help you get started
        today.
      </p>

      <router-link
        to="/about"
        class="btn btn-primary btn-lg rounded-pill px-2 py-2 d-flex align-items-center hero-btn"
        aria-label="En savoir plus sur nos services de soins de la peau"
      >
        <i class="bi bi-info-circle me-2"></i>
        En savoir plus
      </router-link>
    </div>
  </section>

  <footer class="footer-refonte">
    <div class="footer-container">
      <div class="footer-brand">
        <img src="@/assets/logo.png" alt="Logo Ma Boté" class="footer-logo" />
        <div class="footer-title">MABÔTÉ</div>
        <div class="footer-slogan">Votre beauté, notre passion</div>
      </div>
      <div class="footer-sections">
        <div class="footer-section">
          <h5>Navigation</h5>
          <router-link to="/" class="footer-link">Accueil</router-link>
          <router-link to="/about" class="footer-link">À propos</router-link>
          <router-link to="/rituels" class="footer-link">Rituels</router-link>
          <router-link to="/conseils" class="footer-link">Conseils</router-link>
          <router-link to="/contact" class="footer-link">Contact</router-link>
        </div>
        <div class="footer-section">
          <h5>Contact</h5>
          <a href="mailto:contact@mabote.com" class="footer-link">
            <i class="bi bi-envelope me-1"></i> contact@mabote.com
          </a>
          <a href="tel:+26547851245" class="footer-link">
            <i class="bi bi-telephone me-1"></i> +2 654 785 1245
          </a>
          <div class="footer-socials">
            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noopener"
              aria-label="Facebook"
              class="footer-social"
            >
              <img src="@/assets/facebook.svg" alt="Facebook" />
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener"
              aria-label="Instagram"
              class="footer-social"
            >
              <img src="@/assets/instagram.svg" alt="Instagram" />
            </a>
            <a
              href="https://snapchat.com/"
              target="_blank"
              rel="noopener"
              aria-label="Snapchat"
              class="footer-social"
            >
              <img src="@/assets/snapchat.svg" alt="Snapchat" />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener"
              aria-label="X-Twitter"
              class="footer-social"
            >
              <img src="@/assets/twitter-x.svg" alt="X (Twitter)" />
            </a>
          </div>
        </div>
        <div class="footer-section">
          <h5>Infos</h5>
          <router-link to="/privacy" class="footer-link"
            >Politique de confidentialité</router-link
          >
          <router-link to="/cgv" class="footer-link">CGV</router-link>
          <div class="footer-hours">
            <span><i class="bi bi-clock me-1"></i> Lun-Sam : 9h - 19h</span>
            <span
              ><i class="bi bi-geo-alt me-1"></i> 123, Rue Beauté, Paris</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      &copy; {{ new Date().getFullYear() }}
      <span class="fw-bold">MABÔTÉ</span> — Tous droits réservés.
    </div>
  </footer>
</template>

<script setup>
/*
 * Importe l’image localement pour bénéficier de l’optimisation / hash
 * (remplace le chemin par le tien dans /src/assets).
 */
import handImg from "../assets/main.png";
</script>

<style scoped>
/* ===== variables de couleur ===== */
:root {
  --bg-right: #fff6f1;
  --border-center: #e7d9d3;
  --title: #8e4f3d;
  --text: #34241f;
  --btn-bg: #aa6247;
  --btn-bg-hover: #9a5840;
}

/* ===== reset minimum ===== */
*,
*::before,
*::after {
  box-sizing: border-box;
}
.hero {
  display: flex;
  padding: 20px 0 0 0;
  min-height: 320px;
  color: var(--text);
  max-height: 420px;
  align-items: center;
}

/* ------- image gauche ------- */
.hero__img {
  flex: 1 1 45%;
  background-position: center;
  background-size: cover;
  position: relative;
  border-top-right-radius: 2rem;
  overflow: hidden;
}

/* demi-cercle */
.hero__img::after {
  content: "";
  position: absolute;
  right: -12.5rem; /* diamètre / 2  */
  top: 0;
  width: 25rem; /* diamètre       */
  height: 100%;
  background: var(--bg-right);
  border-top-left-radius: 25rem;
  border-bottom-left-radius: 25rem;
}

/* ------- bloc de texte ------- */
.hero__content {
  flex: 1 1 55%;
  background: var(--bg-right);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 6vw;
  position: relative;
}

.hero__content::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 2px;
  height: 100%;
  background: var(--border-center);
}

/* typographie */
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500&display=swap");
h1 {
  font-family: "Playfair Display", serif;
  font-size: clamp(2rem, 4.7vw, 3.5rem);
  line-height: 1.2;
  color: var(--title);
  margin: 0 0 1.5rem;
}
p {
  font-family: "Inter", sans-serif;
  font-size: 1.1rem;
  max-width: 45ch;
  margin: 0 0 2.5rem;
}

/* ------- responsive ------- */
@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    min-height: 180px;
    max-height: 260px;
  }
  .hero__img::after {
    display: none;
  }
}

/* footer styles */
.footer-refonte {
  background: linear-gradient(120deg, #fff6f1 0%, #ffeaea 100%);
  color: #8e4f3d;
  font-family: "Inter", sans-serif;
  padding: 2.2rem 0 0.5rem 0;
  border-top: 2px solid #e7d9d3;
  box-shadow: 0 -2px 16px 0 rgba(185, 108, 83, 0.08);
}
.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0 1.5rem;
}
.footer-brand {
  flex: 1 1 220px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}
.footer-logo {
  height: 60px;
  border-radius: 1.2rem;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(185, 108, 83, 0.1);
  padding: 0.2rem 0.7rem;
}
.footer-title {
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 0.04em;
  color: #b96c53;
  margin-top: 0.2rem;
}
.footer-slogan {
  font-size: 1.08rem;
  color: #45241b;
  opacity: 0.8;
}
.footer-sections {
  flex: 3 1 600px;
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem;
  justify-content: flex-end;
}
.footer-section {
  min-width: 180px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.footer-section h5 {
  font-size: 1.09rem;
  font-weight: 600;
  color: #b96c53;
  margin-bottom: 0.5rem;
  letter-spacing: 0.01em;
}
.footer-link {
  color: #8e4f3d;
  text-decoration: none;
  font-size: 1.04rem;
  margin-bottom: 0.2rem;
  transition: color 0.18s;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.footer-link:hover,
.footer-link:focus {
  color: #b96c53;
  text-decoration: underline;
}
.footer-socials {
  display: flex;
  gap: 0.7rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}
.footer-social img {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 8px 0 rgba(185, 108, 83, 0.08);
  transition: box-shadow 0.18s, filter 0.18s;
  filter: grayscale(0.1) brightness(0.97);
}
.footer-social:hover img,
.footer-social:focus img {
  box-shadow: 0 4px 16px 0 rgba(185, 108, 83, 0.13);
  filter: none;
}
.footer-hours {
  margin-top: 0.5rem;
  font-size: 0.98rem;
  color: #45241b;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.footer-bottom {
  text-align: center;
  font-size: 1.01rem;
  color: #b96c53;
  margin-top: 2.2rem;
  padding-bottom: 0.5rem;
  border-top: 1px solid #e7d9d3;
  opacity: 0.85;
}

/* Responsive improvements */
@media (max-width: 1100px) {
  .footer-container {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 0 0.5rem;
  }
  .footer-sections {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
  }
  .footer-section {
    align-items: center;
    min-width: unset;
  }
  .footer-brand {
    align-items: center;
    margin-bottom: 1.2rem;
  }
}
@media (max-width: 700px) {
  .footer-refonte {
    padding: 1.2rem 0 0.2rem 0;
    font-size: 0.97rem;
  }
  .footer-logo {
    height: 38px;
  }
  .footer-title {
    font-size: 1.08rem;
  }
  .footer-sections {
    gap: 1rem;
  }
  .footer-section h5 {
    font-size: 1rem;
  }
  .footer-bottom {
    font-size: 0.93rem;
    margin-top: 1.2rem;
  }
  .footer-section {
    padding-bottom: 0.7rem;
  }
}
@media (max-width: 430px) {
  .footer-refonte {
    padding: 0.7rem 0 0.1rem 0;
  }
  .footer-logo {
    height: 28px;
  }
  .footer-title {
    font-size: 0.98rem;
  }
  .footer-section h5 {
    font-size: 0.93rem;
  }
  .footer-link {
    font-size: 0.93rem;
  }
}
</style>
