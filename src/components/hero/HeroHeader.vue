<script setup lang="ts">
import { computed, ref } from 'vue'
import MaskReveal from '@/components/ui/MaskReveal.vue'
import LocaleToggle from '@/components/ui/LocaleToggle.vue'
import { useLocale } from '@/composables/useLocale'

const menuOpen = ref(false)
const { t } = useLocale()

const navLinks = computed(() => [
  { href: '#projetos', label: t('nav.work'), testId: 'nav-link-work' },
  { href: '#skills', label: t('nav.expertise'), testId: 'nav-link-expertise' },
  { href: '#sobre', label: t('nav.experience'), testId: 'nav-link-experience' },
])
</script>

<template>
  <header
    class="hero-header fixed inset-x-0 top-0 z-30 w-full border-b border-glow/15 bg-bg/60 backdrop-blur-xl"
  >
    <div
      class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5 md:px-10 md:py-6"
    >
      <MaskReveal :delay="0">
        <a
          href="#"
          class="group inline-flex items-center gap-2.5"
          aria-current="page"
          data-testid="nav-wordmark"
        >
          <span
            class="h-1.5 w-1.5 shrink-0 rounded-full bg-glow shadow-[0_0_10px_color-mix(in_srgb,var(--color-glow)_80%,transparent)]"
            aria-hidden="true"
          />
          <span class="inline-flex min-w-0 items-baseline gap-0">
            <span
              class="font-display truncate text-[15px] font-semibold tracking-tight text-text max-md:max-w-[10.5rem] sm:max-w-none"
            >
              Marcílio Alano Filho
            </span>
            <span class="font-mono-label ml-2 hidden text-[10px] text-glow/80 md:inline">
              {{ t('nav.creativeDeveloper') }}
            </span>
          </span>
        </a>
      </MaskReveal>

      <nav class="hidden items-center gap-9 md:flex" :aria-label="t('nav.mainNav')">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          :data-testid="link.testId"
          class="font-mono-label text-[11px] text-text-muted transition-colors duration-300 hover:text-text"
        >
          {{ link.label }}
        </a>
      </nav>

      <div class="flex items-center gap-2 md:gap-3">
        <LocaleToggle />

        <a
          href="#contato"
          data-testid="nav-cta-button-mobile"
          class="group relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-glow/30 bg-bg/40 transition-all duration-500 hover:border-glow/60 md:hidden"
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
            class="group relative hidden items-center gap-2 rounded-full border border-glow/30 bg-bg/40 px-4 py-2 font-mono-label text-[11px] text-text transition-all duration-500 hover:border-glow/60 md:inline-flex"
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
          class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-glow/25 text-text md:hidden"
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
      class="border-t border-glow/15 bg-bg/95 px-6 py-4 backdrop-blur-xl md:hidden"
    >
      <ul class="flex flex-col gap-3">
        <li v-for="link in navLinks" :key="link.href">
          <a
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
