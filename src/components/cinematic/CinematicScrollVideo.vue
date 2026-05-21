<script setup lang="ts">
import { ref } from 'vue'
import { useVideoOnScroll } from '@/composables/useVideoOnScroll'
import { useLocale } from '@/composables/useLocale'

const sectionRef = ref<HTMLElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)

const { shouldReduceMotion, isMobile } = useVideoOnScroll(sectionRef, videoRef)
const { t } = useLocale()
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
      v-if="shouldReduceMotion || isMobile"
      class="absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_srgb,#6565c0_25%,transparent),#07070d)]"
      aria-hidden="true"
    />

    <video
      v-else
      ref="videoRef"
      class="absolute inset-0 h-full w-full object-cover"
      muted
      loop
      playsinline
      preload="none"
      aria-hidden="true"
      poster="/media/kling-poster.svg"
    >
      <source src="/media/kling-scroll.mp4" type="video/mp4" />
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
