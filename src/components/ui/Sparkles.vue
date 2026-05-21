<script setup lang="ts">
import { computed, useId } from 'vue'
import { buildExpertiseSparklesOptions } from '@/lib/expertiseSparkles'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { useMediaQuery } from '@/composables/useMediaQuery'

const props = withDefaults(
  defineProps<{
    class?: string
    density?: number
    speed?: number
    size?: number
  }>(),
  {
    density: 220,
    speed: 0.45,
    size: 1.2,
  },
)

const { shouldReduceMotion } = useReducedMotion()
const { matches: isMobile } = useMediaQuery('(max-width: 768px)')

const particleId = `sparkles-${useId().replace(/:/g, '')}`

const options = computed(() =>
  buildExpertiseSparklesOptions({
    density: isMobile.value ? Math.round(props.density * 0.45) : props.density,
    speed: props.speed,
    size: props.size,
  }),
)
</script>

<template>
  <div
    v-if="!shouldReduceMotion"
    :class="['sparkles-layer pointer-events-none absolute inset-0 overflow-hidden', props.class]"
    aria-hidden="true"
  >
    <VueParticles :id="particleId" :options="options" class="h-full w-full" />
  </div>
</template>

<style scoped>
.sparkles-layer :deep(canvas) {
  width: 100% !important;
  height: 100% !important;
}
</style>
