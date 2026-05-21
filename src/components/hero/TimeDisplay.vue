<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import MaskReveal from '@/components/ui/MaskReveal.vue'

const hours = ref('00')
const minutes = ref('00')
const seconds = ref('00')
let timer: ReturnType<typeof setInterval> | null = null

const pad = (n: number) => String(n).padStart(2, '0')

const tick = () => {
  const now = new Date()
  hours.value = pad(now.getHours())
  minutes.value = pad(now.getMinutes())
  seconds.value = pad(now.getSeconds())
}

onMounted(() => {
  tick()
  timer = setInterval(tick, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="time-display text-right">
    <MaskReveal :delay="0.8" block>
      <p class="font-mono text-xs tabular-nums text-text">
        <span>{{ hours }}</span>:<span>{{ minutes }}</span>:<span>{{ seconds }}</span>
      </p>
    </MaskReveal>
    <div class="mt-2 flex flex-col gap-0.5 text-[10px] uppercase tracking-widest text-text-muted">
      <MaskReveal :delay="1">
        <span>BRT</span>
      </MaskReveal>
    </div>
  </div>
</template>
