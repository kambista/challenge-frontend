<script setup lang="ts">
import { computed, useId } from 'vue';
import type { SelectOption } from '~/shared/types/common.types';
import UiIcon from './UiIcon.vue';
import UiPopover from './UiPopover.vue';

const props = defineProps<{
  label?: string;
  options: readonly SelectOption[];
  error?: string;
  placeholder?: string;
  compact?: boolean;
  ariaLabel?: string;
}>();
defineOptions({ inheritAttrs: false });
const model = defineModel<string>({ required: true });
const open = defineModel<boolean>('open', { default: false });
const id = useId();
const selectedLabel = computed(
  () => props.options.find((option) => option.value === model.value)?.label,
);
function selectOption(value: string, close: () => void) {
  model.value = value;
  close();
}
</script>

<template>
  <div class="min-w-0" :class="$attrs.class">
    <label v-if="label" :id="id + '-label'" :for="id" class="text-gray-60 mb-1.5 block text-sm">
      {{ label }}
    </label>
    <UiPopover v-model="open" :fill="compact">
      <template #trigger="{ open: isOpen, toggle }">
        <button
          :id="id"
          type="button"
          v-bind="{ ...$attrs, class: undefined }"
          :aria-label="ariaLabel || label"
          :aria-labelledby="label ? id + '-label' : undefined"
          aria-haspopup="listbox"
          :aria-expanded="isOpen"
          :aria-invalid="!!error"
          :aria-describedby="error ? id + '-error' : undefined"
          class="focus-visible:outline-info flex w-full items-center justify-between gap-2 text-left transition"
          :class="[
            compact
              ? 'rounded-r-control bg-secondary h-full min-h-[70px] px-2.5 text-base font-bold text-white md:min-h-19 md:px-5 md:text-xl'
              : 'rounded-control min-h-11 border bg-white px-4 py-2.5 text-sm',
            error ? 'border-danger' : 'border-gray-25',
            !compact && !selectedLabel ? 'text-gray-40' : '',
          ]"
          @click="toggle"
        >
          <span class="min-w-0 truncate">{{ selectedLabel || placeholder || 'Selecciona' }}</span>
          <UiIcon
            name="chevron-down"
            class="shrink-0 transition-transform"
            :class="open ? 'rotate-180' : ''"
            :size="compact ? 17 : 18"
          />
        </button>
      </template>
      <template #default="{ close }">
        <div
          role="listbox"
          :aria-label="ariaLabel || label || 'Opciones'"
          class="max-h-56 min-w-32 overflow-y-auto"
        >
          <button
            v-for="option in options"
            :key="option.value"
            type="button"
            role="option"
            :aria-selected="model === option.value"
            class="text-secondary hover:bg-gray-20 focus:bg-gray-20 flex w-full items-center justify-between gap-3 rounded px-3 py-2.5 text-left text-sm focus:outline-none"
            :class="model === option.value ? 'bg-gray-10 font-semibold' : ''"
            @click="selectOption(option.value, close)"
          >
            {{ option.label }}
          </button>
        </div>
      </template>
    </UiPopover>
    <p v-if="error" :id="id + '-error'" role="alert" class="text-danger mt-1 text-xs">
      {{ error }}
    </p>
  </div>
</template>
