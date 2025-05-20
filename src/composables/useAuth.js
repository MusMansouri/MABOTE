import { computed } from "vue";
import { useStore } from "vuex";

export function useAuth() {
  const store = useStore();
  return {
    user: computed(() => store.getters["auth/user"]),
    isAdmin: () => store.getters["auth/isAdmin"],
    isClient: () => store.getters["auth/isClient"],
    login: (email, password) =>
      store.dispatch("auth/login", { email, password }),
    register: (userData) => store.dispatch("auth/register", userData),
    logout: () => store.dispatch("auth/logout"),
    updateUser: (userData) => store.dispatch("auth/updateUser", userData),
  };
}
