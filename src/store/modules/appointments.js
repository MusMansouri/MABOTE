import axios from "axios";

const state = {
  appointments: [], // Chargement initial des rendez-vous
  availabilities: [], // Chargement initial des disponibilités
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
          ? user.name
          : a.userInfo?.name || a.guestInfo?.name || "Invité",
        ritualName: ritual ? ritual.name : a.ritualName || "Rituel inconnu",
      };
    });
  },
  myAppointments: (state, getters, rootState, rootGetters) => {
    const user = rootGetters["auth/user"];
    if (!user) return [];
    // Utilise le getter enrichi pour avoir les noms
    return getters.allAppointments.filter((a) => a.userId === user.id);
  },
  availabilities: (state) => state.availabilities,
};

const mutations = {
  setAppointments(state, appointments) {
    state.appointments = appointments;
  },
  setAvailabilities(state, availabilities) {
    state.availabilities = availabilities;
  },
  ADD_APPOINTMENT(state, appointment) {
    const conflict = state.appointments.find(
      (a) =>
        a.date === appointment.date &&
        a.time === appointment.time &&
        a.status !== "cancelled"
    );
    if (conflict) {
      throw new Error("Ce créneau est déjà réservé.");
    }
    const newAppointment = {
      ...appointment,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    state.appointments.push(newAppointment);
  },
  CANCEL_APPOINTMENT(state, id) {
    const index = state.appointments.findIndex((a) => a.id === id);
    if (index !== -1) {
      state.appointments[index].status = "cancelled";
    }
  },
};

const actions = {
  async fetchAppointments({ commit }) {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get(
        "http://localhost:3000/api/appointments",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      commit("setAppointments", response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des rendez-vous:", error);
    }
  },
  async fetchAvailabilities({ commit }) {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get(
        "http://localhost:3000/api/availabilities",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      commit("setAvailabilities", response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des disponibilités:", error);
    }
  },
  async addAppointment({ commit }, appointment) {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.post(
        "http://localhost:3000/api/appointments",
        appointment,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      commit("ADD_APPOINTMENT", response.data);
    } catch (error) {
      throw error;
    }
  },
  async cancelAppointment({ commit }, id) {
    try {
      const token = localStorage.getItem("jwt");
      await axios.put(
        `http://localhost:3000/api/appointments/${id}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      commit("CANCEL_APPOINTMENT", id);
    } catch (error) {
      throw error;
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
