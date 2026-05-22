import { computed, ref, watch } from 'vue'
import { messages, type Locale } from '@/i18n/messages'

const STORAGE_KEY = 'portfolio-locale'

function readStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'pt'
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'pt' || stored === 'en' ? stored : 'pt'
}

const locale = ref<Locale>(readStoredLocale())

function applyHtmlLang(value: Locale) {
  if (typeof document === 'undefined') return
  document.documentElement.lang = value === 'pt' ? 'pt-BR' : 'en'
}

applyHtmlLang(locale.value)

watch(locale, (value) => {
  localStorage.setItem(STORAGE_KEY, value)
  applyHtmlLang(value)
})

type MessageTree = (typeof messages)[Locale]

function resolvePath(tree: MessageTree, path: string): string {
  const value = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, tree)
  return typeof value === 'string' ? value : path
}

export function useLocale() {
  const dictionary = computed(() => messages[locale.value])

  const t = (path: string) => resolvePath(dictionary.value, path)

  const setLocale = (next: Locale) => {
    locale.value = next
  }

  const toggleLocale = () => {
    locale.value = locale.value === 'pt' ? 'en' : 'pt'
  }

  return {
    locale,
    setLocale,
    toggleLocale,
    t,
  }
}
