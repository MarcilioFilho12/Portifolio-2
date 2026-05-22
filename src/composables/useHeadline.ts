import { computed } from 'vue'
import { messages } from '@/i18n/messages'
import { useLocale } from '@/composables/useLocale'

export function useHeadline() {
  const { locale } = useLocale()

  const headline = computed(() => messages[locale.value].hero.headline)

  return { headline }
}
