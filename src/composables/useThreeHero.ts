import { onMounted, onUnmounted, type Ref } from 'vue'
import type { HeroSceneHandle } from '@/three/heroScene'
import { useReducedMotion } from './useReducedMotion'
import { useMediaQuery } from './useMediaQuery'

export function useThreeHero(containerRef: Ref<HTMLElement | null>) {
  const { shouldReduceMotion } = useReducedMotion()
  const { matches: isMobile } = useMediaQuery('(max-width: 768px)')

  let handle: HeroSceneHandle | null = null
  let heroEl: HTMLElement | null = null

  const onPointerMove = (e: PointerEvent) => {
    if (!handle) return
    const nx = (e.clientX / window.innerWidth) * 2 - 1
    const ny = (e.clientY / window.innerHeight) * 2 - 1
    handle.setPointer(nx, ny)
  }

  const onWheel = (e: WheelEvent) => {
    if (!handle) return
    e.preventDefault()
    handle.setWheelDelta(e.deltaY)
  }

  const onResize = () => handle?.resize()

  onMounted(async () => {
    const el = containerRef.value
    const mobile = window.matchMedia('(max-width: 768px)').matches
    if (!el || shouldReduceMotion.value || mobile || isMobile.value) return

    const { createHeroScene } = await import('@/three/heroScene')
    handle = createHeroScene(el)

    heroEl = document.getElementById('hero')
    heroEl?.addEventListener('wheel', onWheel, { passive: false })

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
  })

  onUnmounted(() => {
    heroEl?.removeEventListener('wheel', onWheel)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('resize', onResize)
    handle?.dispose()
    handle = null
    heroEl = null
  })
}
