<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useLocale } from '@/composables/useLocale'
import { useReducedMotion } from '@/composables/useReducedMotion'
import {
  CLASS_ABILITIES_LIST,
  MOVES,
  UI_ICONS,
  getRuneSprite,
} from '@/games/rokenpo/domain/constants'
import { reduce, createInitialState, type Action } from '@/games/rokenpo/domain/reducer'
import { defaultRng } from '@/games/rokenpo/domain/rng'
import { ClassType, TERRITORIES, type GameState, type GameView, type Move } from '@/games/rokenpo/domain/types'
import { rankForFloor } from '@/games/rokenpo/domain/rank'
import { formatLogParts, gameCopy } from '@/games/rokenpo/copy'
import { playButtonHit, playMoveHit, primeButtonHit } from '@/games/rokenpo/buttonHit'
import {
  playTrack,
  stopMusic,
  suspendMusic,
  warmTrack,
  type TrackId,
} from '@/games/rokenpo/music'
import PixelArt from '@/games/rokenpo/ui/PixelArt.vue'
import PixelSprite from '@/games/rokenpo/ui/PixelSprite.vue'
import '@/games/rokenpo/ui/rokenpo.css'

const router = useRouter()
const { locale } = useLocale()
const { shouldReduceMotion } = useReducedMotion()
const copy = computed(() => gameCopy(locale.value))

const classes = [ClassType.WARRIOR, ClassType.MAGE, ClassType.ROGUE, ClassType.CLERIC] as const
const classArt: Record<ClassType, string> = {
  [ClassType.WARRIOR]: '/media/rokenpo/fajutsu.png',
  [ClassType.MAGE]: '/media/rokenpo/ninjutsu.png',
  [ClassType.ROGUE]: '/media/rokenpo/genjutsu.png',
  [ClassType.CLERIC]: '/media/rokenpo/sustento.png',
}
interface FighterArt {
  src: string
  /** Present when src is a sprite sheet laid out left to right. */
  sheet?: { w: number; h: number; frames: number; duration: number }
  aura?: { src: string; frames: number; duration: number }
}

const fighterArt: Record<ClassType, FighterArt> = {
  [ClassType.WARRIOR]: { src: '/media/rokenpo/fajutsu.png' },
  [ClassType.MAGE]: { src: '/media/rokenpo/fighter-ninjutsu.png' },
  [ClassType.ROGUE]: { src: '/media/rokenpo/fighter-genjutsu.png' },
  [ClassType.CLERIC]: { src: '/media/rokenpo/fighter-sustento.png' },
}
const moveArt: Record<Move, string> = {
  rock: '/media/rokenpo/move-taijutsu.png',
  paper: '/media/rokenpo/move-ninjutsu.png',
  scissors: '/media/rokenpo/move-genjutsu.png',
}
const state = ref<GameState>(createInitialState())
const shake = ref(false)
const flash = ref(false)
const paused = ref(false)
const confirmExit = ref(false)
const failed = ref(false)
const resumeRef = ref<HTMLButtonElement | null>(null)
const musicOn = ref(false)
const stampMove = ref<Move | null>(null)
const stampKey = ref(0)
let userMuted = false

let unlockTimer = 0
let shakeTimer = 0
let flashTimer = 0
let stampTimer = 0

const player = computed(() => state.value.player)
const fighter = computed(() => (player.value ? fighterArt[player.value.class] : null))
const enemy = computed(() => state.value.currentEnemy)
const abilities = computed(() => (player.value ? CLASS_ABILITIES_LIST[player.value.class] : []))
const logs = computed(() => state.value.logs.map((line) => formatLogParts(line, copy.value)))
const latestLog = computed(() => logs.value[0]?.text ?? '')
const rankLabel = computed(() => copy.value.ranks[rankForFloor(state.value.floor)])
const territoryLabel = computed(() =>
  state.value.territory ? copy.value.territories[state.value.territory].name : '',
)

function meter(current: number, max: number) {
  if (max <= 0) return '0%'
  return `${Math.max(0, Math.min(100, (current / max) * 100))}%`
}

function clearTimers() {
  window.clearTimeout(unlockTimer)
  window.clearTimeout(shakeTimer)
  window.clearTimeout(flashTimer)
  window.clearTimeout(stampTimer)
}

