export {}

declare module 'vue' {
  interface GlobalComponents {
    VueParticles: import('vue').DefineComponent<{
      id: string
      options?: import('@tsparticles/engine').ISourceOptions
    }>
  }
}
