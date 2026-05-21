<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    text: string
    as?: 'h1' | 'h2' | 'p' | 'span'
    id?: string
    class?: string
  }>(),
  { as: 'h1' },
)

const words = computed(() => props.text.split(/\s+/).filter(Boolean))
</script>

<template>
  <component :is="as" :id="id" data-reveal="split" :class="class" class="split-heading">
    <span
      v-for="(word, i) in words"
      :key="`${word}-${i}`"
      class="split-word-wrap mr-[0.28em] inline-block overflow-hidden align-top"
      style="margin-bottom: -0.15em; padding-bottom: 0.15em"
    >
      <span class="split-word inline-block">{{ word }}</span>
    </span>
  </component>
</template>
