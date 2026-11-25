<script setup lang="ts">
const {
  variant = 'primary',
  type = 'button',
  busy = false,
  disabled = false,
} = defineProps<{
  variant?: 'primary' | 'secondary' | 'outline';
  type?: 'button' | 'submit';
  busy?: boolean;
  disabled?: boolean;
}>();
const styles = {
  primary:
    'bg-primary text-secondary hover:brightness-95 disabled:bg-primary-soft disabled:text-gray-60',
  secondary: 'bg-secondary text-white hover:bg-secondary-light disabled:opacity-50',
  outline: 'border border-gray-25 bg-white text-secondary hover:bg-gray-10 disabled:opacity-50',
};
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || busy"
    :aria-busy="busy"
    :class="styles[variant]"
    class="rounded-control inline-flex min-h-12 w-full items-center justify-center gap-2 px-5 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed"
  >
    <span
      v-if="busy"
      aria-hidden="true"
      class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
    />
    <slot />
  </button>
</template>
