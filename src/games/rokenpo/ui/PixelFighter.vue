<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    src: string
    frames?: number
    frameMs?: number
    aura?: string
    auraFrames?: number
    auraFrameMs?: number
    animated?: boolean
  }>(),
  { frames: 1, frameMs: 380, aura: undefined, auraFrames: 1, auraFrameMs: 130, animated: false },
)

// steps(n, jump-none) stops on every frame including the last, which is what
// lines background-position up with the sheet. Duration and timing stay inline
// so prefers-reduced-motion in rokenpo.css can still cancel animation-name.
function sheet(src: string, frames: number, frameMs: number) {
  return {
    backgroundImage: `url("${src}")`,
    backgroundSize: `${frames * 100}% 100%`,
    animationDuration: `${(frames * frameMs) / 1000}s`,
    animationTimingFunction: `steps(${frames}, jump-none)`,
  }
}

const body = computed(() => sheet(props.src, props.frames, props.frameMs))
const halo = computed(() =>
  props.aura ? sheet(props.aura, props.auraFrames, props.auraFrameMs) : null,
)
</script>

<template>
  <div class="rokenpo-pf" :class="{ 'is-animated': animated }">
    <span v-if="halo" class="rokenpo-pf-layer is-aura" :style="halo" aria-hidden="true" />
    <img v-if="frames === 1" class="rokenpo-pf-still" :src="src" alt="" />
    <span v-else class="rokenpo-pf-layer is-body" :style="body" aria-hidden="true" />
  </div>
</template>
