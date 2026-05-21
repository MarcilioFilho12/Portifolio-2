import { onMounted, onUnmounted, ref } from 'vue'

export function useMediaQuery(query: string) {
  const matches = ref(false)
  let mq: MediaQueryList | null = null

  const update = () => {
    matches.value = mq?.matches ?? false
  }

  onMounted(() => {
    mq = window.matchMedia(query)
    update()
    mq.addEventListener('change', update)
  })

  onUnmounted(() => {
    mq?.removeEventListener('change', update)
  })

  return { matches }
}
