import { computed } from "vue";
import { useStore } from "vuex";

export function useStoreHelpers() {
  const store = useStore();

  return {
    // Getters
    allRituals: computed(() => store.getters["rituals/allRituals"]),
    allConseils: computed(() => store.getters["conseils/allConseils"]),
    allAppointments: computed(
      () => store.getters["appointments/allAppointments"]
    ),
    myAppointments: computed(
      () => store.getters["appointments/myAppointments"]
    ),
    allUsers: computed(() => store.getters["users/allUsers"]),
    availabilities: computed(
      () => store.getters["appointments/availabilities"]
    ),

    // Actions
    fetchRituals: () => store.dispatch("rituals/fetchRituals"),
    fetchConseils: () => store.dispatch("conseils/fetchConseils"),
    fetchAppointments: () => store.dispatch("appointments/fetchAppointments"),
    fetchAvailabilities: () =>
      store.dispatch("appointments/fetchAvailabilities"),
    fetchUsers: () => store.dispatch("users/fetchUsers"),
  };
}
