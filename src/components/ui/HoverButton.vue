<script setup lang="ts">
import { computed, ref } from 'vue'
import { useReducedMotion } from '@/composables/useReducedMotion'

const props = withDefaults(
  defineProps<{
    href?: string
    variant?: 'primary' | 'ghost'
    target?: string
    rel?: string
    download?: string
    disabled?: boolean
    glowColor?: string
    backgroundColor?: string
    textColor?: string
    hoverTextColor?: string
  }>(),
  {
    variant: 'primary',
    disabled: false,
  },
)

const rootRef = ref<HTMLElement | null>(null)
const glowPosition = ref({ x: 50, y: 50 })
const isHovered = ref(false)
const { shouldReduceMotion } = useReducedMotion()

const palette = computed(() => {
  if (props.variant === 'primary') {
    return {
      bg: props.backgroundColor ?? 'var(--color-text)',
      color: props.textColor ?? 'var(--color-bg)',
      hoverColor: props.hoverTextColor ?? 'var(--color-bg)',
      glow:
        props.glowColor ??
        'color-mix(in srgb, var(--color-glow) 55%, var(--color-primary) 45%)',
      border: 'transparent',
    }
  }
  return {
    bg: props.backgroundColor ?? 'color-mix(in srgb, var(--color-bg) 70%, transparent)',
    color: props.textColor ?? 'var(--color-text)',
    hoverColor: props.hoverTextColor ?? 'var(--color-glow)',
    glow: props.glowColor ?? 'color-mix(in srgb, var(--color-glow) 75%, transparent)',
    border: 'color-mix(in srgb, var(--color-glow) 35%, transparent)',
  }
})

const showGlow = computed(
  () => isHovered.value && !props.disabled && !shouldReduceMotion.value,
)

const textStyle = computed(() => ({
  color: isHovered.value ? palette.value.hoverColor : palette.value.color,
}))

function handleMouseMove(e: MouseEvent) {
  const el = rootRef.value
  if (!el || props.disabled || shouldReduceMotion.value) return
  const rect = el.getBoundingClientRect()
  glowPosition.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  }
}

function onEnter() {
  if (!props.disabled) isHovered.value = true
}

function onLeave() {
  isHovered.value = false
  glowPosition.value = { x: 50, y: 50 }
}
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    ref="rootRef"
    :href="href"
    :target="target"
    :rel="rel"
    :download="download"
    :type="href ? undefined : 'button'"
    :disabled="href ? undefined : disabled"
    :aria-disabled="disabled || undefined"
    class="hover-btn group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border px-6 py-3 text-sm font-medium transition-[color,transform,border-color] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glow"
    :class="[
      disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-[1.02]',
      variant === 'ghost' ? 'backdrop-blur-sm' : '',
    ]"
    :style="{
      backgroundColor: palette.bg,
      borderColor: palette.border,
      ...textStyle,
    }"
    @mousemove="handleMouseMove"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @focus="onEnter"
    @blur="onLeave"
  >
    <span
      class="hover-btn__glow pointer-events-none absolute z-0 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-400 ease-out"
      :class="showGlow ? 'scale-[1.2] opacity-60' : 'scale-0 opacity-0'"
      :style="{
        left: `${glowPosition.x}px`,
        top: `${glowPosition.y}px`,
        background: `radial-gradient(circle, ${palette.glow} 12%, transparent 72%)`,
      }"
      aria-hidden="true"
    />

    <span class="relative z-10 inline-flex items-center justify-center gap-2">
      <slot />
    </span>
  </component>
</template>

<style scoped>
.hover-btn {
  --ease-luxury: cubic-bezier(0.625, 0.05, 0, 1);
}

.hover-btn__glow {
  transition-timing-function: var(--ease-luxury);
}

@media (prefers-reduced-motion: reduce) {
  .hover-btn:hover {
    transform: none;
  }
}
</style>
