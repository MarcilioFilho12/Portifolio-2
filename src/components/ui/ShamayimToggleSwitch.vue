<script setup lang="ts">
import { computed, ref, watch } from 'vue'

export type TogglePattern =
  | 'conic'
  | 'linear'
  | 'dots'
  | 'grid'
  | 'checker'
  | 'hex'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    defaultState?: boolean
    mirrored?: boolean
    pattern?: TogglePattern
    iconOff?: string
    iconOn?: string
    iconShadow?: string
    trackBg?: string
    trackShadow?: string
    buttonBg?: string
    buttonShadow?: string
    buttonBeforeBg?: string
    buttonAfterBg?: string
    offLabel?: string
    onLabel?: string
  }>(),
  {
    modelValue: undefined,
    defaultState: false,
    mirrored: false,
    pattern: 'conic',
    offLabel: 'PT',
    onLabel: 'EN',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean]
}>()

const portfolioDefaults = {
  iconOff: 'var(--color-text-muted)',
  iconOn: 'var(--color-glow)',
  iconShadow: '0 1px 1px color-mix(in srgb, var(--color-glow) 35%, transparent)',
  trackBg:
    'repeating-conic-gradient(var(--color-primary) 0deg 18deg, var(--color-accent) 18deg 36deg)',
  trackShadow:
    'inset 0 0.125em 0.25em rgba(7, 7, 13, 0.65), inset -1.5em 0 0.0625em rgba(7, 7, 13, 0.45), inset 0.5em 0 0.5em rgba(7, 7, 13, 0.45), 0 1px 1px color-mix(in srgb, var(--color-glow) 30%, transparent)',
  buttonBg: 'linear-gradient(to right, var(--color-glow), var(--color-primary))',
  buttonShadow: '0 0.125em 0.25em rgb(0 0 0 / 0.55)',
  buttonBeforeBg:
    'linear-gradient(to right, var(--color-primary), var(--color-accent), var(--color-glow))',
  buttonAfterBg:
    'repeating-linear-gradient(to right, color-mix(in srgb, var(--color-glow) 55%, transparent) 0 0.0625em, var(--color-accent) 0.0625em 0.125em, transparent 0.125em 0.1875em)',
} as const

const patternPresets: Record<
  TogglePattern,
  { trackBg: string; backgroundSize?: string; backgroundPosition?: string }
> = {
  conic: {
    trackBg:
      'repeating-conic-gradient(var(--color-primary) 0deg 18deg, var(--color-accent) 18deg 36deg)',
    backgroundSize: '18px 18px',
  },
  linear: {
    trackBg:
      'repeating-linear-gradient(135deg, var(--color-primary) 0 2px, var(--color-accent) 2px 4px)',
    backgroundSize: '8px 8px',
  },
  dots: {
    trackBg:
      'radial-gradient(circle at 2px 2px, var(--color-accent) 1.5px, transparent 0), radial-gradient(circle at 6px 6px, var(--color-primary) 1.5px, transparent 0)',
    backgroundSize: '8px 8px',
  },
  grid: {
    trackBg:
      'linear-gradient(var(--color-accent) 1.5px, transparent 1.5px), linear-gradient(90deg, var(--color-accent) 1.5px, transparent 1.5px)',
    backgroundSize: '8px 8px',
  },
  checker: {
    trackBg:
      'linear-gradient(45deg, var(--color-primary) 25%, transparent 25%, transparent 75%, var(--color-primary) 75%, var(--color-primary)), linear-gradient(45deg, var(--color-primary) 25%, transparent 25%, transparent 75%, var(--color-primary) 75%, var(--color-primary))',
    backgroundSize: '8px 8px',
    backgroundPosition: '0 0, 4px 4px',
  },
  hex: {
    trackBg:
      'radial-gradient(circle, var(--color-primary) 2px, transparent 2.5px), radial-gradient(circle, var(--color-accent) 2px, transparent 2.5px)',
    backgroundSize: '12px 13.86px',
    backgroundPosition: '0 0, 6px 6.93px',
  },
}

const internal = ref(props.modelValue ?? props.defaultState)

watch(
  () => props.modelValue,
  (value) => {
    if (value !== undefined) internal.value = value
  },
)

const isOn = computed({
  get: () => (props.modelValue !== undefined ? props.modelValue : internal.value),
  set: (value: boolean) => {
    internal.value = value
    emit('update:modelValue', value)
    emit('change', value)
  },
})

