<template>
  <div class="admin-dashboard container py-5">
    <h1 class="mb-4 text-center">
      <i class="bi bi-speedometer2 me-2"></i>
      Tableau de bord administrateur
    </h1>
    <ul
      class="nav nav-pills justify-content-center mb-4 admin-tabs"
      role="tablist"
    >
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          :class="{ active: tab === 'overview' }"
          @click="tab = 'overview'"
          type="button"
        >
          <i class="bi bi-bar-chart me-1"></i> Vue d'ensemble
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          :class="{ active: tab === 'rituels' }"
          @click="tab = 'rituels'"
          type="button"
        >
          <i class="bi bi-stars me-1"></i> Rituels
          <span class="badge bg-secondary ms-1">{{
            store.getters["rituals/allRituals"].length
          }}</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          :class="{ active: tab === 'conseils' }"
          @click="tab = 'conseils'"
          type="button"
        >
          <i class="bi bi-lightbulb me-1"></i> Conseils
          <span class="badge bg-secondary ms-1">{{
            store.getters["conseils/allConseils"].length
          }}</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          :class="{ active: tab === 'users' }"
          @click="tab = 'users'"
          type="button"
        >
          <i class="bi bi-people me-1"></i> Utilisateurs
          <span class="badge bg-secondary ms-1">{{
            store.getters["users/allUsers"].length
          }}</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          :class="{ active: tab === 'rdv' }"
          @click="tab = 'rdv'"
          type="button"
        >
          <i class="bi bi-calendar-check me-1"></i> Disponibilités & RDV
        </button>
      </li>
    </ul>

    <!-- OVERVIEW -->
    <div
      v-if="tab === 'overview'"
      class="admin-section bg-white rounded-4 shadow-sm p-4 mb-5"
    >
      <div class="row text-center">
        <div class="col-6 col-md-3 mb-4">
          <div class="overview-card">
            <i class="bi bi-stars fs-2 mb-2"></i>
            <div class="fw-bold">
              {{ store.getters["rituals/allRituals"].length }}
            </div>
            <div>Rituels</div>
          </div>
        </div>
        <div class="col-6 col-md-3 mb-4">
          <div class="overview-card">
            <i class="bi bi-lightbulb fs-2 mb-2"></i>
            <div class="fw-bold">
              {{ store.getters["conseils/allConseils"].length }}
            </div>
            <div>Conseils</div>
          </div>
        </div>
        <div class="col-6 col-md-3 mb-4">
          <div class="overview-card">
            <i class="bi bi-people fs-2 mb-2"></i>
            <div class="fw-bold">
              {{ store.getters["users/allUsers"].length }}
            </div>
            <div>Utilisateurs</div>
          </div>
        </div>
        <div class="col-6 col-md-3 mb-4">
          <div class="overview-card">
            <i class="bi bi-calendar-check fs-2 mb-2"></i>
            <div class="fw-bold">{{ totalAppointments }}</div>
            <div>Rendez-vous</div>
          </div>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-12 col-md-6 mb-4">
          <h5 class="mb-3">
            <i class="bi bi-people me-2"></i>Derniers utilisateurs
          </h5>
          <ul class="list-group">
            <li
              v-for="user in store.getters['users/allUsers']
                .slice(-5)
                .reverse()"
              :key="user.id"
              class="list-group-item d-flex align-items-center"
            >
              <img
                v-if="user.photo"
                :src="user.photo"
                alt=""
                style="
                  width: 32px;
                  height: 32px;
                  object-fit: cover;
                  border-radius: 50%;
                  margin-right: 10px;
                "
              />
              <span>
                <strong>{{ user.name }}</strong>
                <span class="text-muted ms-2">{{ user.email }}</span>
                <span class="badge bg-secondary ms-2">{{ user.role }}</span>
              </span>
            </li>
          </ul>
        </div>
        <div class="col-12 col-md-6 mb-4">
          <h5 class="mb-3">
            <i class="bi bi-calendar-event me-2"></i>Prochains rendez-vous
          </h5>
          <ul class="list-group">
            <li
              v-for="appointment in upcomingAppointments"
              :key="appointment.id"
              class="list-group-item d-flex align-items-center"
            >
              <span>
                <strong>{{ appointment.ritualName }}</strong>
                <span class="text-muted ms-2"
                  >{{ appointment.date }} à {{ appointment.time }}</span
                >
                <span class="badge bg-secondary ms-2">{{
                  appointment.status
                }}</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- RITUELS -->
    <div
      v-if="tab === 'rituels'"
      class="admin-section bg-white rounded-4 shadow-sm p-4 mb-5"
    >
      <div class="row">
        <div class="col-md-6">
          <h2 class="h5 mb-3">
            <i class="bi bi-plus-circle me-2"></i>Ajouter un rituel
          </h2>
          <form @submit.prevent="handleAddRitual">
            <div class="mb-3">
              <label for="ritualName" class="form-label">Ritual Name</label>
              <input
                v-model="newRitual.name"
                type="text"
                class="form-control"
                id="ritualName"
                required
              />
            </div>
            <div class="mb-3">
              <label for="ritualDescription" class="form-label"
                >Description</label
              >
              <textarea
                v-model="newRitual.description"
                class="form-control"
                id="ritualDescription"
                rows="3"
                required
              ></textarea>
            </div>
            <div class="mb-3">
              <label for="ritualDuration" class="form-label"
                >Duration (min)</label
              >
              <input
                v-model.number="newRitual.duration"
                type="number"
                min="1"
                class="form-control"
                id="ritualDuration"
                required
              />
            </div>
            <div class="mb-3">
              <label for="ritualPrice" class="form-label">Price (€)</label>
              <input
                v-model.number="newRitual.price"
                type="number"
                min="0"
                class="form-control"
                id="ritualPrice"
                required
              />
            </div>
            <div class="mb-3">
              <label for="ritualImage" class="form-label">Image</label>
              <input
                type="file"
                class="form-control"
                id="ritualImage"
                accept="image/*"
                @change="onRitualImageChange"
              />
              <div v-if="newRitual.image" class="mt-2">
                <img
                  :src="newRitual.image"
                  alt="Aperçu"
                  style="max-width: 100px; border-radius: 8px"
                />
              </div>
            </div>
            <button type="submit" class="btn btn-primary">Add Ritual</button>
          </form>
        </div>
        <div class="col-md-6">
          <h2 class="h5 mb-3">
            <i class="bi bi-list-ul me-2"></i>Rituels existants
          </h2>
          <ul class="list-group">
            <li
              v-for="ritual in store.getters['rituals/allRituals']"
              :key="ritual.id"
              class="list-group-item d-flex justify-content-between align-items-center ritual-item"
              :class="{
                'selected-item':
                  selectedRituel && selectedRituel.id === ritual.id,
              }"
              @click="selectRituel(ritual)"
              style="cursor: pointer"
            >
              <span class="d-flex align-items-center">
                <img
                  v-if="ritual.image"
                  :src="ritual.image"
                  alt=""
                  style="
                    width: 38px;
                    height: 38px;
                    object-fit: cover;
                    border-radius: 8px;
                    margin-right: 10px;
                  "
                  @error="onRitualImgError"
                />
                <strong>{{ ritual.name }}</strong>
                <span class="text-muted ms-2"
                  >{{ ritual.duration }} min, {{ ritual.price }} €</span
                >
              </span>
              <div
                v-if="selectedRituel && selectedRituel.id === ritual.id"
                class="item-actions"
              >
                <button
                  class="btn btn-sm btn-outline-primary me-2"
                  @click.stop="editRituel(ritual)"
                >
                  Modifier
                </button>
                <button
                  class="btn btn-sm btn-danger"
                  @click.stop="confirmAndDeleteRitual(ritual.id)"
                >
                  <i class="bi bi-trash">Supprimer</i>
                </button>
              </div>
            </li>
          </ul>
          <!-- Modal d'édition rituel -->
          <div v-if="editRituelModal" class="modal-backdrop">
            <div class="modal-dialog">
              <div class="modal-content p-3">
                <h5>Modifier le rituel</h5>
                <form @submit.prevent="saveEditRituel">
                  <input
                    v-model="editRitual.name"
                    class="form-control mb-2"
                    placeholder="Nom"
                    required
                  />
                  <textarea
                    v-model="editRitual.description"
                    class="form-control mb-2"
                    placeholder="Description"
                    required
                  ></textarea>
                  <input
                    v-model.number="editRitual.duration"
                    type="number"
                    min="1"
                    class="form-control mb-2"
                    placeholder="Durée"
                    required
                  />
                  <input
                    v-model.number="editRitual.price"
                    type="number"
                    min="0"
                    class="form-control mb-2"
                    placeholder="Prix"
                    required
                  />
                  <div class="mb-2">
                    <label class="form-label">Image</label>
                    <input
                      type="file"
                      class="form-control"
                      accept="image/*"
                      @change="onEditRitualImageChange"
                    />
                    <div v-if="editRitual.image" class="mt-2">
                      <img
                        :src="editRitual.image"
                        alt="Aperçu"
                        style="max-width: 100px; border-radius: 8px"
                      />
                    </div>
                  </div>
                  <button type="submit" class="btn btn-primary btn-sm me-2">
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary btn-sm"
                    @click="closeEditRituel"
                  >
                    Annuler
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CONSEILS -->
    <div
      v-if="tab === 'conseils'"
      class="admin-section bg-white rounded-4 shadow-sm p-4 mb-5"
    >
      <div class="row">
        <div class="col-md-6">
          <h2 class="h5 mb-3">
            <i class="bi bi-plus-circle me-2"></i>Ajouter un conseil
          </h2>
          <form @submit.prevent="handleAddConseil">
            <div class="mb-3">
              <label for="conseilName" class="form-label">Nom</label>
              <input
                v-model="newConseil.name"
                type="text"
                class="form-control"
                id="conseilName"
                required
              />
            </div>
            <div class="mb-3">
              <label for="conseilRole" class="form-label">Rôle</label>
              <input
                v-model="newConseil.role"
                type="text"
                class="form-control"
                id="conseilRole"
                required
              />
            </div>
            <div class="mb-3">
              <label for="conseilDescription" class="form-label"
                >Description</label
              >
              <textarea
                v-model="newConseil.description"
                class="form-control"
                id="conseilDescription"
                rows="2"
              ></textarea>
            </div>
            <div class="mb-3">
              <label for="conseilImg" class="form-label">Image</label>
              <input
                type="file"
                class="form-control"
                id="conseilImg"
                accept="image/*"
                @change="onConseilImageChange"
              />
              <div v-if="newConseil.img" class="mt-2">
                <img
                  :src="newConseil.img"
                  alt="Aperçu"
                  style="max-width: 100px; border-radius: 8px"
                />
              </div>
            </div>
            <button type="submit" class="btn btn-primary">Ajouter</button>
          </form>
        </div>
        <div class="col-md-6">
          <h2 class="h5 mb-3">
            <i class="bi bi-list-ul me-2"></i>Conseils existants
          </h2>
          <ul class="list-group">
            <li
              v-for="conseil in store.getters['conseils/allConseils']"
              :key="conseil.id"
              class="list-group-item d-flex justify-content-between align-items-center conseil-item"
              :class="{
                'selected-item':
                  selectedConseil && selectedConseil.id === conseil.id,
              }"
              @click="selectConseil(conseil)"
              style="cursor: pointer"
            >
              <span>
                <img
                  v-if="conseil.img"
                  :src="conseil.img"
                  alt=""
                  style="
                    width: 32px;
                    height: 32px;
                    object-fit: cover;
                    border-radius: 50%;
                    margin-right: 8px;
                  "
                />
                <strong>{{ conseil.name }}</strong>
                <span class="text-muted">({{ conseil.role }})</span>
              </span>
              <div
                v-if="selectedConseil && selectedConseil.id === conseil.id"
                class="item-actions"
              >
                <button
                  class="btn btn-sm btn-outline-primary me-2"
                  @click.stop="editConseil(conseil)"
                >
                  Modifier
                </button>
                <button
                  class="btn btn-sm btn-danger"
                  @click.stop="confirmAndDeleteConseil(conseil.id)"
                >
                  <i class="bi bi-trash">Supprimer</i>
                </button>
              </div>
            </li>
          </ul>
          <!-- Modal d'édition conseil -->
          <div v-if="editConseilModal" class="modal-backdrop">
            <div class="modal-dialog">
              <div class="modal-content p-3">
                <h5>Modifier le conseil</h5>
                <form @submit.prevent="saveEditConseil">
                  <input
                    v-model="editConseilData.name"
                    class="form-control mb-2"
                    placeholder="Nom"
                    required
                  />
                  <input
                    v-model="editConseilData.role"
                    class="form-control mb-2"
                    placeholder="Rôle"
                    required
                  />
                  <textarea
                    v-model="editConseilData.description"
                    class="form-control mb-2"
                    placeholder="Description"
                  ></textarea>
                  <div class="mb-2">
                    <label class="form-label">Image</label>
                    <input
                      type="file"
                      class="form-control"
                      accept="image/*"
                      @change="onEditConseilImageChange"
                    />
                    <div v-if="editConseilData.img" class="mt-2">
                      <img
                        :src="editConseilData.img"
                        alt="Aperçu"
                        style="max-width: 100px; border-radius: 8px"
                      />
                    </div>
                  </div>
                  <button type="submit" class="btn btn-primary btn-sm me-2">
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary btn-sm"
                    @click="closeEditConseil"
                  >
                    Annuler
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- UTILISATEURS -->
    <div
      v-if="tab === 'users'"
      class="admin-section bg-white rounded-4 shadow-sm p-4 mb-5"
    >
      <div class="row">
        <div class="col-md-6">
          <h2 class="h5 mb-3"><i class="bi bi-person me-2"></i>Clients</h2>
          <ul class="list-group">
            <li
              v-for="user in store.getters['users/allUsers'].filter(
                (u) => u.role === 'client'
              )"
              :key="user.id"
              class="list-group-item d-flex justify-content-between align-items-center user-item"
            >
              <span>
                <img
                  v-if="user.photo"
                  :src="user.photo"
                  alt=""
                  style="
                    width: 32px;
                    height: 32px;
                    object-fit: cover;
                    border-radius: 50%;
                    margin-right: 8px;
                  "
                />
                <strong>{{ user.firstName }} {{ user.lastName }}</strong>
                <span class="text-muted">({{ user.email }})</span>
                <span class="badge bg-secondary ms-2">{{ user.role }}</span>
              </span>
              <button
                class="btn btn-sm btn-outline-primary ms-2"
                @click="openEditUser(user)"
                :disabled="user.id === 1"
                :title="
                  user.id === 1
                    ? 'Modification du rôle interdite pour l\'administrateur principal'
                    : 'Modifier'
                "
              >
                Modifier
              </button>
            </li>
          </ul>
        </div>
        <div class="col-md-6">
          <h2 class="h5 mb-3"><i class="bi bi-person-gear me-2"></i>Admins</h2>
          <ul class="list-group">
            <li
              v-for="user in store.getters['users/allUsers'].filter(
                (u) => u.role === 'admin'
              )"
              :key="user.id"
              class="list-group-item d-flex justify-content-between align-items-center user-item"
            >
              <span>
                <img
                  v-if="user.photo"
                  :src="user.photo"
                  alt=""
                  style="
                    width: 32px;
                    height: 32px;
                    object-fit: cover;
                    border-radius: 50%;
                    margin-right: 8px;
                  "
                />
                <strong>{{ user.firstName }} {{ user.lastName }}</strong>
                <span class="text-muted">({{ user.email }})</span>
                <span class="badge bg-secondary ms-2">{{ user.role }}</span>
              </span>
              <button
                class="btn btn-sm btn-outline-primary ms-2"
                @click="openEditUser(user)"
                :disabled="user.id === 1"
                :title="
                  user.id === 1
                    ? 'Modification du rôle interdite pour l\'administrateur principal'
                    : 'Modifier'
                "
              >
                Modifier
              </button>
            </li>
          </ul>
        </div>
        <div class="col-md-6">
          <h2 class="h5 mb-3"><i class="bi bi-person-x me-2"></i>Suspendus</h2>
          <ul class="list-group">
            <li
              v-for="user in store.getters['users/allUsers'].filter(
                (u) => u.role === 'suspendu' || u.status === 'suspendu'
              )"
              :key="user.id"
              class="list-group-item d-flex justify-content-between align-items-center user-item"
            >
              <span>
                <img
                  v-if="user.photo"
                  :src="user.photo"
                  alt=""
                  style="
                    width: 32px;
                    height: 32px;
                    object-fit: cover;
                    border-radius: 50%;
                    margin-right: 8px;
                  "
                />
                <strong>{{ user.firstName }} {{ user.lastName }}</strong>
                <span class="text-muted">({{ user.email }})</span>
                <span class="badge bg-danger ms-2">Suspendu</span>
              </span>
              <button
                class="btn btn-sm btn-outline-primary ms-2"
                @click="openEditUser(user)"
                :disabled="user.id === 1"
                :title="
                  user.id === 1
                    ? 'Modification du rôle interdite pour l\'administrateur principal'
                    : 'Modifier'
                "
              >
                Modifier
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- RENDEZ-VOUS & DISPONIBILITÉS -->
    <div
      v-if="tab === 'rdv'"
      class="admin-section bg-white rounded-4 shadow-sm p-4 mb-5"
    >
      <div class="row">
        <div class="col-md-6 mb-4">
          <h2 class="h5 mb-3">
            <i class="bi bi-calendar-plus me-2"></i>Ajouter une disponibilité
          </h2>
          <form @submit.prevent="handleAddAvailability">
            <div class="mb-3">
              <label for="availabilityDate" class="form-label">Date</label>
              <input
                v-model="newAvailability.date"
                type="date"
                class="form-control"
                id="availabilityDate"
                required
              />
            </div>
            <div class="mb-3">
              <label for="availabilityStartTime" class="form-label"
                >Heure de début</label
              >
              <input
                v-model="newAvailability.startTime"
                type="time"
                class="form-control"
                id="availabilityStartTime"
                required
              />
            </div>
            <div class="mb-3">
              <label for="availabilityEndTime" class="form-label"
                >Heure de fin</label
              >
              <input
                v-model="newAvailability.endTime"
                type="time"
                class="form-control"
                id="availabilityEndTime"
                required
              />
            </div>
            <button type="submit" class="btn btn-primary w-100">Ajouter</button>
          </form>
        </div>
        <div class="col-md-6 mb-4">
          <h2 class="h5 mb-3">
            <i class="bi bi-calendar-check me-2"></i>Disponibilités
          </h2>
          <div class="mb-2">
            <input
              v-model="availabilityFilter"
              type="date"
              class="form-control"
              placeholder="Filtrer par date"
            />
          </div>
          <ul class="list-group">
            <li
              v-for="availability in store.getters[
                'appointments/availabilities'
              ].filter(
                (a) => !availabilityFilter || a.date === availabilityFilter
              )"
              :key="availability.id"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                {{ formatDate(availability.date) }} :
                {{ availability.startTime }} - {{ availability.endTime }}
              </span>
              <div>
                <button
                  @click="openEditAvailability(availability)"
                  class="btn btn-outline-primary btn-sm me-2"
                  :aria-label="
                    'Modifier la disponibilité du ' + availability.date
                  "
                >
                  <i class="bi bi-pencil"></i> Modifier
                </button>
                <button
                  @click="confirmAndDeleteAvailability(availability.id)"
                  class="btn btn-danger btn-sm"
                  :aria-label="
                    'Supprimer la disponibilité du ' + availability.date
                  "
                >
                  <i class="bi bi-trash">Annuler</i>
                </button>
              </div>
            </li>
          </ul>
          <!-- Modal d'édition disponibilité -->
          <div v-if="editAvailabilityModal" class="modal-backdrop">
            <div class="modal-dialog">
              <div class="modal-content p-3">
                <h5>Modifier la disponibilité</h5>
                <form @submit.prevent="saveEditAvailability">
                  <div class="mb-2">
                    <label class="form-label">Date</label>
                    <input
                      v-model="editAvailabilityData.date"
                      type="date"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="mb-2">
                    <label class="form-label">Heure de début</label>
                    <input
                      v-model="editAvailabilityData.startTime"
                      type="time"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="mb-2">
                    <label class="form-label">Heure de fin</label>
                    <input
                      v-model="editAvailabilityData.endTime"
                      type="time"
                      class="form-control"
                      required
                    />
                  </div>
                  <button type="submit" class="btn btn-primary btn-sm me-2">
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary btn-sm"
                    @click="closeEditAvailability"
                  >
                    Annuler
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <h2 class="h5 mb-3">
            <i class="bi bi-calendar-event me-2"></i>Rendez-vous
          </h2>
          <div class="mb-2 d-flex flex-wrap gap-2">
            <input
              v-model="appointmentFilter"
              type="date"
              class="form-control w-auto"
              placeholder="Filtrer par date"
            />
            <select v-model="appointmentSort" class="form-select w-auto">
              <option value="asc">Date croissante</option>
              <option value="desc">Date décroissante</option>
            </select>
          </div>
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Heure</th>
                  <th>Client</th>
                  <th>Rituel</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="appointment in store.getters[
                    'appointments/allAppointments'
                  ]
                    .filter(
                      (a) => !appointmentFilter || a.date === appointmentFilter
                    )
                    .sort((a, b) =>
                      appointmentSort === 'asc'
                        ? (a.date || '').localeCompare(b.date || '') ||
                          (a.time || '').localeCompare(b.time || '')
                        : (b.date || '').localeCompare(a.date || '') ||
                          (b.time || '').localeCompare(a.time || '')
                    )"
                  :key="appointment.id"
                >
                  <td>{{ formatDate(appointment.date) }}</td>
                  <td>{{ appointment.time }}</td>
                  <td>{{ appointment.clientName }}</td>
                  <td>{{ appointment.ritualName }}</td>
                  <td>
                    <span
                      :class="{
                        'badge bg-success': appointment.status === 'confirmed',
                        'badge bg-warning': appointment.status === 'pending',
                        'badge bg-danger': appointment.status === 'cancelled',
                      }"
                    >
                      {{ appointment.status }}
                    </span>
                  </td>
                  <td>
                    <button
                      @click="
                        store.dispatch(
                          'appointments/cancelAppointment',
                          appointment.id
                        )
                      "
                      class="btn btn-warning btn-sm"
                      :aria-label="
                        'Annuler le rendez-vous du ' +
                        appointment.date +
                        ' à ' +
                        appointment.time
                      "
                    >
                      <i class="bi bi-x-circle"></i>
                      Annuler
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modale d'édition utilisateur -->
    <div
      v-if="editUserModal"
      class="modal-backdrop"
      aria-modal="true"
      role="dialog"
    >
      <div class="modal-dialog">
        <div class="modal-content p-3">
          <h5>Modifier l'utilisateur</h5>
          <form @submit.prevent="saveEditUser">
            <div class="mb-2">
              <label class="form-label">Prénom</label>
              <input
                v-model="editUser.firstName"
                class="form-control"
                disabled
              />
            </div>
            <div class="mb-2">
              <label class="form-label">Nom</label>
              <input
                v-model="editUser.lastName"
                class="form-control"
                disabled
              />
            </div>
            <div class="mb-2">
              <label class="form-label">E-mail</label>
              <input v-model="editUser.email" class="form-control" disabled />
            </div>
            <div class="mb-2">
              <label class="form-label">Rôle</label>
              <select
                v-model="editUser.role"
                class="form-select"
                :disabled="editUser.id === 1"
              >
                <option value="client">Client</option>
                <option value="admin">Admin</option>
                <option value="suspendu">Suspendu</option>
              </select>
              <div v-if="editUser.id === 1" class="text-danger small mt-1">
                Le rôle de l'administrateur principal ne peut pas être modifié.
              </div>
            </div>
            <div class="d-flex justify-content-end">
              <button
                type="submit"
                class="btn btn-primary btn-sm me-2"
                :disabled="editUser.id === 1"
              >
                Enregistrer
              </button>
              <button
                type="button"
                class="btn btn-secondary btn-sm"
                @click="closeEditUser"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const tab = ref("overview");

