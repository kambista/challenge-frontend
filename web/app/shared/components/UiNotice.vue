<script setup lang="ts">
import UiIcon from './UiIcon.vue';
defineProps<{ tone?: 'info' | 'warning' }>();
</script>

<template>
  <div
    class="rounded-control flex items-center gap-3 p-3.5 text-xs leading-4"
    :class="tone === 'warning' ? 'bg-warning-soft text-warning' : 'bg-info-soft text-secondary'"
  >
    <UiIcon name="info" :size="19" class="shrink-0" />
    <div><slot /></div>
  </div>
</template>
