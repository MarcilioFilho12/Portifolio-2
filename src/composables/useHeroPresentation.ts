import { onMounted, onUnmounted, ref } from 'vue'

const NARROW_QUERY = '(max-width: 768px)'
const REDUCE_QUERY = '(prefers-reduced-motion: reduce)'

type NetworkInformation = {
  saveData?: boolean
  addEventListener?: (type: string, listener: () => void) => void
  removeEventListener?: (type: string, listener: () => void) => void
}

export type HeroPresentation = 'full' | 'phone' | 'still'

function connection(): NetworkInformation | undefined {
  return (navigator as Navigator & { connection?: NetworkInformation }).connection
}

function deviceMemory(): number | undefined {
  return (navigator as Navigator & { deviceMemory?: number }).deviceMemory
}

/** Notebook completo, celular capaz em modo curto, ou estático quando o aparelho não aguenta WebGL. */
export function detectHeroPresentation(): HeroPresentation {
  if (typeof window === 'undefined') return 'full'
  if (window.matchMedia(REDUCE_QUERY).matches) return 'still'
  if (connection()?.saveData) return 'still'

  const memory = deviceMemory()
  if (memory !== undefined && memory <= 4) return 'still'
  if (window.matchMedia(NARROW_QUERY).matches) return 'phone'
  return 'full'
}

export function useHeroPresentation() {
  const presentation = ref<HeroPresentation>(detectHeroPresentation())

  let narrowQuery: MediaQueryList | null = null
  let reduceQuery: MediaQueryList | null = null

  const refresh = () => {
    presentation.value = detectHeroPresentation()
  }

  onMounted(() => {
    narrowQuery = window.matchMedia(NARROW_QUERY)
    reduceQuery = window.matchMedia(REDUCE_QUERY)
    narrowQuery.addEventListener('change', refresh)
    reduceQuery.addEventListener('change', refresh)
    connection()?.addEventListener?.('change', refresh)
    refresh()
  })

  onUnmounted(() => {
    narrowQuery?.removeEventListener('change', refresh)
    reduceQuery?.removeEventListener('change', refresh)
    connection()?.removeEventListener?.('change', refresh)
  })

  return { presentation }
}
