import type { Locale } from '@/i18n/messages'
import {
  ClassType,
  type ClashEffect,
  type ClashOutcome,
  type LogLine,
  type Move,
  type RankId,
  type Territory,
} from './domain/types'

export interface NamedText {
  name: string
  description: string
}

export interface TerritoryText {
  name: string
  line: string
}

export interface GameCopy {
  title: string
  kicker: string
  exit: string
  pause: string
  resume: string
  leaveTitle: string
  leaveBody: string
  stay: string
  leave: string
  start: string
  subtitle: string
  opening: string
  chooseTerritory: string
  choosePath: string
  floor: string
  level: string
  armor: string
  gold: string
  moves: Record<Move, string>
  keys: string
  classes: Record<ClassType, string>
  bios: Record<ClassType, string>
  territories: Record<Territory, TerritoryText>
  ranks: Record<RankId, string>
  seals: Record<string, NamedText>
  abilities: Record<string, NamedText>
  dungeon: string
  levelUp: string
  campfire: string
  heal: string
  repair: string
  merchant: string
  merchantLine: string
  proceed: string
  gameover: string
  gameoverLine: string
  restart: string
  noRunes: string
  boss: string
  failed: string
  hearts: string
  energy: string
  shields: string
  logsLabel: string
  logWin: string
  logLoss: string
  logTie: string
  logYou: string
  logFoe: string
  logFoeHearts: string
  mute: string
  unmute: string
}

const sealsPt: Record<string, NamedText> = {
  flat_dmg_1: { name: 'Impacto', description: '+1 de dano base nas vitórias.' },
  paper_energy: { name: 'Reserva de Chakra', description: 'Vencer com Ninjutsu restaura 10 de chakra.' },
  max_hp_2: { name: 'Vitalidade', description: '+2 de vida máxima.' },
  heavy_hitter: { name: 'Ferida Aberta', description: 'Na derrota, o dano recebido aumenta em 2.' },
  streak_scaling: { name: 'Ímpeto', description: 'O dano da vitória cresce com a sequência.' },
  cheat_death: { name: 'Último Suspiro', description: 'Uma vez, renasce com a vida cheia.' },
}

const sealsEn: Record<string, NamedText> = {
  flat_dmg_1: { name: 'Impact', description: '+1 base damage on wins.' },
  paper_energy: { name: 'Chakra Reserve', description: 'Winning with Ninjutsu restores 10 chakra.' },
  max_hp_2: { name: 'Vitality', description: '+2 maximum health.' },
  heavy_hitter: { name: 'Open Wound', description: 'On a loss, damage taken increases by 2.' },
  streak_scaling: { name: 'Momentum', description: 'Win damage grows with the win streak.' },
  cheat_death: { name: 'Last Breath', description: 'Once, return with full health.' },
}

const abilitiesPt: Record<string, NamedText> = {
  w1: { name: 'Punho Demolidor', description: 'A próxima vitória de Taijutsu causa +5 e quebra a armadura.' },
  w2: { name: 'Postura de Ferro', description: '+4 de armadura na hora.' },
  m1: { name: 'Selo de Reversão', description: 'A próxima derrota vira empate.' },
  m2: { name: 'Rajada de Chakra', description: '3 de dano direto, ignorando armadura.' },
  r1: { name: 'Ilusão Cruel', description: 'A próxima vitória de Genjutsu sangra por 6 turnos.' },
  r2: { name: 'Passo Fantasma', description: '+1 escudo.' },
  c1: { name: 'Conversão de Chakra', description: 'Converte a armadura atual em cura.' },
  c2: { name: 'Técnica de Regeneração', description: '+1 de vida e +2 escudos.' },
}

const abilitiesEn: Record<string, NamedText> = {
  w1: { name: 'Crushing Fist', description: 'The next Taijutsu win deals +5 and breaks armor.' },
  w2: { name: 'Iron Stance', description: '+4 armor immediately.' },
  m1: { name: 'Reversal Seal', description: 'The next loss becomes a tie.' },
  m2: { name: 'Chakra Burst', description: '3 direct damage, ignoring armor.' },
  r1: { name: 'Cruel Illusion', description: 'The next Genjutsu win bleeds for 6 turns.' },
  r2: { name: 'Ghost Step', description: '+1 shield.' },
  c1: { name: 'Chakra Conversion', description: 'Turn current armor into healing.' },
  c2: { name: 'Regeneration', description: '+1 health and +2 shields.' },
}

