<script setup lang="ts">
import SplitWords from '@/components/ui/SplitWords.vue'

defineProps<{
  text: string
  as?: 'h1' | 'h2'
  id?: string
  class?: string
}>()
</script>

<template>
  <div class="heading-display relative inline-block max-w-full">
    <svg
      data-reveal="corner"
      class="heading-display__corner heading-display__corner--tl"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path d="M0 0V12H2V2H12V0H0Z" fill="currentColor" />
    </svg>
    <svg
      data-reveal="corner"
      class="heading-display__corner heading-display__corner--tr"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path d="M12 0V12H10V2H0V0H12Z" fill="currentColor" />
    </svg>
    <svg
      data-reveal="corner"
      class="heading-display__corner heading-display__corner--bl"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path d="M0 12V0H2V10H12V12H0Z" fill="currentColor" />
    </svg>
    <svg
      data-reveal="corner"
      class="heading-display__corner heading-display__corner--br"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path d="M12 12V0H10V10H0V12H12Z" fill="currentColor" />
    </svg>
    <SplitWords :text="text" :as="as ?? 'h1'" :id="id" :class="class" />
  </div>
</template>

<style scoped>
.heading-display {
  padding: 1.25rem 1.5rem;
}

.heading-display__corner {
  position: absolute;
  width: 10px;
  height: 10px;
  color: color-mix(in srgb, var(--color-glow) 55%, transparent);
}

.heading-display__corner--tl {
  top: 0;
  left: 0;
}
.heading-display__corner--tr {
  top: 0;
  right: 0;
}
.heading-display__corner--bl {
  bottom: 0;
  left: 0;
}
.heading-display__corner--br {
  bottom: 0;
  right: 0;
}
</style>
