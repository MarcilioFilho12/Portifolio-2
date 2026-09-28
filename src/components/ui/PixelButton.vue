<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

const PIXEL_SIZE = 3
const MIN_PIXEL_SIZE = 1
const MAX_PIXEL_SIZE = 32

const BAYER: ReadonlyArray<ReadonlyArray<number>> = [
  [16, 8, 14, 6],
  [5, 12, 2, 10],
  [13, 4, 15, 7],
  [1, 9, 3, 11],
]

const props = withDefaults(
  defineProps<{
    to: string
    ditherColor?: string
    ditherOpacity?: number
    ditherSize?: number
  }>(),
  {
    ditherColor: '#dddde6',
    ditherOpacity: 1,
    ditherSize: PIXEL_SIZE,
  },
)

const canvasRef = ref<HTMLCanvasElement | null>(null)
const colorOverride = ref<[number, number, number] | null>(null)
const pixelSize = ref(PIXEL_SIZE)

let frame = 0
let observer: ResizeObserver | null = null
let viewObserver: IntersectionObserver | null = null
let reduceQuery: MediaQueryList | null = null
let narrowQuery: MediaQueryList | null = null
let onScreen = true

function parseRgb(input: string): [number, number, number] {
  const match = input.match(/\d+(?:\.\d+)?/g)
  if (!match || match.length < 3) return [0, 0, 0]
  return [Number(match[0]), Number(match[1]), Number(match[2])]
}

function parseHex(input: string): [number, number, number] | null {
  const hex = input.trim().replace(/^#/, '')
  if (hex.length === 3) {
    const r = parseInt(hex[0] + hex[0], 16)
    const g = parseInt(hex[1] + hex[1], 16)
    const b = parseInt(hex[2] + hex[2], 16)
    if ([r, g, b].some(Number.isNaN)) return null
    return [r, g, b]
  }
  if (hex.length === 6) {
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    if ([r, g, b].some(Number.isNaN)) return null
    return [r, g, b]
  }
  return null
}

function clampSize(size: number) {
  return Math.max(MIN_PIXEL_SIZE, Math.min(MAX_PIXEL_SIZE, Math.round(size)))
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const step = pixelSize.value
  const width = Math.max(1, Math.floor(rect.width / step))
  const height = Math.max(1, Math.floor(rect.height / step))
  if (canvas.width !== width) canvas.width = width
  if (canvas.height !== height) canvas.height = height
}

function draw(timeSec: number) {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx) return

  const width = canvas.width
  const height = canvas.height
  const computed = getComputedStyle(canvas)
  const parent = canvas.parentElement
  const parentStyle = parent ? getComputedStyle(parent) : computed
  const [fr, fg, fb] = colorOverride.value ?? parseRgb(computed.color)
  const [br, bg, bb] = parseRgb(parentStyle.backgroundColor || 'rgb(7, 7, 13)')
  const angle = Math.sin(timeSec * 0.4545) * 0.112
  const dx = -Math.sin(angle)
  const dy = Math.cos(angle)
  const image = ctx.createImageData(width, height)
  const data = image.data
  const cx = width / 2
  const cy = height / 2
  const step = pixelSize.value

  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const posX = (px - cx) * step
      const posY = (py - cy) * step
      const value = Math.sin((posX * dx + posY * dy) * 0.048 - timeSec * 1.412) * 0.5 + 0.5
      const threshold = (BAYER[py & 3]?.[px & 3] ?? 0) / 17
      const on = value < threshold
      const index = (py * width + px) * 4
      if (on) {
        data[index] = fr
        data[index + 1] = fg
        data[index + 2] = fb
        data[index + 3] = 255
      } else {
        data[index] = br
        data[index + 1] = bg
        data[index + 2] = bb
        data[index + 3] = 255
      }
    }
  }

  ctx.putImageData(image, 0, 0)
}

function stop() {
  cancelAnimationFrame(frame)
  frame = 0
}

function wantsStillFrame() {
  const reduced = reduceQuery?.matches ?? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const narrow = narrowQuery?.matches ?? window.matchMedia('(max-width: 768px)').matches
  return reduced || narrow || !onScreen || document.hidden
}

function loop(start: number) {
  const tick = (now: number) => {
    if (wantsStillFrame()) {
      frame = 0
      draw(0)
      return
    }
    draw((now - start) / 1000)
    frame = requestAnimationFrame(tick)
  }
  frame = requestAnimationFrame(tick)
}

function paint() {
  resize()
  stop()
  if (wantsStillFrame()) {
    draw(0)
    return
  }
  loop(performance.now())
}

function onMotionChange() {
  paint()
}

watch(
  () => props.ditherColor,
  (color) => {
    colorOverride.value = color ? parseHex(color) : null
  },
  { immediate: true },
)

watch(
  () => props.ditherSize,
  (size) => {
    pixelSize.value = clampSize(size)
    resize()
  },
  { immediate: true },
)

onMounted(() => {
  reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  narrowQuery = window.matchMedia('(max-width: 768px)')
  reduceQuery.addEventListener('change', onMotionChange)
  narrowQuery.addEventListener('change', onMotionChange)
  document.addEventListener('visibilitychange', onMotionChange)
  const canvas = canvasRef.value
  if (canvas) {
    observer = new ResizeObserver(resize)
    observer.observe(canvas)
    viewObserver = new IntersectionObserver(([entry]) => {
      onScreen = !!entry?.isIntersecting
      paint()
    })
    viewObserver.observe(canvas)
  }
  paint()
})

onUnmounted(() => {
  stop()
  observer?.disconnect()
  viewObserver?.disconnect()
  reduceQuery?.removeEventListener('change', onMotionChange)
  narrowQuery?.removeEventListener('change', onMotionChange)
  document.removeEventListener('visibilitychange', onMotionChange)
})
</script>

<template>
  <RouterLink :to="to" class="dither-btn">
    <canvas
      ref="canvasRef"
      class="dither-btn__field"
      aria-hidden="true"
      :style="{ opacity: ditherOpacity }"
    />
    <span class="dither-btn__label"><slot /></span>
  </RouterLink>
</template>

<style scoped>
.dither-btn {
  position: relative;
  display: inline-flex;
  height: 32px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid var(--color-text);
  border-radius: 6px;
  background: #101018;
  padding: 0 14px;
  color: var(--color-text);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  line-height: 1;
  text-decoration: none;
  text-transform: uppercase;
  transition: transform 180ms cubic-bezier(0.32, 0.72, 0, 1);
}

.dither-btn:hover {
  border-color: var(--color-glow);
}

.dither-btn:active {
  transform: translateY(1px) scale(0.99);
}

.dither-btn:focus-visible {
  outline: 2px solid var(--color-glow);
  outline-offset: 3px;
}

.dither-btn__field {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  color: var(--color-text);
  image-rendering: pixelated;
}

.dither-btn__label {
  position: relative;
  z-index: 1;
  text-shadow:
    1px 1px 0 #101018,
    -1px 1px 0 #101018,
    1px -1px 0 #101018,
    -1px -1px 0 #101018,
    0 2px 0 #101018,
    0 -2px 0 #101018,
    2px 0 0 #101018,
    -2px 0 0 #101018;
}

@media (prefers-reduced-motion: reduce) {
  .dither-btn,
  .dither-btn:active {
    transition: none;
    transform: none;
  }
}
</style>
