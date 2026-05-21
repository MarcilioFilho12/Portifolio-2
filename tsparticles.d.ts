declare module '@tsparticles/vue3' {
  import type { App } from 'vue'
  import type { Engine } from '@tsparticles/engine'

  export interface ParticlesPluginOptions {
    init?: (engine: Engine) => Promise<void>
  }

  const Particles: {
    install(app: App, options?: ParticlesPluginOptions): void
  }

  export default Particles
}
