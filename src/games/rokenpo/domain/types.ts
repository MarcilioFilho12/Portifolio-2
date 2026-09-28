export type Move = 'rock' | 'paper' | 'scissors'

export enum ClassType {
  WARRIOR = 'Warrior',
  MAGE = 'Mage',
  ROGUE = 'Rogue',
  CLERIC = 'Cleric',
}

export type EnemyArchetype = 'BRUTE' | 'TACTICIAN' | 'STALKER' | 'CHAOTIC' | 'PREDICTABLE'

export type RuneTier = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'S+'

export const TERRITORIES = ['lacre', 'brasa', 'delta', 'veu', 'duna'] as const

export type Territory = (typeof TERRITORIES)[number]

export type RankId = 'recruit' | 'veteran' | 'captain' | 'master' | 'shadow'

export type GameView =
  | 'start'
  | 'territory'
  | 'class-select'
  | 'dungeon'
  | 'combat'
  | 'levelup'
  | 'campfire'
  | 'merchant'
  | 'gameover'

export type Phase = 'idle' | 'resolving'

export interface Ability {
  id: string
  name: string
  description: string
  cost: number
  effect: string
}

export interface Rune {
  id: string
  name: string
  description: string
  tier: RuneTier
  effect: string
}

export interface Player {
  class: ClassType
  hearts: number
  maxHearts: number
  energy: number
  maxEnergy: number
  armor: number
  shields: number
  maxShields: number
  gold: number
  runes: Rune[]
  level: number
  exp: number
  nextLevelExp: number
}

export interface Enemy {
  name: string
  type: 'monster' | 'miniboss' | 'megaboss'
  hearts: number
  maxHearts: number
  armor: number
  bleedTurns: number
  stunned: boolean
  archetype: EnemyArchetype
  difficulty: number
}

export type ClashOutcome = 'win' | 'loss' | 'tie'

export type ClashEffect =
  | { k: 'foe-hearts'; amount: number }
  | { k: 'hearts'; amount: number }
  | { k: 'shields'; amount: number }

export type LogLine =
  | { k: 'boot' }
  | {
      k: 'clash'
      outcome: ClashOutcome
      move: Move
      enemyMove: Move | null
      effects: ClashEffect[]
    }
  | { k: 'ability'; abilityId: string }
  | { k: 'reborn' }

export interface GameState {
  view: GameView
  phase: Phase
  player: Player | null
  currentEnemy: Enemy | null
  floor: number
  territory: Territory | null
  logs: LogLine[]
  levelUpChoices: Rune[]
  turnCount: number
  winStreak: number
  activeAbilityEffect: string | null
}