const totalAppointments = computed(
  () => store.getters["appointments/allAppointments"].length
);
const upcomingAppointments = computed(() => {
  const today = new Date().toISOString().slice(0, 10);
  return store.getters["appointments/allAppointments"]
    .filter((a) => a.status !== "cancelled" && a.date >= today)
    .sort(
      (a, b) =>
        (a.date || "").localeCompare(b.date || "") ||
        (a.time || "").localeCompare(b.time || "")
    )
    .slice(0, 5);
});

const newRitual = ref({
  name: "",
  description: "",
  duration: 60,
  price: 0,
  image: "",
});
const newConseil = ref({ name: "", role: "", description: "", img: "" });

const handleAddRitual = () => {
  store.dispatch("rituals/addRitual", newRitual.value);
  newRitual.value = {
    name: "",
    description: "",
    duration: 60,
    price: 0,
    image: "",
  };
};

const handleAddConseil = async () => {
  await store.dispatch("conseils/addConseil", newConseil.value);
  await store.dispatch("conseils/fetchConseils");
  newConseil.value = { name: "", role: "", description: "", img: "" };
};

const newAvailability = ref({ date: "", startTime: "", endTime: "" });
const availabilityFilter = ref("");
const appointmentFilter = ref("");
const appointmentSort = ref("asc");

