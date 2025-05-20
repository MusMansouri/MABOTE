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

  <footer class="footer-main improved-footer">
    <div class="container py-4">
      <div class="footer-logo mb-3 d-flex justify-content-center">
        <img
          src="@/assets/logo.png"
          alt="Logo Ma Boté"
          height="56"
          style="
            border-radius: 1.2rem;
            box-shadow: 0 2px 12px 0 rgba(185, 108, 83, 0.1);
            background: #fff;
            padding: 0.2rem 0.7rem;
          "
        />
      </div>
      <div
        class="footer-links mb-3 d-flex flex-wrap justify-content-center gap-3"
      >
        <router-link to="/" class="footer-link">Accueil</router-link>
        <router-link to="/about" class="footer-link">À propos</router-link>
        <router-link to="/rituels" class="footer-link">Rituels</router-link>
        <router-link to="/conseils" class="footer-link">Conseils</router-link>
        <router-link to="/contact" class="footer-link">Contact</router-link>
        <router-link to="/privacy" class="footer-link"
          >Politique de confidentialité</router-link
        >
      </div>
      <div
        class="footer-contact mb-3 d-flex flex-wrap justify-content-center align-items-center gap-3"
      >
        <a href="mailto:contact@mabote.com" class="footer-contact-link">
          <i class="bi bi-envelope me-1 text-primary"></i> contact@mabote.com
        </a>
        <span class="mx-2 d-none d-md-inline">|</span>
        <a href="tel:+26547851245" class="footer-contact-link">
          <i class="bi bi-telephone me-1 text-success"></i> +2 654 785 1245
        </a>
      </div>
      <div
        class="footer-socials mb-3 d-flex justify-content-center gap-3 flex-wrap"
      >
        <a
          href="https://facebook.com/"
          target="_blank"
          rel="noopener"
          aria-label="Facebook"
          class="footer-social-link social-circle social-facebook"
        >
          <img
            src="@/assets/facebook.svg"
            alt="Facebook"
            width="24"
            height="24"
            style="display: block"
          />
        </a>
        <a
          href="https://instagram.com/"
          target="_blank"
          rel="noopener"
          aria-label="Instagram"
          class="footer-social-link social-circle social-instagram"
        >
          <img
            src="@/assets/instagram.svg"
            alt="Instagram"
            width="24"
            height="24"
            style="display: block"
          />
        </a>
        <a
          href="https://snapchat.com/"
          target="_blank"
          rel="noopener"
          aria-label="Snapchat"
          class="footer-social-link social-circle social-snapchat"
        >
          <img
            src="@/assets/snapchat.svg"
            alt="Snapchat"
            width="24"
            height="24"
            style="display: block"
          />
        </a>
        <a
          href="https://twitter.com/"
          target="_blank"
          rel="noopener"
          aria-label="X-Twitter"
          class="footer-social-link social-circle social-x"
        >
          <img
            src="@/assets/twitter-x.svg"
            alt="X (Twitter)"
            width="24"
            height="24"
            style="display: block"
          />
        </a>
      </div>
      <div class="footer-copyright mt-2">
        <hr style="opacity: 0.18; margin-bottom: 0.7rem" />
        &copy; {{ new Date().getFullYear() }}
        <span class="fw-bold">MABÔTÉ</span>. Tous droits réservés.
      </div>
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
.footer-main {
  background: linear-gradient(120deg, #fff6f1 0%, #ffeaea 100%);
  border-top: 2px solid #e7d9d3;
  color: #8e4f3d;
  font-family: "Baskervville", serif;
  font-size: 1.12rem;
  text-align: center;
  box-shadow: 0 -2px 16px 0 rgba(185, 108, 83, 0.08);
  padding: 0.7rem 0 0.3rem 0;
  position: relative;
}
.footer-logo img {
  height: 56px;
  margin-bottom: 0.1rem;
  border-radius: 1.2rem;
}
.footer-links {
  margin-bottom: 0.7rem;
  gap: 1.2rem;
}
.footer-link {
  color: #b96c53;
  margin: 0 0.7rem;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.08rem;
  letter-spacing: 0.01em;
  transition: color 0.18s, text-shadow 0.18s;
  border-radius: 0.7rem;
  padding: 0.1rem 0.7rem;
}
.footer-link:hover,
.footer-link:focus {
  color: #fff;
  background: #b96c53;
  text-shadow: 0 2px 8px #b96c53;
  text-decoration: none;
}
.footer-contact {
  color: #45241b;
  font-size: 1.04rem;
  margin-bottom: 0.5rem;
  gap: 1.2rem;
}
.footer-contact-link {
  color: #45241b;
  text-decoration: none;
  margin: 0 0.2rem;
  font-weight: 500;
  transition: color 0.18s, text-shadow 0.18s;
  display: flex;
  align-items: center;
  gap: 0.2rem;
}
.footer-contact-link:hover,
.footer-contact-link:focus {
  color: #b96c53;
  text-shadow: 0 2px 8px #b96c53;
  text-decoration: underline;
}
.footer-socials {
  margin-bottom: 0.5rem;
  gap: 0.5rem;
}
.footer-social-link {
  color: #b96c53;
  font-size: 1.45rem;
  margin: 0 0.18rem;
  transition: color 0.18s, background 0.18s, box-shadow 0.18s;
  vertical-align: middle;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.social-circle {
  background: #fff;
  border-radius: 50%;
  width: 2.3em;
  height: 2.3em;
  box-shadow: 0 2px 8px 0 rgba(185, 108, 83, 0.08);
  border: 1.5px solid #f3e2db;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
}
.social-circle:hover,
.social-circle:focus {
  background: #ffeaea;
  color: #a45947;
  box-shadow: 0 4px 16px 0 rgba(185, 108, 83, 0.13);
}

/* Ajout styles personnalisés pour chaque réseau */
.social-facebook {
  border-color: #1877f3;
}
.social-facebook:hover,
.social-facebook:focus {
  background: #1877f3;
  color: #fff;
  box-shadow: 0 4px 16px 0 rgba(24, 119, 243, 0.13);
}
.social-instagram {
  border-color: #e4405f;
}
.social-instagram:hover,
.social-instagram:focus {
  background: linear-gradient(135deg, #fdc468 0%, #df4996 100%);
  color: #fff;
  box-shadow: 0 4px 16px 0 rgba(223, 73, 150, 0.13);
}
.social-snapchat {
  border-color: #fffc00;
}
.social-snapchat:hover,
.social-snapchat:focus {
  background: #fffc00;
  color: #000;
  box-shadow: 0 4px 16px 0 rgba(255, 252, 0, 0.13);
}
.social-x {
  border-color: #222;
}
.social-x:hover,
.social-x:focus {
  background: #222;
  color: #fff;
  box-shadow: 0 4px 16px 0 rgba(34, 34, 34, 0.13);
}
.footer-social-link img {
  filter: grayscale(0.15) brightness(0.95);
  transition: filter 0.18s;
}
.footer-social-link:hover img,
.footer-social-link:focus img {
  filter: none;
}
@media (max-width: 600px) {
  .improved-footer {
    font-size: 0.97rem;
    padding: 0.1rem 0 0.1rem 0;
  }
  .footer-logo img {
    height: 32px;
  }
  .footer-link {
    margin: 0 0.3rem;
    font-size: 0.98rem;
    padding: 0.1rem 0.3rem;
  }
  .footer-social-link {
    font-size: 1.1rem;
    margin: 0 0.08rem;
  }
  .social-circle {
    width: 1.7em;
    height: 1.7em;
  }
}

/* Styles globaux pour les boutons */
.btn,
button,
input[type="submit"],
input[type="button"] {
  font-family: "Inter", sans-serif;
  font-weight: 500;
  border-radius: 1.5rem;
  padding: 0.28rem 0.85rem;
  font-size: 0.95rem;
  letter-spacing: 0.01em;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s, border 0.18s,
    transform 0.18s;
  box-shadow: 0 1.5px 6px 0 rgba(185, 108, 83, 0.06);
  border: 1px solid #b96c53;
  background: #fff;
  color: #b96c53;
  outline: none;
  min-width: 70px;
  max-width: 170px;
  line-height: 1.15;
}
.btn-lg,
button.btn-lg {
  padding: 0.38rem 1.05rem;
  font-size: 1.01rem;
}
.btn-sm,
button.btn-sm {
  padding: 0.16rem 0.55rem;
  font-size: 0.89rem;
}
.btn,
button {
  min-width: 70px;
  max-width: 170px;
}
.btn .bi,
button .bi {
  font-size: 1em;
}

/* Ajustement pour les boutons du footer et des réseaux sociaux */
.footer-social-link {
  min-width: unset;
  max-width: unset;
  padding: 0;
}

/* Ajustement pour les boutons dans les formulaires */
form .btn,
form button,
form input[type="submit"] {
  min-width: 80px;
  max-width: 170px;
}

/* Pour les boutons ronds (icônes seules) */
.btn-circle {
  border-radius: 50%;
  width: 1.7em;
  height: 1.7em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 1em;
}
</style>
