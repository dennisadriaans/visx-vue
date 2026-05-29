import { describe, test, expect, it, vi } from 'vite-plus/test'
import { defineComponent, nextTick, h } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import useTooltipInPortal from '../src/useTooltipInPortal'
// Mock @vueuse/core useElementBounding to avoid real DOM measurements in jsdom
vi.mock('@vueuse/core', () => ({
  useElementBounding: () => ({
    left: { value: 0 },
    top: { value: 0 },
    width: { value: 0 },
    height: { value: 0 },
    right: { value: 0 },
    bottom: { value: 0 },
    x: { value: 0 },
    y: { value: 0 },
    update: vi.fn()
  })
}))

// Mock @visx-vue/bounds for TooltipWithBounds used inside the portal
vi.mock('@visx-vue/bounds', () => ({
  useBoundingRects: () => ({
    rect: { value: undefined },
    parentRect: { value: undefined },
    update: vi.fn()
  })
}))

const TooltipWithZIndex = defineComponent({
  name: 'TooltipWithZIndex',
  props: {
    zIndexOption: { type: [Number, String], default: undefined },
    zIndexProp: { type: [Number, String], default: undefined }
  },
  setup(props) {
    const { TooltipInPortal } = useTooltipInPortal({
      zIndex: props.zIndexOption
    })

    return () =>
      h(
        TooltipInPortal,
        { zIndex: props.zIndexProp, 'data-testid': 'tooltip-portal' },
        { default: () => 'Hello' }
      )
  }
})

describe('useTooltipInPortal()', () => {
  test('it should be defined', () => {
    expect(useTooltipInPortal).toBeDefined()
  })

  it('should pass zIndex prop from options to Portal', async () => {
    const wrapper = mount(TooltipWithZIndex, {
      props: { zIndexOption: 1 },
      attachTo: document.body
    })

    await nextTick()
    await flushPromises()

    const portalDiv = document.body.querySelector('[style*="z-index: 1"]')
    expect(portalDiv).not.toBeNull()

    wrapper.unmount()
  })

  it('should pass zIndex prop from component to Portal', async () => {
    const wrapper = mount(TooltipWithZIndex, {
      props: { zIndexOption: 1, zIndexProp: 'var(--tooltip-zindex)' },
      attachTo: document.body
    })

    await nextTick()
    await flushPromises()

    const tooltipEl = document.body.querySelector('[data-testid="tooltip-portal"]')
    expect(tooltipEl).not.toBeNull()

    wrapper.unmount()
  })
})
