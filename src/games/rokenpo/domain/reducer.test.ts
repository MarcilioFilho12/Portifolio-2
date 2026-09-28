import { describe, expect, it } from 'vitest'
import { RUNES_POOL } from './constants'
import { rankForFloor } from './rank'
import { createInitialState, createPlayer, reduce } from './reducer'
import { sequenceRng } from './rng'
import { resolveClash } from './rules'
import { ClassType, type Enemy, type GameState, type Player } from './types'

function combat(options?: {
  player?: Partial<Player>
  enemy?: Partial<Enemy>
  floor?: number
  turnCount?: number
}): GameState {
  const enemy: Enemy = {
    name: 'Sentinela',
    type: 'monster',
    hearts: 8,
    maxHearts: 8,
    armor: 0,
    bleedTurns: 0,
    stunned: false,
    archetype: 'PREDICTABLE',
    difficulty: 1,
    ...options?.enemy,
  }
  return {
    ...createInitialState(),
    view: 'combat',
    player: { ...createPlayer(ClassType.MAGE), ...options?.player },
    currentEnemy: enemy,
    floor: options?.floor ?? 1,
    turnCount: options?.turnCount ?? 0,
  }
}

describe('resolveClash', () => {
  it('empata no mesmo golpe e cobre o ciclo pedra-papel-tesoura', () => {
    expect(resolveClash('rock', 'rock')).toBe('tie')
    expect(resolveClash('rock', 'scissors')).toBe('win')
    expect(resolveClash('paper', 'rock')).toBe('win')
    expect(resolveClash('scissors', 'paper')).toBe('win')
    expect(resolveClash('rock', 'paper')).toBe('loss')
  })
})

