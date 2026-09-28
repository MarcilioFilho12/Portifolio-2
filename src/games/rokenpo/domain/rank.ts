import type { RankId } from './types'

export function rankForFloor(floor: number): RankId {
  if (floor >= 20) return 'shadow'
  if (floor >= 15) return 'master'
  if (floor >= 10) return 'captain'
  if (floor >= 5) return 'veteran'
  return 'recruit'
}
