import { describe, it, expect, vi, beforeEach } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { defineComponent, h, ref, type Ref } from 'vue'
import { useBoundingRects } from '../src'

const mockRect: DOMRect = {
  top: 50,
  left: 50,
  bottom: 0,
  right: 0,
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  toJSON: vi.fn()
}

function createWrapper() {
  let composableReturn!: ReturnType<typeof useBoundingRects>

  const WrapperComponent = defineComponent({
    setup() {
      const nodeRef = ref<HTMLElement | null>(null) as Ref<HTMLElement | null>
      composableReturn = useBoundingRects(nodeRef)
      return { nodeRef, ...composableReturn }
    },
    render() {
      return h('div', { ref: 'nodeRef' }, 'content')
    }
  })

  const wrapper = mount(WrapperComponent, {
    attachTo: document.body
  })

  return { wrapper, composableReturn }
}

describe('useBoundingRects', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(mockRect)
  })

  it('should be defined', () => {
    expect(useBoundingRects).toBeDefined()
  })

  it('should return rect and parentRect as undefined before mount when no element', () => {
    let composableReturn!: ReturnType<typeof useBoundingRects>

    const Comp = defineComponent({
      setup() {
        const nodeRef = ref<HTMLElement | null>(null)
        composableReturn = useBoundingRects(nodeRef)
        return () => null
      }
    })

    mount(Comp)

    expect(composableReturn.rect.value).toBeUndefined()
    expect(composableReturn.parentRect.value).toBeUndefined()
  })

  it('should measure rect and parentRect on mount when element ref is provided', () => {
    const { composableReturn } = createWrapper()

    expect(Element.prototype.getBoundingClientRect).toHaveBeenCalledTimes(2)

    expect(composableReturn.rect.value).toEqual({
      top: mockRect.top,
      right: mockRect.right,
      bottom: mockRect.bottom,
      left: mockRect.left,
      width: mockRect.width,
      height: mockRect.height
    })

    expect(composableReturn.parentRect.value).toEqual({
      top: mockRect.top,
      right: mockRect.right,
      bottom: mockRect.bottom,
      left: mockRect.left,
      width: mockRect.width,
      height: mockRect.height
    })
  })

  it('should re-measure when update() is called', () => {
    const { composableReturn } = createWrapper()

    expect(Element.prototype.getBoundingClientRect).toHaveBeenCalledTimes(2)

    composableReturn.update()

    expect(Element.prototype.getBoundingClientRect).toHaveBeenCalledTimes(4)
  })

  it('should use emptyRect when getBoundingClientRect is not available', () => {
    vi.restoreAllMocks()
    const original = Element.prototype.getBoundingClientRect
    ;(Element.prototype as any).getBoundingClientRect = null

    const { composableReturn, wrapper } = createWrapper()

    const emptyRect = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      width: 0,
      height: 0
    }

    expect(composableReturn.rect.value).toEqual(emptyRect)
    expect(composableReturn.parentRect.value).toEqual(emptyRect)

    Element.prototype.getBoundingClientRect = original
    wrapper.unmount()
  })

  it('should set rect and parentRect to undefined when node ref becomes null and update is called', () => {
    let composableReturn!: ReturnType<typeof useBoundingRects>
    const nodeRef = ref<HTMLElement | null>(null)

    const Comp = defineComponent({
      setup() {
        composableReturn = useBoundingRects(nodeRef)
        return { nodeRef }
      },
      render() {
        return h('div', { ref: 'nodeRef' }, 'content')
      }
    })

    const wrapper = mount(Comp, { attachTo: document.body })

    expect(composableReturn.rect.value).toBeDefined()

    nodeRef.value = null
    composableReturn.update()

    expect(composableReturn.rect.value).toBeUndefined()
    expect(composableReturn.parentRect.value).toBeUndefined()

    wrapper.unmount()
  })
})