function showStamp(move: Move) {
  if (shouldReduceMotion.value) return
  stampMove.value = move
  stampKey.value += 1
  window.clearTimeout(stampTimer)
  stampTimer = window.setTimeout(() => {
    stampMove.value = null
  }, 320)
}

function dispatch(action: Action) {
  if (failed.value) return
  try {
    const result = reduce(state.value, action, defaultRng)
    state.value = result.state
    if (result.fx.shake && !shouldReduceMotion.value) {
      shake.value = true
      window.clearTimeout(shakeTimer)
      shakeTimer = window.setTimeout(() => {
        shake.value = false
      }, 150)
    }
    if (result.fx.flash && !shouldReduceMotion.value) {
      flash.value = true
      window.clearTimeout(flashTimer)
      flashTimer = window.setTimeout(() => {
        flash.value = false
      }, 80)
    }
    if (action.type === 'clash' && result.state.phase === 'resolving') {
      showStamp(action.move)
    }
    if (result.state.phase === 'resolving') {
      window.clearTimeout(unlockTimer)
      unlockTimer = window.setTimeout(() => dispatch({ type: 'unlock' }), 160)
    }
  } catch {
    failed.value = true
    clearTimers()
  }
}

function requestExit() {
  const view = state.value.view
  if (view === 'start' || view === 'territory' || view === 'class-select' || view === 'gameover') {
    void router.push('/')
    return
  }
  paused.value = false
  confirmExit.value = true
}

function leave() {
  void router.push('/')
}

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    if (confirmExit.value) {
      confirmExit.value = false
      return
    }
    paused.value = !paused.value
    return
  }
  if (paused.value || confirmExit.value || failed.value) return
  if (state.value.view !== 'combat' || state.value.phase !== 'idle') return
  const move = ({ '1': 'rock', '2': 'paper', '3': 'scissors' } as Record<string, Move>)[event.key]
  if (!move) return
  event.preventDefault()
  playMoveHit(move)
  dispatch({ type: 'clash', move })
}

// The opening theme carries every screen outside a fight; combat takes over.
function trackForView(view: GameView): TrackId {
  return view === 'combat' ? 'combat' : 'opening'
}

async function syncMusic(force = false) {
  if (failed.value) return
  if (paused.value || confirmExit.value) {
    suspendMusic()
    return
  }

  const wanted = trackForView(state.value.view)
  if (userMuted) return
  if (!force && shouldReduceMotion.value) return
  try {
    await playTrack(wanted)
    musicOn.value = true
  } catch {
    musicOn.value = false
  }
}

function toggleMusic() {
  if (musicOn.value) {
    userMuted = true
    stopMusic()
    musicOn.value = false
    return
  }
  userMuted = false
  void syncMusic(true)
}

function onUiClick(event: MouseEvent) {
  const target = event.target
  if (!(target instanceof Element)) return
  const button = target.closest('button')
  if (!button) return
  const move = button.dataset.move as Move | undefined
  if (move) {
    playMoveHit(move)
    return
  }
  playButtonHit()
}

function onStartPointerDown(event: PointerEvent) {
  const target = event.target
  if (!(target instanceof Element)) return
  if (target.closest('[data-testid="rokenpo-start"], [data-testid="rokenpo-sound"]')) return
  void syncMusic()
}

watch(paused, async (open) => {
  if (!open) return
  await nextTick()
  resumeRef.value?.focus()
})

watch(
  () => state.value.view,
  (view) => {
    // The dungeon screen is the last click before a fight, so buffer the combat
    // track here instead of making the first fight wait on the network.
    if (view === 'dungeon') warmTrack('combat')
    void syncMusic()
  },
)

watch([paused, confirmExit], () => {
  void syncMusic()
})

onMounted(() => {
  primeButtonHit()
  window.addEventListener('keydown', onKey)
  void syncMusic()
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  stopMusic()
  musicOn.value = false
  clearTimers()
})
</script>

