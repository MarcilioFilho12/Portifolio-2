<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { useLowPower } from '@/composables/useLowPower'
import { useReducedMotion } from '@/composables/useReducedMotion'

const { shouldReduceMotion } = useReducedMotion()
const { isLowPower } = useLowPower()
const { t } = useLocale()

const sectionRef = ref<HTMLElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
let observer: IntersectionObserver | null = null

const useStaticBackdrop = computed(() => shouldReduceMotion.value)

const playVideo = () => {
  const video = videoRef.value
  if (!video || useStaticBackdrop.value) return
  if (isLowPower.value) video.playbackRate = 0.9
  video.play().catch(() => {})
}

onMounted(() => {
  const section = sectionRef.value
  const video = videoRef.value
  if (!section || !video || useStaticBackdrop.value) return

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (!entry) return
      if (entry.isIntersecting) playVideo()
      else video.pause()
    },
    { threshold: isLowPower.value ? 0.15 : 0.25 },
  )
  observer.observe(section)
})

onUnmounted(() => {
  observer?.disconnect()
  videoRef.value?.pause()
})
</script>

<template>
  <section
    id="cinematic"
    ref="sectionRef"
    class="relative min-h-[100dvh] w-full overflow-hidden"
    :aria-label="t('cinematic.sectionLabel')"
  >
    <p class="sr-only">{{ t('cinematic.srOnly') }}</p>

    <div
      v-if="useStaticBackdrop"
      class="absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_srgb,#6565c0_22%,transparent),#07070d)]"
      aria-hidden="true"
    />

    <video
      v-else
      ref="videoRef"
      class="cinematic-video absolute inset-0 h-full w-full object-cover"
      muted
      loop
      playsinline
      :preload="isLowPower ? 'metadata' : 'auto'"
      aria-hidden="true"
      poster="/media/kling-poster.svg"
    >
      <source src="/media/kling-scroll.webm" type="video/webm" />
    </video>

    <div
      class="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg/40 via-transparent to-bg/40"
      aria-hidden="true"
    />

    <div class="relative z-10 flex min-h-[100dvh] items-end px-6 pb-16">
      <div class="mx-auto w-full max-w-6xl">
        <p class="text-sm uppercase tracking-[0.25em] text-glow/80">{{ t('cinematic.label') }}</p>
        <h2 class="mt-2 max-w-lg text-2xl font-medium text-text md:text-3xl">
          {{ t('cinematic.title') }}
        </h2>
        <p class="mt-3 max-w-md text-sm text-text-muted">
          {{ t('cinematic.body') }}
        </p>
      </div>
    </div>
  </section>
</template>
