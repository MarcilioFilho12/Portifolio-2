/** URLs tentadas em ordem (não usar modelToUsed.glb em produção). */
export const BRAIN_GLB_URLS = ['/media/brain-hero.glb', '/media/brain_hologram.glb'] as const

export const BRAIN_TARGET_SIZE = 7.2

export const BRAIN_POSITION = { x: 0, y: 0.05, z: 0 } as const

export const WHEEL_SENSITIVITY = 0.002

export const BRAIN_ROTATION_LERP = 0.12

export const HERO_COLORS = {
  bg: 0x07070d,
  glow: 0x8282d5,
  primary: 0x3d3da4,
  accent: 0x6565c0,
} as const

export const CAMERA = {
  fov: 55,
  z: 28,
  fogDensity: 0.035,
} as const
