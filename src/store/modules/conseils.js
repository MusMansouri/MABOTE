import conseilsData from "@/data/conseils.json";

const state = {
  conseils: [...conseilsData],
};

const getters = {
  allConseils: (state) => state.conseils,
  conseils: (state) => state.conseils,
};

const mutations = {
  setConseils(state, conseils) {
    state.conseils = conseils;
  },
};

const actions = {
  fetchConseils({ commit }) {
    commit("setConseils", [...conseilsData]);
  },
  addConseil({ commit, state }, conseil) {
    const newConseil = { ...conseil, id: Date.now() };
    const conseils = [...state.conseils, newConseil];
    commit("setConseils", conseils);
  },
  deleteConseil({ commit, state }, id) {
    const conseils = state.conseils.filter((c) => c.id !== id);
    commit("setConseils", conseils);
  },
  updateConseil({ commit, state }, updated) {
    const conseils = state.conseils.map((c) =>
      c.id === updated.id ? updated : c
    );
    commit("setConseils", conseils);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
