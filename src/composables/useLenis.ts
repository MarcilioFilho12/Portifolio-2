import Lenis from 'lenis'
import { onMounted, onUnmounted } from 'vue'
import { gsap, registerGsap, ScrollTrigger } from './useGsap'
import { useReducedMotion } from './useReducedMotion'

export function useLenis() {
  const { shouldReduceMotion } = useReducedMotion()
  let lenis: Lenis | null = null
  let tickerCb: ((time: number) => void) | null = null
  const onResize = () => ScrollTrigger.refresh()

  onMounted(() => {
    if (shouldReduceMotion.value) return

    registerGsap()
    document.documentElement.classList.add('lenis', 'lenis-smooth')
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    tickerCb = (time: number) => {
      lenis?.raf(time * 1000)
    }
    gsap.ticker.add(tickerCb)
    gsap.ticker.lagSmoothing(0)

    requestAnimationFrame(() => ScrollTrigger.refresh())
    window.addEventListener('resize', onResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', onResize)
    if (tickerCb) gsap.ticker.remove(tickerCb)
    document.documentElement.classList.remove('lenis', 'lenis-smooth')
    lenis?.destroy()
    lenis = null
  })
}
