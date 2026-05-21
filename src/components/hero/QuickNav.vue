<script setup lang="ts">
import { ref } from 'vue'
import MaskReveal from '@/components/ui/MaskReveal.vue'
import QuickNavColumn from './QuickNavColumn.vue'
import TimeDisplay from './TimeDisplay.vue'
import ScrollComet from './ScrollComet.vue'

const menuOpen = ref(false)

const columns = [
  {
    label: 'Repertório',
    icon: 'triangle' as const,
    baseDelay: 0.28,
    links: [
      { href: '#projetos', label: 'Projetos' },
      { href: '#skills', label: 'Expertise' },
    ],
  },
  {
    label: 'Narrativa',
    icon: 'circle' as const,
    baseDelay: 0.36,
    links: [
      { href: '#sobre', label: 'Sobre' },
      { href: '#contato', label: 'Contato' },
    ],
  },
  {
    label: 'Conexão',
    icon: 'square' as const,
    baseDelay: 0.44,
    links: [
      { href: 'https://github.com/MarcilioFilho12', label: 'GitHub' },
      { href: 'https://www.linkedin.com/in/marcilio-filho1110/', label: 'LinkedIn' },
    ],
  },
]
</script>

<template>
  <nav class="quicknav relative z-20 w-full" aria-label="Navegação principal">
    <div
      class="mx-auto grid max-w-[1400px] grid-cols-2 items-start gap-6 px-6 pt-8 lg:grid-cols-[1fr_repeat(3,minmax(0,1fr))_auto_auto] lg:gap-4 lg:pt-10"
    >
      <!-- Logo -->
      <div class="col-span-1 flex items-start lg:col-span-1">
        <MaskReveal :delay="0">
          <a href="#" class="group inline-flex items-center gap-2" aria-current="page">
            <svg
              class="h-9 w-9 text-text transition-transform duration-300 group-hover:scale-105"
              viewBox="0 0 48 48"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="4"
                y="4"
                width="40"
                height="40"
                rx="8"
                stroke="currentColor"
                stroke-width="1"
                opacity="0.35"
              />
              <text
                x="24"
                y="30"
                text-anchor="middle"
                fill="currentColor"
                font-size="14"
                font-weight="600"
                font-family="Inter, sans-serif"
              >
                M
              </text>
            </svg>
            <span class="hidden text-sm font-medium tracking-wide text-text sm:inline">
              Alano
            </span>
          </a>
        </MaskReveal>
      </div>

      <QuickNavColumn
        v-for="col in columns"
        :key="col.label"
        v-bind="col"
      />

      <div class="hidden lg:block">
        <TimeDisplay />
      </div>

      <div class="hidden items-end justify-end lg:flex">
        <a href="#cinematic" aria-label="Rolar para a experiência cinematográfica">
          <ScrollComet />
        </a>
      </div>

      <!-- Mobile menu toggle -->
      <button
        type="button"
        class="col-start-2 row-start-1 justify-self-end rounded-lg border border-white/10 p-2 text-text lg:hidden"
        :aria-expanded="menuOpen"
        aria-controls="mobile-nav"
        @click="menuOpen = !menuOpen"
      >
        <span class="sr-only">Menu</span>
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

    <div
      v-show="menuOpen"
      id="mobile-nav"
      class="border-t border-white/10 bg-bg/95 px-6 py-4 backdrop-blur-xl lg:hidden"
    >
      <ul class="flex flex-col gap-3">
        <li v-for="col in columns" :key="col.label">
          <p class="mb-2 text-[10px] uppercase tracking-widest text-text-muted">{{ col.label }}</p>
          <ul class="flex flex-col gap-2 pl-2">
            <li v-for="link in col.links" :key="link.href">
              <a :href="link.href" class="text-sm text-text" @click="menuOpen = false">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>
