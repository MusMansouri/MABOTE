import { computed } from "vue";
import { useStore } from "vuex";
import { useAuth } from "./useAuth";

export function useAppointments() {
  const store = useStore();
  const { user, isAdmin } = useAuth();

  const allAppointments = computed(
    () => store.getters["appointments/allAppointments"]
  );
  const myAppointments = computed(
    () => store.getters["appointments/myAppointments"]
  );
  const availabilities = computed(
    () => store.getters["appointments/availabilities"]
  );

  const fetchAppointments = () =>
    store.dispatch("appointments/fetchAppointments");
  const fetchAvailabilities = () =>
    store.dispatch("appointments/fetchAvailabilities");
  const addAppointment = (appointment) =>
    store.dispatch("appointments/addAppointment", appointment);
  const cancelAppointment = (id) =>
    store.dispatch("appointments/cancelAppointment", id);
  const addAvailability = (availability) =>
    store.dispatch("appointments/addAvailability", availability);
  const deleteAvailability = (id) =>
    store.dispatch("appointments/deleteAvailability", id);
  const fetchAvailableSlots = (params) =>
    store.dispatch("appointments/fetchAvailableSlots", params);

  return {
    allAppointments,
    myAppointments,
    availabilities,
    fetchAppointments,
    fetchAvailabilities,
    addAppointment,
    cancelAppointment,
    addAvailability,
    deleteAvailability,
    fetchAvailableSlots,
  };
}
