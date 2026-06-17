import { computed } from 'vue'
import { projects as baseProjects, type Project } from '@/data/projects'
import { useLocale } from '@/composables/useLocale'

const LOCALIZED_PROJECTS: Record<string, string> = {
  'passo-a-passo': 'passoAPasso',
  soumed: 'soumed',
  chamateria: 'chamateria',
}

export function useProjects() {
  const { locale, t } = useLocale()

  const projects = computed<Project[]>(() =>
    baseProjects.map((p) => {
      const i18nKey = LOCALIZED_PROJECTS[p.id]
      if (!i18nKey) return p

      return {
        ...p,
        category: t(`projects.${i18nKey}.category`),
        description: t(`projects.${i18nKey}.description`),
        imageAlt: t(`projects.${i18nKey}.imageAlt`),
      }
    }),
  )

  return { projects, locale }
}
