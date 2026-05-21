<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import SectionReveal from '@/components/ui/SectionReveal.vue'
import { CONTACT_CV, CONTACT_PRIMARY, CONTACT_SOCIAL } from '@/data/siteLinks'
import { useLocale } from '@/composables/useLocale'

const { t } = useLocale()
const externalRel = 'noopener noreferrer'

const contactPrimary = computed(() =>
  CONTACT_PRIMARY.map((link) => ({
    ...link,
    label: link.id === 'whatsapp' ? t('contact.whatsapp') : link.label,
  })),
)

const contactCv = computed(() =>
  CONTACT_CV.map((link) => ({
    ...link,
    label: link.id === 'cv-en' ? t('contact.cvEn') : link.id === 'cv-pt' ? t('contact.cvPt') : link.label,
  })),
)
</script>

<template>
  <section id="contato" class="px-6 py-24" aria-labelledby="contact-title">
    <SectionReveal
      class="mx-auto max-w-6xl rounded-3xl border border-glow/20 bg-bg/50 p-10 text-center backdrop-blur-xl md:p-16"
    >
      <p class="font-mono-label text-[11px] text-glow/80">{{ t('contact.label') }}</p>
      <h2 id="contact-title" class="mt-3 font-display text-3xl font-medium tracking-tight text-text md:text-4xl">
        {{ t('contact.title') }}
      </h2>
      <p class="mx-auto mt-4 max-w-md font-body text-text-muted">
        {{ t('contact.body') }}
      </p>

      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <BaseButton
          v-for="link in contactPrimary"
          :key="link.id"
          :href="link.href"
          :variant="link.variant ?? 'primary'"
          :target="link.external ? '_blank' : undefined"
          :rel="link.external ? externalRel : undefined"
          :data-testid="`contact-${link.id}`"
        >
          {{ link.label }}
        </BaseButton>
      </div>

      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <BaseButton
          v-for="link in CONTACT_SOCIAL"
          :key="link.id"
          :href="link.href"
          variant="ghost"
          target="_blank"
          :rel="externalRel"
          :data-testid="`contact-${link.id}`"
        >
          {{ link.label }}
        </BaseButton>
      </div>

      <div class="mt-6 flex flex-wrap justify-center gap-3 border-t border-glow/15 pt-8">
        <BaseButton
          v-for="link in contactCv"
          :key="link.id"
          :href="link.href"
          :download="link.download"
          variant="ghost"
          :data-testid="`contact-${link.id}`"
        >
          {{ link.label }} ↓
        </BaseButton>
      </div>
    </SectionReveal>
  </section>
</template>