const pt: GameCopy = {
  title: 'Guerra Ninja',
  kicker: 'Arte das 3 Técnicas',
  exit: 'Portfólio',
  pause: 'Pausa',
  resume: 'Continuar',
  leaveTitle: 'Sair da jornada?',
  leaveBody: 'O progresso desta partida fica para trás.',
  stay: 'Ficar',
  leave: 'Sair',
  start: 'Novo caminho',
  subtitle: 'Três técnicas. Uma jornada. Torne-se a Sombra.',
  opening: 'Todo mestre já foi um ninguém.',
  chooseTerritory: 'Escolha o território',
  choosePath: 'Escolha o caminho',
  floor: 'Andar',
  level: 'Nível',
  armor: 'Armadura',
  gold: 'Ouro',
  moves: { rock: 'Taijutsu', paper: 'Ninjutsu', scissors: 'Genjutsu' },
  keys: 'Teclas 1, 2 e 3',
  classes: {
    [ClassType.WARRIOR]: 'Caminho do Ninja Guerreiro',
    [ClassType.MAGE]: 'Caminho do Sennin Lendário',
    [ClassType.ROGUE]: 'Caminho Sábio',
    [ClassType.CLERIC]: 'Caminho do Karma',
  },
  bios: {
    [ClassType.WARRIOR]: 'O punho. Começa com 2 de armadura.',
    [ClassType.MAGE]: 'O selo escrito. O chakra que vira técnica.',
    [ClassType.ROGUE]: 'A ilusão. O corte que o olho não vê.',
    [ClassType.CLERIC]: 'O corpo que aguenta. Cura e escudo.',
  },
  territories: {
    lacre: { name: 'Folha', line: 'Floresta, madeira e disciplina.' },
    brasa: { name: 'Redemoinho', line: 'Vento, espiral e corte.' },
    delta: { name: 'Chuva', line: 'Chuva, ponte e precisão.' },
    veu: { name: 'Som', line: 'Eco, vibração e ouvido.' },
    duna: { name: 'Areia', line: 'Areia, ruína e resistência.' },
  },
  ranks: {
    recruit: 'Recrutado',
    veteran: 'Veterano',
    captain: 'Capitão',
    master: 'Mestre',
    shadow: 'Sombra',
  },
  seals: sealsPt,
  abilities: abilitiesPt,
  dungeon: 'Enfrentar',
  levelUp: 'Escolha um selamento',
  campfire: 'O fogo ainda respira',
  heal: 'Recuperar (+2)',
  repair: 'Meditar',
  merchant: 'Mercador',
  merchantLine: 'Ainda não tenho nada que valha seu ouro.',
  proceed: 'Seguir',
  gameover: 'A sombra caiu',
  gameoverLine: 'A jornada terminou.',
  restart: 'Novo caminho',
  noRunes: 'Seguir sem selamento',
  boss: 'Chefe',
  failed: 'O jogo encontrou um erro. A home continua intacta.',
  hearts: 'Vida',
  energy: 'Chakra',
  shields: 'Escudos',
  logsLabel: 'Registro do duelo',
  logWin: 'Vitória',
  logLoss: 'Derrota',
  logTie: 'Empate',
  logYou: 'Você',
  logFoe: 'Adversário',
  logFoeHearts: 'Vida dele',
  mute: 'Silenciar',
  unmute: 'Som',
}

