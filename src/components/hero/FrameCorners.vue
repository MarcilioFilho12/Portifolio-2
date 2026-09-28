<script setup lang="ts"></script>

<template>
  <div class="pointer-events-none absolute inset-0 z-[2]" aria-hidden="true">
    <span
      class="absolute top-3 left-3 h-4 w-4 border-t border-l border-glow/40 sm:top-6 sm:left-6 sm:h-6 sm:w-6"
    />
    <span
      class="absolute top-3 right-3 h-4 w-4 border-t border-r border-glow/40 sm:top-6 sm:right-6 sm:h-6 sm:w-6"
    />
    <span
      class="absolute bottom-3 left-3 h-4 w-4 border-b border-l border-glow/40 sm:bottom-6 sm:left-6 sm:h-6 sm:w-6"
    />
    <span
      class="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-glow/40 sm:bottom-6 sm:right-6 sm:h-6 sm:w-6"
    />
  </div>
</template>
