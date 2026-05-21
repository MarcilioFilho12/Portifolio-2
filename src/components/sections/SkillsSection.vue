<script setup lang="ts">
import { skills } from '@/data/projects'
import SectionReveal from '@/components/ui/SectionReveal.vue'
import { useLocale } from '@/composables/useLocale'

const { t } = useLocale()
</script>

<template>
  <section
    id="skills"
    class="relative border-y border-glow/15 px-6 py-24 md:py-28"
    aria-labelledby="skills-title"
  >
    <SectionReveal class="mx-auto max-w-6xl">
      <p class="font-mono-label text-[11px] text-glow/80">{{ t('skills.label') }}</p>
      <h2 id="skills-title" class="mt-3 font-display text-3xl font-medium tracking-tight text-text md:text-4xl">
        {{ t('skills.title') }}
      </h2>
      <p class="mt-4 max-w-lg font-body text-sm leading-relaxed text-text-muted md:text-base">
        {{ t('skills.body') }}
      </p>

      <ul class="mt-10 flex flex-wrap gap-3" role="list">
        <li
          v-for="skill in skills"
          :key="skill"
          class="rounded-full border border-glow/25 bg-bg/50 px-4 py-2.5 text-sm text-text-muted shadow-[0_0_20px_color-mix(in_srgb,var(--color-glow)_8%,transparent)] backdrop-blur-sm transition-colors duration-300 hover:border-glow/50 hover:text-text"
        >
          {{ skill }}
        </li>
      </ul>
    </SectionReveal>
  </section>
</template>