const en: GameCopy = {
  title: 'Ninja War',
  kicker: 'Art of the 3 Techniques',
  exit: 'Portfolio',
  pause: 'Paused',
  resume: 'Resume',
  leaveTitle: 'Leave this run?',
  leaveBody: 'Progress in this match will be left behind.',
  stay: 'Stay',
  leave: 'Leave',
  start: 'New path',
  subtitle: 'Three techniques. One journey. Become the Shadow.',
  opening: 'Every master was once a nobody.',
  chooseTerritory: 'Choose a territory',
  choosePath: 'Choose a path',
  floor: 'Floor',
  level: 'Level',
  armor: 'Armor',
  gold: 'Gold',
  moves: { rock: 'Taijutsu', paper: 'Ninjutsu', scissors: 'Genjutsu' },
  keys: 'Keys 1, 2 and 3',
  classes: {
    [ClassType.WARRIOR]: 'Path of the Warrior Ninja',
    [ClassType.MAGE]: 'Path of the Legendary Sennin',
    [ClassType.ROGUE]: 'Sage Path',
    [ClassType.CLERIC]: 'Path of Karma',
  },
  bios: {
    [ClassType.WARRIOR]: 'The fist. Starts with 2 armor.',
    [ClassType.MAGE]: 'The written seal. Chakra turned into technique.',
    [ClassType.ROGUE]: 'The illusion. The cut the eye misses.',
    [ClassType.CLERIC]: 'The body that endures. Healing and shields.',
  },
  territories: {
    lacre: { name: 'Leaf', line: 'Forest, wood, and discipline.' },
    brasa: { name: 'Whirlwind', line: 'Wind, spiral, and the cut.' },
    delta: { name: 'Rain', line: 'Rain, bridges, and precision.' },
    veu: { name: 'Sound', line: 'Echo, vibration, and the ear.' },
    duna: { name: 'Sand', line: 'Sand, ruin, and endurance.' },
  },
  ranks: {
    recruit: 'Recruit',
    veteran: 'Veteran',
    captain: 'Captain',
    master: 'Master',
    shadow: 'Shadow',
  },
  seals: sealsEn,
  abilities: abilitiesEn,
  dungeon: 'Face',
  levelUp: 'Choose a seal',
  campfire: 'The fire still breathes',
  heal: 'Recover (+2)',
  repair: 'Meditate',
  merchant: 'Merchant',
  merchantLine: 'I still have nothing worth your gold.',
  proceed: 'Continue',
  gameover: 'The shadow fell',
  gameoverLine: 'The journey is over.',
  restart: 'New path',
  noRunes: 'Continue without a seal',
  boss: 'Boss',
  failed: 'The game hit an error. The home page is still intact.',
  hearts: 'Health',
  energy: 'Chakra',
  shields: 'Shields',
  logsLabel: 'Duel log',
  logWin: 'Win',
  logLoss: 'Loss',
  logTie: 'Tie',
  logYou: 'You',
  logFoe: 'Foe',
  logFoeHearts: 'Their health',
  mute: 'Mute',
  unmute: 'Sound',
}

const dictionaries: Record<Locale, GameCopy> = { pt, en }

export function gameCopy(locale: Locale): GameCopy {
  return dictionaries[locale]
}

export interface LogParts {
  lead: string
  result: string
  tone: ClashOutcome | null
  detail: string
  text: string
}

function signed(amount: number): string {
  return amount > 0 ? `+${amount}` : `−${Math.abs(amount)}`
}

function effectText(effect: ClashEffect, copy: GameCopy): string {
  switch (effect.k) {
    case 'foe-hearts':
      return `${copy.logFoeHearts} ${signed(effect.amount)}`
    case 'hearts':
      return `${copy.hearts} ${signed(effect.amount)}`
    case 'shields':
      return `${copy.shields} ${signed(effect.amount)}`
    default: {
      const unreachable: never = effect
      void unreachable
      return ''
    }
  }
}

function outcomeText(outcome: ClashOutcome, copy: GameCopy): string {
  if (outcome === 'win') return copy.logWin
  if (outcome === 'loss') return copy.logLoss
  return copy.logTie
}

function plain(text: string): LogParts {
  return { lead: text, result: '', tone: null, detail: '', text }
}

export function formatLogParts(line: LogLine, copy: GameCopy): LogParts {
  switch (line.k) {
    case 'boot':
      return plain(copy.opening)
    case 'clash': {
      const mine = `${copy.logYou} ${copy.moves[line.move]}`
      const theirs = line.enemyMove ? `${copy.logFoe} ${copy.moves[line.enemyMove]}` : ''
      const lead = theirs ? `${mine} · ${theirs}` : mine
      const result = outcomeText(line.outcome, copy)
      const detail = line.effects.map((effect) => effectText(effect, copy)).join(' · ')
      return {
        lead,
        result,
        tone: line.outcome,
        detail,
        text: [lead, result, detail].filter(Boolean).join(' · '),
      }
    }
    case 'ability':
      return plain(copy.abilities[line.abilityId]?.name ?? line.abilityId)
    case 'reborn':
      return plain(copy.seals.cheat_death?.name ?? copy.restart)
    default: {
      const unreachable: never = line
      void unreachable
      return plain('')
    }
  }
}

export function formatLog(line: LogLine, copy: GameCopy): string {
  return formatLogParts(line, copy).text
}
