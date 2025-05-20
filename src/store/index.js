import { createStore } from "vuex";
import auth from "./modules/auth";
import rituals from "./modules/rituals";
import conseils from "./modules/conseils";
import appointments from "./modules/appointments";
import users from "./modules/users";

export default createStore({
  modules: {
    auth,
    rituals,
    conseils,
    appointments,
    users,
  },
});
