<script setup lang="ts">
import { onMounted, shallowRef } from 'vue';

const ready = shallowRef(false);

onMounted(() => {
  ready.value = true;
});
</script>

<template>
  <div :data-ready="ready" :inert="!ready">
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>
