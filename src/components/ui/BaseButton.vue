<script setup lang="ts">
import HoverButton from '@/components/ui/HoverButton.vue'

withDefaults(
  defineProps<{
    href?: string
    variant?: 'primary' | 'ghost'
    target?: string
    rel?: string
    download?: string
    disabled?: boolean
  }>(),
  { variant: 'primary', disabled: false },
)
</script>

<template>
  <HoverButton
    :href="href"
    :variant="variant"
    :target="target"
    :rel="rel"
    :download="download"
    :disabled="disabled"
  >
    <slot />
  </HoverButton>
</template>
