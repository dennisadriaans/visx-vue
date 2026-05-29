import { ref, shallowRef, onMounted, onUnmounted, type Ref, type ShallowRef } from 'vue'
import type { DebounceSettings, ResizeObserverPolyfill } from './types'
import { debounce } from './debounce'

export interface ParentSizeState {
  width: number
  height: number
  top: number
  left: number
}

export interface UseParentSizeConfig extends DebounceSettings {
  /** Initial size before measuring the parent. */
  initialSize?: Partial<ParentSizeState>
  /** Optionally inject a ResizeObserver polyfill, else this *must* be globally available. */
  resizeObserverPolyfill?: ResizeObserverPolyfill
  /** Optional dimensions provided won't trigger a state change when changed. */
  ignoreDimensions?: keyof ParentSizeState | (keyof ParentSizeState)[]
}

const defaultInitialSize: ParentSizeState = {
  width: 0,
  height: 0,
  top: 0,
  left: 0
}

const defaultIgnoreDimensions: UseParentSizeConfig['ignoreDimensions'] = []

export interface UseParentSizeResult<T extends HTMLElement = HTMLDivElement> {
  parentRef: ShallowRef<T | null>
  resize: ((...args: [ParentSizeState]) => void) & { cancel: () => void }
  width: Ref<number>
  height: Ref<number>
  top: Ref<number>
  left: Ref<number>
}

export function useParentSize<T extends HTMLElement = HTMLDivElement>(
  config: UseParentSizeConfig = {}
): UseParentSizeResult<T> {
  const {
    initialSize,
    debounceTime = 300,
    ignoreDimensions = defaultIgnoreDimensions,
    enableDebounceLeadingCall = true,
    resizeObserverPolyfill
  } = config

  const parentRef = shallowRef<T | null>(null)
  const width = ref(initialSize?.width ?? defaultInitialSize.width)
  const height = ref(initialSize?.height ?? defaultInitialSize.height)
  const top = ref(initialSize?.top ?? defaultInitialSize.top)
  const left = ref(initialSize?.left ?? defaultInitialSize.left)

  let animationFrameID = 0

  const normalized = Array.isArray(ignoreDimensions) ? ignoreDimensions : [ignoreDimensions]

  const resize = debounce(
    (incoming: ParentSizeState) => {
      const existing: ParentSizeState = {
        width: width.value,
        height: height.value,
        top: top.value,
        left: left.value
      }
      const stateKeys = Object.keys(existing) as (keyof ParentSizeState)[]
      const keysWithChanges = stateKeys.filter((key) => existing[key] !== incoming[key])
      const shouldBail = keysWithChanges.every((key) => normalized.includes(key))

      if (!shouldBail) {
        width.value = incoming.width
        height.value = incoming.height
        top.value = incoming.top
        left.value = incoming.left
      }
    },
    debounceTime,
    { leading: enableDebounceLeadingCall }
  )

  let observer: ResizeObserver | undefined

  onMounted(() => {
    const LocalResizeObserver = resizeObserverPolyfill ?? window.ResizeObserver

    observer = new LocalResizeObserver((entries) => {
      entries.forEach((entry) => {
        const { left: l, top: t, width: w, height: h } = entry.contentRect ?? {}
        animationFrameID = window.requestAnimationFrame(() => {
          resize({ width: w, height: h, top: t, left: l })
        })
      })
    })

    if (parentRef.value) observer.observe(parentRef.value)
  })

  onUnmounted(() => {
    window.cancelAnimationFrame(animationFrameID)
    observer?.disconnect()
    resize.cancel()
  })

  return {
    parentRef: parentRef as ShallowRef<T | null>,
    resize,
    width,
    height,
    top,
    left
  }
}
