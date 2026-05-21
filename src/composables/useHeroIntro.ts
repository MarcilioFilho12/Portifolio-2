import { onMounted, type Ref } from 'vue'
import { gsap, registerGsap } from './useGsap'
import { useReducedMotion } from './useReducedMotion'

export function useHeroIntro(rootRef: Ref<HTMLElement | null>) {
  const { shouldReduceMotion } = useReducedMotion()

  onMounted(() => {
    const root = rootRef.value
    if (!root || shouldReduceMotion.value) return

    registerGsap()

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.from('[data-hero="eyebrow"]', { y: 24, opacity: 0, duration: 0.7 })
      .from('[data-hero="title"]', { y: 36, opacity: 0, duration: 0.9 }, '-=0.4')
      .from('[data-hero="subtitle"]', { y: 20, opacity: 0, duration: 0.7 }, '-=0.5')
      .from('[data-hero="cta"]', { y: 16, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.4')
      .from('[data-hero="scroll"]', { opacity: 0, duration: 0.5 }, '-=0.2')
  })
}
