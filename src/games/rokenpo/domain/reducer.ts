import { BOSSES, CLASS_ABILITIES_LIST, ENEMY_POOLS, RUNES_POOL } from './constants'
import { defaultRng, type Rng } from './rng'
import { getEnemyMove, nextLevelExp, resolveClash } from './rules'
import {
  ClassType,
  TERRITORIES,
  type Ability,
  type ClashEffect,
  type Enemy,
  type EnemyArchetype,
  type GameState,
  type LogLine,
  type Move,
  type Player,
  type Rune,
  type Territory,
} from './types'

export interface Fx {
  shake: boolean
  flash: boolean
}

export interface ReduceResult {
  state: GameState
  fx: Fx
}

export type Action =
  | { type: 'begin' }
  | { type: 'select-territory'; territory: Territory }
  | { type: 'select-class'; classType: ClassType }
  | { type: 'spawn' }
  | { type: 'clash'; move: Move }
  | { type: 'ability'; abilityId: string }
  | { type: 'pick-rune'; runeId: string }
  | { type: 'skip-level' }
  | { type: 'campfire'; choice: 'heal' | 'shields' }
  | { type: 'continue' }
  | { type: 'unlock' }
  | { type: 'reset' }

const NO_FX: Fx = { shake: false, flash: false }
const FLOOR_ARCHETYPES: EnemyArchetype[] = ['BRUTE', 'TACTICIAN', 'STALKER']
const MOVES: Move[] = ['rock', 'paper', 'scissors']

