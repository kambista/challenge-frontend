import { nextTick, onBeforeUnmount, onMounted, shallowRef, watch, type Ref } from 'vue';
import type { PopoverPlacement } from '~/shared/types/ui.types';

export type { PopoverPlacement };

export function usePopoverPlacement(
  trigger: Ref<HTMLElement | null>,
  popup: Ref<HTMLElement | null>,
  open: Ref<boolean>,
) {
  const placement = shallowRef<PopoverPlacement>('bottom');
  const positioned = shallowRef(false);
  const maxHeight = shallowRef<number>();

  async function updatePlacement() {
    if (!open.value) return;
    positioned.value = false;
    maxHeight.value = undefined;
    await nextTick();

    const anchor = trigger.value;
    const panel = popup.value;
    if (!anchor || !panel) {
      positioned.value = true;
      return;
    }

    const anchorBounds = anchor.getBoundingClientRect();
    const panelHeight = panel.getBoundingClientRect().height;
    const dialogBounds = anchor.closest('dialog')?.getBoundingClientRect();
    const viewportTop = Math.max(0, dialogBounds?.top ?? 0);
    const viewportBottom = Math.min(window.innerHeight, dialogBounds?.bottom ?? window.innerHeight);
    const spaceBelow = viewportBottom - anchorBounds.bottom - 8;
    const spaceAbove = anchorBounds.top - viewportTop - 8;
    const belowFits = panelHeight <= spaceBelow;
    const aboveFits = panelHeight <= spaceAbove;

    if (belowFits || (!aboveFits && spaceBelow >= spaceAbove)) {
      placement.value = 'bottom';
      maxHeight.value = Math.max(1, Math.min(panelHeight, spaceBelow));
    } else {
      placement.value = 'top';
      maxHeight.value = Math.max(1, Math.min(panelHeight, spaceAbove));
    }
    positioned.value = true;
  }

  function handleOpenChange(value: boolean) {
    if (value) {
      void updatePlacement();
      return;
    }
    positioned.value = false;
  }

  function registerViewportListeners() {
    window.addEventListener('resize', updatePlacement);
    window.addEventListener('scroll', updatePlacement, true);
  }

  function unregisterViewportListeners() {
    window.removeEventListener('resize', updatePlacement);
    window.removeEventListener('scroll', updatePlacement, true);
  }

  watch(open, handleOpenChange);
  onMounted(registerViewportListeners);
  onBeforeUnmount(unregisterViewportListeners);

  return { placement, positioned, maxHeight };
}
