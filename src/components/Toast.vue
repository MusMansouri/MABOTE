<template>
  <div v-if="visible" class="toast-container position-fixed bottom-0 end-0 p-3">
    <div
      class="toast show align-items-center text-white bg-primary border-0"
      role="alert"
    >
      <div class="d-flex">
        <div class="toast-body">{{ message }}</div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          @click="hideToast"
          aria-label="Close"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  message: { type: String, required: true },
  duration: { type: Number, default: 3000 },
});

const visible = ref(true);

function hideToast() {
  visible.value = false;
}

setTimeout(hideToast, props.duration);
</script>

<style scoped>
.toast-container {
  z-index: 1050;
}
</style>
