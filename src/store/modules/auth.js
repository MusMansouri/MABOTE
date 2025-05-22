import axios from "axios";

const state = {
  user: null,
  isAuthenticated: false,
  users: [],
};

const getters = {
  user: (state) => state.user,
  isAuthenticated: (state) => !!state.user,
  isAdmin: (state) => state.user && state.user.role === "admin",
  isClient: (state) => state.user && state.user.role === "client",
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
  SET_USER(state, user) {
    state.user = normalizeUser(user);
    state.isAuthenticated = !!user;
  },
  ADD_USER(state, user) {
    state.users.push(normalizeUser(user));
  },
  UPDATE_USER(state, updatedUser) {
    const idx = state.users.findIndex((u) => u.id === updatedUser.id);
    if (idx !== -1) state.users[idx] = { ...normalizeUser(updatedUser) };
    if (state.user && state.user.id === updatedUser.id) {
      state.user = { ...normalizeUser(updatedUser) };
    }
  },
};

const actions = {
  async login({ commit }, { email, password }) {
    try {
      const API_URL = process.env.VUE_APP_API_URL;
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem("jwt", token);
      localStorage.setItem("user", JSON.stringify(user));
      commit("SET_USER", user);
      return true;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      return false;
    }
  },
  logout({ commit }) {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    commit("SET_USER", null);
  },
  async register({ commit }, userData) {
    try {
      const API_URL = process.env.VUE_APP_API_URL;
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      const { token, user } = response.data;
      localStorage.setItem("jwt", token);
      localStorage.setItem("user", JSON.stringify(user));
      commit("SET_USER", user);
      return user;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Erreur lors de l'inscription");
    }
  },
  async updateUser({ commit, state }, user) {
    try {
      const API_URL = process.env.VUE_APP_API_URL;
      const token = localStorage.getItem("jwt");
      const response = await axios.put(`${API_URL}/users/${user.id}`, user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      commit("UPDATE_USER", response.data);
      // Si l'utilisateur connecté est modifié, on met à jour le state.user
      if (state.user && state.user.id === user.id) {
        commit("SET_USER", response.data);
      }
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la mise à jour du profil utilisateur");
    }
  },
};

// Restaure la session utilisateur depuis localStorage au chargement du store
const savedToken = localStorage.getItem("jwt");
const savedUser = localStorage.getItem("user");
if (savedToken && savedUser) {
  state.user = JSON.parse(savedUser);
  state.isAuthenticated = true;
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
