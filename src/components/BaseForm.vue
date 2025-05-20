<template>
  <form @submit.prevent="onSubmit">
    <div v-for="field in fields" :key="field.name" class="mb-3">
      <label :for="field.name" class="form-label">{{ field.label }}</label>
      <input
        v-if="field.type !== 'textarea'"
        :type="field.type"
        :id="field.name"
        v-model="formData[field.name]"
        class="form-control"
        :required="field.required"
      />
      <textarea
        v-else
        :id="field.name"
        v-model="formData[field.name]"
        class="form-control"
        :required="field.required"
      ></textarea>
    </div>
    <button type="submit" class="btn btn-primary">{{ submitLabel }}</button>
  </form>
</template>

<script setup>
import { reactive } from "vue";

const props = defineProps({
  fields: { type: Array, required: true },
  initialData: { type: Object, default: () => ({}) },
  submitLabel: { type: String, default: "Valider" },
});

const emit = defineEmits(["submit"]);

const formData = reactive({ ...props.initialData });

function onSubmit() {
  emit("submit", { ...formData });
}
</script>
