<script setup lang="ts">
import { computed } from 'vue'
import ShamayimToggleSwitch from '@/components/ui/ShamayimToggleSwitch.vue'
import { useLocale } from '@/composables/useLocale'

const { locale, setLocale, t } = useLocale()

const isEnglish = computed({
  get: () => locale.value === 'en',
  set: (on: boolean) => setLocale(on ? 'en' : 'pt'),
})
</script>

<template>
  <div
    class="locale-toggle inline-flex items-center"
    role="group"
    :aria-label="t('nav.langLabel')"
    data-testid="locale-toggle"
  >
    <ShamayimToggleSwitch
      v-model="isEnglish"
      pattern="conic"
      off-label="PT"
      on-label="EN"
      data-testid="locale-shamayim-switch"
    />
  </div>
</template>
