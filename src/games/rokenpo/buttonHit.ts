import type { Move } from '@/games/rokenpo/domain/types'

// Short cuts from a single hit of each source.
// button: Artninja, Freesound 846339.
// rock: posdesigndesom, Freesound 847838.
// scissors: sergeeo, Freesound 159565.
const BUTTON_SRC = '/media/audio/button-hit.mp3'
const MOVE_SRC: Partial<Record<Move, string>> = {
  rock: '/media/audio/hit-taijutsu.mp3',
  scissors: '/media/audio/hit-genjutsu.mp3',
}

function play(src: string, volume: number) {
  const audio = new Audio(src)
  audio.volume = volume
  void audio.play().catch(() => {})
}

export function primeButtonHit() {
  for (const src of [BUTTON_SRC, ...Object.values(MOVE_SRC)]) {
    const audio = new Audio(src)
    audio.preload = 'auto'
    audio.load()
  }
}

export function playButtonHit() {
  play(BUTTON_SRC, 0.7)
}

export function playMoveHit(move: Move) {
  const src = MOVE_SRC[move]
  if (!src) {
    playButtonHit()
    return
  }
  play(src, 0.65)
}
