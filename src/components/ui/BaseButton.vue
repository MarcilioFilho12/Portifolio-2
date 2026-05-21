<script setup lang="ts">
withDefaults(
  defineProps<{
    href?: string
    variant?: 'primary' | 'ghost'
    target?: string
    rel?: string
    download?: string
  }>(),
  { variant: 'primary' },
)
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :target="target"
    :rel="rel"
    :download="download"
    class="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glow"
    :class="
      variant === 'primary'
        ? 'bg-text text-bg hover:scale-[1.02] hover:bg-text/90'
        : 'border border-glow/30 bg-bg/40 text-text backdrop-blur-sm hover:border-glow/50 hover:bg-bg/60'
    "
  >
    <slot />
  </component>
</template>
