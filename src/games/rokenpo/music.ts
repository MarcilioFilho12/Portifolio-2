export type TrackId = 'opening' | 'combat'

interface Track {
  src: string
  volume: number
  /** Whether stopping rewinds. The theme that spans screens keeps its position
   * so it is not restarted after every fight; combat restarts on its intro. */
  rewind: boolean
  audio: HTMLAudioElement | null
  fade: number
}

// One element per track, created on demand and reused for the whole session, so
// entering combat repeatedly never allocates or re-downloads anything.
const tracks: Record<TrackId, Track> = {
  opening: {
    src: '/media/audio/the-raising-fighting-spirit.mp3',
    volume: 0.4,
    rewind: false,
    audio: null,
    fade: 0,
  },
  combat: {
    src: '/media/audio/heavy-violence.mp3',
    volume: 0.34,
    rewind: true,
    audio: null,
    fade: 0,
  },
}

let current: TrackId | null = null
let suspended = false

function element(id: TrackId) {
  const track = tracks[id]
  if (!track.audio) {
    const audio = new Audio()
    audio.preload = 'auto'
    audio.loop = true
    audio.volume = track.volume
    // src last: with preload already set, assigning it starts the buffering.
    audio.src = track.src
    track.audio = audio
  }
  return track.audio
}

/** Starts buffering a track ahead of the screen that needs it. Safe to call often. */
export function warmTrack(id: TrackId) {
  element(id)
}

function stopFade(track: Track) {
  window.cancelAnimationFrame(track.fade)
  track.fade = 0
}

function ramp(id: TrackId, to: number, ms: number, done?: () => void) {
  const track = tracks[id]
  const audio = track.audio
  if (!audio) return
  stopFade(track)
  const from = audio.volume
  const started = performance.now()
  const step = (now: number) => {
    const progress = Math.min(1, (now - started) / ms)
    audio.volume = from + (to - from) * progress
    if (progress < 1) {
      track.fade = requestAnimationFrame(step)
      return
    }
    track.fade = 0
    done?.()
  }
  track.fade = requestAnimationFrame(step)
}

function fadeTrack(id: TrackId) {
  const track = tracks[id]
  const audio = track.audio
  if (!audio || audio.paused) {
    stopFade(track)
    return
  }
  if (current === id) current = null
  ramp(id, 0, 400, () => {
    audio.pause()
    if (track.rewind) audio.currentTime = 0
  })
}

export async function playTrack(id: TrackId) {
  if (current && current !== id) fadeTrack(current)

  const track = tracks[id]
  const audio = element(id)
  // Held by suspendMusic: pick the song back up instead of restarting it.
  const resuming = suspended && current === id && audio.paused
  current = id
  suspended = false
  stopFade(track)

  if (!audio.paused) {
    ramp(id, track.volume, 200)
    return
  }

  if (!resuming && track.rewind) audio.currentTime = 0
  audio.volume = 0
  try {
    await audio.play()
  } catch (error) {
    if (current === id) current = null
    audio.volume = track.volume
    throw error
  }
  ramp(id, track.volume, 400)
}

/** Holds the current track at its position, for the pause menu. */
export function suspendMusic() {
  if (!current) return
  const track = tracks[current]
  stopFade(track)
  track.audio?.pause()
  suspended = true
}

export function stopMusic() {
  for (const track of Object.values(tracks)) {
    stopFade(track)
    if (!track.audio) continue
    track.audio.pause()
    track.audio.currentTime = 0
    track.audio.volume = track.volume
  }
  current = null
  suspended = false
}
