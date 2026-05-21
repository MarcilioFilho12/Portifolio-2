<script setup lang="ts"></script>

<template>
  <div class="pointer-events-none absolute inset-0 z-[2]" aria-hidden="true">
    <span
      class="absolute top-6 left-6 h-6 w-6 border-t border-l border-glow/40"
    />
    <span
      class="absolute top-6 right-6 h-6 w-6 border-t border-r border-glow/40"
    />
    <span
      class="absolute bottom-6 left-6 h-6 w-6 border-b border-l border-glow/40"
    />
    <span
      class="absolute bottom-6 right-6 h-6 w-6 border-b border-r border-glow/40"
    />
  </div>
</template>