function same(state: GameState): ReduceResult {
  return { state, fx: NO_FX }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function pushLog(logs: LogLine[], line: LogLine): LogLine[] {
  return [line, ...logs].slice(0, 5)
}

export function createPlayer(classType: ClassType): Player {
  return {
    class: classType,
    hearts: 3,
    maxHearts: 3,
    energy: 100,
    maxEnergy: 100,
    armor: classType === ClassType.WARRIOR ? 2 : 0,
    shields: 3,
    maxShields: 3,
    gold: 0,
    runes: [],
    level: 1,
    exp: 0,
    nextLevelExp: nextLevelExp(1),
  }
}

export function createInitialState(): GameState {
  return {
    view: 'start',
    phase: 'idle',
    player: null,
    currentEnemy: null,
    floor: 1,
    territory: null,
    logs: [{ k: 'boot' }],
    levelUpChoices: [],
    turnCount: 0,
    winStreak: 0,
    activeAbilityEffect: null,
  }
}

function boundPlayer(player: Player): Player {
  const maxHearts = Math.max(1, player.maxHearts)
  const maxEnergy = Math.max(1, player.maxEnergy)
  const maxShields = Math.max(0, player.maxShields)
  return {
    ...player,
    maxHearts,
    maxEnergy,
    maxShields,
    hearts: clamp(player.hearts, 0, maxHearts),
    energy: clamp(player.energy, 0, maxEnergy),
    shields: clamp(player.shields, 0, maxShields),
    armor: Math.max(0, player.armor),
    gold: Math.max(0, Math.floor(player.gold)),
    level: Math.max(1, Math.floor(player.level)),
    exp: Math.max(0, player.exp),
    nextLevelExp: Math.max(1, player.nextLevelExp),
    runes: player.runes.filter((rune, index, list) => list.findIndex((item) => item.id === rune.id) === index),
  }
}

function absorb(armor: number, damage: number): { armor: number; damage: number } {
  if (damage <= 0 || armor <= 0) return { armor, damage }
  const taken = Math.min(armor, damage)
  return { armor: armor - taken, damage: damage - taken }
}

function drawRunes(owned: Rune[], rng: Rng): Rune[] {
  const available = RUNES_POOL.filter((rune) => !owned.some((ownedRune) => ownedRune.id === rune.id))
  const selection: Rune[] = []
  for (let i = 0; i < 3; i += 1) {
    if (available.length === 0) break
    const picked = available.splice(rng.int(available.length), 1)[0]
    if (picked) selection.push(picked)
  }
  return selection
}

function advanceFloor(state: GameState, player: Player): GameState {
  const floor = state.floor + 1
  return {
    ...state,
    player: boundPlayer(player),
    currentEnemy: null,
    floor,
    levelUpChoices: [],
    phase: 'idle',
    activeAbilityEffect: null,
    view: floor % 3 === 0 ? 'campfire' : 'dungeon',
  }
}

function grantVictory(state: GameState, rng: Rng): GameState {
  const player = state.player
  if (!player) return state
  const gained: Player = {
    ...player,
    exp: player.exp + state.floor * 5,
    gold: player.gold + 10 + state.floor,
  }
  if (gained.exp >= gained.nextLevelExp) {
    return {
      ...state,
      player: boundPlayer(gained),
      currentEnemy: null,
      view: 'levelup',
      levelUpChoices: drawRunes(gained.runes, rng),
      phase: 'idle',
      activeAbilityEffect: null,
    }
  }
  return advanceFloor(state, gained)
}

function applyLevel(player: Player, rune: Rune | null): Player {
  const next: Player = {
    ...player,
    runes: rune ? [...player.runes, rune] : player.runes,
    level: player.level + 1,
    exp: player.exp - player.nextLevelExp,
  }
  next.nextLevelExp = nextLevelExp(next.level)
  if (rune?.effect === 'max_hp_2') {
    next.maxHearts += 2
    next.hearts += 2
  }
  if (next.exp < 0) next.exp = 0
  return boundPlayer(next)
}

function spawnEnemy(state: GameState, rng: Rng): ReduceResult {
  if (state.view !== 'dungeon' || !state.player || state.phase !== 'idle') return same(state)
  const rolled = FLOOR_ARCHETYPES[rng.int(FLOOR_ARCHETYPES.length)] ?? 'BRUTE'
  const boss = BOSSES[state.floor]
  const archetype = boss?.archetype ?? rolled
  const pool = ENEMY_POOLS[archetype] ?? ENEMY_POOLS.BRUTE
  const name = boss?.name ?? pool[rng.int(pool.length)] ?? 'Sombra'
  const hearts = boss ? 10 + state.floor : 3 + Math.floor(state.floor / 3)
  const enemy: Enemy = {
    name,
    type: boss ? (state.floor === 20 ? 'megaboss' : 'miniboss') : 'monster',
    hearts,
    maxHearts: hearts,
    armor: boss ? 5 : 0,
    bleedTurns: 0,
    stunned: false,
    archetype,
    difficulty: state.floor,
  }
  return {
    state: {
      ...state,
      currentEnemy: enemy,
      view: 'combat',
      turnCount: 0,
      activeAbilityEffect: null,
      phase: 'idle',
    },
    fx: NO_FX,
  }
}

function useAbility(state: GameState, abilityId: string, rng: Rng): ReduceResult {
  if (state.phase !== 'idle' || state.view !== 'combat' || !state.player || !state.currentEnemy) return same(state)
  const ability: Ability | undefined = CLASS_ABILITIES_LIST[state.player.class].find((item) => item.id === abilityId)
  if (!ability || state.player.energy < ability.cost) return same(state)

  let player: Player = { ...state.player, energy: state.player.energy - ability.cost }
  let enemy: Enemy = { ...state.currentEnemy }
  let active = state.activeAbilityEffect
  const logs = pushLog(state.logs, { k: 'ability', abilityId: ability.id })

  switch (ability.effect) {
    case 'warrior_guard':
      player = { ...player, armor: player.armor + 4 }
      break
    case 'mage_flare':
      enemy = { ...enemy, hearts: enemy.hearts - 3 }
      break
    case 'rogue_stealth':
      player = { ...player, shields: Math.min(player.maxShields, player.shields + 1) }
      break
    case 'cleric_transfuse':
      player = {
        ...player,
        hearts: Math.min(player.maxHearts, player.hearts + player.armor),
        armor: 0,
      }
      break
    case 'cleric_prayer':
      player = {
        ...player,
        hearts: Math.min(player.maxHearts, player.hearts + 1),
        shields: Math.min(player.maxShields, player.shields + 2),
      }
      break
    default:
      active = ability.effect
      break
  }

  player = boundPlayer(player)
  const next: GameState = {
    ...state,
    player,
    currentEnemy: enemy,
    logs,
    activeAbilityEffect: active,
  }
  if (enemy.hearts <= 0) return { state: grantVictory(next, rng), fx: NO_FX }
  return { state: { ...next, currentEnemy: { ...enemy, hearts: Math.max(0, enemy.hearts) } }, fx: NO_FX }
}

function clash(state: GameState, move: Move, rng: Rng): ReduceResult {
  if (state.phase !== 'idle' || state.view !== 'combat' || !state.player || !state.currentEnemy) return same(state)
  if (!MOVES.includes(move)) return same(state)

  let player: Player = { ...state.player, runes: state.player.runes }
  let enemy: Enemy = { ...state.currentEnemy }
  let active = state.activeAbilityEffect
  let streak = state.winStreak
  let logs = state.logs
  const hasRune = (effect: string) => player.runes.some((rune) => rune.effect === effect)

  let result: 'win' | 'loss' | 'tie'
  let enemyMove: Move = 'rock'
  if (enemy.stunned) {
    result = 'win'
    enemy = { ...enemy, stunned: false }
  } else {
    enemyMove = getEnemyMove(enemy, state.turnCount, rng)
    result = resolveClash(move, enemyMove)
    if (active === 'mage_deny' && result === 'loss') {
      result = 'tie'
      active = null
    }
  }

  let enemyDamage = 0
  let playerDamage = 0
  const effects: ClashEffect[] = []

  if (result === 'win') {
    streak += 1
    if (streak % 2 === 0 && player.shields < player.maxShields) {
      player = { ...player, shields: player.shields + 1 }
      effects.push({ k: 'shields', amount: 1 })
    }
    enemyDamage = 1 + (hasRune('flat_dmg_1') ? 1 : 0)
    if (active === 'warrior_smash' && move === 'rock') {
      enemyDamage += 5
      enemy = { ...enemy, armor: Math.max(0, enemy.armor - 5) }
      active = null
    }
    if (active === 'rogue_mercy' && move === 'scissors') {
      enemy = { ...enemy, bleedTurns: 6 }
      active = null
    }
    if (move === 'paper' && hasRune('paper_energy')) {
      player = { ...player, energy: Math.min(player.maxEnergy, player.energy + 10) }
    }
    if (hasRune('streak_scaling')) enemyDamage *= 1 + streak * 0.2
  } else if (result === 'loss') {
    streak = 0
    playerDamage = 1 + (hasRune('heavy_hitter') ? 2 : 0)
    active = null
  } else {
    streak = 0
    active = null
    if (player.shields > 0) {
      player = { ...player, shields: player.shields - 1 }
      effects.push({ k: 'shields', amount: -1 })
    } else {
      playerDamage = 1
    }
  }

  if (enemyDamage > 0) {
    const absorbed = absorb(enemy.armor, enemyDamage)
    const dealt = Math.floor(absorbed.damage)
    enemy = { ...enemy, armor: absorbed.armor, hearts: enemy.hearts - dealt }
    if (dealt > 0) effects.push({ k: 'foe-hearts', amount: -dealt })
  }
  const struck = playerDamage > 0
  if (playerDamage > 0) {
    const absorbed = absorb(player.armor, playerDamage)
    const taken = Math.floor(absorbed.damage)
    player = { ...player, armor: absorbed.armor, hearts: player.hearts - taken }
    if (taken > 0) effects.push({ k: 'hearts', amount: -taken })
  }

  logs = pushLog(logs, {
    k: 'clash',
    outcome: result,
    move,
    enemyMove: state.currentEnemy.stunned ? null : enemyMove,
    effects,
  })
  if (enemy.bleedTurns > 0) {
    enemy = { ...enemy, hearts: enemy.hearts - 1, bleedTurns: enemy.bleedTurns - 1 }
  }

  if (player.hearts <= 0) {
    if (hasRune('cheat_death')) {
      player = {
        ...player,
        hearts: player.maxHearts,
        runes: player.runes.filter((rune) => rune.effect !== 'cheat_death'),
      }
      logs = pushLog(logs, { k: 'reborn' })
    } else {
      return {
        state: {
          ...state,
          player: boundPlayer({ ...player, hearts: 0 }),
          currentEnemy: enemy,
          logs,
          winStreak: streak,
          activeAbilityEffect: null,
          view: 'gameover',
          phase: 'idle',
        },
        fx: { shake: true, flash: true },
      }
    }
  }

  const progressed: GameState = {
    ...state,
    player: boundPlayer(player),
    currentEnemy: enemy,
    logs,
    winStreak: streak,
    activeAbilityEffect: active,
    turnCount: state.turnCount + 1,
  }

  if (enemy.hearts <= 0) {
    return { state: grantVictory(progressed, rng), fx: { shake: true, flash: struck } }
  }

  return {
    state: {
      ...progressed,
      currentEnemy: { ...enemy, hearts: Math.max(0, enemy.hearts), armor: Math.max(0, enemy.armor) },
      phase: 'resolving',
    },
    fx: { shake: true, flash: struck },
  }
}

export function reduce(state: GameState, action: Action, rng: Rng = defaultRng): ReduceResult {
  switch (action.type) {
    case 'reset':
      return { state: createInitialState(), fx: NO_FX }
    case 'unlock':
      if (state.phase !== 'resolving') return same(state)
      return { state: { ...state, phase: 'idle' }, fx: NO_FX }
    case 'begin':
      if (state.view !== 'start') return same(state)
      return { state: { ...state, view: 'territory' }, fx: NO_FX }
    case 'select-territory':
      if (state.view !== 'territory' || !TERRITORIES.includes(action.territory)) return same(state)
      return { state: { ...state, territory: action.territory, view: 'class-select' }, fx: NO_FX }
    case 'select-class':
      if (state.view !== 'class-select') return same(state)
      return {
        state: {
          ...state,
          player: createPlayer(action.classType),
          currentEnemy: null,
          view: 'dungeon',
          phase: 'idle',
        },
        fx: NO_FX,
      }
    case 'spawn':
      return spawnEnemy(state, rng)
    case 'clash':
      return clash(state, action.move, rng)
    case 'ability':
      return useAbility(state, action.abilityId, rng)
    case 'pick-rune': {
      if (state.view !== 'levelup' || !state.player) return same(state)
      const rune = state.levelUpChoices.find((item) => item.id === action.runeId)
      if (!rune || state.player.runes.some((owned) => owned.id === rune.id)) return same(state)
      return { state: advanceFloor({ ...state, levelUpChoices: [] }, applyLevel(state.player, rune)), fx: NO_FX }
    }
    case 'skip-level':
      if (state.view !== 'levelup' || !state.player || state.levelUpChoices.length > 0) return same(state)
      return { state: advanceFloor(state, applyLevel(state.player, null)), fx: NO_FX }
    case 'campfire': {
      if (state.view !== 'campfire' || !state.player || state.phase !== 'idle') return same(state)
      const player =
        action.choice === 'heal'
          ? { ...state.player, hearts: Math.min(state.player.maxHearts, state.player.hearts + 2) }
          : { ...state.player, shields: state.player.maxShields }
      return { state: { ...state, player: boundPlayer(player), view: 'merchant' }, fx: NO_FX }
    }
    case 'continue':
      if (state.view !== 'merchant' || !state.player) return same(state)
      return { state: { ...state, view: 'dungeon' }, fx: NO_FX }
    default: {
      const unreachable: never = action
      void unreachable
      return same(state)
    }
  }
}
