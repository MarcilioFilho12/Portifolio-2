<script setup lang="ts">
defineProps<{
  href: string
  label: string
}>()
</script>

<template>
  <a :href="href" class="secondary-link group inline-block">
    <span class="secondary-link__inner">
      <span class="secondary-link__text">{{ label }}</span>
    </span>
  </a>
</template>

<style scoped>
.secondary-link__inner {
  background-image: linear-gradient(currentColor, currentColor);
  background-repeat: no-repeat;
  background-size: 0% 1px;
  background-position: right bottom;
  transition: background-size 0.35s cubic-bezier(0.625, 0.05, 0, 1);
}

.group:hover .secondary-link__inner,
.group:focus-visible .secondary-link__inner {
  background-size: 100% 1px;
  background-position: left bottom;
}

.secondary-link__text {
  font-size: 0.875rem;
  letter-spacing: 0.02em;
  color: var(--color-text);
}
</style>
