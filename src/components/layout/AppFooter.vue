<script setup lang="ts">
import { SOCIAL } from '@/data/siteLinks'
import { useLocale } from '@/composables/useLocale'

const year = new Date().getFullYear()
const { t } = useLocale()

const footerLinks = [
  { label: 'GitHub', href: SOCIAL.github },
  { label: 'LinkedIn', href: SOCIAL.linkedin },
  { label: 'Behance', href: SOCIAL.behance },
] as const
</script>

<template>
  <footer class="relative border-t border-glow/15 py-10">
    <div
      class="mx-auto flex max-w-6xl flex-col gap-6 px-6 text-sm text-text-muted md:flex-row md:items-center md:justify-between"
    >
      <p>© {{ year }} Marcílio Alano Filho</p>

      <nav class="flex flex-wrap gap-4" :aria-label="t('footer.socialNav')">
        <a
          v-for="link in footerLinks"
          :key="link.href"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="font-mono-label text-[10px] text-glow/70 transition-colors hover:text-text"
        >
          {{ link.label }}
        </a>
      </nav>

      <p class="text-xs">{{ t('footer.tagline') }}</p>
    </div>
  </footer>
</template>