// --- Availability Edit Modal State ---
const editAvailabilityModal = ref(false);
const editAvailabilityData = ref({});
const selectedAvailability = ref(null);

function openEditAvailability(availability) {
  editAvailabilityData.value = { ...availability };
  editAvailabilityModal.value = true;
  selectedAvailability.value = availability;
}
function closeEditAvailability() {
  editAvailabilityModal.value = false;
  editAvailabilityData.value = {};
  selectedAvailability.value = null;
}
async function saveEditAvailability() {
  await store.dispatch(
    "appointments/updateAvailability",
    editAvailabilityData.value
  );
  await store.dispatch("appointments/fetchAvailabilities");
  closeEditAvailability();
}

const selectedRituel = ref(null);
const selectedConseil = ref(null);
const selectedUser = ref(null);

const editRituelModal = ref(false);
const editRitual = ref({});
function selectRituel(ritual) {
  selectedRituel.value = ritual;
}
function editRituel(ritual) {
  editRitual.value = { ...ritual };
  editRituelModal.value = true;
}
function closeEditRituel() {
  editRituelModal.value = false;
  editRitual.value = {};
  selectedRituel.value = null;
}
function saveEditRituel() {
  store.dispatch("rituals/updateRitual", editRitual.value);
  closeEditRituel();
}

