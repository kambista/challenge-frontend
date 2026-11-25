<script setup lang="ts">
import { onMounted, onBeforeUnmount, shallowRef, watch, useTemplateRef, useId } from 'vue';
import UiIcon from './UiIcon.vue';
import { lockDialogScroll, unlockDialogScroll } from '~/shared/utils/dialogScrollLock';
const props = defineProps<{
  title: string;
  wide?: boolean;
  drawer?: boolean;
  accountPicker?: boolean;
  subtitle?: string;
}>();
const open = defineModel<boolean>({ required: true });
const dialog = useTemplateRef<HTMLDialogElement>('dialog');
const closing = shallowRef(false);
const id = useId();
let closeTimer: ReturnType<typeof setTimeout> | undefined;

function finishClose() {
  if (!open.value && dialog.value?.open) {
    dialog.value.close();
    unlockDialogScroll(dialog.value);
  }
  closeTimer = undefined;
  closing.value = false;
}

function sync() {
  if (!dialog.value) return;
  if (open.value) {
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = undefined;
    closing.value = false;
    if (!dialog.value.open) {
      dialog.value.showModal();
      lockDialogScroll(dialog.value);
    }
    return;
  }

  if (dialog.value.open && !closing.value) {
    closing.value = true;
    closeTimer = setTimeout(
      finishClose,
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : props.drawer ? 300 : 220,
    );
  }
}

function backdrop(event: MouseEvent) {
  if (!dialog.value || event.target !== dialog.value) return;
  const bounds = dialog.value.getBoundingClientRect();
  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  )
    open.value = false;
}

function handleDialogClose() {
  open.value = false;
  sync();
}

function cleanupDialog() {
  if (closeTimer) clearTimeout(closeTimer);
  if (dialog.value?.open) {
    dialog.value.close();
    unlockDialogScroll(dialog.value);
  }
}

onMounted(sync);
watch(open, sync);
onBeforeUnmount(cleanupDialog);
</script>

<template>
  <dialog
    ref="dialog"
    :aria-labelledby="id"
    class="ui-dialog text-secondary fixed max-h-[94dvh] overflow-y-auto bg-white backdrop:bg-black/60"
    :class="[
      drawer
        ? 'ui-dialog--drawer md:rounded-l-control inset-x-0 top-auto bottom-0 m-0 w-full max-w-none rounded-t-[20px] md:top-0 md:right-0 md:bottom-0 md:left-auto md:max-h-dvh md:min-h-dvh md:w-[73%] md:rounded-tr-none'
        : accountPicker
          ? 'ui-dialog--modal inset-x-0 top-auto bottom-0 m-0 w-full max-w-none rounded-t-[20px] md:inset-0 md:m-auto md:max-w-[406px] md:rounded-[12px]'
          : 'ui-dialog--modal rounded-panel inset-0 m-auto w-[calc(100%-2rem)] p-6 sm:p-8 ' +
            (wide ? 'max-w-4xl' : 'max-w-md'),
      closing ? 'ui-dialog--closing' : '',
    ]"
    @cancel.prevent="open = false"
    @close="handleDialogClose"
    @click="backdrop"
  >
    <header
      class="flex items-start justify-between gap-4"
      :class="
        drawer
          ? 'border-gray-25 border-b px-6 py-5 md:px-11'
          : accountPicker
            ? 'md:bg-secondary bg-white px-6 py-5 md:text-white'
            : 'mb-6'
      "
    >
      <div>
        <h2
          :id="id"
          class="text-xl font-bold"
          :class="accountPicker ? 'md:text-2xl md:font-medium' : ''"
        >
          {{ title }}
        </h2>
        <p v-if="subtitle" class="mt-1 text-base">{{ subtitle }}</p>
      </div>
      <button type="button" aria-label="Cerrar" class="-mr-1 shrink-0 p-1" @click="open = false">
        <UiIcon name="close" :size="22" />
      </button>
    </header>
    <slot />
  </dialog>
</template>

<style>
.ui-dialog--modal[open] {
  animation: ui-modal-enter 180ms ease-out both;
}

.ui-dialog--modal[open].ui-dialog--closing {
  animation-name: ui-modal-exit;
  animation-duration: 220ms;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.ui-dialog--drawer[open].ui-dialog--closing {
  animation-name: ui-drawer-exit-mobile;
  animation-duration: 300ms;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.ui-dialog--drawer[open] {
  animation: ui-drawer-enter-mobile 260ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.ui-dialog[open]::backdrop {
  animation: ui-dialog-backdrop-enter 180ms ease-out both;
}

.ui-dialog[open].ui-dialog--closing::backdrop {
  animation-name: ui-dialog-backdrop-exit;
  animation-duration: 220ms;
  animation-timing-function: ease-in;
}

.ui-dialog--drawer[open].ui-dialog--closing::backdrop {
  animation-duration: 260ms;
}

@keyframes ui-modal-enter {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes ui-modal-exit {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  to {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
}

@keyframes ui-dialog-backdrop-exit {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

.ui-dialog--drawer[open]::backdrop {
  animation: ui-dialog-backdrop-enter 180ms ease-out both;
}

@keyframes ui-drawer-enter-mobile {
  from {
    opacity: 0.75;
    transform: translateY(100%);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes ui-drawer-enter-desktop {
  from {
    opacity: 0.75;
    transform: translateX(100%);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes ui-drawer-exit-mobile {
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(100%);
  }
}

@keyframes ui-drawer-exit-desktop {
  from {
    opacity: 1;
    transform: translateX(0);
  }

  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

@keyframes ui-dialog-backdrop-enter {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@media (min-width: 768px) {
  .ui-dialog--drawer[open] {
    animation-name: ui-drawer-enter-desktop;
  }

  .ui-dialog--drawer[open].ui-dialog--closing {
    animation-name: ui-drawer-exit-desktop;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ui-dialog[open],
  .ui-dialog[open]::backdrop {
    animation-duration: 1ms;
  }
}
</style>
