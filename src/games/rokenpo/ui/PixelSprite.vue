<script setup lang="ts">
// Plays a horizontal sprite sheet by sliding it inside a clipping box. The step
// count lands on each frame exactly, and translateX stays on the compositor, so
// animating costs no JavaScript and no layout.
withDefaults(
  defineProps<{
    src: string
    frames?: number
    duration?: number
    pingPong?: boolean
  }>(),
  { frames: 1, duration: 1, pingPong: false },
)
</script>

<template>
  <span class="rokenpo-sprite" :class="{ 'is-still': frames < 2 }">
    <img
      :src="src"
      alt=""
      :style="{
        width: `${frames * 100}%`,
        animationDuration: `${duration}s`,
        animationTimingFunction: `steps(${frames})`,
        animationDirection: pingPong ? 'alternate' : 'normal',
      }"
    />
  </span>
</template>
