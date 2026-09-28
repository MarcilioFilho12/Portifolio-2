<script setup lang="ts">
import MaskReveal from '@/components/ui/MaskReveal.vue'
import { useLocale } from '@/composables/useLocale'

const { t } = useLocale()
</script>

<template>
  <div
    data-reveal="footer"
    class="relative z-10 px-5 pb-10 pt-2 sm:px-8 md:px-10 md:pb-10"
  >
    <div class="mx-auto flex max-w-7xl items-end justify-between gap-4">
      <a
        href="#cinematic"
        class="inline-flex items-center gap-2 text-text-muted"
        :aria-label="t('hero.scrollCinematic')"
      >
        <svg
          class="h-3.5 w-3.5 shrink-0 animate-bounce text-text-muted"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
        <span class="font-mono-label text-[10px] whitespace-nowrap">{{ t('hero.scrollEnter') }}</span>
      </a>

      <div class="flex shrink-0 items-center gap-4 text-right sm:gap-6">
        <MaskReveal :delay="1.5">
          <div>
            <p class="font-mono-label text-[10px] whitespace-nowrap text-text-muted">{{ t('hero.available') }}</p>
            <p class="font-display mt-1 text-sm whitespace-nowrap text-text">{{ t('hero.availableDate') }}</p>
          </div>
        </MaskReveal>
        <div class="hidden items-center gap-6 md:flex">
          <span class="h-8 w-px bg-white/15" aria-hidden="true" />
          <MaskReveal :delay="1.6">
            <div>
              <p class="font-mono-label text-[10px] whitespace-nowrap text-text-muted">{{ t('hero.nowPlaying') }}</p>
              <p class="font-display mt-1 text-sm whitespace-nowrap text-text">{{ t('hero.nowPlayingTrack') }}</p>
            </div>
          </MaskReveal>
        </div>
      </div>
    </div>
  </div>
</template>
