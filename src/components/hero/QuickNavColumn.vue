<script setup lang="ts">
import MaskReveal from '@/components/ui/MaskReveal.vue'
import SecondaryLink from '@/components/ui/SecondaryLink.vue'

export interface NavLink {
  href: string
  label: string
}

defineProps<{
  label: string
  icon: 'triangle' | 'circle' | 'square'
  links: NavLink[]
  baseDelay?: number
}>()
</script>

<template>
  <div class="quicknav-col hidden lg:flex lg:flex-col lg:gap-4">
    <div class="flex items-center gap-2">
      <svg
        class="h-3.5 w-3.5 shrink-0 text-glow"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
      >
        <path v-if="icon === 'triangle'" d="M0 0L14 14H0V0Z" fill="currentColor" />
        <circle v-else-if="icon === 'circle'" cx="7" cy="7" r="7" fill="currentColor" />
        <rect v-else width="14" height="14" fill="currentColor" />
      </svg>
      <MaskReveal :delay="baseDelay ?? 0.2" block>
        <span class="text-xs uppercase tracking-[0.18em] text-text-muted">{{ label }}</span>
      </MaskReveal>
    </div>
    <div class="flex flex-col gap-2 pl-1">
      <MaskReveal
        v-for="(link, i) in links"
        :key="link.href"
        :delay="(baseDelay ?? 0.2) + 0.08 + i * 0.04"
        block
      >
        <SecondaryLink :href="link.href" :label="link.label" />
      </MaskReveal>
    </div>
  </div>
</template>
