import { describe, it, expect, vi, beforeEach, afterEach } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { ParentSize } from '../src'

// ---------------------------------------------------------------------------
// ResizeObserver mock
// ---------------------------------------------------------------------------
type ROCallback = ResizeObserverCallback
let resizeObserverCallbacks: ROCallback[] = []
let resizeObserverInstances: {
  disconnect: ReturnType<typeof vi.fn>
  observe: ReturnType<typeof vi.fn>
}[] = []

class MockResizeObserver {
  cb: ROCallback
  observe: ReturnType<typeof vi.fn>
  unobserve: ReturnType<typeof vi.fn>
  disconnect: ReturnType<typeof vi.fn>

  constructor(cb: ROCallback) {
    this.cb = cb
    this.observe = vi.fn()
    this.unobserve = vi.fn()
    this.disconnect = vi.fn()
    resizeObserverCallbacks.push(cb)
    resizeObserverInstances.push(this)
  }
}

function triggerResize(
  entry: Partial<ResizeObserverEntry> = {
    contentRect: {
      width: 200,
      height: 100,
      top: 0,
      left: 0,
      x: 0,
      y: 0,
      bottom: 100,
      right: 200,
      toJSON() {}
    }
  } as unknown as Partial<ResizeObserverEntry>
) {
  resizeObserverCallbacks.forEach((cb) => {
    cb([entry as ResizeObserverEntry], {} as ResizeObserver)
  })
}

beforeEach(() => {
  resizeObserverCallbacks = []
  resizeObserverInstances = []
  vi.stubGlobal('ResizeObserver', MockResizeObserver)
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    cb(0)
    return 0
  })
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('<ParentSize />', () => {
  it('should be defined', () => {
    expect(ParentSize).toBeDefined()
  })

  it('does not throw', () => {
    const wrapper = mount(ParentSize, {
      props: {
        resizeObserverPolyfill: MockResizeObserver as unknown as new (
          cb: ResizeObserverCallback
        ) => ResizeObserver
      },
      slots: {
        default: (_props: Record<string, unknown>) => h('div', { 'data-testid': 'test' })
      }
    })
    expect(wrapper.find('[data-testid="test"]').exists()).toBe(true)
  })

  it('renders a div wrapper with default styles', () => {
    const wrapper = mount(ParentSize, {
      slots: {
        default: () => h('span', 'child')
      }
    })
    const div = wrapper.find('div')
    expect(div.exists()).toBe(true)
    expect(div.attributes('style')).toContain('width: 100%')
    expect(div.attributes('style')).toContain('height: 100%')
  })

  it('applies className prop', () => {
    const wrapper = mount(ParentSize, {
      props: { className: 'my-class' },
      slots: {
        default: () => null
      }
    })
    expect(wrapper.find('.my-class').exists()).toBe(true)
  })

  it('provides dimensions via scoped slot', async () => {
    vi.useFakeTimers()
    let slotProps: Record<string, unknown> | undefined

    mount(ParentSize, {
      props: {
        debounceTime: 0
      },
      slots: {
        default: (props: Record<string, unknown>) => {
          slotProps = props
          return h('div', `${props.width}x${props.height}`)
        }
      }
    })

    // Trigger a resize
    triggerResize()
    vi.advanceTimersByTime(10)
    await nextTick()

    expect(slotProps).toBeDefined()
    expect(slotProps!.width).toBe(200)
    expect(slotProps!.height).toBe(100)

    vi.useRealTimers()
  })

  it('respects initialSize', () => {
    let slotProps: Record<string, unknown> | undefined

    mount(ParentSize, {
      props: {
        initialSize: { width: 500, height: 300 }
      },
      slots: {
        default: (props: Record<string, unknown>) => {
          slotProps = props
          return null
        }
      }
    })

    expect(slotProps).toBeDefined()
    expect(slotProps!.width).toBe(500)
    expect(slotProps!.height).toBe(300)
  })
})
