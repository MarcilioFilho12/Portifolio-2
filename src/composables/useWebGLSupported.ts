import { onMounted, ref } from 'vue'

export function useWebGLSupported() {
  const isSupported = ref(false)

  onMounted(() => {
    try {
      const canvas = document.createElement('canvas')
      isSupported.value = !!(
        canvas.getContext('webgl2') ?? canvas.getContext('webgl')
      )
    } catch {
      isSupported.value = false
    }
  })

  return { isSupported }
}
