export interface Rng {
  next(): number
  int(max: number): number
}

export const defaultRng: Rng = {
  next: () => Math.random(),
  int(max: number) {
    if (max <= 0) return 0
    return Math.floor(Math.random() * max)
  },
}

export function sequenceRng(values: number[]): Rng {
  let index = 0
  const next = () => {
    const value = values[index] ?? 0
    index += 1
    return value
  }
  return {
    next,
    int(max: number) {
      if (max <= 0) return 0
      return Math.min(max - 1, Math.floor(next() * max))
    },
  }
}
