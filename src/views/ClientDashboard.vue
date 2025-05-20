<template>
  <div class="client-dashboard container py-5">
    <Toast
      v-if="errorMessage"
      :message="errorMessage"
      @close="errorMessage = ''"
    />
    <h1 class="mb-4 text-center">
      <i class="bi bi-person-circle me-2"></i>
      Mon espace personnel
    </h1>
    <div class="row g-4">
      <!-- Colonne profil -->
      <div class="col-12 col-lg-4">
        <div
          class="client-section profile-card bg-white rounded-4 shadow-sm p-4 mb-4 text-center position-relative"
        >
          <div class="profile-avatar-wrapper mb-3">
            <label class="profile-avatar-label">
              <input
                type="file"
                accept="image/*"
                class="d-none"
                @change="onProfileImageChange"
              />
              <img
                :src="
                  store.getters['auth/user'] && store.getters['auth/user'].photo
                    ? store.getters['auth/user'].photo
                    : defaultAvatar
                "
                alt="avatar"
                class="profile-avatar-img"
              />
              <div class="profile-avatar-edit">Changer</div>
            </label>
            <button
              v-if="store.getters['auth/user']?.photo"
              class="btn btn-link btn-sm profile-avatar-remove"
              @click="removeProfileImage"
              aria-label="Supprimer la photo de profil"
            >
              <i class="bi bi-x-circle"></i>
            </button>
          </div>
          <h2 class="h5 mt-2 mb-1 profile-name">
            {{
              (store.getters["auth/user"]?.firstName || "") +
                " " +
                (store.getters["auth/user"]?.lastName || "") || "Utilisateur"
            }}
          </h2>
          <div class="text-muted mb-2 profile-email">
            {{ store.getters["auth/user"]?.email }}<br />
            <span v-if="store.getters['auth/user']?.phone">{{
              store.getters["auth/user"].phone
            }}</span>
          </div>
          <span class="badge bg-secondary mb-3 profile-role">
            {{
              store.getters["auth/user"]?.role === "admin" ? "Admin" : "Client"
            }}
          </span>
          <button
            class="btn btn-outline-primary btn-sm w-100 profile-edit-btn"
            @click="editProfileModal = true"
          >
            <i class="bi bi-pencil me-1"></i> Modifier mon profil
          </button>
        </div>
      </div>
      <!-- Colonne principale -->
      <div class="col-12 col-lg-8">
        <div class="client-section bg-white rounded-4 shadow-sm p-4 mb-4">
          <h2 class="h5 mb-3">
            <i class="bi bi-calendar-event me-2"></i>
            {{ t("upcomingAppointments") }}
          </h2>
          <div
            v-if="paginatedAppointments.length === 0"
            class="alert alert-info"
          >
            {{ t("noUpcomingAppointments") }}
          </div>
          <ul class="list-group" v-else>
            <li
              v-for="appointment in paginatedAppointments"
              :key="appointment.id"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                <strong>{{ appointment.ritualName }}</strong>
                <span class="text-muted ms-2"
                  >{{ formatDate(appointment.date) }} à
                  {{ appointment.time }}</span
                >
                <span class="badge bg-secondary ms-2">{{
                  appointment.status
                }}</span>
              </span>
              <div class="d-flex gap-2">
                <button
                  class="btn btn-outline-primary btn-sm"
                  @click="openEditModal(appointment)"
                >
                  Modifier
                </button>
                <button
                  class="btn btn-danger btn-sm"
                  @click="cancelAppointment(appointment.id)"
                >
                  Annuler
                </button>
              </div>
            </li>
          </ul>
          <nav
            v-if="totalPages > 1"
            aria-label="Pagination rendez-vous"
            class="mt-3"
          >
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button
                  class="page-link"
                  @click="prevPage"
                  :aria-disabled="currentPage === 1"
                  aria-label="{{ t('previous') }}"
                >
                  &laquo;
                </button>
              </li>
              <li
                class="page-item"
                v-for="page in totalPages"
                :key="page"
                :class="{ active: currentPage === page }"
              >
                <button class="page-link" @click="goToPage(page)">
                  {{ page }}
                </button>
              </li>
              <li
                class="page-item"
                :class="{ disabled: currentPage === totalPages }"
              >
                <button
                  class="page-link"
                  @click="nextPage"
                  :aria-disabled="currentPage === totalPages"
                  aria-label="{{ t('next') }}"
                >
                  &raquo;
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <!-- Amélioration visuelle de la section feedbacks -->
        <div class="client-section bg-white rounded-4 shadow-sm p-4 mt-4">
          <h2 class="h5 mb-3">
            <i class="bi bi-chat-dots me-2"></i>
            Vos feedbacks
          </h2>
          <div v-if="feedbacks.length === 0" class="alert alert-info">
            Aucun feedback trouvé.
          </div>
          <div v-else>
            <ul class="list-group">
              <li
                v-for="fb in feedbacks"
                :key="fb.id"
                class="list-group-item d-flex align-items-center py-3"
              >
                <div class="position-relative me-3">
                  <img
                    v-if="fb.photo"
                    :src="fb.photo"
                    alt="photo feedback"
                    style="
                      width: 72px;
                      height: 72px;
                      object-fit: cover;
                      border-radius: 50%;
                      box-shadow: 0 2px 12px 0 rgba(185, 108, 83, 0.13);
                      border: 2px solid #b96c53;
                    "
                  />
                  <button
                    v-if="fb.photo"
                    class="btn btn-link btn-sm position-absolute top-0 end-0 p-0"
                    style="
                      z-index: 2;
                      color: #b96c53;
                      background: #fff6f1;
                      border-radius: 50%;
                    "
                    @click="removeFeedbackPhoto(fb.id)"
                    aria-label="Supprimer la photo du feedback"
                  >
                    <i class="bi bi-x-circle"></i>
                  </button>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold mb-1">{{ fb.message }}</div>
                  <div class="text-muted small">
                    {{ new Date(fb.createdAt).toLocaleDateString() }}
                  </div>
                </div>
                <button
                  class="btn btn-outline-danger btn-sm ms-2"
                  @click="deleteFeedback(fb.id)"
                  aria-label="Supprimer ce feedback"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </li>
            </ul>
          </div>
          <h3 class="h6 mt-4">Laisser un feedback</h3>
          <form @submit.prevent="submitFeedback" class="mt-2">
            <div class="mb-3">
              <textarea
                v-model="feedbackMessage"
                class="form-control"
                rows="3"
                placeholder="Votre message"
                required
              ></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Ajouter une photo</label>
              <input
                type="file"
                accept="image/*"
                class="form-control"
                @change="onFeedbackPhotoChange"
              />
              <span v-if="feedbackPhoto" class="ms-2">Image sélectionnée</span>
            </div>
            <div v-if="feedbackError" class="text-danger small mb-2">
              {{ feedbackError }}
            </div>
            <div class="d-flex justify-content-end">
              <button type="submit" class="btn btn-primary btn-sm me-2">
                Envoyer
              </button>
              <button
                type="button"
                class="btn btn-secondary btn-sm"
                @click="
                  feedbackMessage = '';
                  feedbackPhoto = '';
                  feedbackError = '';
                "
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal modification profil -->
    <div
      v-if="editProfileModal"
      class="modal-backdrop"
      aria-modal="true"
      role="dialog"
    >
      <div class="modal-dialog">
        <div class="modal-content p-3">
          <h5>{{ t("editProfileTitle") }}</h5>
          <form @submit.prevent="saveProfile">
            <input
              v-model="editProfile.firstName"
              class="form-control mb-2"
              :placeholder="t('firstName')"
              required
              aria-label="{{ t('firstName') }}"
            />
            <input
              v-model="editProfile.lastName"
              class="form-control mb-2"
              :placeholder="t('lastName')"
              required
              aria-label="{{ t('lastName') }}"
            />
            <input
              v-model="editProfile.email"
              class="form-control mb-2"
              :placeholder="t('email')"
              required
              aria-label="{{ t('email') }}"
              @blur="validateEmail"
            />
            <input
              v-model="editProfile.phone"
              class="form-control mb-2"
              :placeholder="t('phone')"
              required
              aria-label="{{ t('phone') }}"
              @blur="validatePhone"
            />
            <div v-if="emailError" class="text-danger small mb-2">
              {{ emailError }}
            </div>
            <div v-if="phoneError" class="text-danger small mb-2">
              {{ phoneError }}
            </div>
            <button
              type="submit"
              class="btn btn-primary btn-sm me-2"
              :disabled="!!emailError || !!phoneError"
            >
              {{ t("save") }}
            </button>
            <button
              type="button"
              class="btn btn-secondary btn-sm"
              @click="editProfileModal = false"
            >
              {{ t("cancel") }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de modification -->
    <div
      v-if="showEditModal"
      class="modal-backdrop"
      aria-modal="true"
      role="dialog"
    >
      <div class="modal-dialog">
        <div class="modal-content p-3">
          <h5>{{ t("editAppointmentTitle") }}</h5>
          <form @submit.prevent="saveAppointment">
            <div class="mb-3">
              <label class="form-label">{{ t("date") }}</label>
              <input
                type="date"
                v-model="editAppointment.date"
                class="form-control"
                required
                aria-label="{{ t('date') }}"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">{{ t("time") }}</label>
              <input
                type="time"
                v-model="editAppointment.time"
                class="form-control"
                required
                aria-label="{{ t('time') }}"
              />
            </div>
            <div class="d-flex justify-content-end">
              <button
                type="button"
                class="btn btn-secondary me-2"
                @click="closeEditModal"
              >
                {{ t("cancel") }}
              </button>
              <button type="submit" class="btn btn-primary">
                {{ t("save") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Toast from "@/components/Toast.vue";
import { ref, computed, watchEffect } from "vue";
import { useStore } from "vuex";
import feedbacksData from "@/data/feedbacks.json";

const store = useStore();
const defaultAvatar =
  "https://ui-avatars.com/api/?name=Client&background=b96c53&color=fff";
const editProfileModal = ref(false);
const editProfile = ref({ firstName: "", lastName: "", email: "", phone: "" });
const errorMessage = ref("");
const emailError = ref("");
const phoneError = ref("");
const feedbacksAll = ref([...feedbacksData]);
const feedbacks = computed(() => {
  const user = store.getters["auth/user"];
  if (!user) return [];
  return feedbacksAll.value.filter((fb) => fb.userId === user.id);
});
const feedbackMessage = ref("");
const feedbackPhoto = ref("");
const feedbackError = ref("");

// i18n simulation
const messages = {
  firstName: "Prénom",
  lastName: "Nom",
  editProfileTitle: "Modifier mon profil",
  name: "Nom",
  email: "E-mail",
  phone: "Téléphone",
  save: "Enregistrer",
  cancel: "Annuler",
  editAppointmentTitle: "Modifier le rendez-vous",
  date: "Date",
  time: "Heure",
  upcomingAppointments: "Mes rendez-vous à venir",
  noUpcomingAppointments: "Aucun rendez-vous à venir.",
  previous: "Précédent",
  next: "Suivant",
  invalidEmail: "Format d'e-mail invalide.",
  invalidPhone: "Format de téléphone invalide.",
  updateProfileError: "Erreur lors de la mise à jour du profil.",
  updateAppointmentError: "Erreur lors de la modification du rendez-vous.",
};
const t = (key) => messages[key] || key;

function onProfileImageChange(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      store.dispatch("auth/updateUser", {
        ...store.getters["auth/user"],
        photo: ev.target.result,
      });
    };
    reader.readAsDataURL(file);
  }
}

function removeProfileImage() {
  store.dispatch("auth/updateUser", {
    ...store.getters["auth/user"],
    photo: "",
  });
}

function validateEmail() {
  const email = editProfile.value.email;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  emailError.value = regex.test(email) ? "" : t("invalidEmail");
}

function validatePhone() {
  const phone = editProfile.value.phone;
  const regex = /^\+?[0-9\s]*$/;
  phoneError.value = regex.test(phone) ? "" : t("invalidPhone");
}

async function saveProfile() {
  validateEmail();
  validatePhone();
  if (emailError.value || phoneError.value) return;
  try {
    await store.dispatch("auth/updateUser", {
      ...store.getters["auth/user"],
      ...editProfile.value,
    });
    editProfileModal.value = false;
  } catch (e) {
    errorMessage.value = t("updateProfileError");
  }
}

async function saveAppointment() {
  try {
    await store.dispatch(
      "appointments/updateAppointment",
      editAppointment.value
    );
    closeEditModal();
  } catch (e) {
    errorMessage.value = t("updateAppointmentError");
  }
}

function cancelAppointment(appointmentId) {
  if (confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?")) {
    store.dispatch("appointments/cancelAppointment", appointmentId);
  }
}

function onFeedbackPhotoChange(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      feedbackPhoto.value = ev.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function submitFeedback() {
  feedbackError.value = "";
  if (!feedbackMessage.value) {
    feedbackError.value = "Le message est requis.";
    return;
  }
  const user = store.getters["auth/user"];
  feedbacksAll.value.push({
    id: Date.now(),
    userId: user.id,
    message: feedbackMessage.value,
    photo: feedbackPhoto.value || "",
    createdAt: new Date().toISOString(),
  });
  feedbackMessage.value = "";
  feedbackPhoto.value = "";
}

// Ajout de la suppression de feedback et de la photo du feedback
function removeFeedbackPhoto(feedbackId) {
  const fb = feedbacksAll.value.find((f) => f.id === feedbackId);
  if (fb) fb.photo = "";
}
function deleteFeedback(feedbackId) {
  if (confirm("Voulez-vous vraiment supprimer ce feedback ?")) {
    feedbacksAll.value = feedbacksAll.value.filter(
      (fb) => fb.id !== feedbackId
    );
  }
}

watchEffect(() => {
  if (store.getters["auth/user"]) {
    editProfile.value = {
      firstName: store.getters["auth/user"].firstName,
      lastName: store.getters["auth/user"].lastName,
      email: store.getters["auth/user"].email,
      phone: store.getters["auth/user"].phone,
    };
  }
});

// Pagination pour les rendez-vous à venir
const itemsPerPage = 5;
const currentPage = ref(1);
const totalPages = computed(() =>
  Math.ceil(futureAppointments.value.length / itemsPerPage)
);
const paginatedAppointments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return futureAppointments.value.slice(start, start + itemsPerPage);
});
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}
function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page;
}