const editConseilModal = ref(false);
const editConseilData = ref({});
function selectConseil(conseil) {
  selectedConseil.value = conseil;
}
function editConseil(conseil) {
  editConseilData.value = { ...conseil };
  editConseilModal.value = true;
}
function closeEditConseil() {
  editConseilModal.value = false;
  editConseilData.value = {};
  selectedConseil.value = null;
}
async function saveEditConseil() {
  await store.dispatch("conseils/updateConseil", editConseilData.value);
  await store.dispatch("conseils/fetchConseils");
  closeEditConseil();
}

const editUserModal = ref(false);
const editUser = ref({});
function openEditUser(user) {
  editUser.value = { ...user };
  editUserModal.value = true;
}
function closeEditUser() {
  editUserModal.value = false;
  editUser.value = {};
}
async function saveEditUser() {
  await store.dispatch("users/updateUser", { ...editUser.value });
  await store.dispatch("users/fetchUsers");
  closeEditUser();
}

function fileToBase64(file, cb) {
  const reader = new FileReader();
  reader.onload = (e) => cb(e.target.result);
  reader.readAsDataURL(file);
}

function onRitualImageChange(e) {
  const file = e.target.files[0];
  if (file) {
    fileToBase64(file, (base64) => {
      // Ajout du préfixe si absent
      if (!base64.startsWith("data:image/")) {
        const mime = file.type || "image/png";
        newRitual.value.image = `data:${mime};base64,${base64}`;
      } else {
        newRitual.value.image = base64;
      }
    });
  }
}

