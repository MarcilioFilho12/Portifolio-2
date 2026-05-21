import type { ISourceOptions } from '@tsparticles/engine'

export interface ExpertiseSparklesParams {
  density?: number
  speed?: number
  size?: number
}

const PALETTE = ['#8282d5', '#6565c0', '#3d3da4']

/** Partículas estilo Sparkles — paleta do portfólio (#07070d / glow / primary / accent) */
export function buildExpertiseSparklesOptions({
  density = 200,
  speed = 0.45,
  size = 1.2,
}: ExpertiseSparklesParams = {}): ISourceOptions {
  return {
    background: {
      color: { value: 'transparent' },
    },
    fullScreen: {
      enable: false,
      zIndex: 0,
    },
    fpsLimit: 60,
    detectRetina: true,
    particles: {
      color: {
        value: PALETTE,
      },
      move: {
        enable: true,
        direction: 'none',
        speed: {
          min: speed / 12,
          max: speed,
        },
        straight: false,
        outModes: { default: 'out' },
      },
      number: {
        value: density,
        density: {
          enable: true,
          width: 900,
          height: 400,
        },
      },
      opacity: {
        value: { min: 0.15, max: 0.75 },
        animation: {
          enable: true,
          sync: false,
          speed: 1.2,
        },
      },
      size: {
        value: { min: size * 0.4, max: size },
      },
      shape: {
        type: 'circle',
      },
    },
    interactivity: {
      detectsOn: 'canvas',
      events: {
        onHover: { enable: false },
        onClick: { enable: false },
      },
    },
  }
}
