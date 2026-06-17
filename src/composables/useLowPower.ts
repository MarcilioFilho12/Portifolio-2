import { computed, ref } from 'vue'

const MOBILE_QUERY = '(max-width: 768px)'

type NetworkInformation = {
  saveData?: boolean
  addEventListener?: (type: string, listener: () => void) => void
}

function getConnection(): NetworkInformation | undefined {
  return (navigator as Navigator & { connection?: NetworkInformation }).connection
}

function detectLowPower(): boolean {
  if (typeof window === 'undefined') return false

  if (window.matchMedia(MOBILE_QUERY).matches) return true

  if (getConnection()?.saveData) return true

  return false
}

const isLowPower = ref(detectLowPower())

if (typeof window !== 'undefined') {
  const mq = window.matchMedia(MOBILE_QUERY)
  const refresh = () => {
    isLowPower.value = detectLowPower()
  }
  mq.addEventListener('change', refresh)
  getConnection()?.addEventListener?.('change', refresh)
}

/** Mobile, save-data ou dispositivos fracos — experiência leve sem WebGL/vídeo/partículas. */
export function useLowPower() {
  return {
    isLowPower: computed(() => isLowPower.value),
  }
}
