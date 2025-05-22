import { ref } from "vue";

const users = ref([]);

function loadUsers() {
  const stored = localStorage.getItem("users");
  if (stored) {
    users.value = JSON.parse(stored);
  } else {
    users.value = [];
  }
}

function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users.value));
}

export function useUsers() {
  const fetchUsers = () => {
    loadUsers();
  };

  const addUser = (userData) => {
    const exists = users.value.some((u) => u.email === userData.email);
    if (exists) return false;
    const newUser = {
      id: Math.max(0, ...users.value.map((u) => u.id || 0)) + 1,
      ...userData,
    };
    users.value.push(newUser);
    saveUsers();
    return newUser;
  };

  const deleteUser = (id) => {
    users.value = users.value.filter((u) => u.id !== id);
    saveUsers();
  };

  if (users.value.length === 0) loadUsers();

  return {
    users,
    fetchUsers,
    addUser,
    deleteUser,
  };
}
