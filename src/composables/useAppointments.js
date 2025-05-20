import { ref, computed } from "vue";
import appointmentsData from "@/data/appointments.json";
import availabilitiesData from "@/data/availabilities.json";
import ritualsData from "@/data/rituals.json";
import { useAuth } from "./useAuth";

// NOTE: Toute la logique ici est locale (en mémoire) et doit être remplacée par des appels API lors de l'ajout du backend.

const STATUS_PENDING = "pending";
const STATUS_CONFIRMED = "confirmed";
const STATUS_CANCELLED = "cancelled";

// Utilisation directe des données importées
const appointments = ref([...appointmentsData]);
const availabilities = ref([...availabilitiesData]);

export function useAppointments() {
  const { user, isAdmin, getUserById } = useAuth();

  const enrichedAppointments = computed(() => {
    return appointments.value.map((appointment) => {
      const clientData = getUserById(appointment.userId);
      const ritualData = ritualsData.find((r) => r.id === appointment.ritualId);
      return {
        ...appointment,
        clientName: clientData ? clientData.name : "Client inconnu",
        ritualName: ritualData ? ritualData.name : "Rituel inconnu",
        ritualDuration: ritualData ? ritualData.duration : 60,
      };
    });
  });

  const myAppointments = computed(() => {
    if (!user.value) return [];
    return enrichedAppointments.value.filter((a) => a.userId === user.value.id);
  });

  const allAppointments = computed(() => {
    if (!isAdmin()) return [];
    return enrichedAppointments.value;
  });

  const addAppointment = (appointmentData) => {
    if (!user.value) return null;
    const newAppointment = {
      id: Math.max(0, ...appointments.value.map((a) => a.id)) + 1,
      userId: user.value.id,
      status: STATUS_PENDING,
      ...appointmentData,
    };
    appointments.value.push(newAppointment);
    return newAppointment;
  };

  const cancelAppointment = (id) => {
    if (!user.value) return false;
    const index = appointments.value.findIndex((a) => a.id === id);
    if (index === -1) return false;
    const appointment = appointments.value[index];
    if (!isAdmin() && appointment.userId !== user.value.id) {
      return false;
    }
    appointments.value[index] = { ...appointment, status: STATUS_CANCELLED };
    return true;
  };

  const addAvailability = (availabilityData) => {
    if (!isAdmin()) return null;
    const newAvailability = {
      id: Math.max(0, ...availabilities.value.map((a) => a.id)) + 1,
      ...availabilityData,
    };
    availabilities.value.push(newAvailability);
    return newAvailability;
  };

  const deleteAvailability = (id) => {
    if (!isAdmin()) return false;
    const index = availabilities.value.findIndex((a) => a.id === id);
    if (index === -1) return false;
    availabilities.value.splice(index, 1);
    return true;
  };

  return {
    myAppointments,
    allAppointments,
    availabilities,
    addAppointment,
    cancelAppointment,
    addAvailability,
    deleteAvailability,
  };
}
