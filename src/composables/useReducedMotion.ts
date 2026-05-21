import { onMounted, onUnmounted, ref } from 'vue'

export function useReducedMotion() {
  const shouldReduceMotion = ref(false)
  let mq: MediaQueryList | null = null

  const update = () => {
    shouldReduceMotion.value = mq?.matches ?? false
  }

  onMounted(() => {
    mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    update()
    mq.addEventListener('change', update)
  })

  onUnmounted(() => {
    mq?.removeEventListener('change', update)
  })

  return { shouldReduceMotion }
}
