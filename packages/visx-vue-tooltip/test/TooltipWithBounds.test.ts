import { describe, test, expect, it, vi } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { defaultStyles, TooltipWithBounds } from '../src'

// Mock @visx-vue/bounds so useBoundingRects returns empty rects (no DOM measurement in jsdom)
vi.mock('@visx-vue/bounds', () => ({
  useBoundingRects: () => ({
    rect: { value: undefined },
    parentRect: { value: undefined },
    update: vi.fn()
  })
}))

describe('<TooltipWithBounds />', () => {
  test('it should be defined', () => {
    expect(TooltipWithBounds).toBeDefined()
  })

  it('should render with default styles by default', () => {
    const wrapper = mount(TooltipWithBounds, {
      slots: { default: 'Hello' }
    })
    const tooltip = wrapper.element as HTMLElement

    expect(wrapper.text()).toBe('Hello')
    expect(wrapper.classes()).toContain('visx-tooltip')

    // Check that default styles are applied
    Object.entries(defaultStyles).forEach(([key, value]) => {
      if (key === 'backgroundColor' || key === 'color') {
        expect(typeof tooltip.style[key as any]).toBe('string')
      } else {
        expect(tooltip.style[key as any]).toBe(value)
      }
    })

    wrapper.unmount()
  })

  it('should render without default styles if unstyled is set to true', () => {
    const wrapper = mount(TooltipWithBounds, {
      props: { unstyled: true },
      slots: { default: 'Hello' }
    })
    const tooltip = wrapper.element as HTMLElement

    expect(wrapper.text()).toBe('Hello')
    expect(wrapper.classes()).toContain('visx-tooltip')

    // Verify positioning styles (left/top) are applied
    expect(tooltip.style.top).toBe('0px')
    expect(tooltip.style.left).toBe('0px')

    // Verify default styles are NOT applied
    expect(tooltip.style.backgroundColor).toBe('')
    expect(tooltip.style.color).toBe('')
    expect(tooltip.style.padding).toBe('')
    expect(tooltip.style.borderRadius).toBe('')
    expect(tooltip.style.fontSize).toBe('')
    expect(tooltip.style.boxShadow).toBe('')
    expect(tooltip.style.pointerEvents).toBe('')

    wrapper.unmount()
  })
})
