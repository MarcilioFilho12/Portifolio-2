import { MOVES } from './constants'
import type { Rng } from './rng'
import type { Enemy, Move } from './types'

export type Outcome = 'win' | 'loss' | 'tie'

export function resolveClash(playerMove: Move, enemyMove: Move): Outcome {
  if (playerMove === enemyMove) return 'tie'
  if (
    (playerMove === 'rock' && enemyMove === 'scissors') ||
    (playerMove === 'paper' && enemyMove === 'rock') ||
    (playerMove === 'scissors' && enemyMove === 'paper')
  ) {
    return 'win'
  }
  return 'loss'
}

export function getEnemyMove(enemy: Enemy, turnCount: number, rng: Rng): Move {
  switch (enemy.archetype) {
    case 'BRUTE': {
      const roll = rng.next()
      return roll < 0.6 ? 'rock' : roll < 0.8 ? 'paper' : 'scissors'
    }
    case 'TACTICIAN': {
      const roll = rng.next()
      return roll < 0.6 ? 'paper' : roll < 0.8 ? 'rock' : 'scissors'
    }
    case 'STALKER': {
      const roll = rng.next()
      return roll < 0.6 ? 'scissors' : roll < 0.8 ? 'paper' : 'rock'
    }
    case 'PREDICTABLE':
      return MOVES[turnCount % 3] ?? 'rock'
    case 'CHAOTIC':
    default:
      return MOVES[rng.int(MOVES.length)] ?? 'rock'
  }
}

export function nextLevelExp(level: number): number {
  return Math.floor(10 * Math.pow(Math.max(1, level), 1.5))
}
