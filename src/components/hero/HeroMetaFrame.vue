<script setup lang="ts">
import MaskReveal from '@/components/ui/MaskReveal.vue'
import { useLocale } from '@/composables/useLocale'

const { t } = useLocale()
</script>

<template>
  <div
    data-reveal="meta"
    class="relative z-10 mx-auto flex w-full max-w-7xl items-start justify-between gap-6 px-6 pt-[5.5rem] md:px-10 md:pt-28"
  >
    <div class="flex flex-col gap-1.5">
      <MaskReveal :delay="0.35">
        <p class="font-mono-label text-[10px] text-glow/90">{{ t('hero.metaFolio') }}</p>
      </MaskReveal>
      <MaskReveal :delay="0.42">
        <p class="font-mono-label text-[10px] text-glow/70">{{ t('hero.metaCinematic') }}</p>
      </MaskReveal>
    </div>

    <MaskReveal :delay="0.45" class="shrink-0">
      <p class="font-mono-label text-right text-[10px] text-glow/80 max-md:text-[9px]">
        {{ t('hero.metaLocation') }}
      </p>
    </MaskReveal>
  </div>
</template>
