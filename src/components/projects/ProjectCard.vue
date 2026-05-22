<script setup lang="ts">
import type { Project } from '@/data/projects'
import GlassCard from '@/components/ui/GlassCard.vue'
import { useLocale } from '@/composables/useLocale'

defineProps<{ project: Project }>()

const { t } = useLocale()
</script>

<template>
  <article class="group">
    <component
      :is="project.href ? 'a' : 'div'"
      :href="project.href"
      :target="project.href ? '_blank' : undefined"
      :rel="project.href ? 'noopener noreferrer' : undefined"
      :data-testid="project.href ? `project-link-${project.id}` : undefined"
      class="block h-full rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-glow"
      :class="project.href ? 'transition-opacity hover:opacity-95' : ''"
    >
      <GlassCard class="h-full">
        <div
          class="mb-4 aspect-video overflow-hidden rounded-xl transition-transform duration-500 group-hover:scale-[1.02]"
          :class="
            project.image
              ? ''
              : 'bg-gradient-to-br from-primary/30 via-glow/20 to-accent/20'
          "
          :style="project.image && project.imageBg ? { backgroundColor: project.imageBg } : undefined"
        >
          <img
            v-if="project.image"
            :src="project.image"
            :alt="project.imageAlt ?? project.title"
            class="h-full w-full"
            :class="
              project.imageFit === 'cover'
                ? 'object-cover object-top'
                : 'object-contain px-10 py-8'
            "
            loading="lazy"
            decoding="async"
          />
        </div>
        <p class="text-xs uppercase tracking-wider text-glow">{{ project.category }}</p>
        <h3 class="mt-2 text-xl font-medium text-text">
          {{ project.title }}
          <span
            v-if="project.href"
            class="ml-1 inline-block text-glow opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden="true"
          >↗</span>
        </h3>
        <p class="mt-2 text-sm text-text-muted">{{ project.description }}</p>
        <ul class="mt-4 flex flex-wrap gap-2" :aria-label="t('common.techStack')">
          <li
            v-for="tag in project.stack"
            :key="tag"
            class="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-text-muted"
          >
            {{ tag }}
          </li>
        </ul>
      </GlassCard>
    </component>
  </article>
</template>
