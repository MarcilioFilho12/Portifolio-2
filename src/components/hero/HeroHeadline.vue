<script setup lang="ts">
import { useHeadline } from '@/composables/useHeadline'

const { headline } = useHeadline()
</script>

<template>
  <div class="hero-headline w-full text-left">
    <h1
      id="hero-title"
      class="hero-headline__title font-display font-light tracking-tighter text-text"
      data-testid="hero-headline"
    >
      <span
        data-reveal="split"
        class="hero-headline__brand split-heading block leading-[1.05] tracking-[-0.05em]"
      >
        <span class="split-word-wrap split-word-wrap--descender mr-[0.06em]">
          <span
            class="split-word inline-block font-extralight text-text/75 text-[clamp(2.5rem,9vw,6.75rem)] sm:text-[clamp(2.85rem,10vw,7.25rem)]"
          >{{ headline.brandWeb }}</span>
        </span>
        <span class="split-word-wrap split-word-wrap--descender">
          <span
            class="split-word inline-block font-medium text-glow text-[clamp(2.65rem,10vw,7.75rem)] sm:text-[clamp(3rem,11vw,8.5rem)] drop-shadow-[0_0_32px_color-mix(in_srgb,var(--color-glow)_30%,transparent)]"
          >{{ headline.brandDesign }}</span>
        </span>
      </span>

      <span
        data-reveal="split"
        class="hero-headline__lede split-heading mt-3 block font-light leading-[1.2] tracking-tight text-text/90 sm:mt-4 md:mt-5 text-[clamp(1.25rem,3.2vw,2.75rem)] md:text-[clamp(1.5rem,3.5vw,3.25rem)]"
      >
        <span
          v-for="(word, i) in headline.ledeWords"
          :key="`lede-${word}-${i}`"
          class="split-word-wrap mr-[0.22em]"
          :class="{ 'split-word-wrap--italic': word === headline.ledeEmphasis }"
        >
          <span
            class="split-word inline-block"
            :class="word === headline.ledeEmphasis ? 'font-extralight italic text-text/80' : ''"
          >{{ word }}</span>
        </span>
      </span>

      <span
        data-reveal="split"
        class="hero-headline__tags split-heading mt-2 block font-light leading-[1.22] tracking-tight sm:mt-3 md:mt-4 text-[clamp(1.1rem,2.8vw,2.35rem)] md:text-[clamp(1.25rem,3vw,2.65rem)]"
      >
        <span
          v-for="(tag, i) in headline.tags"
          :key="`tag-${tag.word}-${i}`"
          class="split-word-wrap mr-[0.22em]"
          :class="{ 'split-word-wrap--italic': tag.italic }"
        >
          <span
            class="split-word inline-block"
            :class="[
              tag.glow ? 'text-glow' : '',
              tag.italic ? 'font-extralight italic text-text/80 text-[0.88em] sm:text-[0.9em]' : '',
            ]"
          >{{ tag.word }}</span>
        </span>
      </span>
    </h1>
  </div>
</template>

<style scoped>
.hero-headline__brand {
  letter-spacing: -0.03em;
}

.hero-headline__brand .split-word-wrap:last-child {
  margin-left: -0.02em;
}
</style>
