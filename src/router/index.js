import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import RituelsView from "../views/RituelsView.vue";
import ConseilView from "../views/ConseilView.vue";
import ContactView from "../views/ContactView.vue";
import AdminDashboard from "../views/AdminDashboard.vue";
import ClientDashboard from "../views/ClientDashboard.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import ConseilDetailView from "@/views/ConseilDetailView.vue";
import ReservationView from "../views/ReservationView.vue";
import ReservationConnectedView from "@/views/ReservationConnectedView.vue";
import ReservationGuestView from "@/views/ReservationGuestView.vue";
import store from "@/store";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
  {
    path: "/rituels",
    name: "rituels",
    component: RituelsView,
  },
  {
    path: "/conseils",
    name: "conseils",
    component: ConseilView,
  },
  {
    path: "/conseils/:id",
    name: "ConseilDetail",
    component: ConseilDetailView,
  },
  {
    path: "/contact",
    name: "contact",
    component: ContactView,
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/client",
    name: "client",
    component: ClientDashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  },
  {
    path: "/reservation/:ritualId",
    name: "Reservation",
    component: ReservationView,
  },
  {
    path: "/reservation/connected/:ritualId",
    name: "ReservationConnected",
    component: ReservationConnectedView,
    meta: { requiresAuth: true },
  },
  {
    path: "/reservation/guest/:ritualId",
    name: "ReservationGuest",
    component: ReservationGuestView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!store.getters["auth/user"];
  const isAdmin = store.getters["auth/isAdmin"];

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next("/client");
  } else {
    next();
  }
});

export default router;
