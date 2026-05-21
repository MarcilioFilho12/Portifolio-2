import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { applyBrainMaterials } from './brainMaterials'
import { BRAIN_GLB_URLS, BRAIN_POSITION, BRAIN_TARGET_SIZE } from './heroConfig'

export function centerAndScale(object: THREE.Object3D): void {
  const box = new THREE.Box3().setFromObject(object)
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z)

  object.position.sub(center)
  if (maxDim > 0) {
    object.scale.setScalar(BRAIN_TARGET_SIZE / maxDim)
  }
}

export async function loadBrainModel(): Promise<{
  root: THREE.Group
  materials: THREE.MeshStandardMaterial[]
} | null> {
  const loader = new GLTFLoader()

  for (const url of BRAIN_GLB_URLS) {
    try {
      const gltf = await loader.loadAsync(url)
      const root = gltf.scene as THREE.Group
      root.name = 'brainRoot'

      centerAndScale(root)
      root.position.set(BRAIN_POSITION.x, BRAIN_POSITION.y, BRAIN_POSITION.z)

      const materials = applyBrainMaterials(root)
      return { root, materials }
    } catch (err) {
      console.warn(`[heroScene] Falha ao carregar ${url}:`, err)
    }
  }

  console.warn(
    '[heroScene] Nenhum GLB encontrado. Coloque brain-hero.glb ou brain_hologram.glb em public/media/',
  )
  return null
}

export function disposeBrain(root: THREE.Object3D): void {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (!mesh.isMesh) return
    mesh.geometry?.dispose()
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    mats.forEach((m) => m.dispose())
  })
}
