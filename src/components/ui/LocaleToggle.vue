<script setup lang="ts">
import type { Locale } from '@/i18n/messages'
import { useLocale } from '@/composables/useLocale'

const { locale, setLocale, t } = useLocale()

const options: { id: Locale; label: string }[] = [
  { id: 'pt', label: 'PT' },
  { id: 'en', label: 'EN' },
]
</script>

<template>
  <div
    class="locale-toggle inline-flex items-center rounded-full border border-glow/30 bg-bg/40 p-0.5 backdrop-blur-sm"
    role="group"
    :aria-label="t('nav.langLabel')"
    data-testid="locale-toggle"
  >
    <button
      v-for="opt in options"
      :key="opt.id"
      type="button"
      class="font-mono-label min-w-[2.25rem] rounded-full px-2.5 py-1.5 text-[10px] transition-all duration-300"
      :class="
        locale === opt.id
          ? 'bg-glow/25 text-text shadow-[0_0_12px_color-mix(in_srgb,var(--color-glow)_25%,transparent)]'
          : 'text-text-muted hover:text-text'
      "
      :aria-pressed="locale === opt.id"
      :data-testid="`locale-${opt.id}`"
      @click="setLocale(opt.id)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>
