<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useHead } from '@unhead/vue'
import ParticleDrift from '@/components/games/ParticleDrift.vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import LocaleToggle from '@/components/ui/LocaleToggle.vue'
import { useLocale } from '@/composables/useLocale'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { playTrack } from '@/games/rokenpo/music'

const { t } = useLocale()
const { shouldReduceMotion } = useReducedMotion()

function onEnterGame() {
  if (shouldReduceMotion.value) return
  void playTrack('opening').catch(() => {})
}

useHead(() => ({
  title: t('games.metaTitle'),
  meta: [{ name: 'description', content: t('games.subtitle') }],
}))
</script>

<template>
  <div class="relative min-h-dvh overflow-x-hidden bg-[#030509] text-text">
    <ParticleDrift class="pointer-events-none absolute inset-0 z-0" />
    <div
      class="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(3,5,9,0.55)_100%)]"
      aria-hidden="true"
    />

    <header class="sticky top-0 z-30 border-b border-white/10 bg-[#030509]/55 backdrop-blur-xl">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
        <RouterLink
          to="/"
          class="font-display text-[15px] font-semibold tracking-tight text-text"
          data-testid="games-home-link"
        >
          Marcílio Alano Filho
        </RouterLink>
        <div class="flex items-center gap-4">
          <span class="font-mono-label text-[11px] text-glow">{{ t('nav.games') }}</span>
          <LocaleToggle />
        </div>
      </div>
    </header>

    <main id="games-main" class="relative z-10 mx-auto max-w-6xl px-6 py-16" data-testid="games-page">
      <p class="font-mono-label text-[11px] text-glow">{{ t('nav.games') }}</p>
      <h1 class="mt-3 text-3xl font-semibold text-text md:text-4xl">{{ t('games.title') }}</h1>
      <p class="mt-3 max-w-xl text-text-muted">{{ t('games.subtitle') }}</p>

      <ul class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <li>
          <RouterLink
            to="/games/rokenpo"
            class="block h-full rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-glow"
            data-testid="game-card-rokenpo"
            @click="onEnterGame"
          >
            <GlassCard class="h-full">
              <img
                class="mb-4 aspect-video w-full rounded-xl object-cover"
                src="/media/rokenpo/guerra-ninja-card.png"
                alt=""
              />
              <p class="text-xs uppercase tracking-wider text-glow">{{ t('games.rokenpo.category') }}</p>
              <h2 class="mt-2 text-xl font-medium text-text">{{ t('games.rokenpo.title') }}</h2>
              <p class="mt-2 text-sm text-text-muted">{{ t('games.rokenpo.description') }}</p>
              <p class="mt-6 text-sm text-text">{{ t('games.play') }}</p>
            </GlassCard>
          </RouterLink>
        </li>
      </ul>
    </main>
  </div>
</template>
