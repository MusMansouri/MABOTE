import usersData from "@/data/users.json";

const state = {
  users: [...usersData],
};

const getters = {
  allUsers: (state) => state.users,
};

const mutations = {
  setUsers(state, users) {
    state.users = users;
  },
  ADD_USER(state, user) {
    state.users.push(user);
  },
  UPDATE_USER(state, updated) {
    const idx = state.users.findIndex((u) => u.id === updated.id);
    if (idx !== -1) state.users[idx] = { ...updated };
  },
  DELETE_USER(state, id) {
    state.users = state.users.filter((u) => u.id !== id);
  },
};

const actions = {
  fetchUsers({ commit }) {
    commit("setUsers", [...usersData]);
  },
  addUser({ commit }, user) {
    commit("ADD_USER", user);
  },
  updateUser({ commit }, user) {
    commit("UPDATE_USER", user);
  },
  deleteUser({ commit }, id) {
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
