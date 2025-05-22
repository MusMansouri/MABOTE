import axios from "axios";

const state = {
  conseils: [],
};

const getters = {
  allConseils: (state) => state.conseils,
  conseils: (state) => state.conseils,
};

function normalizeConseil(c) {
  return {
    ...c,
    name: c.name || c.title || "",
    description: c.description || c.content || "",
    role: c.role || c.category || "",
    img: c.img || "",
  };
}

const mutations = {
  setConseils(state, conseils) {
    // Sécurise : toujours un tableau
    if (!Array.isArray(conseils)) {
      conseils = conseils ? [conseils] : [];
    }
    state.conseils = conseils.map(normalizeConseil);
  },
};

const actions = {
  async fetchConseils({ commit }) {
    const API_URL = process.env.VUE_APP_API_URL;
    try {
      const response = await axios.get(`${API_URL}/conseils`);
      // Vérifie que la réponse est bien un tableau
      const conseils = Array.isArray(response.data) ? response.data : [];
      commit("setConseils", conseils);
    } catch (e) {
      // En cas d'erreur, on vide la liste pour éviter un affichage cassé
      commit("setConseils", []);
      // Optionnel : log ou dispatch d'une notification d'erreur
    }
  },
  async addConseil({ commit }, conseil) {
    const API_URL = process.env.VUE_APP_API_URL;
    const token = localStorage.getItem("jwt");
    // Adapter les champs pour le backend
    const payload = {
      title: conseil.name || conseil.title || "",
      category: conseil.role || conseil.category || "",
      content: conseil.description || conseil.content || "",
      img: conseil.img || "",
    };
    const response = await axios.post(`${API_URL}/conseils`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Correction : s'assurer que response.data est un tableau
    const conseils = Array.isArray(response.data)
      ? response.data
      : [response.data];
    commit("setConseils", conseils);
  },
  async deleteConseil({ commit }, id) {
    const API_URL = process.env.VUE_APP_API_URL;
    const token = localStorage.getItem("jwt");
    const response = await axios.delete(`${API_URL}/conseils/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    commit("setConseils", response.data);
  },
  async updateConseil({ commit }, updated) {
    const API_URL = process.env.VUE_APP_API_URL;
    const token = localStorage.getItem("jwt");
    // Adapter les champs pour le backend
    const payload = {
      title: updated.name || updated.title || "",
      category: updated.role || updated.category || "",
      content: updated.description || updated.content || "",
      img: updated.img || "",
    };
    const response = await axios.put(
      `${API_URL}/conseils/${updated.id}`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    commit("setConseils", response.data);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
