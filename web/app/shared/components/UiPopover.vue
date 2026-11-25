<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue';
import { usePopoverPlacement } from '~/shared/composables/usePopoverPlacement';
defineProps<{ align?: 'left' | 'right'; fill?: boolean }>();
const open = defineModel<boolean>({ default: false });
const root = useTemplateRef<HTMLElement>('root');
const trigger = useTemplateRef<HTMLElement>('trigger');
const popup = useTemplateRef<HTMLElement>('popup');
const { placement, positioned, maxHeight } = usePopoverPlacement(trigger, popup, open);

function closeOutside(event: PointerEvent) {
  if (event.target instanceof Node && !root.value?.contains(event.target)) open.value = false;
}

function keydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    open.value = false;
    root.value?.querySelector<HTMLButtonElement>('button')?.focus();
  }
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    if (!open.value) {
      open.value = true;
      return;
    }
    const items = [
      ...(root.value?.querySelectorAll<HTMLButtonElement>('[role="option"],[role="menuitem"]') ||
        []),
    ];
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    items[(index + (event.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length]?.focus();
  }
  if (event.key === 'Tab') open.value = false;
}

async function focusSelectedOption(value: boolean) {
  if (!value) return;
  await nextTick();
  root.value
    ?.querySelector<HTMLButtonElement>(
      '[role="option"][aria-selected="true"],[role="option"],[role="menuitem"]',
    )
    ?.focus();
}

function closeAndRestoreFocus() {
  open.value = false;
  root.value?.querySelector('button')?.focus();
}

function toggleOpen() {
  open.value = !open.value;
}

function registerOutsidePointerListener() {
  document.addEventListener('pointerdown', closeOutside);
}

function unregisterOutsidePointerListener() {
  document.removeEventListener('pointerdown', closeOutside);
}

watch(open, focusSelectedOption);
onMounted(registerOutsidePointerListener);
onBeforeUnmount(unregisterOutsidePointerListener);
</script>

<template>
  <div
    ref="root"
    class="relative min-w-0"
    :class="[fill ? 'h-full' : '', open ? 'z-30' : '']"
    @keydown="keydown"
  >
    <div ref="trigger" class="min-w-0" :class="fill ? 'h-full' : ''">
      <slot name="trigger" :open="open" :toggle="toggleOpen" />
    </div>
    <Transition name="ui-popover">
      <div
        v-if="open"
        ref="popup"
        class="rounded-control absolute z-50 min-w-full overflow-hidden bg-white p-1 shadow-[0_8px_24px_rgba(6,15,38,.18)]"
        :class="[
          placement === 'top' ? 'bottom-[calc(100%+6px)]' : 'top-[calc(100%+6px)]',
          align === 'right' ? 'right-0' : 'left-0',
        ]"
        :style="{
          visibility: positioned ? 'visible' : 'hidden',
          maxHeight: maxHeight ? `${maxHeight}px` : undefined,
          overflowY:
            maxHeight && popup && maxHeight < popup.getBoundingClientRect().height
              ? 'auto'
              : undefined,
        }"
      >
        <slot :close="closeAndRestoreFocus" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.ui-popover-enter-active,
.ui-popover-leave-active {
  transition:
    opacity 120ms ease,
    transform 120ms ease;
}

.ui-popover-enter-from,
.ui-popover-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
