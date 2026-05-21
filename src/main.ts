import { createApp } from 'vue'
import { createHead } from '@unhead/vue/client'
import Particles from '@tsparticles/vue3'
import type { Engine } from '@tsparticles/engine'
import { loadSlim } from '@tsparticles/slim'
import App from './App.vue'
import 'lenis/dist/lenis.css'
import './style.css'

const app = createApp(App)
app.use(createHead())
app.use(Particles, {
  init: async (engine: Engine) => {
    await loadSlim(engine)
  },
})
app.mount('#app')