function onConseilImageChange(e) {
  const file = e.target.files[0];
  if (file) {
    fileToBase64(file, (base64) => {
      newConseil.value.img = base64;
    });
  }
}

function onEditRitualImageChange(e) {
  const file = e.target.files[0];
  if (file) {
    fileToBase64(file, (base64) => {
      editRitual.value.image = base64;
    });
  }
}

function onEditConseilImageChange(e) {
  const file = e.target.files[0];
  if (file) {
    fileToBase64(file, (base64) => {
      editConseilData.value.img = base64;
    });
  }
}

function onRitualImgError(e) {
  e.target.src = require("@/assets/rit.png");
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function confirmAndDeleteRitual(ritualId) {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce rituel ?")) {
    store.dispatch("rituals/deleteRitual", ritualId);
  }
}

async function confirmAndDeleteConseil(conseilId) {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce conseil ?")) {
    await store.dispatch("conseils/deleteConseil", conseilId);
    await store.dispatch("conseils/fetchConseils");
  }
}

async function confirmAndDeleteAvailability(availabilityId) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cette disponibilité ?")) {
    await store.dispatch("appointments/deleteAvailability", availabilityId);
    await store.dispatch("appointments/fetchAvailabilities");
  }
}

const handleAddAvailability = async () => {
  // Prevent empty or duplicate entries
  if (
    !newAvailability.value.date ||
    !newAvailability.value.startTime ||
    !newAvailability.value.endTime
  ) {
    alert("Veuillez remplir tous les champs de la disponibilité.");
    return;
  }
  // Optionally: prevent duplicate for same date/start/end
  const exists = store.getters["appointments/availabilities"].some(
    (a) =>
      a.date === newAvailability.value.date &&
      a.startTime === newAvailability.value.startTime &&
      a.endTime === newAvailability.value.endTime
  );
  if (exists) {
    alert("Cette disponibilité existe déjà.");
    return;
  }
  try {
    await store.dispatch("appointments/addAvailability", {
      ...newAvailability.value,
    });
    newAvailability.value = { date: "", startTime: "", endTime: "" };
  } catch (e) {
    alert(
      "Erreur lors de l'ajout de la disponibilité. Voir la console pour plus de détails."
    );
    console.error(e);
  }
};
</script>

<style scoped>
.admin-tabs .nav-link {
  color: #b96c53;
  font-weight: 500;
  font-size: 1.1rem;
  border-radius: 1.5rem;
  margin: 0 0.2rem;
  background: #fff6f1;
  transition: background 0.18s, color 0.18s;
}
.admin-tabs .nav-link.active,
.admin-tabs .nav-link:focus {
  background: #b96c53;
  color: #fff;
}
.admin-section {
  margin-bottom: 2rem;
  overflow-x: auto;
}
.table-responsive {
  overflow-x: auto;
}
@media (max-width: 768px) {
  .admin-section {
    padding: 1rem 0.5rem;
  }
  .admin-tabs .nav-link {
    font-size: 1rem;
    padding: 0.5rem 0.8rem;
  }
}
.selected-item {
  background: #ffeaea !important;
}
.item-actions {
  display: flex;
  gap: 0.5rem;
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
.overview-card {
  background: #fff6f1;
  border-radius: 1.5rem;
  padding: 1.5rem 1rem;
  box-shadow: 0 2px 12px 0 rgba(185, 108, 83, 0.07);
  margin-bottom: 1rem;
}
.overview-card .bi {
  color: #b96c53;
}
</style>
