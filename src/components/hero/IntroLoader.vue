<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, registerGsap } from '@/composables/useGsap'
import { useReducedMotion } from '@/composables/useReducedMotion'

const STORAGE_KEY = 'portfolio-intro-seen'

const emit = defineEmits<{
  complete: []
}>()

const { shouldReduceMotion } = useReducedMotion()
const visible = ref(!sessionStorage.getItem(STORAGE_KEY))
const rootRef = ref<HTMLElement | null>(null)
let autoTimer: ReturnType<typeof setTimeout> | null = null

const finish = () => {
  if (!visible.value) return
  sessionStorage.setItem(STORAGE_KEY, '1')
  visible.value = false
  emit('complete')
}

const skip = () => finish()

onMounted(() => {
  if (!visible.value) {
    emit('complete')
    return
  }

  if (shouldReduceMotion.value) {
    finish()
    return
  }

  registerGsap()
  const root = rootRef.value
  if (root) {
    gsap.fromTo(
      root.querySelector('[data-intro="logo"]'),
      { scale: 0.92, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' },
    )
    gsap.fromTo(
      root.querySelector('[data-intro="bar"]'),
      { scaleX: 0 },
      { scaleX: 1, duration: 1.6, ease: 'power2.inOut', delay: 0.2 },
    )
  }

  autoTimer = setTimeout(() => {
    const el = rootRef.value
    if (!el) {
      finish()
      return
    }
    gsap.to(el, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: finish,
    })
  }, 2400)
})

onUnmounted(() => {
  if (autoTimer) clearTimeout(autoTimer)
})
</script>

<template>
  <div
    v-if="visible"
    ref="rootRef"
    class="intro-loader fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg"
    role="dialog"
    aria-modal="true"
    aria-label="Introdução do portfólio"
  >
    <div data-intro="logo" class="mb-10 flex flex-col items-center gap-4">
      <svg class="h-14 w-14 text-glow" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect
          x="4"
          y="4"
          width="40"
          height="40"
          rx="8"
          stroke="currentColor"
          stroke-width="1"
          opacity="0.4"
        />
        <text
          x="24"
          y="30"
          text-anchor="middle"
          fill="currentColor"
          font-size="14"
          font-weight="600"
          font-family="Inter, sans-serif"
        >
          M
        </text>
      </svg>
      <p class="text-xs uppercase tracking-[0.22em] text-text-muted">Marcílio Alano</p>
    </div>

    <div
      data-intro="bar"
      class="h-px w-48 origin-left bg-gradient-to-r from-transparent via-glow to-transparent"
      aria-hidden="true"
    />

    <button
      type="button"
      class="intro-loader__skip absolute bottom-10 right-10 text-xs uppercase tracking-widest text-text-muted transition-colors hover:text-text"
      @click="skip"
    >
      Pular intro
    </button>
  </div>
</template>

<style scoped>
.intro-loader__skip:focus-visible {
  outline: 2px solid var(--color-glow);
  outline-offset: 4px;
}
</style>
