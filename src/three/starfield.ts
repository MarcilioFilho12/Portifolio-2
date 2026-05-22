import * as THREE from 'three'
import { HERO_COLORS } from './heroConfig'

export const STARFIELD_PIXEL_RATIO_CAP = 2.5

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aTwinkle;
  attribute float aPhase;
  uniform float uTime;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vTwinkle;
  varying float vTwinkleTier;

  void main() {
    vColor = aColor;
    vTwinkleTier = aTwinkle;

    float twinkle = 1.0;
    if (aTwinkle > 0.5) {
      float speed = aTwinkle > 1.5 ? 0.55 : 0.32;
      float wave = sin(uTime * speed + aPhase);
      float sparkle = pow(max(sin(uTime * (speed * 1.35) + aPhase * 2.3), 0.0), 4.0);
      float amp = aTwinkle > 1.5 ? 0.75 : 0.5;
      twinkle = 0.35 + amp * (wave * 0.5 + 0.5) + sparkle * (aTwinkle > 1.5 ? 1.2 : 0.55);
      twinkle = clamp(twinkle, 0.25, 2.2);
    } else {
      twinkle = 0.72 + 0.08 * sin(uTime * 0.1 + aPhase);
    }

    vTwinkle = twinkle;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float dist = max(-mvPosition.z, 0.1);
    float sizeMul = aTwinkle > 1.5 ? 1.55 : (aTwinkle > 0.5 ? 1.25 : 1.0);
    gl_PointSize = aSize * sizeMul * twinkle * (460.0 / dist);
    gl_PointSize = clamp(gl_PointSize, 1.0, 72.0);
    vAlpha = 0.5 + 0.5 * smoothstep(35.0, 8.0, dist);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vTwinkle;
  varying float vTwinkleTier;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    if (d > 0.5) discard;

    float core = smoothstep(0.2, 0.0, d);
    float halo = smoothstep(0.5, 0.06, d);
    float alpha = (core * 1.0 + halo * 0.45) * vAlpha;

    float brightness = 1.0;
    if (vTwinkleTier > 1.5) {
      brightness = 1.15 + 0.85 * vTwinkle;
      alpha *= vTwinkle * 1.15;
    } else if (vTwinkleTier > 0.5) {
      brightness = 0.95 + 0.65 * vTwinkle;
      alpha *= vTwinkle;
    } else {
      alpha *= vTwinkle * 0.85;
    }

    alpha = clamp(alpha, 0.0, 1.0);
    vec3 col = vColor * brightness;
    gl_FragColor = vec4(col, alpha);
  }
`

export interface StarfieldHandle {
  points: THREE.Points
  setTime: (t: number) => void
  dispose: () => void
}

export function createStarfield(
  width: number,
  height: number,
  options?: { lite?: boolean },
): StarfieldHandle {
  const density = options?.lite ? 1800 : 1100
  const cap = options?.lite ? 520 : 1100
  const particleCount = Math.min(cap, Math.floor((width * height) / density))
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)
  const twinkles = new Float32Array(particleCount)
  const phases = new Float32Array(particleCount)

  const palette = [
    new THREE.Color(HERO_COLORS.glow),
    new THREE.Color(HERO_COLORS.primary),
    new THREE.Color(HERO_COLORS.accent),
  ]

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    positions[i3] = (Math.random() - 0.5) * 55
    positions[i3 + 1] = (Math.random() - 0.5) * 35
    positions[i3 + 2] = (Math.random() - 0.5) * 40

    const c = palette[Math.floor(Math.random() * palette.length)]!
    colors[i3] = c.r
    colors[i3 + 1] = c.g
    colors[i3 + 2] = c.b

    phases[i] = Math.random() * Math.PI * 2

    const roll = Math.random()
    if (roll < 0.12) {
      twinkles[i] = 2
      sizes[i] = 3.5 + Math.random() * 5
    } else if (roll < 0.38) {
      twinkles[i] = 1
      sizes[i] = 2.4 + Math.random() * 4
    } else {
      twinkles[i] = 0
      sizes[i] = 1.6 + Math.random() * 2.8
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('aTwinkle', new THREE.BufferAttribute(twinkles, 1))
  geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
    },
  })

  const points = new THREE.Points(geometry, material)
  points.renderOrder = 0
  points.frustumCulled = false

  return {
    points,
    setTime: (t: number) => {
      material.uniforms.uTime!.value = t
    },
    dispose: () => {
      geometry.dispose()
      material.dispose()
    },
  }
}
