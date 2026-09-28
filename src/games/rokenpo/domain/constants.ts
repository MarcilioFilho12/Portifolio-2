import type { Ability, ClassType, EnemyArchetype, Move, Rune } from './types'
import { ClassType as Class } from './types'

export const PALETTE = [
  'transparent',
  '#f4efe6',
  '#44403c',
  '#1c1917',
  '#b91c1c',
  '#d6a35c',
  '#1e3a8a',
  '#2563eb',
  '#3f6212',
  '#ef4444',
  '#d6d3d1',
  '#78716c',
]

export const UI_ICONS: Record<string, number[][]> = {
  HEART: [
    [0, 0, 4, 4, 0, 4, 4, 0],
    [0, 4, 9, 4, 4, 4, 4, 4],
    [4, 4, 4, 4, 4, 4, 4, 4],
    [4, 4, 4, 4, 4, 4, 4, 4],
    [0, 4, 4, 4, 4, 4, 4, 0],
    [0, 0, 4, 4, 4, 4, 0, 0],
    [0, 0, 0, 4, 4, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  MANA: [
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 1, 6, 10, 1, 0, 0],
    [0, 1, 6, 6, 6, 6, 1, 0],
    [0, 1, 6, 10, 6, 6, 1, 0],
    [0, 1, 6, 6, 6, 6, 1, 0],
    [0, 1, 6, 6, 10, 6, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  SHIELD: [
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 11, 7, 7, 7, 7, 1, 1],
    [1, 7, 11, 7, 7, 7, 7, 1],
    [1, 7, 7, 7, 7, 7, 7, 1],
    [0, 1, 7, 7, 7, 7, 1, 0],
    [0, 0, 1, 7, 7, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  XP: [
    [0, 0, 0, 5, 5, 0, 0, 0],
    [0, 0, 5, 5, 5, 5, 0, 0],
    [5, 5, 5, 1, 1, 5, 5, 5],
    [0, 5, 5, 5, 5, 5, 5, 0],
    [0, 0, 5, 5, 5, 5, 0, 0],
    [0, 5, 5, 0, 0, 5, 5, 0],
    [5, 5, 0, 0, 0, 0, 5, 5],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  GOLD: [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 5, 5, 5, 5, 1, 0],
    [1, 5, 5, 1, 1, 5, 5, 1],
    [1, 5, 1, 5, 5, 1, 5, 1],
    [1, 5, 5, 1, 1, 5, 5, 1],
    [0, 1, 5, 5, 5, 5, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  MARK: [
    [0, 0, 0, 0, 0, 11, 11, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 11, 1, 1, 11, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0],
    [0, 0, 11, 0, 4, 9, 9, 4, 0, 11, 0, 0],
    [0, 11, 1, 4, 9, 1, 1, 9, 4, 1, 11, 0],
    [11, 1, 4, 9, 1, 4, 4, 1, 9, 4, 1, 11],
    [11, 1, 4, 9, 1, 4, 4, 1, 9, 4, 1, 11],
    [0, 11, 1, 4, 9, 1, 1, 9, 4, 1, 11, 0],
    [0, 0, 11, 0, 4, 9, 9, 4, 0, 11, 0, 0],
    [0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 11, 1, 1, 11, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 11, 11, 0, 0, 0, 0, 0],
  ],
}

export const CLASS_ABILITIES_LIST: Record<ClassType, Ability[]> = {
  [Class.WARRIOR]: [
    { id: 'w1', name: 'Punho Demolidor', description: '40 de chakra: a próxima vitória de Taijutsu causa +5 e quebra a armadura.', cost: 40, effect: 'warrior_smash' },
    { id: 'w2', name: 'Postura de Ferro', description: '30 de chakra: +4 de armadura na hora.', cost: 30, effect: 'warrior_guard' },
  ],
  [Class.MAGE]: [
    { id: 'm1', name: 'Selo de Reversão', description: '50 de chakra: a próxima derrota vira empate.', cost: 50, effect: 'mage_deny' },
    { id: 'm2', name: 'Rajada de Chakra', description: '35 de chakra: 3 de dano direto, ignorando armadura.', cost: 35, effect: 'mage_flare' },
  ],
  [Class.ROGUE]: [
    { id: 'r1', name: 'Ilusão Cruel', description: '40 de chakra: a próxima vitória de Genjutsu sangra por 6 turnos.', cost: 40, effect: 'rogue_mercy' },
    { id: 'r2', name: 'Passo Fantasma', description: '30 de chakra: +1 escudo.', cost: 30, effect: 'rogue_stealth' },
  ],
  [Class.CLERIC]: [
    { id: 'c1', name: 'Conversão de Chakra', description: '30 de chakra: converte a armadura atual em cura.', cost: 30, effect: 'cleric_transfuse' },
    { id: 'c2', name: 'Técnica de Regeneração', description: '60 de chakra: +1 de vida e +2 escudos.', cost: 60, effect: 'cleric_prayer' },
  ],
}

export const CLASS_BIOS: Record<ClassType, string> = {
  [Class.WARRIOR]: 'Uma tumba de ferro. Foco: Pedra.',
  [Class.MAGE]: 'Sussurros do vazio. Foco: Papel.',
  [Class.ROGUE]: 'Sombra letal. Foco: Tesoura.',
  [Class.CLERIC]: 'Fé inabalável. Foco: Sustento.',
}

export const RUNES_POOL: Rune[] = [
  { id: 'f3', tier: 'F', name: 'Impacto', effect: 'flat_dmg_1', description: '+1 de dano base nas vitórias.' },
  { id: 'd1', tier: 'D', name: 'Reserva de Chakra', effect: 'paper_energy', description: 'Vencer com Ninjutsu restaura 10 de chakra.' },
  { id: 'f1', tier: 'F', name: 'Vitalidade', effect: 'max_hp_2', description: '+2 de vida máxima.' },
  { id: 'd2', tier: 'D', name: 'Ferida Aberta', effect: 'heavy_hitter', description: 'Na derrota, o dano recebido aumenta em 2.' },
  { id: 'a1', tier: 'A', name: 'Ímpeto', effect: 'streak_scaling', description: 'O dano da vitória cresce com a sequência.' },
  { id: 'sp2', tier: 'S+', name: 'Último Suspiro', effect: 'cheat_death', description: 'Uma vez, renasce com a vida cheia.' },
]

export const ENEMY_POOLS: Record<EnemyArchetype, string[]> = {
  BRUTE: ['Quebra-osso', 'Muralha', 'Punho-ferro', 'Colosso'],
  TACTICIAN: ['Escriba', 'Corvo', 'Estrategista', 'Selo'],
  STALKER: ['Véu', 'Lâmina', 'Sussurro', 'Máscara'],
  CHAOTIC: ['Máscara solta'],
  PREDICTABLE: ['Sentinela'],
}

export const BOSSES: Record<number, { name: string; archetype: EnemyArchetype }> = {
  5: { name: 'Sentinela de Bronze', archetype: 'PREDICTABLE' },
  10: { name: 'Máscara Risonha', archetype: 'CHAOTIC' },
  15: { name: 'Guardião do Selo', archetype: 'TACTICIAN' },
  20: { name: 'Sombra Partida', archetype: 'CHAOTIC' },
}

export const MOVES: Move[] = ['rock', 'paper', 'scissors']

export const PLAYER_SPRITES: Record<ClassType, number[][]> = {
  [Class.WARRIOR]: [
    [0, 5, 5, 5, 5, 5, 5, 0],
    [0, 4, 4, 1, 1, 4, 4, 0],
    [0, 1, 3, 1, 1, 3, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [2, 4, 1, 1, 1, 1, 4, 2],
    [0, 2, 1, 1, 1, 1, 2, 0],
    [0, 2, 2, 0, 0, 2, 2, 0],
    [0, 3, 3, 0, 0, 3, 3, 0],
  ],
  [Class.MAGE]: [
    [0, 0, 6, 6, 6, 6, 0, 0],
    [0, 6, 1, 1, 1, 1, 6, 0],
    [0, 6, 3, 1, 1, 3, 6, 0],
    [0, 6, 1, 5, 5, 1, 6, 0],
    [0, 0, 7, 4, 4, 7, 0, 0],
    [0, 7, 1, 1, 1, 1, 7, 0],
    [0, 0, 2, 2, 2, 2, 0, 0],
    [0, 2, 2, 0, 0, 2, 2, 0],
  ],
  [Class.ROGUE]: [
    [0, 0, 3, 3, 3, 3, 0, 0],
    [0, 3, 1, 1, 1, 1, 3, 0],
    [0, 3, 4, 3, 3, 4, 3, 0],
    [0, 3, 3, 1, 1, 3, 3, 0],
    [0, 1, 1, 3, 3, 1, 1, 0],
    [4, 0, 1, 1, 1, 1, 0, 5],
    [0, 0, 3, 0, 0, 3, 0, 5],
    [0, 0, 3, 0, 0, 3, 0, 0],
  ],
  [Class.CLERIC]: [
    [0, 0, 8, 8, 8, 8, 0, 0],
    [0, 8, 1, 1, 1, 1, 8, 0],
    [0, 8, 3, 1, 1, 3, 8, 0],
    [0, 8, 1, 5, 5, 1, 8, 0],
    [0, 0, 1, 8, 8, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 2, 1, 1, 2, 0, 0],
    [0, 2, 2, 0, 0, 2, 2, 0],
  ],
}

export const ENEMY_SPRITES: Record<EnemyArchetype, number[][]> = {
  BRUTE: [
    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
    [0, 2, 4, 4, 4, 4, 4, 4, 4, 4, 2, 0],
    [2, 2, 1, 3, 1, 2, 2, 1, 3, 1, 2, 2],
    [2, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 2],
    [2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2],
    [4, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 4],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 0, 3, 3, 3, 0, 0, 3, 3, 3, 0, 0],
    [0, 0, 3, 3, 3, 0, 0, 3, 3, 3, 0, 0],
  ],
  TACTICIAN: [
    [0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0],
    [0, 0, 0, 5, 4, 4, 4, 4, 5, 0, 0, 0],
    [0, 0, 1, 1, 3, 1, 1, 3, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 6, 6, 1, 5, 5, 5, 5, 1, 6, 6, 0],
    [0, 6, 6, 1, 1, 6, 6, 1, 1, 6, 6, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 2, 1, 1, 1, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 0],
    [0, 0, 0, 5, 5, 0, 0, 5, 5, 0, 0, 0],
  ],
  STALKER: [
    [0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0],
    [0, 0, 0, 3, 1, 1, 1, 1, 3, 0, 0, 0],
    [0, 0, 0, 3, 4, 3, 3, 4, 3, 0, 0, 0],
    [0, 0, 3, 3, 1, 1, 1, 1, 3, 3, 0, 0],
    [0, 3, 1, 1, 3, 3, 3, 3, 1, 1, 3, 0],
    [4, 1, 1, 1, 3, 0, 0, 3, 1, 1, 1, 5],
    [0, 3, 1, 1, 0, 0, 0, 0, 1, 1, 3, 5],
    [0, 0, 3, 3, 0, 0, 0, 0, 3, 3, 0, 0],
    [0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0],
    [0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0],
  ],
  CHAOTIC: [
    [0, 0, 10, 10, 0, 0, 0, 10, 10, 0, 0, 0],
    [0, 10, 1, 1, 10, 0, 10, 1, 4, 10, 0, 0],
    [0, 10, 3, 1, 1, 10, 1, 3, 1, 10, 0, 0],
    [0, 0, 10, 4, 1, 1, 1, 10, 0, 0, 0, 0],
    [0, 10, 1, 10, 10, 1, 1, 4, 0, 10, 10, 0],
    [0, 10, 1, 1, 1, 10, 10, 1, 10, 1, 10, 0],
    [0, 0, 10, 10, 1, 1, 1, 1, 1, 10, 0, 0],
    [0, 0, 0, 10, 1, 4, 0, 4, 1, 10, 0, 0],
    [0, 0, 10, 10, 0, 0, 0, 0, 10, 10, 0, 0],
  ],
  PREDICTABLE: [
    [0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0],
    [0, 0, 2, 5, 5, 5, 5, 5, 5, 2, 0, 0],
    [0, 2, 1, 3, 3, 1, 1, 3, 3, 1, 2, 0],
    [0, 2, 1, 1, 1, 4, 4, 1, 1, 1, 2, 0],
    [0, 2, 5, 1, 1, 1, 1, 1, 1, 5, 2, 0],
    [0, 2, 1, 5, 5, 5, 5, 5, 5, 1, 2, 0],
    [0, 0, 2, 1, 1, 1, 1, 1, 1, 2, 0, 0],
    [0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0],
    [0, 0, 0, 3, 3, 0, 0, 3, 3, 0, 0, 0],
    [0, 0, 0, 3, 3, 0, 0, 3, 3, 0, 0, 0],
  ],
}

export function getRuneSprite(id: string): number[][] {
  const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const color = id.startsWith('sp') ? 5 : id.startsWith('s') ? 6 : id.startsWith('a') ? 4 : 8
  const sprite: number[][] = []
  for (let y = 0; y < 8; y++) {
    const row: number[] = []
    for (let x = 0; x < 8; x++) {
      const edge = x === 0 || y === 0 || x === 7 || y === 7
      const mark = x > 1 && x < 6 && y > 1 && y < 6 && (x + y + seed) % 3 === 0
      row.push(edge ? 1 : mark ? color : 0)
    }
    sprite.push(row)
  }
  return sprite
}
