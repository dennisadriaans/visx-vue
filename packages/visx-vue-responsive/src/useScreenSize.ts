import { ref, onMounted, onUnmounted } from 'vue'
import type { DebounceSettings } from './types'
import { debounce } from './debounce'

interface ScreenSize {
  width: number
  height: number
}

const defaultInitialSize: ScreenSize = {
  width: 0,
  height: 0
}

export interface UseScreenSizeConfig extends DebounceSettings {
  /** Initial size before measuring the screen. */
  initialSize?: ScreenSize
}

export function useScreenSize(config: UseScreenSizeConfig = {}) {
  const {
    initialSize = defaultInitialSize,
    debounceTime = 300,
    enableDebounceLeadingCall = true
  } = config

  const width = ref(initialSize.width)
  const height = ref(initialSize.height)

  const handleResize = debounce(
    () => {
      width.value = window.innerWidth
      height.value = window.innerHeight
    },
    debounceTime,
    { leading: enableDebounceLeadingCall }
  )

  onMounted(() => {
    handleResize()
    window.addEventListener('resize', handleResize, false)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize, false)
    handleResize.cancel()
  })

  return { width, height }
}
