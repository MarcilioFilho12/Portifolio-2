import * as THREE from 'three'
import { BRAIN_ROTATION_LERP, CAMERA, HERO_COLORS, WHEEL_SENSITIVITY } from './heroConfig'
import { disposeBrain, loadBrainModel } from './loadBrainModel'
import { createStarfield, STARFIELD_PIXEL_RATIO_CAP } from './starfield'

export interface HeroSceneHandle {
  resize: () => void
  setPointer: (nx: number, ny: number) => void
  setWheelDelta: (delta: number) => void
  dispose: () => void
}

export function createHeroScene(container: HTMLElement): HeroSceneHandle {
  const width = container.clientWidth || window.innerWidth
  const height = container.clientHeight || window.innerHeight

  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(HERO_COLORS.bg, CAMERA.fogDensity)

  const camera = new THREE.PerspectiveCamera(CAMERA.fov, width / height, 0.1, 120)
  camera.position.set(0, 0, CAMERA.z)

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, STARFIELD_PIXEL_RATIO_CAP))
  renderer.setClearColor(0x000000, 0)
  container.appendChild(renderer.domElement)

  const starfield = createStarfield(width, height)
  const points = starfield.points
  scene.add(points)

  const brainHolder = new THREE.Group()
  brainHolder.renderOrder = 1
  scene.add(brainHolder)

  scene.add(new THREE.AmbientLight(HERO_COLORS.glow, 0.15))

  const keyLight = new THREE.DirectionalLight(HERO_COLORS.glow, 0.35)
  keyLight.position.set(5, 10, 16)
  scene.add(keyLight)

  let brainRoot: THREE.Group | null = null
  let brainOpacity = 0
  let brainRotationTarget = 0
  let brainRotationCurrent = 0
  let pointerX = 0
  let pointerY = 0
  let rafId = 0
  const clock = new THREE.Clock()

  loadBrainModel().then((result) => {
    if (!result) return
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
    const t = clock.getElapsedTime()

    starfield.setTime(t)

    points.rotation.y = t * 0.04 + pointerX * 0.15
    points.rotation.x = pointerY * 0.08

    brainRotationCurrent +=
      (brainRotationTarget - brainRotationCurrent) * BRAIN_ROTATION_LERP

    if (brainRoot) {
      if (brainOpacity < 1) {
        brainOpacity = Math.min(1, brainOpacity + 0.02)
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

    camera.position.x += (pointerX * 2 - camera.position.x) * 0.05
    camera.position.y += (-pointerY * 1.2 - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
    renderer.render(scene, camera)
    rafId = requestAnimationFrame(tick)
  }

  tick()

  const resize = () => {
    const w = container.clientWidth || window.innerWidth
    const h = container.clientHeight || window.innerHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, STARFIELD_PIXEL_RATIO_CAP))
    renderer.setSize(w, h)
  }

  const dispose = () => {
    cancelAnimationFrame(rafId)
    if (brainRoot) {
      disposeBrain(brainRoot)
      brainHolder.remove(brainRoot)
      brainRoot = null
    }
    starfield.dispose()
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
    dispose,
  }
}
