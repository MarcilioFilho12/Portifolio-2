<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import MaskReveal from '@/components/ui/MaskReveal.vue'
import LocaleToggle from '@/components/ui/LocaleToggle.vue'
import { useLocale } from '@/composables/useLocale'

const menuOpen = ref(false)
const { t } = useLocale()

const navLinks = computed(() => [
  { href: '#projetos', label: t('nav.work'), testId: 'nav-link-work' },
  { href: '#skills', label: t('nav.expertise'), testId: 'nav-link-expertise' },
  { href: '#sobre', label: t('nav.experience'), testId: 'nav-link-experience' },
  { href: '/games', label: t('nav.games'), testId: 'nav-link-games' },
])
</script>

<template>
  <header
    class="hero-header fixed inset-x-0 top-0 z-30 w-full border-b border-glow/15 bg-bg/60 backdrop-blur-xl"
  >
    <div
      class="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 xl:px-10 xl:py-6"
    >
      <MaskReveal :delay="0" class="min-w-0">
        <a
          href="#"
          class="group inline-flex min-w-0 max-w-full items-center gap-2.5"
          aria-current="page"
          data-testid="nav-wordmark"
        >
          <span
            class="h-1.5 w-1.5 shrink-0 rounded-full bg-glow shadow-[0_0_10px_color-mix(in_srgb,var(--color-glow)_80%,transparent)]"
            aria-hidden="true"
          />
          <span class="inline-flex min-w-0 items-baseline gap-0">
            <span class="truncate font-display text-[15px] font-semibold tracking-tight text-text max-[380px]:hidden">
              Marcílio Alano Filho
            </span>
            <span class="hidden font-display text-[15px] font-semibold tracking-tight text-text max-[380px]:inline">
              M. Alano
            </span>
            <span class="font-mono-label ml-2 hidden whitespace-nowrap text-[10px] text-glow/80 min-[1440px]:inline">
              {{ t('nav.creativeDeveloper') }}
            </span>
          </span>
        </a>
      </MaskReveal>

      <nav class="hidden items-center gap-6 xl:flex 2xl:gap-9" :aria-label="t('nav.mainNav')">
        <template v-for="link in navLinks" :key="link.href">
          <RouterLink
            v-if="link.href.startsWith('/')"
            :to="link.href"
            :data-testid="link.testId"
            class="font-mono-label text-[11px] text-text-muted transition-colors duration-300 hover:text-text"
          >
            {{ link.label }}
          </RouterLink>
          <a
            v-else
            :href="link.href"
            :data-testid="link.testId"
            class="font-mono-label text-[11px] text-text-muted transition-colors duration-300 hover:text-text"
          >
            {{ link.label }}
          </a>
        </template>
      </nav>

      <div class="flex items-center gap-2 md:gap-3">
        <LocaleToggle />

        <a
          href="#contato"
          data-testid="nav-cta-button-mobile"
          class="group relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-glow/30 bg-bg/40 transition-all duration-500 hover:border-glow/60 xl:hidden"
          :aria-label="t('nav.getInTouch')"
        >
          <span
            class="inline-block h-1.5 w-1.5 rounded-full bg-glow shadow-[0_0_6px_var(--color-glow)]"
            aria-hidden="true"
          />
        </a>

        <MaskReveal :delay="0.12">
          <a
            href="#contato"
            data-testid="nav-cta-button"
            class="group relative hidden shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-glow/30 bg-bg/40 px-4 py-2 font-mono-label text-[11px] text-text transition-all duration-500 hover:border-glow/60 xl:inline-flex"
          >
            <span class="relative z-10">{{ t('nav.getInTouch') }}</span>
            <span
              class="relative z-10 inline-block h-1.5 w-1.5 rounded-full bg-glow shadow-[0_0_6px_var(--color-glow)] transition-colors group-hover:bg-text"
              aria-hidden="true"
            />
            <span
              class="pointer-events-none absolute inset-0 rounded-full bg-primary/0 blur-md transition-all duration-500 group-hover:bg-primary/30"
              aria-hidden="true"
            />
          </a>
        </MaskReveal>

        <button
          type="button"
          class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-glow/25 text-text xl:hidden"
          :aria-expanded="menuOpen"
          aria-controls="hero-mobile-nav"
          data-testid="mobile-menu-toggle"
          @click="menuOpen = !menuOpen"
        >
          <span class="sr-only">{{ t('nav.openMenu') }}</span>
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              v-if="!menuOpen"
              stroke-linecap="round"
              stroke-width="1.5"
              d="M4 7h16M4 12h16M4 17h16"
            />
            <path v-else stroke-linecap="round" stroke-width="1.5" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>

    <div
      v-show="menuOpen"
      id="hero-mobile-nav"
      class="border-t border-glow/15 bg-bg/95 px-4 py-4 backdrop-blur-xl sm:px-6 xl:hidden"
    >
      <ul class="flex flex-col gap-3">
        <li v-for="link in navLinks" :key="link.href">
          <RouterLink
            v-if="link.href.startsWith('/')"
            :to="link.href"
            class="font-mono-label text-sm text-text"
            @click="menuOpen = false"
          >
            {{ link.label }}
          </RouterLink>
          <a
            v-else
            :href="link.href"
            class="font-mono-label text-sm text-text"
            @click="menuOpen = false"
          >
            {{ link.label }}
          </a>
        </li>
        <li>
          <a
            href="#contato"
            class="font-mono-label text-sm text-glow"
            @click="menuOpen = false"
          >
            {{ t('nav.getInTouch') }}
          </a>
        </li>
      </ul>
    </div>
  </header>
</template>
