import axios from "axios";

const state = {
  appointments: [],
  availabilities: [],
  loading: false,
  error: null,
};

const getters = {
  allAppointments: (state, getters, rootState, rootGetters) => {
    // Enrichit chaque rendez-vous avec le nom du client et du rituel
    return state.appointments.map((a) => {
      const user = rootGetters["users/allUsers"]?.find(
        (u) => u.id === a.userId
      );
      const ritual = rootGetters["rituals/allRituals"]?.find(
        (r) => r.id === a.ritualId
      );
      return {
        ...a,
        clientName: user
          ? user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim()
          : a.userInfo?.name || a.guestInfo?.name || "Invité",
        ritualName: ritual ? ritual.name : a.ritualName || "Rituel inconnu",
      };
    });
  },
  myAppointments: (state, getters, rootState, rootGetters) => {
    const user = rootGetters["auth/user"];
    if (!user) return [];
    return getters.allAppointments.filter((a) => a.userId === user.id);
  },
  availabilities: (state) => state.availabilities,
};

const mutations = {
  setAppointments(state, appointments) {
    state.appointments = appointments;
  },
  setAvailabilities(state, payload) {
    if (Array.isArray(payload)) {
      state.availabilities = payload;
    } else if (payload && Array.isArray(payload.data)) {
      state.availabilities = payload.data;
    } else {
      state.availabilities = [];
      console.warn(
        "[appointments/setAvailabilities] Received unexpected payload structure. Availabilities set to empty array. Payload:",
        payload
      );
    }
  },
  setLoading(state, loading) {
    state.loading = loading;
  },
  setError(state, error) {
    state.error = error;
  },
};

const actions = {
  async fetchAppointments({ commit }) {
    commit("setLoading", true);
    try {
      const token = localStorage.getItem("jwt");
      const API_URL = process.env.VUE_APP_API_URL;
      const response = await axios.get(`${API_URL}/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      commit("setAppointments", response.data);
    } catch (error) {
      commit("setError", error.message);
      console.error("Erreur lors du chargement des rendez-vous:", error);
    } finally {
      commit("setLoading", false);
    }
  },
  async fetchAvailabilities({ commit }) {
    commit("setLoading", true);
    try {
      const token = localStorage.getItem("jwt");
      const API_URL = process.env.VUE_APP_API_URL;
      const response = await axios.get(`${API_URL}/availabilities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      commit("setAvailabilities", response.data);
    } catch (error) {
      commit("setError", error.message);
      console.error("Erreur lors du chargement des disponibilités:", error);
    } finally {
      commit("setLoading", false);
    }
  },
  async addAppointment({ dispatch, commit }, appointment) {
    commit("setLoading", true);
    try {
      const token = localStorage.getItem("jwt");
      const API_URL = process.env.VUE_APP_API_URL;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.post(`${API_URL}/appointments`, appointment, { headers });
      await dispatch("fetchAppointments");
    } catch (error) {
      commit("setError", error.message);
      throw error;
    } finally {
      commit("setLoading", false);
    }
  },
  async cancelAppointment({ dispatch, commit }, id) {
    commit("setLoading", true);
    try {
      const token = localStorage.getItem("jwt");
      const API_URL = process.env.VUE_APP_API_URL;
      await axios.put(
        `${API_URL}/appointments/${id}`,
        { status: "cancelled" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await dispatch("fetchAppointments");
    } catch (error) {
      commit("setError", error.message);
      throw error;
    } finally {
      commit("setLoading", false);
    }
  },
  async updateAvailability({ dispatch, commit }, availability) {
    commit("setLoading", true);
    try {
      const token = localStorage.getItem("jwt");
      const API_URL = process.env.VUE_APP_API_URL;
      await axios.put(
        `${API_URL}/availabilities/${availability.id}`,
        availability,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await dispatch("fetchAvailabilities");
    } catch (error) {
      commit("setError", error.message);
      throw error;
    } finally {
      commit("setLoading", false);
    }
  },
  async deleteAvailability({ dispatch, commit }, id) {
    commit("setLoading", true);
    try {
      const token = localStorage.getItem("jwt");
      const API_URL = process.env.VUE_APP_API_URL;
      await axios.delete(`${API_URL}/availabilities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await dispatch("fetchAvailabilities");
    } catch (error) {
      commit("setError", error.message);
      throw error;
    } finally {
      commit("setLoading", false);
    }
  },
  async addAvailability({ dispatch, commit }, availability) {
    commit("setLoading", true);
    try {
      const token = localStorage.getItem("jwt");
      const API_URL = process.env.VUE_APP_API_URL;
      await axios.post(`${API_URL}/availabilities`, availability, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await dispatch("fetchAvailabilities");
    } catch (error) {
      commit("setError", error.message);
      throw error;
    } finally {
      commit("setLoading", false);
    }
  },
  // Nouvelle action pour obtenir les créneaux disponibles pour un rituel et une date
  async fetchAvailableSlots(_, { ritualId, date }) {
    const token = localStorage.getItem("jwt");
    const API_URL = process.env.VUE_APP_API_URL;
    // L'API doit retourner les créneaux disponibles pour ce rituel et cette date
    const response = await axios.get(
      `${API_URL}/availabilities/slots?ritualId=${ritualId}&date=${date}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data; // Tableau de créneaux horaires
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
