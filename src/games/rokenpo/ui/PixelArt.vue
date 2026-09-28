<script setup lang="ts">
import { PALETTE } from '@/games/rokenpo/domain/constants'

defineProps<{
  data: number[][]
  size?: number
  animate?: 'float' | 'wobble' | 'pulse'
  title?: string
}>()
</script>

<template>
  <div
    v-if="data[0]"
    class="rokenpo-pixel"
    :class="animate ? `rk-${animate}` : undefined"
    :title="title"
    :style="{
      gridTemplateColumns: `repeat(${data[0].length}, 1fr)`,
      width: `${data[0].length * (size ?? 5)}px`,
      height: `${data.length * (size ?? 5)}px`,
    }"
  >
    <span
      v-for="(color, index) in data.flat()"
      :key="index"
      :style="{ backgroundColor: PALETTE[color] ?? 'transparent' }"
    />
  </div>
</template>
