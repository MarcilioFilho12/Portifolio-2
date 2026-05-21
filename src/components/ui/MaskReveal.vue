<script setup lang="ts">
withDefaults(
  defineProps<{
    delay?: number
    block?: boolean
  }>(),
  { delay: 0, block: false },
)
</script>

<template>
  <div
    data-reveal="mask"
    :data-reveal-delay="delay"
    class="mask-reveal overflow-hidden"
    :class="block ? 'block w-full' : 'inline-block'"
    style="clip-path: inset(100% 0% 0% 0%)"
  >
    <slot />
  </div>
</template>
