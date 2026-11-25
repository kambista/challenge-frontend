<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue';
import UiIcon from './UiIcon.vue';

defineProps<{ title: string; message: string }>();
const open = defineModel<boolean>({ required: true });
let timeout: ReturnType<typeof setTimeout> | undefined;

function clearTimer() {
  if (timeout) clearTimeout(timeout);
  timeout = undefined;
}

function closeToast() {
  open.value = false;
}

function handleOpenChange(value: boolean) {
  clearTimer();
  if (value) timeout = setTimeout(closeToast, 6000);
}

watch(open, handleOpenChange, { immediate: true });

onBeforeUnmount(clearTimer);
</script>

<template>
  <div
    class="pointer-events-none fixed inset-x-4 top-4 z-100 sm:right-6 sm:left-auto sm:w-[min(420px,calc(100vw-3rem))]"
  >
    <Transition name="ui-toast">
      <section
        v-if="open"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        class="rounded-panel border-gray-21 border-l-danger text-secondary pointer-events-auto flex items-start gap-3 border border-l-4 bg-white p-4 shadow-[0_12px_36px_rgba(6,15,38,.18)]"
      >
        <span
          class="bg-danger-soft text-danger grid size-8 shrink-0 place-items-center rounded-full text-lg font-bold"
          aria-hidden="true"
        >
          !
        </span>
        <div class="min-w-0 flex-1 pt-0.5">
          <h2 class="text-sm font-bold">{{ title }}</h2>
          <p class="text-gray-60 mt-1 text-sm leading-5">{{ message }}</p>
        </div>
        <button
          type="button"
          aria-label="Cerrar notificación"
          class="text-gray-60 hover:bg-gray-20 hover:text-secondary -mt-1 -mr-1 grid size-8 shrink-0 place-items-center rounded-full transition-colors"
          @click="open = false"
        >
          <UiIcon name="close" :size="18" />
        </button>
      </section>
    </Transition>
  </div>
</template>

<style scoped>
.ui-toast-enter-active,
.ui-toast-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.ui-toast-enter-from,
.ui-toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
