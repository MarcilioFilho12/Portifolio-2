<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import ProjectCard from './ProjectCard.vue'
import SectionReveal from '@/components/ui/SectionReveal.vue'
import { gsap, registerGsap } from '@/composables/useGsap'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { useMediaQuery } from '@/composables/useMediaQuery'
import { useProjects } from '@/composables/useProjects'
import { useLocale } from '@/composables/useLocale'

const { projects } = useProjects()
const { t } = useLocale()

const gridRef = ref<HTMLElement | null>(null)
const { shouldReduceMotion } = useReducedMotion()
const { matches: isMobile } = useMediaQuery('(max-width: 768px)')
let cardsTween: gsap.core.Tween | null = null
let fallbackTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  const grid = gridRef.value
  if (!grid || shouldReduceMotion.value || isMobile.value) return

  registerGsap()

  cardsTween = gsap.from(grid.children, {
    y: 40,
    opacity: 0,
    duration: 0.75,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: grid,
      start: 'top 90%',
      once: true,
      invalidateOnRefresh: true,
    },
  })

  fallbackTimer = setTimeout(() => {
    gsap.set(grid.children, { clearProps: 'all' })
  }, 2800)
})

onUnmounted(() => {
  if (fallbackTimer) clearTimeout(fallbackTimer)
  cardsTween?.scrollTrigger?.kill()
  cardsTween?.kill()
})
</script>

<template>
  <section id="projetos" class="px-6 py-24" aria-labelledby="projects-title">
    <SectionReveal class="mx-auto max-w-6xl">
      <h2 id="projects-title" class="text-3xl font-semibold text-text md:text-4xl">
        {{ t('projects.title') }}
      </h2>
      <p class="mt-3 max-w-xl text-text-muted">
        {{ t('projects.subtitle') }}
      </p>
      <div ref="gridRef" class="mt-12 grid gap-6 sm:grid-cols-2">
        <ProjectCard v-for="p in projects" :key="p.id" :project="p" />
      </div>
    </SectionReveal>
  </section>
</template>
