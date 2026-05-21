import * as THREE from 'three'
import { HERO_COLORS } from './heroConfig'

const DARK_EMISSIVE_THRESHOLD = 0x111111

export function applyBrainMaterials(root: THREE.Object3D): THREE.MeshStandardMaterial[] {
  const tracked: THREE.MeshStandardMaterial[] = []

  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (!mesh.isMesh) return

    mesh.renderOrder = 2
    mesh.frustumCulled = true

    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    const next = mats.map((mat) => {
      const m = mat.clone() as THREE.MeshStandardMaterial

      if (m.emissive) {
        m.emissive = m.emissive.clone()
        if (m.emissive.getHex() < DARK_EMISSIVE_THRESHOLD) {
          m.emissive.setHex(HERO_COLORS.glow)
        }
        m.emissiveIntensity = Math.max(m.emissiveIntensity ?? 0, 0.35)
        tracked.push(m)
      }

      m.metalness = Math.min(m.metalness ?? 0.25, 0.4)
      m.roughness = Math.max(Math.min(m.roughness ?? 0.45, 0.65), 0.28)

      if (m.opacity !== undefined && m.opacity < 1) {
        m.transparent = true
      } else {
        m.opacity = 1
        m.transparent = false
      }

      m.depthWrite = true
      m.side = THREE.DoubleSide

      return m
    })

    mesh.material = next.length === 1 ? next[0]! : next
  })

  return tracked
}
