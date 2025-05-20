import { ref } from "vue";
import conseilsData from "@/data/conseils.json";
import { useAuth } from "./useAuth";

const conseils = ref([...conseilsData]);

export function useConseils() {
  const { isAdmin } = useAuth();

  const fetchConseils = async () => {
    conseils.value = [...conseilsData];
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
