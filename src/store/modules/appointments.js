import appointmentsData from "@/data/appointments.json";
import availabilitiesData from "@/data/availabilities.json";

const state = {
  appointments: [...appointmentsData], // Chargement initial des rendez-vous
  availabilities: [...availabilitiesData], // Chargement initial des disponibilités
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
  fetchAppointments({ commit }) {
    commit("setAppointments", [...appointmentsData]);
  },
  fetchAvailabilities({ commit }) {
    commit("setAvailabilities", [...availabilitiesData]);
  },
  addAppointment({ commit }, appointment) {
    commit("ADD_APPOINTMENT", appointment);
  },
  cancelAppointment({ commit }, id) {
    commit("CANCEL_APPOINTMENT", id);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