// Rendez-vous à venir
const futureAppointments = computed(() => {
  const today = new Date().toISOString().slice(0, 10);
  return store.getters["appointments/myAppointments"]
    .filter((a) => a.status !== "cancelled" && a.date >= today)
    .sort(
      (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
    );
});

// Groupement des rendez-vous par date pour la vue simplifiée
const groupedAppointments = computed(() => {
  const groups = {};
  store.getters["appointments/myAppointments"].forEach((a) => {
    if (!groups[a.date]) groups[a.date] = [];
    groups[a.date].push(a);
  });
  return groups;
});

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

// Modal de modification des rendez-vous
const showEditModal = ref(false);
const editAppointment = ref({});

function openEditModal(appointment) {
  editAppointment.value = { ...appointment };
  showEditModal.value = true;
}

function closeEditModal() {
  showEditModal.value = false;
  editAppointment.value = {};
}
</script>

<style scoped>
.client-section {
  margin-bottom: 2rem;
  overflow-x: auto;
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-dialog {
  background: #fff;
  border-radius: 1rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 4px 32px 0 rgba(185, 108, 83, 0.13);
}
.profile-card {
  background: linear-gradient(135deg, #fff6f1 0%, #fff 100%);
  box-shadow: 0 4px 24px 0 rgba(185, 108, 83, 0.1);
  border: 1.5px solid #f3e2db;
}
.profile-avatar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-width: 120px;
  min-height: 120px;
}
.profile-avatar-label {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.profile-avatar-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #b96c53;
  box-shadow: 0 2px 12px 0 rgba(185, 108, 83, 0.13);
  background: #fff;
  transition: box-shadow 0.2s, border 0.2s;
}
.profile-avatar-label:hover .profile-avatar-img {
  box-shadow: 0 4px 24px 0 rgba(185, 108, 83, 0.18);
  border-color: #a04d2e;
}
.profile-avatar-edit {
  font-size: 0.95rem;
  color: #b96c53;
  margin-top: 0.5rem;
  text-align: center;
}
.profile-avatar-remove {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #b96c53;
  font-size: 1.3rem;
  background: #fff6f1;
  border-radius: 50%;
  border: none;
  padding: 0.2rem 0.4rem;
  z-index: 10;
  box-shadow: 0 2px 8px 0 rgba(185, 108, 83, 0.1);
  transition: background 0.18s;
}
.profile-avatar-remove:hover {
  background: #ffeaea;
  color: #a04d2e;
}
.profile-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #45241b;
}
.profile-email {
  font-size: 1rem;
}
.profile-role {
  font-size: 0.95rem;
  letter-spacing: 0.02em;
}
.profile-edit-btn {
  margin-top: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
}
@media (max-width: 991.98px) {
  .client-section {
    padding: 1rem 0.5rem;
  }
  .profile-card {
    margin-bottom: 2rem;
  }
  .profile-avatar-img {
    width: 96px;
    height: 96px;
  }
}
</style>
