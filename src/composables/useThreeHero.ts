import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue'
import { PHONE_BRAIN_GLB_URLS } from '@/three/heroConfig'
import type { HeroSceneHandle } from '@/three/heroScene'
import { detectHeroPresentation } from './useHeroPresentation'
import { useLowPower } from './useLowPower'
import { useReducedMotion } from './useReducedMotion'

function webglOk() {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export function useThreeHero(containerRef: Ref<HTMLElement | null>) {
  const { shouldReduceMotion } = useReducedMotion()
  const { isLowPower } = useLowPower()
  const sceneActive = ref(false)

  let handle: HeroSceneHandle | null = null
  let heroEl: HTMLElement | null = null
  let observer: IntersectionObserver | null = null
  let generation = 0
  let closed = false
  let liteMode = false
  let heroVisible = true
  let scrolling = false
  let scrollTimer = 0

  const onPointer = (event: PointerEvent) => {
    if (!handle) return
    if (event.pointerType === 'touch' && event.buttons === 0) return
    handle.setPointer(
      (event.clientX / window.innerWidth) * 2 - 1,
      (event.clientY / window.innerHeight) * 2 - 1,
    )
  }

  const onPointerUp = (event: PointerEvent) => {
    if (event.pointerType !== 'touch') return
    handle?.setPointer(0, 0)
  }

  const onWheel = (event: WheelEvent) => {
    if (!handle || liteMode) return
    event.preventDefault()
    handle.setWheelDelta(event.deltaY)
  }

  const onResize = () => handle?.resize()

  const syncRunning = () => {
    handle?.setRunning(heroVisible && !document.hidden && !scrolling)
  }

  const onScroll = () => {
    if (!liteMode || !handle) return
    scrolling = true
    handle.setRunning(false)
    window.clearTimeout(scrollTimer)
    scrollTimer = window.setTimeout(() => {
      scrolling = false
      syncRunning()
    }, 150)
  }

  const onVisibility = () => syncRunning()

  function unbind() {
    heroEl?.removeEventListener('wheel', onWheel)
    window.removeEventListener('pointerdown', onPointer)
    window.removeEventListener('pointermove', onPointer)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', onPointerUp)
    window.removeEventListener('resize', onResize)
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('scroll', onScroll)
    window.clearTimeout(scrollTimer)
    scrolling = false
    observer?.disconnect()
    observer = null
  }

  function stopHandle() {
    unbind()
    handle?.dispose()
    handle = null
    heroEl = null
  }

  function bind(lite: boolean) {
    heroEl = document.getElementById('hero')
    if (!lite) {
      heroEl?.addEventListener('wheel', onWheel, { passive: false })
      window.addEventListener('pointerdown', onPointer, { passive: true })
      window.addEventListener('pointermove', onPointer, { passive: true })
      window.addEventListener('pointerup', onPointerUp, { passive: true })
      window.addEventListener('pointercancel', onPointerUp, { passive: true })
    } else {
      window.addEventListener('scroll', onScroll, { passive: true })
    }
    window.addEventListener('resize', onResize, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    if (!heroEl) return
    observer = new IntersectionObserver(
      ([entry]) => {
        heroVisible = !!entry?.isIntersecting
        syncRunning()
      },
      { threshold: 0.05 },
    )
    observer.observe(heroEl)
  }

  async function start() {
    const token = ++generation
    stopHandle()

    const el = containerRef.value
    const presentation = detectHeroPresentation()
    if (closed || !el || presentation === 'still' || !webglOk()) {
      sceneActive.value = false
      return
    }

    const lite = presentation === 'phone'
    liteMode = lite
    const { createHeroScene } = await import('@/three/heroScene')
    if (token !== generation || closed) return

    const container = containerRef.value
    if (!container) return

    handle = createHeroScene(container, {
      lite,
      autoRotate: lite,
      modelUrls: lite ? PHONE_BRAIN_GLB_URLS : undefined,
      onUnavailable: () => {
        if (token !== generation) return
        stopHandle()
        sceneActive.value = false
      },
    })
    sceneActive.value = true
    heroVisible = true
    bind(lite)
    syncRunning()
  }

  watch(isLowPower, () => {
    if (closed) return
    void start()
  })

  watch(shouldReduceMotion, () => {
    if (closed) return
    void start()
  })

  onMounted(() => {
    void start()
  })

  onUnmounted(() => {
    closed = true
    generation += 1
    stopHandle()
    sceneActive.value = false
  })

  return { sceneActive }
}
