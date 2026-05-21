<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import SectionReveal from '@/components/ui/SectionReveal.vue'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { useLocale } from '@/composables/useLocale'

const ABOUT_VIDEO = '/media/about-ai-man-nod.mp4'

const { shouldReduceMotion } = useReducedMotion()
const { t } = useLocale()
const videoRef = ref<HTMLVideoElement | null>(null)

onMounted(() => {
  const video = videoRef.value
  if (!video || shouldReduceMotion.value) return
  video.play().catch(() => {})
})

onUnmounted(() => {
  videoRef.value?.pause()
})
</script>

<template>
  <section id="sobre" class="px-6 py-24" aria-labelledby="about-title">
    <SectionReveal class="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
      <div>
        <p class="font-mono-label text-[11px] text-glow/80">{{ t('about.label') }}</p>
        <h2 id="about-title" class="mt-3 font-display text-3xl font-medium tracking-tight text-text md:text-4xl">
          {{ t('about.title') }}
        </h2>
        <p class="mt-6 font-body leading-relaxed text-text-muted">
          {{ t('about.p1') }}
        </p>
        <p class="mt-4 font-body leading-relaxed text-text-muted">
          {{ t('about.p2') }}
        </p>
      </div>

      <div class="glow-border relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-bg/80">
        <video
          v-if="!shouldReduceMotion"
          ref="videoRef"
          class="h-full w-full object-cover"
          :src="ABOUT_VIDEO"
          muted
          loop
          playsinline
          preload="metadata"
          :aria-label="t('about.videoLabel')"
        />
        <div
          v-else
          class="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/25 via-glow/15 to-bg"
          role="img"
          :aria-label="t('about.staticPreview')"
        >
          <span class="font-mono-label text-[10px] text-glow/70">{{ t('about.reducedMotion') }}</span>
        </div>
        <div
          class="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/50 via-transparent to-transparent"
          aria-hidden="true"
        />
      </div>
    </SectionReveal>
  </section>
</template>
