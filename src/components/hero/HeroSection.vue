<script setup lang="ts">
import { computed, ref } from 'vue'
import HeroHeader from '@/components/hero/HeroHeader.vue'
import HeroCanvas from '@/components/hero/HeroCanvas.vue'
import HeroHeadline from '@/components/hero/HeroHeadline.vue'
import HeroMetaFrame from '@/components/hero/HeroMetaFrame.vue'
import HeroFooter from '@/components/hero/HeroFooter.vue'
import FrameCorners from '@/components/hero/FrameCorners.vue'
import SecondaryLink from '@/components/ui/SecondaryLink.vue'
import HoverButton from '@/components/ui/HoverButton.vue'
import ScrollComet from '@/components/hero/ScrollComet.vue'
import { useHeroEntrance } from '@/composables/useHeroEntrance'
import { useLocale } from '@/composables/useLocale'

const { t } = useLocale()

const props = defineProps<{
  entranceReady?: boolean
}>()

const heroRef = ref<HTMLElement | null>(null)
const ready = computed(() => props.entranceReady ?? true)
useHeroEntrance(heroRef, ready)
</script>

<template>
  <section
    id="hero"
    ref="heroRef"
    class="hero-section relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-bg"
    aria-labelledby="hero-title"
  >
    <p class="sr-only">{{ t('hero.srOnly') }}</p>

    <div data-hero-canvas class="absolute inset-0 z-0">
      <HeroCanvas />
    </div>

    <div
      class="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,rgba(7,7,13,0)_0%,rgba(7,7,13,0.45)_55%,rgba(7,7,13,0.78)_100%)]"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-bg via-bg/20 to-transparent"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_50%_30%,color-mix(in_srgb,#3d3da4_12%,transparent),transparent_60%),radial-gradient(ellipse_at_20%_80%,color-mix(in_srgb,#8282d5_8%,transparent),transparent_50%)]"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -top-40 left-1/2 z-[1] h-[50vh] w-[70vw] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]"
      aria-hidden="true"
    />

    <FrameCorners />
    <HeroHeader />
    <HeroMetaFrame />

    <div class="relative z-10 flex flex-1 flex-col">
      <div
        class="flex flex-1 flex-col items-stretch justify-end px-6 pb-8 pt-4 md:items-start md:justify-center md:px-10 md:pb-0 md:pt-6"
      >
        <div class="mx-auto w-full max-w-7xl">
          <HeroHeadline />

          <p
            data-reveal="subhead"
            class="font-body mt-8 max-w-xl text-left text-[15px] leading-relaxed text-white/70 md:text-base"
            data-testid="hero-subline"
          >
            {{ t('hero.subline') }}
          </p>

          <div class="mt-10 flex flex-wrap items-center justify-start gap-5">
            <HoverButton
              data-reveal="cta"
              href="#projetos"
              variant="primary"
              data-testid="hero-cta-primary"
            >
              {{ t('hero.ctaWork') }}
              <span
                class="transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              >→</span>
            </HoverButton>
            <span data-reveal="cta">
              <SecondaryLink href="#contato" :label="t('hero.ctaContact')" />
            </span>
          </div>
        </div>
      </div>

      <HeroFooter />
    </div>

    <div class="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 md:hidden">
      <a href="#cinematic" class="block" :aria-label="t('hero.scrollCinematic')">
        <ScrollComet />
      </a>
    </div>
  </section>
</template>
