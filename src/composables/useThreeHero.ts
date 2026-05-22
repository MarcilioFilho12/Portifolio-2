import { onMounted, onUnmounted, type Ref } from 'vue'
import type { HeroSceneHandle } from '@/three/heroScene'
import { useReducedMotion } from './useReducedMotion'

export function useThreeHero(containerRef: Ref<HTMLElement | null>) {
  const { shouldReduceMotion } = useReducedMotion()

  let handle: HeroSceneHandle | null = null
  let heroEl: HTMLElement | null = null
  let onTouchMove: ((e: TouchEvent) => void) | null = null

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
    if (!el || shouldReduceMotion.value) return

    const mobile = window.matchMedia('(max-width: 768px)').matches

    const { createHeroScene } = await import('@/three/heroScene')
    handle = createHeroScene(el, {
      lite: mobile,
      autoRotate: mobile,
    })

    heroEl = document.getElementById('hero')

    if (!mobile) {
      heroEl?.addEventListener('wheel', onWheel, { passive: false })
      window.addEventListener('pointermove', onPointerMove, { passive: true })
    } else {
      onTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0]
        if (!touch || !handle) return
        const nx = (touch.clientX / window.innerWidth) * 2 - 1
        const ny = (touch.clientY / window.innerHeight) * 2 - 1
        handle.setPointer(nx, ny)
      }
      heroEl?.addEventListener('touchmove', onTouchMove, { passive: true })
    }

    window.addEventListener('resize', onResize, { passive: true })
  })

  onUnmounted(() => {
    if (onTouchMove) heroEl?.removeEventListener('touchmove', onTouchMove)
    onTouchMove = null
    heroEl?.removeEventListener('wheel', onWheel)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('resize', onResize)
    handle?.dispose()
    handle = null
    heroEl = null
  })
}
