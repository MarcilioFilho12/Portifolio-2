<script setup lang="ts">
import { ref } from 'vue'
import { useThreeHero } from '@/composables/useThreeHero'

const containerRef = ref<HTMLElement | null>(null)
useThreeHero(containerRef)
</script>

<template>
  <div
    ref="containerRef"
    class="pointer-events-none absolute inset-0 z-0 h-full w-full"
    aria-hidden="true"
  />
</template>
