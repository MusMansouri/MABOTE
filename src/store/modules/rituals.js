import axios from "axios";

function normalizeRitual(ritual) {
  // Always return a valid image: base64 with prefix or fallback
  let image = ritual.image;
  if (!image || typeof image !== "string" || image.trim() === "") {
    image = require("@/assets/rit.png");
  } else if (image.startsWith("p") && image.endsWith(".png")) {
    // Cas où c'est un nom de fichier d'asset (ex: p1.png)
    try {
      image = require(`@/assets/${image}`);
    } catch {
      image = require("@/assets/rit.png");
    }
  } else if (!image.startsWith("data:image/")) {
    // If it's a base64 string without prefix, add a default prefix
    image = `data:image/png;base64,${image}`;
  }
  return {
    ...ritual,
    image,
  };
}

const state = {
  rituals: [],
};

const getters = {
  allRituals: (state) => state.rituals,
  rituals: (state) => state.rituals,
};

const mutations = {
  setRituals(state, rituals) {
    state.rituals = rituals.map(normalizeRitual);
  },
  ADD_RITUAL(state, ritual) {
    state.rituals.push(normalizeRitual({ ...ritual, id: Date.now() }));
  },
  UPDATE_RITUAL(state, updated) {
    const idx = state.rituals.findIndex((r) => r.id === updated.id);
    if (idx !== -1) state.rituals[idx] = normalizeRitual({ ...updated });
  },
  DELETE_RITUAL(state, id) {
    state.rituals = state.rituals.filter((r) => r.id !== id);
  },
};

const actions = {
  async fetchRituals({ commit }) {
    const API_URL = process.env.VUE_APP_API_URL;
    const response = await axios.get(`${API_URL}/rituals`);
    commit("setRituals", response.data);
  },
  async addRitual({ commit }, ritual) {
    // Vérification de la taille de l'image (si présente, base64)
    if (ritual.image && ritual.image.length > 1_000_000) {
      alert(
        "L'image est trop volumineuse (max 1 Mo). Veuillez choisir une image plus légère."
      );
      return;
    }
    // Vérification de la taille du payload total (limite de sécurité)
    const payloadSize = JSON.stringify(ritual).length;
    if (payloadSize > 1_500_000) {
      alert(
        "Le rituel est trop volumineux (max 1,5 Mo). Veuillez réduire la taille de l'image ou des champs."
      );
      return;
    }
    const API_URL = process.env.VUE_APP_API_URL;
    const token = localStorage.getItem("jwt");
    const response = await axios.post(`${API_URL}/rituals`, ritual, {
      headers: { Authorization: `Bearer ${token}` },
    });
    commit("ADD_RITUAL", response.data);
  },
  async updateRitual({ commit }, ritual) {
    const API_URL = process.env.VUE_APP_API_URL;
    const token = localStorage.getItem("jwt");
    const response = await axios.put(
      `${API_URL}/rituals/${ritual.id}`,
      ritual,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    commit("UPDATE_RITUAL", response.data);
  },
  async deleteRitual({ commit }, id) {
    if (!id || typeof id !== "number") {
      console.error("ID de rituel invalide pour la suppression :", id);
      return;
    }
    const API_URL = process.env.VUE_APP_API_URL;
    const token = localStorage.getItem("jwt");
    await axios.delete(`${API_URL}/rituals/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    commit("DELETE_RITUAL", id);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