describe('reduce', () => {
  const rng = sequenceRng([0, 0, 0, 0])

  it('ignora um segundo golpe enquanto o turno ainda resolve', () => {
    const first = reduce(combat(), { type: 'clash', move: 'paper' }, rng)
    expect(first.state.phase).toBe('resolving')
    expect(first.state.currentEnemy?.hearts).toBe(7)
    const second = reduce(first.state, { type: 'clash', move: 'rock' }, rng)
    expect(second.state).toBe(first.state)
  })

  it('gasta escudo no empate e vida quando não há escudo', () => {
    const tied = reduce(combat(), { type: 'clash', move: 'rock' }, rng)
    expect(tied.state.player?.shields).toBe(2)
    expect(tied.state.player?.hearts).toBe(3)
    expect(tied.state.logs[0]).toEqual({
      k: 'clash',
      outcome: 'tie',
      move: 'rock',
      enemyMove: 'rock',
      effects: [{ k: 'shields', amount: -1 }],
    })

    const cruel = reduce(combat({ player: { shields: 0 } }), { type: 'clash', move: 'rock' }, rng)
    expect(cruel.state.player?.hearts).toBe(2)
    expect(cruel.state.logs[0]).toEqual({
      k: 'clash',
      outcome: 'tie',
      move: 'rock',
      enemyMove: 'rock',
      effects: [{ k: 'hearts', amount: -1 }],
    })
  })

  it('registra os dois golpes e o efeito numa linha só', () => {
    const won = reduce(combat(), { type: 'clash', move: 'paper' }, rng)
    expect(won.state.logs[0]).toEqual({
      k: 'clash',
      outcome: 'win',
      move: 'paper',
      enemyMove: 'rock',
      effects: [{ k: 'foe-hearts', amount: -1 }],
    })

    const lost = reduce(combat(), { type: 'clash', move: 'scissors' }, rng)
    expect(lost.state.logs[0]).toEqual({
      k: 'clash',
      outcome: 'loss',
      move: 'scissors',
      enemyMove: 'rock',
      effects: [{ k: 'hearts', amount: -1 }],
    })
  })

  it('renasce com a runa de cheat death e não reutiliza o array antigo', () => {
    const rune = RUNES_POOL.find((item) => item.effect === 'cheat_death')
    expect(rune).toBeTruthy()
    const start = combat({ player: { hearts: 1, runes: rune ? [rune] : [] } })
    const owned = start.player?.runes
    const next = reduce(start, { type: 'clash', move: 'scissors' }, rng)
    expect(next.state.view).toBe('combat')
    expect(next.state.player?.hearts).toBe(3)
    expect(next.state.player?.runes).toEqual([])
    expect(next.state.player?.runes).not.toBe(owned)
  })

  it('abre o level-up sem mutar as runas e segue para o próximo andar', () => {
    const start = combat({
      player: { exp: 0, nextLevelExp: 5 },
      enemy: { hearts: 1, maxHearts: 1 },
    })
    const owned = start.player?.runes ?? []
    const leveled = reduce(start, { type: 'clash', move: 'paper' }, rng)
    expect(leveled.state.view).toBe('levelup')
    expect(leveled.state.levelUpChoices).toHaveLength(3)
    expect(owned).toEqual([])

    const choice = leveled.state.levelUpChoices[0]
    expect(choice).toBeTruthy()
    const picked = reduce(leveled.state, { type: 'pick-rune', runeId: choice?.id ?? '' }, rng)
    expect(picked.state.player?.runes.map((item) => item.id)).toEqual([choice?.id])
    expect(picked.state.player?.runes).not.toBe(owned)
    expect(picked.state.floor).toBe(2)
    expect(picked.state.view).toBe('dungeon')
  })

  it('manda para a fogueira quando o próximo andar é múltiplo de 3', () => {
    const next = reduce(
      combat({ floor: 2, player: { nextLevelExp: 999 }, enemy: { hearts: 1, maxHearts: 1 } }),
      { type: 'clash', move: 'paper' },
      rng,
    )
    expect(next.state.floor).toBe(3)
    expect(next.state.view).toBe('campfire')
  })

  it('trata inimigo atordoado como vitória sem rolagem de golpe', () => {
    const next = reduce(
      combat({ enemy: { stunned: true, hearts: 4, maxHearts: 4 } }),
      { type: 'clash', move: 'rock' },
      rng,
    )
    expect(next.state.currentEnemy?.hearts).toBe(3)
    expect(next.state.currentEnemy?.stunned).toBe(false)
    expect(next.state.logs[0]).toEqual({
      k: 'clash',
      outcome: 'win',
      move: 'rock',
      enemyMove: null,
      effects: [{ k: 'foe-hearts', amount: -1 }],
    })
  })

  it('recusa habilidade sem mana e aplica a explosão quando há mana', () => {
    const poor = combat({ player: { energy: 10 } })
    const broke = reduce(poor, { type: 'ability', abilityId: 'm2' }, rng)
    expect(broke.state).toBe(poor)
    expect(broke.state.player?.energy).toBe(10)

    const start = combat({ enemy: { hearts: 5, maxHearts: 5 } })
    const cast = reduce(start, { type: 'ability', abilityId: 'm2' }, rng)
    expect(cast.state.player?.energy).toBe(65)
    expect(cast.state.currentEnemy?.hearts).toBe(2)
  })

  it('reinicia a partida sem recarregar a página', () => {
    const dead = reduce(combat({ player: { hearts: 1, shields: 0 } }), { type: 'clash', move: 'scissors' }, rng)
    expect(dead.state.view).toBe('gameover')
    const reset = reduce(dead.state, { type: 'reset' }, rng)
    expect(reset.state.view).toBe('start')
    expect(reset.state.player).toBeNull()
  })

  it('dá armadura inicial só ao guerreiro', () => {
    expect(createPlayer(ClassType.WARRIOR).armor).toBe(2)
    expect(createPlayer(ClassType.MAGE).armor).toBe(0)
  })

  it('pede o território antes do caminho e a graduação segue o andar', () => {
    const opened = reduce(createInitialState(), { type: 'begin' }, rng)
    expect(opened.state.view).toBe('territory')
    const placed = reduce(opened.state, { type: 'select-territory', territory: 'lacre' }, rng)
    expect(placed.state.view).toBe('class-select')
    expect(placed.state.territory).toBe('lacre')
    expect(rankForFloor(4)).toBe('recruit')
    expect(rankForFloor(5)).toBe('veteran')
    expect(rankForFloor(10)).toBe('captain')
    expect(rankForFloor(15)).toBe('master')
    expect(rankForFloor(20)).toBe('shadow')
  })
})
