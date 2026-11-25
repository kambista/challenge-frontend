<script setup lang="ts">
import type { IconName } from '~/shared/types/ui.types';

withDefaults(
  defineProps<{
    name: IconName;
    size?: number;
  }>(),
  { size: 20 },
);
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    class="shrink-0"
  >
    <template v-if="name === 'logout'">
      <path
        d="M10 4H4v16h6m4-13 5 5-5 5m-6-5h11"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>
    <template v-else-if="name === 'menu'">
      <path
        d="M3 6h18M3 12h18M3 18h18"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="square"
      />
    </template>
    <template v-else-if="name === 'chevron-left'">
      <path
        d="m15 18-6-6 6-6"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>
    <template v-else-if="name === 'chevron-right'">
      <path
        d="m9 18 6-6-6-6"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>
    <template v-else-if="name === 'chevron-down'">
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>
    <template v-else-if="name === 'close'">
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
      />
    </template>
    <template v-else-if="name === 'eye'">
      <path
        d="M2.5 12s3.3-6 9.5-6 9.5 6 9.5 6-3.3 6-9.5 6-9.5-6-9.5-6Z"
        stroke="currentColor"
        stroke-width="1.5"
      />
      <circle cx="12" cy="12" r="2.7" stroke="currentColor" stroke-width="1.5" />
    </template>
    <template v-else-if="name === 'eye-off'">
      <path
        d="m3 3 18 18M10.6 6.2A10.8 10.8 0 0 1 12 6c6.2 0 9.5 6 9.5 6a14 14 0 0 1-3 3.5M6.2 6.3C3.8 8 2.5 12 2.5 12s3.3 6 9.5 6c.8 0 1.6-.1 2.3-.3"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.9 9.9a3 3 0 0 0 4.2 4.2"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </template>
    <template v-else-if="name === 'info'">
      <circle cx="12" cy="12" r="9.2" stroke="currentColor" stroke-width="1.5" />
      <path d="M12 11v5M12 8h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    </template>
    <template v-else-if="name === 'swap'">
      <path
        d="M20 7h-3.1a7.1 7.1 0 0 0-12.5 2M4 17h3.1a7.1 7.1 0 0 0 12.5-2"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
      />
      <path
        d="m17 4 3 3-3 3M7 20l-3-3 3-3"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>
    <template v-else-if="name === 'copy'">
      <rect x="8" y="8" width="11" height="13" rx="1.5" stroke="currentColor" stroke-width="1.5" />
      <path
        d="M16 5V4a1.5 1.5 0 0 0-1.5-1.5h-9A1.5 1.5 0 0 0 4 4v11a1.5 1.5 0 0 0 1.5 1.5H7"
        stroke="currentColor"
        stroke-width="1.5"
      />
    </template>
    <template v-else-if="name === 'profile'">
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="2"
        stroke="currentColor"
        stroke-width="1.5"
      />
      <circle cx="12" cy="9" r="3" stroke="currentColor" stroke-width="1.5" />
      <path
        d="M6.5 18a5.5 5.5 0 0 1 11 0"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </template>
    <template v-else-if="name === 'calendar'">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.6" />
      <path
        d="M16 3v4M8 3v4M3 10h18"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
      />
      <path
        d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
      />
    </template>
  </svg>
</template>
