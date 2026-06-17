import { onMounted, onUnmounted, watch, type ComputedRef, type Ref } from 'vue'
import { gsap, registerGsap } from '@/composables/useGsap'
import { playHeroEntrance } from '@/animations/heroEntrance'
import { useLowPower } from './useLowPower'
import { useReducedMotion } from './useReducedMotion'

const INTRO_KEY = 'portfolio-intro-seen'
const FALLBACK_MS = 3200
const FALLBACK_MS_LOW_POWER = 900

const introSeenOnLoad =
  typeof sessionStorage !== 'undefined' && !!sessionStorage.getItem(INTRO_KEY)

export function useHeroEntrance(
  rootRef: Ref<HTMLElement | null>,
  entranceReady: Ref<boolean> | ComputedRef<boolean>,
  readyRef?: Ref<boolean>,
) {
  const { shouldReduceMotion } = useReducedMotion()
  const { isLowPower } = useLowPower()
  let played = false
  let fallbackTimer: ReturnType<typeof setTimeout> | null = null

  const shouldSkipMotion = () =>
    shouldReduceMotion.value || isLowPower.value || introSeenOnLoad

  const revealVisible = (root: HTMLElement) => {
    root.classList.add('is-ready')
    if (readyRef) readyRef.value = true
    clearPendingState(root)
  }

  const setInitialState = (root: HTMLElement) => {
    if (shouldSkipMotion()) return
    registerGsap()
    gsap.set(root.querySelectorAll('.split-word'), { yPercent: 110, opacity: 0 })
    gsap.set(root.querySelector('[data-reveal="subhead"]'), { opacity: 0, y: 16 })
    gsap.set(root.querySelectorAll('[data-reveal="cta"]'), { opacity: 0, y: 20 })
    gsap.set(root.querySelector('[data-reveal="discover"]'), { opacity: 0, y: 8 })
    gsap.set(root.querySelector('[data-reveal="meta"]'), { opacity: 0, y: -8 })
    gsap.set(root.querySelector('[data-reveal="footer"]'), { opacity: 0, y: 12 })
  }

  const clearPendingState = (root: HTMLElement) => {
    root.querySelectorAll<HTMLElement>('[data-reveal="mask"]').forEach((el) => {
      el.style.clipPath = 'none'
    })
    root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      el.style.opacity = ''
      el.style.transform = ''
    })
    root.querySelectorAll<HTMLElement>('.hero-headline .split-word-wrap').forEach((el) => {
      el.style.overflow = 'visible'
      el.style.paddingTop = ''
      el.style.paddingBottom = ''
      el.style.marginBottom = ''
    })
    gsap.set(root.querySelectorAll('.split-word'), { clearProps: 'all' })
  }

  const run = () => {
    if (played || !entranceReady.value) return
    const root = rootRef.value
    if (!root) return
    played = true

    if (fallbackTimer) {
      clearTimeout(fallbackTimer)
      fallbackTimer = null
    }

    if (shouldSkipMotion()) {
      revealVisible(root)
      return
    }

    setInitialState(root)
    playHeroEntrance(root, () => revealVisible(root))
  }

  const scheduleFallback = () => {
    if (fallbackTimer) clearTimeout(fallbackTimer)
    const delay = isLowPower.value ? FALLBACK_MS_LOW_POWER : FALLBACK_MS
    fallbackTimer = setTimeout(() => {
      const root = rootRef.value
      if (!root || played) return
      played = true
      revealVisible(root)
    }, delay)
  }

  onMounted(() => {
    const root = rootRef.value
    if (root && (shouldSkipMotion() || entranceReady.value)) {
      if (shouldSkipMotion()) {
        revealVisible(root)
        played = true
      } else {
        run()
      }
    } else {
      scheduleFallback()
    }
  })

  watch(
    [entranceReady, rootRef, shouldReduceMotion, isLowPower],
    () => {
      const root = rootRef.value
      if (!root) return

      if (shouldSkipMotion() && !played) {
        played = true
        revealVisible(root)
        return
      }

      if (entranceReady.value) run()
    },
    { immediate: true },
  )

  onUnmounted(() => {
    if (fallbackTimer) clearTimeout(fallbackTimer)
  })
}

export { INTRO_KEY as HERO_INTRO_KEY }
