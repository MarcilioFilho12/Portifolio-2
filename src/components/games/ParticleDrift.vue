<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useLowPower } from '@/composables/useLowPower'
import { useReducedMotion } from '@/composables/useReducedMotion'

const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*()'.split('')
const LINK = 120
const PROXIMITY = 180

type DriftNode = { x: number; y: number; vy: number; char: string }
type Beam = { x: number; y: number; length: number; speed: number; opacity: number }

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { shouldReduceMotion } = useReducedMotion()
const { isLowPower } = useLowPower()

let nodes: DriftNode[] = []
let beams: Beam[] = []
let frame = 0
let width = 0
let height = 0
let context: CanvasRenderingContext2D | null = null
let observer: ResizeObserver | null = null
const mouse = { x: -1000, y: -1000 }

function scaleCount(base: number, minimum: number) {
  const density = isLowPower.value ? 0.4 : 1
  return Math.max(minimum, Math.round(base * density))
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas || !context) return
  const rect = canvas.getBoundingClientRect()
  width = rect.width
  height = rect.height
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const nextWidth = Math.max(1, Math.floor(width * dpr))
  const nextHeight = Math.max(1, Math.floor(height * dpr))
  if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
    canvas.width = nextWidth
    canvas.height = nextHeight
  }
  context.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function seed() {
  nodes = Array.from({ length: scaleCount(90, 12) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vy: Math.random() * 0.4 + 0.1,
    char: CHARS[Math.floor(Math.random() * CHARS.length)] ?? '0',
  }))
  beams = Array.from({ length: scaleCount(25, 4) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    length: Math.random() * 100 + 50,
    speed: Math.random() * 6 + 3,
    opacity: Math.random() * 0.5 + 0.3,
  }))
}

function draw(frozen: boolean) {
  if (!context || width === 0 || height === 0) return
  const ctx = context
  ctx.clearRect(0, 0, width, height)

  for (const beam of beams) {
    if (!frozen) {
      beam.y -= beam.speed
      if (beam.y + beam.length < 0) {
        beam.y = height + 100
        beam.x = Math.random() * width
      }
    }
    const gradient = ctx.createLinearGradient(beam.x, beam.y, beam.x, beam.y + beam.length)
    gradient.addColorStop(0, `rgba(96, 165, 250, ${beam.opacity})`)
    gradient.addColorStop(1, 'transparent')
    ctx.strokeStyle = gradient
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(beam.x, beam.y)
    ctx.lineTo(beam.x, beam.y + beam.length)
    ctx.stroke()
  }

  ctx.font = '12px "Geist Mono", ui-monospace, monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.lineWidth = 0.5

  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i]
    if (!a) continue
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j]
      if (!b) continue
      const distance = Math.hypot(a.x - b.x, a.y - b.y)
      if (distance >= LINK) continue
      ctx.strokeStyle = `rgba(156, 163, 175, ${0.15 * (1 - distance / LINK)})`
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    }
  }

  for (const node of nodes) {
    if (!frozen) {
      node.y += node.vy
      if (node.y > height + 20) {
        node.y = -20
        node.x = Math.random() * width
      }
    }

    const distance = Math.hypot(mouse.x - node.x, mouse.y - node.y)
    if (!frozen && (distance < PROXIMITY || Math.random() > 0.98)) {
      node.char = CHARS[Math.floor(Math.random() * CHARS.length)] ?? node.char
    }

    if (distance < PROXIMITY) {
      ctx.strokeStyle = `rgba(96, 165, 250, ${0.5 * (1 - distance / PROXIMITY)})`
      ctx.beginPath()
      ctx.moveTo(node.x, node.y)
      ctx.lineTo(mouse.x, mouse.y)
      ctx.stroke()
    }

    ctx.fillStyle = distance < PROXIMITY ? '#60A5FA' : 'rgba(156, 163, 175, 0.4)'
    ctx.fillText(node.char, node.x, node.y)
  }
}

function tick() {
  draw(false)
  frame = window.requestAnimationFrame(tick)
}

function stop() {
  window.cancelAnimationFrame(frame)
  frame = 0
}

function paint() {
  resize()
  if (width < 2 || height < 2) return
  seed()
  stop()
  if (shouldReduceMotion.value || document.hidden) {
    draw(true)
    return
  }
  tick()
}

function onResize() {
  const previous = { width, height }
  resize()
  if (width < 2 || height < 2) return
  if (nodes.length === 0 || Math.abs(previous.width - width) > 40 || Math.abs(previous.height - height) > 40) {
    seed()
  }
  if (shouldReduceMotion.value || document.hidden) draw(true)
}

function onPointer(event: PointerEvent) {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  mouse.x = event.clientX - rect.left
  mouse.y = event.clientY - rect.top
}

function onLeave() {
  mouse.x = -1000
  mouse.y = -1000
}

function onVisibility() {
  if (document.hidden) {
    stop()
    return
  }
  if (!shouldReduceMotion.value && frame === 0) tick()
}

watch([shouldReduceMotion, isLowPower], () => paint())

onMounted(() => {
  const canvas = canvasRef.value
  context = canvas?.getContext('2d') ?? null
  if (canvas) {
    observer = new ResizeObserver(onResize)
    observer.observe(canvas)
  }
  paint()
  window.addEventListener('pointermove', onPointer)
  document.addEventListener('pointerleave', onLeave)
  document.addEventListener('visibilitychange', onVisibility)
})

onUnmounted(() => {
  stop()
  observer?.disconnect()
  window.removeEventListener('pointermove', onPointer)
  document.removeEventListener('pointerleave', onLeave)
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<template>
  <canvas ref="canvasRef" class="particle-drift" aria-hidden="true" />
</template>

<style scoped>
.particle-drift {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
