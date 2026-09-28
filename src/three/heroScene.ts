import * as THREE from 'three'
import {
  BRAIN_AUTO_ROTATE_SPEED,
  BRAIN_GLB_URLS,
  BRAIN_ROTATION_LERP,
  CAMERA,
  HERO_COLORS,
  MOBILE_PIXEL_RATIO_CAP,
  WHEEL_SENSITIVITY,
} from './heroConfig'
import { disposeBrain, loadBrainModel } from './loadBrainModel'
import { createStarfield, STARFIELD_PIXEL_RATIO_CAP } from './starfield'

export interface HeroSceneOptions {
  /** Menos partículas, sem antialias, pixel ratio menor */
  lite?: boolean
  /** Rotação contínua do cérebro (mobile) */
  autoRotate?: boolean
  /** GLB ausente — o chamador pode cair no fundo em CSS */
  onUnavailable?: () => void
  /** Lista de GLB. No celular, só o arquivo que existe. */
  modelUrls?: readonly string[]
}

export interface HeroSceneHandle {
  resize: () => void
  setPointer: (nx: number, ny: number) => void
  setWheelDelta: (delta: number) => void
  setRunning: (running: boolean) => void
  dispose: () => void
}

export function createHeroScene(
  container: HTMLElement,
  options: HeroSceneOptions = {},
): HeroSceneHandle {
  const { lite = false, autoRotate = false, onUnavailable, modelUrls = BRAIN_GLB_URLS } = options
  const frameGap = lite ? 34 : 0
  const width = container.clientWidth || window.innerWidth
  const height = container.clientHeight || window.innerHeight
  const pixelCap = lite ? MOBILE_PIXEL_RATIO_CAP : STARFIELD_PIXEL_RATIO_CAP

  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(HERO_COLORS.bg, CAMERA.fogDensity)

  const camera = new THREE.PerspectiveCamera(CAMERA.fov, width / height, 0.1, 120)
  camera.position.set(0, 0, CAMERA.z)

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: !lite,
    powerPreference: lite ? 'default' : 'high-performance',
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelCap))
  renderer.setClearColor(0x000000, 0)
  container.appendChild(renderer.domElement)

  const starfield = lite ? null : createStarfield(width, height)
  const points = starfield?.points ?? null
  if (points) scene.add(points)

  const brainHolder = new THREE.Group()
  brainHolder.renderOrder = 1
  scene.add(brainHolder)

  scene.add(new THREE.AmbientLight(HERO_COLORS.glow, lite ? 0.12 : 0.15))

  const keyLight = new THREE.DirectionalLight(HERO_COLORS.glow, lite ? 0.28 : 0.35)
  keyLight.position.set(5, 10, 16)
  scene.add(keyLight)

  let brainRoot: THREE.Group | null = null
  let brainOpacity = 0
  let brainRotationTarget = 0
  let brainRotationCurrent = 0
  let pointerX = 0
  let pointerY = 0
  let rafId = 0
  let alive = true
  let running = true
  let timeoutId = 0
  const clock = new THREE.Clock()

  const cancelLoop = () => {
    cancelAnimationFrame(rafId)
    window.clearTimeout(timeoutId)
    rafId = 0
    timeoutId = 0
  }

  const schedule = () => {
    if (!running || !alive) return
    if (frameGap) {
      timeoutId = window.setTimeout(() => {
        timeoutId = 0
        rafId = requestAnimationFrame(tick)
      }, frameGap)
      return
    }
    rafId = requestAnimationFrame(tick)
  }

  loadBrainModel(modelUrls).then((result) => {
    if (!alive) {
      if (result) disposeBrain(result.root)
      return
    }
    if (!result) {
      onUnavailable?.()
      return
    }
    brainRoot = result.root
    brainRoot.visible = false
    brainRoot.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (!mesh.isMesh) return
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      mats.forEach((m) => {
        const mat = m as THREE.MeshStandardMaterial
        mat.opacity = 0
        mat.transparent = true
      })
    })
    brainHolder.add(brainRoot)
  })

  const tick = () => {
    rafId = 0
    if (!running) return

    const delta = clock.getDelta()
    const t = clock.getElapsedTime()

    if (starfield && points) {
      starfield.setTime(t)
      points.rotation.y = t * 0.04 + pointerX * 0.12
      points.rotation.x = pointerY * 0.06
    }

    if (autoRotate) {
      brainRotationTarget += delta * BRAIN_AUTO_ROTATE_SPEED
    }

    brainRotationCurrent +=
      (brainRotationTarget - brainRotationCurrent) * BRAIN_ROTATION_LERP

    if (brainRoot) {
      const fadeStep = lite ? 0.035 : 0.02
      if (brainOpacity < 1) {
        brainOpacity = Math.min(1, brainOpacity + fadeStep)
        brainRoot.visible = true
        brainRoot.traverse((obj) => {
          const mesh = obj as THREE.Mesh
          if (!mesh.isMesh) return
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          mats.forEach((m) => {
            const mat = m as THREE.MeshStandardMaterial
            mat.opacity = brainOpacity
            mat.transparent = brainOpacity < 1
          })
        })
      }
      brainRoot.rotation.y = brainRotationCurrent
    }

    const parallax = lite ? 1.4 : 2
    camera.position.x += (pointerX * parallax - camera.position.x) * 0.05
    camera.position.y += (-pointerY * (parallax * 0.6) - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
    renderer.render(scene, camera)
    schedule()
  }

  tick()

  const resize = () => {
    const w = container.clientWidth || window.innerWidth
    const h = container.clientHeight || window.innerHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelCap))
    renderer.setSize(w, h)
  }

  const setRunning = (next: boolean) => {
    if (next === running) return
    running = next
    if (running) {
      clock.getDelta()
      if (!rafId && !timeoutId) schedule()
      return
    }
    cancelLoop()
  }

  const dispose = () => {
    alive = false
    running = false
    cancelLoop()
    if (brainRoot) {
      disposeBrain(brainRoot)
      brainHolder.remove(brainRoot)
      brainRoot = null
    }
    starfield?.dispose()
    renderer.dispose()
    if (renderer.domElement.parentElement === container) {
      container.removeChild(renderer.domElement)
    }
  }

  return {
    resize,
    setPointer: (nx: number, ny: number) => {
      pointerX = nx
      pointerY = ny
    },
    setWheelDelta: (delta: number) => {
      brainRotationTarget += delta * WHEEL_SENSITIVITY
    },
    setRunning,
    dispose,
  }
}
