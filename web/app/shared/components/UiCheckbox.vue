<script setup lang="ts">
defineProps<{ error?: string }>();
const model = defineModel<boolean>({ required: true });
</script>

<template>
  <div>
    <label class="flex items-start gap-2 text-xs leading-5">
      <input
        v-model="model"
        type="checkbox"
        class="accent-secondary mt-0.5 size-4 shrink-0"
        :aria-invalid="!!error"
      />
      <span><slot /></span>
    </label>
    <p v-if="error" role="alert" class="text-danger mt-1 text-xs">{{ error }}</p>
  </div>
</template>
