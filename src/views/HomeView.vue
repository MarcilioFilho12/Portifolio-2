<script setup lang="ts">
import { computed, ref } from 'vue'
import { useHead } from '@unhead/vue'
import SkipLink from '@/components/layout/SkipLink.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import IntroLoader from '@/components/hero/IntroLoader.vue'
import HeroSection from '@/components/hero/HeroSection.vue'
import CinematicScrollVideo from '@/components/cinematic/CinematicScrollVideo.vue'
import ProjectsSection from '@/components/projects/ProjectsSection.vue'
import SkillsSection from '@/components/sections/SkillsSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
import SiteBodyShell from '@/components/layout/SiteBodyShell.vue'
import { useLenis } from '@/composables/useLenis'
import { useLocale } from '@/composables/useLocale'

const INTRO_KEY = 'portfolio-intro-seen'
const entranceReady = ref(!!sessionStorage.getItem(INTRO_KEY))

useLenis()

function onIntroComplete() {
  entranceReady.value = true
}

const { locale, t } = useLocale()

const ogLocale = computed(() => (locale.value === 'pt' ? 'pt_BR' : 'en_US'))

useHead(() => ({
  title: t('meta.title'),
  meta: [
    { name: 'description', content: t('meta.description') },
    { property: 'og:title', content: t('meta.ogTitle') },
    { property: 'og:description', content: t('meta.ogDescription') },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: ogLocale.value },
  ],
}))
</script>

<template>
  <SkipLink />
  <IntroLoader @complete="onIntroComplete" />
  <main id="main">
    <HeroSection :entrance-ready="entranceReady" />
    <SiteBodyShell>
      <CinematicScrollVideo />
      <ProjectsSection />
      <SkillsSection />
      <AboutSection />
      <ContactSection />
      <AppFooter />
    </SiteBodyShell>
  </main>
</template>
