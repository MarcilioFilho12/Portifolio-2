<script setup lang="ts">
import { useLocale } from '@/composables/useLocale'

const { t } = useLocale()
</script>

<template>
  <div data-reveal="discover" class="scroll-comet flex flex-col items-start gap-3">
    <span class="font-mono-label text-[10px] text-text-muted">{{ t('hero.scrollEnter') }}</span>
    <div class="scroll-comet__rail" aria-hidden="true" />
  </div>
</template>

<style scoped>
.scroll-comet__rail {
  position: relative;
  width: 1px;
  height: 6rem;
  background: color-mix(in srgb, var(--color-text-muted) 45%, transparent);
  overflow: hidden;
}

.scroll-comet__rail::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  width: 28px;
  height: 1.6rem;
  margin-left: -14px;
  background: color-mix(in srgb, var(--color-text) 92%, transparent);
  opacity: 0;
  animation: scroll-comet 2.8s cubic-bezier(0.7, 0.05, 0.13, 1) infinite;
  clip-path: polygon(18% 0%, 82% 0%, 82% 100%, 18% 100%);
}

@keyframes scroll-comet {
  0% {
    transform: translateY(-160%) scaleY(0.8);
    opacity: 0;
  }
  12% {
    opacity: 1;
  }
  65% {
    transform: translateY(320%) scaleY(1.8);
    clip-path: polygon(28% 0%, 72% 0%, 92% 20%, 84% 100%, 16% 100%, 8% 20%);
  }
  100% {
    transform: translateY(520%) scaleY(0.5);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .scroll-comet__rail::after {
    animation: none;
    opacity: 0.5;
    transform: translateY(50%);
  }
}
</style>
