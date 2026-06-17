<script setup lang="ts">
import { ref } from 'vue'
import { useLowPower } from '@/composables/useLowPower'
import { useThreeHero } from '@/composables/useThreeHero'

const containerRef = ref<HTMLElement | null>(null)
const { isLowPower } = useLowPower()
useThreeHero(containerRef)
</script>

<template>
  <div
    v-if="isLowPower"
    class="hero-lite-fallback pointer-events-none absolute inset-0 z-0 overflow-hidden"
    aria-hidden="true"
  >
    <div class="hero-lite-fallback__orb hero-lite-fallback__orb--primary" />
    <div class="hero-lite-fallback__orb hero-lite-fallback__orb--glow" />
    <div
      class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(7,7,13,0)_0%,rgba(7,7,13,0.5)_70%,rgba(7,7,13,0.85)_100%)]"
    />
  </div>

  <div
    ref="containerRef"
    class="pointer-events-none absolute inset-0 z-0 h-full w-full"
    aria-hidden="true"
  />
</template>

<style scoped>
.hero-lite-fallback__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.45;
}

.hero-lite-fallback__orb--primary {
  top: 18%;
  left: 50%;
  width: min(70vw, 320px);
  height: min(70vw, 320px);
  transform: translateX(-50%);
  background: color-mix(in srgb, var(--color-primary) 55%, transparent);
  animation: hero-lite-pulse 8s ease-in-out infinite;
}

.hero-lite-fallback__orb--glow {
  top: 35%;
  left: 55%;
  width: min(50vw, 220px);
  height: min(50vw, 220px);
  transform: translateX(-50%);
  background: color-mix(in srgb, var(--color-glow) 40%, transparent);
  animation: hero-lite-pulse 10s ease-in-out infinite reverse;
}

@keyframes hero-lite-pulse {
  0%,
  100% {
    opacity: 0.35;
    transform: translateX(-50%) scale(1);
  }
  50% {
    opacity: 0.55;
    transform: translateX(-50%) scale(1.08);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-lite-fallback__orb {
    animation: none;
    opacity: 0.4;
  }
}
</style>
