import { computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";

let inactivityTimeout = null;
const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes in ms

function resetInactivityTimer(logoutFn) {
  if (inactivityTimeout) clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(() => {
    logoutFn();
  }, INACTIVITY_LIMIT);
}

export function useAuth() {
  const store = useStore();
  const logoutFn = () => store.dispatch("auth/logout");

  onMounted(() => {
    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    const reset = () => resetInactivityTimer(logoutFn);
    events.forEach((e) => window.addEventListener(e, reset));
    reset();
  });
  onUnmounted(() => {
    if (inactivityTimeout) clearTimeout(inactivityTimeout);
    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    events.forEach((e) => window.removeEventListener(e, resetInactivityTimer));
  });

  return {
    user: computed(() => store.getters["auth/user"]),
    isAdmin: () => store.getters["auth/isAdmin"],
    isClient: () => store.getters["auth/isClient"],
    login: (email, password) =>
      store.dispatch("auth/login", { email, password }),
    register: (userData) => store.dispatch("auth/register", userData),
    logout: () => store.dispatch("auth/logout"),
    updateUser: (userData) => store.dispatch("auth/updateUser", userData),
    setToken(token) {
      localStorage.setItem("token", token);
    },
    getToken() {
      return localStorage.getItem("token");
    },
    removeToken() {
      localStorage.removeItem("token");
    },
  };
}