<template>
  <div
    class="rokenpo"
    :class="{ 'is-shake': shake }"
    :data-territory="state.territory ?? undefined"
    data-testid="rokenpo-root"
    @click="onUiClick"
  >
    <div v-if="flash" class="rokenpo-flash" aria-hidden="true" />

    <header class="rokenpo-bar">
      <p>{{ copy.title }}</p>
      <div class="rokenpo-bar-actions">
        <button
          type="button"
          class="rokenpo-exit"
          data-testid="rokenpo-sound"
          :aria-pressed="musicOn"
          @click="toggleMusic"
        >
          {{ musicOn ? copy.mute : copy.unmute }}
        </button>
        <button type="button" class="rokenpo-exit" data-testid="rokenpo-exit" @click="requestExit">
          {{ copy.exit }}
        </button>
      </div>
    </header>

    <div v-if="player" class="rokenpo-mobile-stats">
      <p>{{ copy.hearts }} {{ Math.floor(player.hearts) }}/{{ player.maxHearts }}</p>
      <p>{{ copy.energy }} {{ Math.floor(player.energy) }}</p>
      <p>{{ rankLabel }} · {{ state.floor }}</p>
    </div>

    <div class="rokenpo-body">
      <aside v-if="player" class="rokenpo-status">
        <img class="rokenpo-portrait" :src="classArt[player.class]" alt="" />
        <p>{{ copy.classes[player.class] }}</p>
        <div class="rokenpo-meter">
          <span>{{ copy.hearts }}</span>
          <span class="rokenpo-meter-track"><span class="rokenpo-meter-fill is-heart" :style="{ width: meter(player.hearts, player.maxHearts) }" /></span>
          <span>{{ Math.floor(player.hearts) }}/{{ player.maxHearts }}</span>
        </div>
        <div class="rokenpo-meter">
          <span>{{ copy.energy }}</span>
          <span class="rokenpo-meter-track"><span class="rokenpo-meter-fill is-mana" :style="{ width: meter(player.energy, player.maxEnergy) }" /></span>
          <span>{{ Math.floor(player.energy) }}/{{ player.maxEnergy }}</span>
        </div>
        <div class="rokenpo-meter">
          <span>{{ copy.shields }}</span>
          <span class="rokenpo-meter-track"><span class="rokenpo-meter-fill is-shield" :style="{ width: meter(player.shields, player.maxShields) }" /></span>
          <span>{{ player.shields }}/{{ player.maxShields }}</span>
        </div>
        <div class="rokenpo-meter">
          <PixelArt :data="UI_ICONS.XP ?? []" :size="2" />
          <span class="rokenpo-meter-track"><span class="rokenpo-meter-fill is-exp" :style="{ width: meter(player.exp, player.nextLevelExp) }" /></span>
          <span>{{ Math.floor(player.exp) }}</span>
        </div>
        <p class="rokenpo-meta">{{ rankLabel }} · {{ copy.floor }} {{ state.floor }} · {{ copy.armor }} {{ Math.floor(player.armor) }}</p>
        <p class="rokenpo-meta">{{ copy.gold }} {{ player.gold }}</p>
        <div class="rokenpo-runes">
          <PixelArt v-for="seal in player.runes" :key="seal.id" :data="getRuneSprite(seal.id)" :size="2" :title="copy.seals[seal.effect]?.name ?? seal.name" />
        </div>
      </aside>

      <main class="rokenpo-stage">
        <section v-if="state.view === 'start'" @pointerdown="onStartPointerDown">
          <div class="rokenpo-mark">
            <PixelArt :data="UI_ICONS.MARK ?? []" :size="5" />
          </div>
          <h1 class="rokenpo-title">{{ copy.title }}</h1>
          <p class="rokenpo-kicker">{{ copy.kicker }}</p>
          <p class="rokenpo-hint">{{ copy.opening }}</p>
          <p class="rokenpo-hint">{{ copy.subtitle }}</p>
          <button type="button" class="rokenpo-action" data-testid="rokenpo-start" @click="dispatch({ type: 'begin' })">
            {{ copy.start }}
          </button>
        </section>

        <section v-else-if="state.view === 'territory'" class="rokenpo-classes">
          <h2 class="rokenpo-kicker">{{ copy.chooseTerritory }}</h2>
          <button
            v-for="territory in TERRITORIES"
            :key="territory"
            type="button"
            class="rokenpo-class"
            :data-testid="`rokenpo-territory-${territory}`"
            @click="dispatch({ type: 'select-territory', territory })"
          >
            <span>{{ copy.territories[territory].name }}</span>
            <span class="rokenpo-hint">{{ copy.territories[territory].line }}</span>
          </button>
        </section>

        <section v-else-if="state.view === 'class-select'" class="rokenpo-classes">
          <h2 class="rokenpo-kicker">{{ copy.choosePath }}</h2>
          <button
            v-for="kind in classes"
            :key="kind"
            type="button"
            class="rokenpo-class"
            @click="dispatch({ type: 'select-class', classType: kind })"
          >
            <img class="rokenpo-class-art" :src="classArt[kind]" alt="" />
            <span>{{ copy.classes[kind] }}</span>
            <span class="rokenpo-hint">{{ copy.bios[kind] }}</span>
          </button>
        </section>

        <section v-else-if="state.view === 'dungeon'">
          <template v-if="fighter">
            <div
              v-if="fighter.sheet"
              class="rokenpo-actor"
              :style="{ '--rk-frame-w': fighter.sheet.w, '--rk-frame-h': fighter.sheet.h }"
            >
              <PixelSprite
                v-if="fighter.aura"
                class="rokenpo-actor-layer is-aura"
                :src="fighter.aura.src"
                :frames="fighter.aura.frames"
                :duration="fighter.aura.duration"
              />
              <PixelSprite
                class="rokenpo-actor-layer"
                :src="fighter.src"
                :frames="fighter.sheet.frames"
                :duration="fighter.sheet.duration"
                ping-pong
              />
            </div>
            <img v-else class="rokenpo-fighter" :src="fighter.src" alt="" />
          </template>
          <button type="button" class="rokenpo-action" data-testid="rokenpo-descend" @click="dispatch({ type: 'spawn' })">
            {{ copy.dungeon }}
          </button>
          <p class="rokenpo-kicker">{{ territoryLabel }} · {{ rankLabel }} · {{ copy.floor }} {{ state.floor }}</p>
        </section>

        <section v-else-if="state.view === 'combat' && enemy">
          <h2 class="rokenpo-title" :class="{ 'is-boss': enemy.type !== 'monster' }" style="font-size: 2rem">
            {{ enemy.name }}
          </h2>
          <p v-if="enemy.type !== 'monster'" class="rokenpo-kicker">{{ copy.boss }}</p>
          <div class="rokenpo-meter" style="max-width: 24rem">
            <span>{{ copy.hearts }}</span>
            <span class="rokenpo-meter-track"><span class="rokenpo-meter-fill is-heart" :style="{ width: meter(enemy.hearts, enemy.maxHearts) }" /></span>
            <span>{{ Math.max(0, Math.floor(enemy.hearts)) }}/{{ enemy.maxHearts }}</span>
          </div>
          <template v-if="fighter">
            <div
              v-if="fighter.sheet"
              class="rokenpo-actor"
              :style="{ '--rk-frame-w': fighter.sheet.w, '--rk-frame-h': fighter.sheet.h }"
            >
              <PixelSprite
                v-if="fighter.aura"
                class="rokenpo-actor-layer is-aura"
                :src="fighter.aura.src"
                :frames="fighter.aura.frames"
                :duration="fighter.aura.duration"
              />
              <PixelSprite
                class="rokenpo-actor-layer"
                :src="fighter.src"
                :frames="fighter.sheet.frames"
                :duration="fighter.sheet.duration"
                ping-pong
              />
            </div>
            <img v-else class="rokenpo-fighter is-breathing" :src="fighter.src" alt="" />
          </template>
          <img
            v-if="stampMove"
            :key="stampKey"
            class="rokenpo-stamp"
            :src="moveArt[stampMove]"
            alt=""
          />
          <div class="rokenpo-moves">
            <button
              v-for="(move, index) in MOVES"
              :key="move"
              type="button"
              class="rokenpo-move"
              :data-move="move"
              :disabled="state.phase !== 'idle'"
              :aria-keyshortcuts="String(index + 1)"
              @click="dispatch({ type: 'clash', move })"
            >
              <img class="rokenpo-move-art" :src="moveArt[move]" alt="" />
              {{ copy.moves[move] }}
            </button>
          </div>
          <p class="rokenpo-hint">{{ copy.keys }}</p>
          <div class="rokenpo-abilities">
            <button
              v-for="ability in abilities"
              :key="ability.id"
              type="button"
              class="rokenpo-ability"
              :class="{ 'is-active': state.activeAbilityEffect === ability.effect }"
              :disabled="state.phase !== 'idle' || (player?.energy ?? 0) < ability.cost"
              :title="copy.abilities[ability.id]?.description ?? ability.description"
              @click="dispatch({ type: 'ability', abilityId: ability.id })"
            >
              {{ copy.abilities[ability.id]?.name ?? ability.name }} ({{ ability.cost }})
            </button>
          </div>
        </section>

        <section v-else-if="state.view === 'levelup'">
          <h2 class="rokenpo-title" style="font-size: 3rem">{{ copy.levelUp }}</h2>
          <div class="rokenpo-runes-pick">
            <button
              v-for="rune in state.levelUpChoices"
              :key="rune.id"
              type="button"
              class="rokenpo-rune"
              @click="dispatch({ type: 'pick-rune', runeId: rune.id })"
            >
              <PixelArt :data="getRuneSprite(rune.id)" :size="3" />
              <span>{{ copy.seals[rune.effect]?.name ?? rune.name }}</span>
              <span class="rokenpo-hint">{{ copy.seals[rune.effect]?.description ?? rune.description }}</span>
            </button>
          </div>
          <button
            v-if="state.levelUpChoices.length === 0"
            type="button"
            class="rokenpo-action"
            @click="dispatch({ type: 'skip-level' })"
          >
            {{ copy.noRunes }}
          </button>
        </section>

        <section v-else-if="state.view === 'campfire'" class="rokenpo-actions">
          <h2 class="rokenpo-title" style="font-size: 3rem">{{ copy.campfire }}</h2>
          <button type="button" class="rokenpo-action" @click="dispatch({ type: 'campfire', choice: 'heal' })">{{ copy.heal }}</button>
          <button type="button" class="rokenpo-action" @click="dispatch({ type: 'campfire', choice: 'shields' })">{{ copy.repair }}</button>
        </section>

        <section v-else-if="state.view === 'merchant'" class="rokenpo-actions">
          <h2 class="rokenpo-title" style="font-size: 3rem">{{ copy.merchant }}</h2>
          <p class="rokenpo-hint">{{ copy.merchantLine }}</p>
          <button type="button" class="rokenpo-action" @click="dispatch({ type: 'continue' })">{{ copy.proceed }}</button>
        </section>

        <section v-else-if="state.view === 'gameover'">
          <h2 class="rokenpo-title">{{ copy.gameover }}</h2>
          <p class="rokenpo-kicker">{{ copy.gameoverLine }}</p>
          <button type="button" class="rokenpo-action" data-testid="rokenpo-restart" @click="dispatch({ type: 'reset' })">
            {{ copy.restart }}
          </button>
        </section>

        <p class="sr-only" aria-live="polite">{{ latestLog }}</p>
        <ul v-if="logs.length" class="rokenpo-logs" :aria-label="copy.logsLabel">
          <li v-for="(line, index) in logs" :key="`${index}-${line.text}`">
            <span v-if="line.lead">{{ line.lead }}</span>
            <span v-if="line.result" class="rokenpo-log-result" :class="`is-${line.tone}`">
              {{ line.result }}
            </span>
            <span v-if="line.detail">{{ line.detail }}</span>
          </li>
        </ul>
      </main>
    </div>

    <div v-if="confirmExit" class="rokenpo-modal" role="dialog" aria-modal="true" :aria-label="copy.leaveTitle">
      <h2 class="rokenpo-title" style="font-size: 2.4rem">{{ copy.leaveTitle }}</h2>
      <p class="rokenpo-hint">{{ copy.leaveBody }}</p>
      <button type="button" class="rokenpo-action" @click="confirmExit = false">{{ copy.stay }}</button>
      <button type="button" class="rokenpo-action" @click="leave">{{ copy.leave }}</button>
    </div>
    <div v-else-if="paused" class="rokenpo-modal" role="dialog" aria-modal="true" :aria-label="copy.pause">
      <h2 class="rokenpo-title" style="font-size: 2.4rem">{{ copy.pause }}</h2>
      <button ref="resumeRef" type="button" class="rokenpo-action" @click="paused = false">{{ copy.resume }}</button>
      <button type="button" class="rokenpo-action" @click="requestExit">{{ copy.exit }}</button>
    </div>
    <div v-if="failed" class="rokenpo-modal" role="alert">
      <p>{{ copy.failed }}</p>
      <button type="button" class="rokenpo-action" @click="leave">{{ copy.exit }}</button>
    </div>
  </div>
</template>
