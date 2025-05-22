import axios from "axios";

const state = {
  users: [],
};

const getters = {
  allUsers: (state) => state.users,
};

function normalizeUser(user) {
  if (!user) return user;
  return {
    ...user,
    firstName: user.firstName || user.prenom || "",
    lastName: user.lastName || user.nom || "",
  };
}

const mutations = {
  setUsers(state, users) {
    state.users = users.map(normalizeUser);
  },
  ADD_USER(state, user) {
    state.users.push(normalizeUser(user));
  },
  UPDATE_USER(state, updated) {
    const idx = state.users.findIndex((u) => u.id === updated.id);
    if (idx !== -1) state.users[idx] = { ...normalizeUser(updated) };
  },
  DELETE_USER(state, id) {
    state.users = state.users.filter((u) => u.id !== id);
  },
};

const actions = {
  async fetchUsers({ commit }) {
    const API_URL = process.env.VUE_APP_API_URL;
    const token = localStorage.getItem("jwt");
    const response = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    commit("setUsers", response.data);
  },
  async addUser({ commit }, user) {
    const API_URL = process.env.VUE_APP_API_URL;
    const token = localStorage.getItem("jwt");
    // Adapter les champs pour le backend
    const payload = {
      ...user,
      nom: user.lastName || user.nom || "",
      prenom: user.firstName || user.prenom || "",
    };
    const response = await axios.post(`${API_URL}/users`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    commit("ADD_USER", response.data);
  },
  async updateUser({ commit }, user) {
    const API_URL = process.env.VUE_APP_API_URL;
    const token = localStorage.getItem("jwt");
    // Adapter les champs pour le backend
    const payload = {
      ...user,
      nom: user.lastName || user.nom || "",
      prenom: user.firstName || user.prenom || "",
    };
    const response = await axios.put(`${API_URL}/users/${user.id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    commit("UPDATE_USER", response.data);
  },
  async deleteUser({ commit }, id) {
    const API_URL = process.env.VUE_APP_API_URL;
    const token = localStorage.getItem("jwt");
    await axios.delete(`${API_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    commit("DELETE_USER", id);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