const preset = computed(() => patternPresets[props.pattern] ?? patternPresets.conic)

const trackStyle = computed(() => ({
  backgroundImage: props.trackBg ?? preset.value.trackBg ?? portfolioDefaults.trackBg,
  backgroundSize: preset.value.backgroundSize ?? '16px 16px',
  backgroundPosition: preset.value.backgroundPosition ?? '0 0',
  boxShadow: props.trackShadow ?? portfolioDefaults.trackShadow,
}))

const buttonStyle = computed(() => ({
  backgroundImage: props.buttonBg ?? portfolioDefaults.buttonBg,
  boxShadow: props.buttonShadow ?? portfolioDefaults.buttonShadow,
}))

const iconOffColor = computed(() => props.iconOff ?? portfolioDefaults.iconOff)
const iconOnColor = computed(() => props.iconOn ?? portfolioDefaults.iconOn)
const iconShadowFilter = computed(
  () => `drop-shadow(${props.iconShadow ?? portfolioDefaults.iconShadow})`,
)

const buttonBeforeBg = computed(
  () => props.buttonBeforeBg ?? portfolioDefaults.buttonBeforeBg,
)
const buttonAfterBg = computed(() => props.buttonAfterBg ?? portfolioDefaults.buttonAfterBg)

function handleToggle() {
  isOn.value = !isOn.value
}
</script>

<template>
  <div
    class="shamayim-toggle"
    :class="{ 'shamayim-toggle--mirrored': mirrored }"
    :style="{ '--btn-before-bg': buttonBeforeBg, '--btn-after-bg': buttonAfterBg }"
  >
    <input
      class="shamayim-toggle__checkbox"
      type="checkbox"
      :checked="isOn"
      :aria-checked="isOn"
      @change="handleToggle"
    />

    <span
      class="shamayim-toggle__label shamayim-toggle__label--off font-mono-label"
      :style="{
        color: !isOn ? iconOnColor : iconOffColor,
        filter: iconShadowFilter,
      }"
    >{{ offLabel }}</span>

    <div class="shamayim-toggle__track" :style="trackStyle">
      <div class="shamayim-toggle__button" :style="buttonStyle" />
    </div>

    <span
      class="shamayim-toggle__label shamayim-toggle__label--on font-mono-label"
      :style="{
        color: isOn ? iconOnColor : iconOffColor,
        filter: iconShadowFilter,
      }"
    >{{ onLabel }}</span>
  </div>
</template>

<style scoped>
.shamayim-toggle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 0.35em;
  font-size: 11px;
  line-height: 1;
}

.shamayim-toggle--mirrored {
  transform: scaleX(-1);
}

.shamayim-toggle--mirrored .shamayim-toggle__label {
  transform: scaleX(-1);
}

.shamayim-toggle__label {
  min-width: 1.25em;
  text-align: center;
  letter-spacing: 0.12em;
  transition: color 0.4s ease;
  user-select: none;
  pointer-events: none;
}

.shamayim-toggle__checkbox {
  position: absolute;
  inset: 0;
  z-index: 2;
  margin: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  appearance: none;
}

.shamayim-toggle__track {
  position: relative;
  flex-shrink: 0;
  border-radius: 3.125em;
  width: 4.05em;
  height: 1.5em;
}

.shamayim-toggle__button {
  position: absolute;
  top: 0.0625em;
  left: 0.0625em;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: inherit;
  width: 2.55em;
  height: calc(100% - 0.125em);
  transition: left 0.4s cubic-bezier(0.625, 0.05, 0, 1);
}

.shamayim-toggle__checkbox:checked ~ .shamayim-toggle__track .shamayim-toggle__button {
  left: 1.4375em;
}

.shamayim-toggle__button::before {
  content: '';
  position: absolute;
  top: 0;
  border-radius: inherit;
  width: calc(100% - 0.375em);
  height: 100%;
  background-image: var(--btn-before-bg);
}

.shamayim-toggle__button::after {
  content: '';
  position: absolute;
  width: 0.5em;
  height: 38%;
  background-image: var(--btn-after-bg);
}

@media (prefers-reduced-motion: reduce) {
  .shamayim-toggle__button {
    transition-duration: 0.01ms;
  }

  .shamayim-toggle__label {
    transition-duration: 0.01ms;
  }
}
</style>
