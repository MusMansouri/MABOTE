import usersData from "@/data/users.json";
import axios from "axios";

const state = {
  user: null,
  isAuthenticated: false,
  users: [...usersData],
};

const getters = {
  user: (state) => state.user,
  isAuthenticated: (state) => !!state.user,
  isAdmin: (state) => state.user && state.user.role === "admin",
  isClient: (state) => state.user && state.user.role === "client",
  allUsers: (state) => state.users,
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
    state.isAuthenticated = !!user;
  },
  ADD_USER(state, user) {
    state.users.push(user);
  },
  UPDATE_USER(state, updatedUser) {
    const idx = state.users.findIndex((u) => u.id === updatedUser.id);
    if (idx !== -1) state.users[idx] = { ...updatedUser };
    if (state.user && state.user.id === updatedUser.id) {
      state.user = { ...updatedUser };
    }
  },
};

const actions = {
  async login({ commit }, { email, password }) {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email,
          password,
        }
      );
      const { token, user } = response.data;

      // Store the token in localStorage for persistence
      localStorage.setItem("jwt", token);

      // Commit the user data to the Vuex store
      commit("SET_USER", user);
      return true;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      return false;
    }
  },
  logout({ commit }) {
    // Clear the token from localStorage
    localStorage.removeItem("jwt");

    // Reset the user state
    commit("SET_USER", null);
  },
  register({ commit, state }, userData) {
    const exists = state.users.some((u) => u.email === userData.email);
    if (exists) throw new Error("Cet email est déjà utilisé.");
    const newUser = {
      ...userData,
      id: Date.now(),
      role: "client",
      phone: userData.phone || "",
    };
    commit("ADD_USER", newUser);
    commit("SET_USER", newUser);
    return newUser;
  },
  updateUser({ commit }, user) {
    commit("UPDATE_USER", user);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
