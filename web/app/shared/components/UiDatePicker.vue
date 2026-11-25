<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  useId,
  useTemplateRef,
  watch,
} from 'vue';
import { usePopoverPlacement } from '~/shared/composables/usePopoverPlacement';
import {
  civilDate,
  WEEKDAYS,
  MONTH_OPTIONS,
  getYearOptions,
  parseDate,
  toIso,
  toDisplay,
  getCalendarDays,
} from '~/shared/utils/date';
import UiIcon from './UiIcon.vue';

const props = defineProps<{ label: string; error?: string; autocomplete?: string }>();

defineOptions({ inheritAttrs: false });

const model = defineModel<string>({ required: true });
const id = useId();
const root = useTemplateRef<HTMLElement>('root');
const trigger = useTemplateRef<HTMLElement>('trigger');
const popup = useTemplateRef<HTMLElement>('popup');
const open = shallowRef(false);
const visibleMonth = shallowRef(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
const inputValue = shallowRef('');
const weekdays = WEEKDAYS;
const monthOptions = MONTH_OPTIONS;
const yearOptions = shallowRef(getYearOptions());
const { placement, positioned } = usePopoverPlacement(trigger, popup, open);

function syncInputFromModel(value: string) {
  const date = parseDate(value);
  inputValue.value = date ? toDisplay(date) : '';
  if (date) visibleMonth.value = civilDate(date.getFullYear(), date.getMonth(), 1);
}
watch(model, syncInputFromModel, { immediate: true });

const days = computed(() => getCalendarDays(visibleMonth.value, model.value));

function showCalendar() {
  if (open.value) return;
  yearOptions.value = getYearOptions();
  const selected = parseDate(model.value);
  const current = selected ?? new Date();
  visibleMonth.value = civilDate(current.getFullYear(), current.getMonth(), 1);
  open.value = true;
}

function updateInput(event: Event) {
  const value = (event.target as HTMLInputElement).value.trim();
  inputValue.value = value;
  const date = parseDate(value);
  model.value = date ? toIso(date) : '';
  if (date) visibleMonth.value = civilDate(date.getFullYear(), date.getMonth(), 1);
}

function normalizeInput() {
  const date = parseDate(inputValue.value);
  inputValue.value = date ? toDisplay(date) : '';
  model.value = date ? toIso(date) : '';
}

function selectDay(date: Date) {
  model.value = toIso(date);
  inputValue.value = toDisplay(date);
  open.value = false;
}

function changeMonth(offset: number) {
  const nextMonth = civilDate(
    visibleMonth.value.getFullYear(),
    visibleMonth.value.getMonth() + offset,
    1,
  );
  if (nextMonth.getFullYear() >= 1) visibleMonth.value = nextMonth;
}

function setMonth(event: Event) {
  visibleMonth.value = civilDate(
    visibleMonth.value.getFullYear(),
    Number((event.target as HTMLSelectElement).value),
    1,
  );
}

function setYear(event: Event) {
  visibleMonth.value = civilDate(
    Number((event.target as HTMLSelectElement).value),
    visibleMonth.value.getMonth(),
    1,
  );
}

function clear() {
  model.value = '';
  inputValue.value = '';
  open.value = false;
}

function closeOutside(event: PointerEvent) {
  if (event.target instanceof Node && !root.value?.contains(event.target)) open.value = false;
}

function handleKeydown(event: KeyboardEvent) {
  if (
    event.target instanceof HTMLInputElement &&
    (event.key === 'Enter' || event.key === 'ArrowDown')
  ) {
    event.preventDefault();
    showCalendar();
  }
  if (event.key === 'Escape' && open.value) {
    open.value = false;
    root.value?.querySelector<HTMLInputElement>('input')?.focus();
  }
}

function registerOutsidePointerListener() {
  document.addEventListener('pointerdown', closeOutside);
}

function unregisterOutsidePointerListener() {
  document.removeEventListener('pointerdown', closeOutside);
}

onMounted(registerOutsidePointerListener);
onBeforeUnmount(unregisterOutsidePointerListener);
</script>

<template>
  <div ref="root" class="relative min-w-0" :class="$attrs.class" @keydown="handleKeydown">
    <label :for="id" class="text-gray-60 mb-1.5 block text-sm">{{ props.label }}</label>
    <div ref="trigger" class="relative">
      <input
        :id="id"
        v-bind="{ ...$attrs, class: undefined }"
        :value="inputValue"
        type="text"
        inputmode="numeric"
        :placeholder="'DD/MM/AAAA'"
        :autocomplete="props.autocomplete"
        :aria-invalid="!!props.error"
        :aria-describedby="props.error ? `${id}-error` : undefined"
        aria-haspopup="dialog"
        :aria-expanded="open"
        :aria-controls="`${id}-calendar`"
        class="rounded-control placeholder:text-gray-40 focus:border-secondary focus:ring-secondary min-h-11 w-full min-w-0 border bg-white py-2.5 pr-11 pl-4 text-sm focus:ring-1 focus:outline-none"
        :class="props.error ? 'border-danger' : 'border-gray-25'"
        @click="showCalendar"
        @input="updateInput"
        @blur="normalizeInput"
      />
      <button
        type="button"
        :aria-label="open ? 'Cerrar calendario' : 'Abrir calendario'"
        :aria-expanded="open"
        class="rounded-control text-gray-60 hover:bg-gray-20 hover:text-secondary absolute inset-y-0 right-1 grid w-9 place-items-center transition-colors"
        @click="open ? (open = false) : showCalendar()"
      >
        <UiIcon name="calendar" :size="19" />
      </button>
    </div>
    <p v-if="props.error" :id="`${id}-error`" role="alert" class="text-danger mt-1 text-xs">
      {{ props.error }}
    </p>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="scale-95 opacity-0"
      enter-to-class="scale-100 opacity-100"
      leave-active-class="transition duration-120 ease-in"
      leave-from-class="scale-100 opacity-100"
      leave-to-class="scale-95 opacity-0"
    >
      <section
        v-if="open"
        :id="`${id}-calendar`"
        ref="popup"
        role="dialog"
        aria-label="Calendario de fecha de nacimiento"
        class="rounded-panel border-gray-21 text-secondary absolute z-50 w-[min(280px,calc(100vw-2rem))] border bg-white p-2.5 shadow-[0_14px_38px_rgba(6,15,38,.16)]"
        :class="[
          placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
          placement === 'top' ? 'origin-bottom' : 'origin-top',
          'right-0 sm:right-auto sm:left-0',
        ]"
        :style="{ visibility: positioned ? 'visible' : 'hidden' }"
      >
        <header class="mb-2 flex items-center justify-between gap-1">
          <button
            type="button"
            aria-label="Mes anterior"
            :disabled="visibleMonth.getFullYear() === 1 && visibleMonth.getMonth() === 0"
            class="text-gray-60 hover:bg-gray-20 hover:text-secondary grid size-7 place-items-center rounded-full transition-colors"
            @click="changeMonth(-1)"
          >
            <UiIcon name="chevron-left" :size="19" />
          </button>
          <div class="flex min-w-0 items-center gap-1">
            <select
              aria-label="Mes"
              :value="visibleMonth.getMonth()"
              class="rounded-control bg-gray-10 hover:bg-gray-20 focus-visible:ring-info max-w-30 cursor-pointer appearance-none px-1.5 py-1.5 text-[13px] font-semibold capitalize transition-colors outline-none focus-visible:ring-2"
              @change="setMonth"
            >
              <option v-for="month in monthOptions" :key="month.value" :value="month.value">
                {{ month.label }}
              </option>
            </select>
            <select
              aria-label="Año"
              :value="visibleMonth.getFullYear()"
              class="rounded-control bg-gray-10 hover:bg-gray-20 focus-visible:ring-info cursor-pointer px-1.5 py-1.5 text-[13px] font-semibold transition-colors outline-none focus-visible:ring-2"
              @change="setYear"
            >
              <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
          <button
            type="button"
            aria-label="Mes siguiente"
            class="text-gray-60 hover:bg-gray-20 hover:text-secondary grid size-7 place-items-center rounded-full transition-colors"
            @click="changeMonth(1)"
          >
            <UiIcon name="chevron-right" :size="19" />
          </button>
        </header>

        <div class="grid grid-cols-7 gap-y-0.5">
          <span
            v-for="(weekday, index) in weekdays"
            :key="index"
            class="text-gray-60 grid size-7 place-items-center text-[10px] font-semibold"
          >
            {{ weekday }}
          </span>
          <button
            v-for="day in days"
            :key="day.iso"
            type="button"
            :aria-label="day.label"
            :aria-current="day.today ? 'date' : undefined"
            :aria-pressed="day.selected"
            :disabled="day.future || day.date.getFullYear() < 1"
            class="focus-visible:ring-info grid size-7 place-items-center rounded-full text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30"
            :class="
              day.selected
                ? 'bg-secondary font-semibold text-white'
                : day.currentMonth
                  ? 'hover:bg-primary-soft'
                  : 'text-gray-40 hover:bg-gray-20'
            "
            @click="selectDay(day.date)"
          >
            {{ day.day }}
          </button>
        </div>
        <footer class="border-gray-21 mt-2 flex items-center justify-between border-t pt-2">
          <button
            type="button"
            class="text-gray-60 hover:bg-gray-20 hover:text-secondary rounded px-2 py-1 text-[11px] font-semibold transition-colors"
            @click="clear"
          >
            Limpiar
          </button>
          <span class="text-gray-40 text-[10px]">DD / MM / AAAA</span>
        </footer>
      </section>
    </Transition>
  </div>
</template>
