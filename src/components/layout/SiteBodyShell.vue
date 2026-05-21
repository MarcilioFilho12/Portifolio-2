<script setup lang="ts">
import Sparkles from '@/components/ui/Sparkles.vue'
</script>

<template>
  <div class="site-body relative bg-bg">
    <Sparkles class="absolute inset-0 z-0" :density="200" :speed="0.38" :size="1.3" />

    <div
      class="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_30%_20%,color-mix(in_srgb,#3d3da4_12%,transparent),transparent_55%),radial-gradient(ellipse_at_70%_60%,color-mix(in_srgb,#8282d5_8%,transparent),transparent_50%)]"
      aria-hidden="true"
    />

    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>
