import { computed } from 'vue'
import { projects as baseProjects, type Project } from '@/data/projects'
import { useLocale } from '@/composables/useLocale'

export function useProjects() {
  const { locale, t } = useLocale()

  const projects = computed<Project[]>(() =>
    baseProjects.map((p) => {
      if (p.id === 'soumed') {
        return {
          ...p,
          category: t('projects.soumed.category'),
          description: t('projects.soumed.description'),
          imageAlt: t('projects.soumed.imageAlt'),
        }
      }
      if (p.id === 'chamateria') {
        return {
          ...p,
          category: t('projects.chamateria.category'),
          description: t('projects.chamateria.description'),
          imageAlt: t('projects.chamateria.imageAlt'),
        }
      }
      return p
    }),
  )

  return { projects, locale }
}
