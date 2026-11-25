<script setup lang="ts">
import BrandLogo from '~/shared/components/BrandLogo.vue';
import UiIcon from '~/shared/components/UiIcon.vue';
import { NuxtLink } from '#components';
import { TRANSACTION_NAVIGATION } from '../constants/navigation';
const collapsed = defineModel<boolean>('collapsed', { default: false });
</script>

<template>
  <aside
    class="fixed inset-y-0 left-0 z-50 hidden h-dvh flex-col bg-white transition-[width] duration-200 lg:flex"
    :class="collapsed ? 'w-[106px]' : 'w-80'"
  >
    <header class="relative flex h-[66px] shrink-0 items-center" :class="collapsed ? '' : 'pl-20'">
      <BrandLogo v-if="!collapsed" class="w-37!" />
      <button
        type="button"
        class="bg-gray-20 text-secondary absolute top-4 -right-3.5 grid size-7 place-items-center rounded-full"
        :aria-label="collapsed ? 'Expandir menú lateral' : 'Contraer menú lateral'"
        :aria-expanded="!collapsed"
        @click="collapsed = !collapsed"
      >
        <UiIcon :name="collapsed ? 'chevron-right' : 'chevron-left'" :size="17" />
      </button>
    </header>
    <nav aria-label="Navegación principal" class="mt-[25px] min-h-0 flex-1 overflow-y-auto pb-6">
      <template v-for="item in TRANSACTION_NAVIGATION" :key="item.label">
        <component
          :is="item.to ? NuxtLink : 'div'"
          :to="item.to"
          :title="collapsed ? item.label : undefined"
          :aria-current="item.active ? 'page' : undefined"
          class="rounded-control text-secondary flex min-h-[62px] items-center text-sm transition-[padding] duration-200"
          :class="[
            collapsed ? 'px-9' : 'gap-4 px-[18px]',
            item.active ? 'bg-gray-20 font-medium' : '',
          ]"
        >
          <img :src="item.icon" alt="" class="size-[34px] shrink-0 object-contain" />
          <Transition
            enter-active-class="transition-opacity delay-150 duration-100"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-75"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <span v-if="!collapsed" class="flex min-w-0 flex-1 items-center gap-2">
              <span class="truncate">{{ item.label }}</span>
              <span
                v-if="item.badge"
                class="bg-secondary shrink-0 rounded-full px-2 py-1 text-[10px] font-bold text-white"
              >
                {{ item.badge }}
              </span>
            </span>
          </Transition>
        </component>
      </template>
    </nav>
  </aside>
</template>
