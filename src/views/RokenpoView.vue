<script setup lang="ts">
import { useHead } from '@unhead/vue'
import RokenpoGame from '@/games/rokenpo/ui/RokenpoGame.vue'
import { useLocale } from '@/composables/useLocale'

const { t } = useLocale()

useHead(() => ({
  title: t('games.playTitle'),
  link: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=VT323&display=swap' }],
}))
</script>

<template>
  <main class="fixed inset-0 z-50 h-dvh bg-[#100c0a]">
    <RokenpoGame />
  </main>
</template>
