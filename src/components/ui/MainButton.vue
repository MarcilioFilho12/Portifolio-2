<script setup lang="ts">
defineProps<{
  href: string
  label?: string
}>()
</script>

<template>
  <a :href="href" data-reveal="cta" class="main-btn group inline-flex">
    <span class="main-btn__bg" aria-hidden="true">
      <svg data-reveal="corner" class="main-btn__corner main-btn__corner--tl" viewBox="0 0 6 6" fill="none">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M3 0C4.657 0 6 1.343 6 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3Zm-1.507 1.167a.33.33 0 0 0-.33.33v3.014c0 .18.146.326.326.326h3.014c.18 0 .326-.146.326-.326V1.497a.33.33 0 0 0-.326-.33H1.493Z"
          fill="currentColor"
        />
      </svg>
      <svg data-reveal="corner" class="main-btn__corner main-btn__corner--tr" viewBox="0 0 6 6" fill="none">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M3 0C4.657 0 6 1.343 6 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3Zm-1.507 1.167a.33.33 0 0 0-.33.33v3.014c0 .18.146.326.326.326h3.014c.18 0 .326-.146.326-.326V1.497a.33.33 0 0 0-.326-.33H1.493Z"
          fill="currentColor"
        />
      </svg>
      <svg data-reveal="corner" class="main-btn__corner main-btn__corner--bl" viewBox="0 0 6 6" fill="none">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M3 0C4.657 0 6 1.343 6 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3Zm-1.507 1.167a.33.33 0 0 0-.33.33v3.014c0 .18.146.326.326.326h3.014c.18 0 .326-.146.326-.326V1.497a.33.33 0 0 0-.326-.33H1.493Z"
          fill="currentColor"
        />
      </svg>
      <svg data-reveal="corner" class="main-btn__corner main-btn__corner--br" viewBox="0 0 6 6" fill="none">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M3 0C4.657 0 6 1.343 6 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3Zm-1.507 1.167a.33.33 0 0 0-.33.33v3.014c0 .18.146.326.326.326h3.014c.18 0 .326-.146.326-.326V1.497a.33.33 0 0 0-.326-.33H1.493Z"
          fill="currentColor"
        />
      </svg>
    </span>
    <span class="main-btn__label">{{ label ?? 'Entrar em contato →' }}</span>
  </a>
</template>

<style scoped>
.main-btn {
  position: relative;
  padding: 1rem 1.75rem;
  border: 1px solid color-mix(in srgb, var(--color-glow) 35%, transparent);
  background: color-mix(in srgb, var(--color-primary) 25%, transparent);
  backdrop-filter: blur(12px);
  transition:
    border-color 0.3s ease,
    background 0.3s ease,
    transform 0.3s ease;
}

.main-btn:hover,
.main-btn:focus-visible {
  border-color: color-mix(in srgb, var(--color-accent) 55%, transparent);
  background: color-mix(in srgb, var(--color-accent) 35%, transparent);
  transform: translateY(-1px);
}

.main-btn__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  color: color-mix(in srgb, var(--color-glow) 70%, transparent);
}

.main-btn__corner {
  position: absolute;
  width: 6px;
  height: 6px;
}

.main-btn__corner--tl {
  top: 6px;
  left: 6px;
}
.main-btn__corner--tr {
  top: 6px;
  right: 6px;
}
.main-btn__corner--bl {
  bottom: 6px;
  left: 6px;
}
.main-btn__corner--br {
  bottom: 6px;
  right: 6px;
}

.main-btn__label {
  position: relative;
  z-index: 1;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.04em;
}
</style>
