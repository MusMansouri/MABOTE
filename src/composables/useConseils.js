import { ref } from "vue";
import { useAuth } from "./useAuth";

const conseils = ref([]);

export function useConseils() {
  const { isAdmin } = useAuth();

  const fetchConseils = async () => {
    conseils.value = [];
  };

  const addConseil = (conseilData) => {
    if (!isAdmin()) return null;
    const newConseil = {
      id: Date.now(),
      ...conseilData,
    };
    conseils.value.push(newConseil);
    return newConseil;
  };

  const deleteConseil = (id) => {
    if (!isAdmin()) return false;
    conseils.value = conseils.value.filter((c) => c.id !== id);
    return true;
  };

  return {
    conseils,
    fetchConseils,
    addConseil,
    deleteConseil,
  };
}
