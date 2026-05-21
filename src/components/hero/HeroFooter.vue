<script setup lang="ts">
import MaskReveal from '@/components/ui/MaskReveal.vue'
import { useLocale } from '@/composables/useLocale'

const { t } = useLocale()
</script>

<template>
  <div
    data-reveal="footer"
    class="relative z-10 px-6 pb-8 pt-4 md:px-10 md:pb-10"
  >
    <div class="mx-auto flex max-w-7xl items-end justify-between gap-6">
      <div class="hidden items-center gap-3 text-text-muted md:flex">
        <svg
          class="h-3.5 w-3.5 animate-bounce text-text-muted"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
        <span class="font-mono-label text-[10px]">{{ t('hero.scrollEnter') }}</span>
      </div>

      <div class="ml-auto flex items-center gap-6 text-right">
        <MaskReveal :delay="1.5" block>
          <div>
            <p class="font-mono-label text-[10px] text-text-muted">{{ t('hero.available') }}</p>
            <p class="font-display mt-1 text-sm text-text">{{ t('hero.availableDate') }}</p>
          </div>
        </MaskReveal>
        <span class="hidden h-8 w-px bg-white/15 md:block" aria-hidden="true" />
        <MaskReveal :delay="1.6" block class="hidden md:block">
          <div>
            <p class="font-mono-label text-[10px] text-text-muted">{{ t('hero.nowPlaying') }}</p>
            <p class="font-display mt-1 text-sm text-text">{{ t('hero.nowPlayingTrack') }}</p>
          </div>
        </MaskReveal>
      </div>
    </div>
  </div>
</template>
