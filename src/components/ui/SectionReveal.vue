<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, registerGsap, ScrollTrigger } from '@/composables/useGsap'
import { useMediaQuery } from '@/composables/useMediaQuery'
import { useReducedMotion } from '@/composables/useReducedMotion'

const root = ref<HTMLElement | null>(null)
const { shouldReduceMotion } = useReducedMotion()
const { matches: isMobile } = useMediaQuery('(max-width: 768px)')
let tween: gsap.core.Tween | null = null
let fallbackTimer: ReturnType<typeof setTimeout> | null = null

const forceVisible = (el: HTMLElement) => {
  gsap.set(el, { clearProps: 'all' })
}

onMounted(() => {
  const el = root.value
  if (!el || shouldReduceMotion.value || isMobile.value) return

  registerGsap()

  tween = gsap.from(el, {
    y: 48,
    opacity: 0,
    duration: 0.95,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      once: true,
      invalidateOnRefresh: true,
    },
  })

  fallbackTimer = setTimeout(() => forceVisible(el), 2800)

  requestAnimationFrame(() => ScrollTrigger.refresh())
})

onUnmounted(() => {
  if (fallbackTimer) clearTimeout(fallbackTimer)
  tween?.scrollTrigger?.kill()
  tween?.kill()
})
</script>

<template>
  <div ref="root">
    <slot />
  </div>
</template>
