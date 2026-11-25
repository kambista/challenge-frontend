<script setup lang="ts">
defineProps<{ light?: boolean }>();
</script>

<template>
  <NuxtLink to="/inicio" aria-label="Kambista, inicio" class="block w-29 shrink-0 md:w-41">
    <img
      :src="light ? '/images/figma/Login-2-0.png' : '/images/figma/brand-logo.png'"
      alt="Kambista"
      class="w-full object-contain"
      :class="light ? '[clip-path:polygon(0_0,100%_0,100%_62%,32%_62%,32%_100%,0_100%)]' : ''"
      width="2170"
      height="607"
    />
  </NuxtLink>
</template>
