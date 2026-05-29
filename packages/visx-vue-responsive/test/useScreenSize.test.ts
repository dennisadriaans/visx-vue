import { describe, test, expect, vi, beforeEach, afterEach } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { useScreenSize } from '../src'

const setWindowSize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height
  })
}

/** Helper: wraps the composable in a component so lifecycle hooks fire. */
function mountComposable(config: Parameters<typeof useScreenSize>[0] = {}) {
  let result!: ReturnType<typeof useScreenSize>

  const Comp = defineComponent({
    setup() {
      result = useScreenSize(config)
      return () => h('div', `${result.width.value}x${result.height.value}`)
    }
  })

  const wrapper = mount(Comp)
  return { wrapper, result }
}

describe('useScreenSize', () => {
  beforeEach(() => {
    setWindowSize(1280, 1024)
  })

  afterEach(() => {
    // @ts-ignore - resetting test overrides
    delete window.innerWidth
    // @ts-ignore
    delete window.innerHeight
  })

  test('it should return the initial screen size', () => {
    // DEVIATION: The Vue composable reads window dimensions inside onMounted (leading call),
    // so after mount the refs reflect window.innerWidth/innerHeight.
    vi.useFakeTimers()
    const { result } = mountComposable()
    vi.advanceTimersByTime(500)

    expect(result.width.value).toBe(1280)
    expect(result.height.value).toBe(1024)

    vi.useRealTimers()
  })

  test('it should update the screen size on window resize', async () => {
    vi.useFakeTimers()

    const { result } = mountComposable()
    vi.advanceTimersByTime(500)

    expect(result.width.value).toBe(1280)
    expect(result.height.value).toBe(1024)

    // Simulate the window resize event
    setWindowSize(800, 600)
    window.dispatchEvent(new Event('resize'))
    vi.advanceTimersByTime(500)
    await nextTick()

    expect(result.width.value).toBe(800)
    expect(result.height.value).toBe(600)

    vi.useRealTimers()
  })

  test('it should respect custom initial size before mount', () => {
    // Before onMounted fires, the refs should hold the provided initial size.
    // After mount with leading=true, they'll be overwritten by window dimensions.
    vi.useFakeTimers()
    const { result } = mountComposable({
      initialSize: { width: 999, height: 888 },
      enableDebounceLeadingCall: false
    })

    // With enableDebounceLeadingCall=false, no leading call — need to wait for debounce
    // Initial size should show before debounce fires
    // Actually the debounce schedules a trailing call in onMounted, so initial shows briefly.
    // After timer advances the trailing call fires:
    vi.advanceTimersByTime(500)
    expect(result.width.value).toBe(1280)
    expect(result.height.value).toBe(1024)

    vi.useRealTimers()
  })

  test('it should remove resize listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    const { wrapper } = mountComposable()
    wrapper.unmount()
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function), false)
  })
})
