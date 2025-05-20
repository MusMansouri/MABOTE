import ritualsData from "@/data/rituals.json";

const state = {
  rituals: [...ritualsData],
};

const getters = {
  allRituals: (state) => state.rituals,
  rituals: (state) => state.rituals,
};

const mutations = {
  setRituals(state, rituals) {
    state.rituals = rituals;
  },
  ADD_RITUAL(state, ritual) {
    state.rituals.push({ ...ritual, id: Date.now() });
  },
  UPDATE_RITUAL(state, updated) {
    const idx = state.rituals.findIndex((r) => r.id === updated.id);
    if (idx !== -1) state.rituals[idx] = { ...updated };
  },
  DELETE_RITUAL(state, id) {
    state.rituals = state.rituals.filter((r) => r.id !== id);
  },
};

const actions = {
  fetchRituals({ commit }) {
    commit("setRituals", [...ritualsData]);
  },
  addRitual({ commit }, ritual) {
    commit("ADD_RITUAL", ritual);
  },
  updateRitual({ commit }, ritual) {
    commit("UPDATE_RITUAL", ritual);
  },
  deleteRitual({ commit }, id) {
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
