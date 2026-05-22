import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import { useReducedMotion } from './useReducedMotion'
import { useMediaQuery } from './useMediaQuery'

export function useVideoOnScroll(
  sectionRef: Ref<HTMLElement | null>,
  videoRef: Ref<HTMLVideoElement | null>,
) {
  const isPlaying = ref(false)
  const { shouldReduceMotion } = useReducedMotion()
  const { matches: isMobile } = useMediaQuery('(max-width: 768px)')

  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const section = sectionRef.value
    const video = videoRef.value
    if (!section || !video) return

    const canPlayVideo = () => !shouldReduceMotion.value

    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return

        if (entry.isIntersecting && canPlayVideo()) {
          if (isMobile.value) {
            video.playbackRate = 0.85
          }
          void video.play().then(() => {
            isPlaying.value = true
          }).catch(() => {
            isPlaying.value = false
          })
        } else {
          video.pause()
          isPlaying.value = false
        }
      },
      { threshold: isMobile.value ? 0.2 : 0.35 },
    )

    observer.observe(section)
  })

  onUnmounted(() => {
    observer?.disconnect()
    videoRef.value?.pause()
  })

  return { isPlaying, shouldReduceMotion, isMobile }
}
