import { describe, test, expect, vi, beforeEach, afterEach } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { scaleLinear } from '@visx-vue/scale'

import { Legend } from '../src'
import { addMock, removeMock } from './svgMock'

const defaultProps = {
  scale: scaleLinear<number>({
    range: [10, 0],
    round: true,
    domain: [0, 10]
  })
}

describe('<Legend />', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    addMock()
  })
  afterEach(removeMock)

  test('it should be defined', () => {
    expect(Legend).toBeDefined()
  })

  test('it should default style to display: flex, flex-direction: column', () => {
    const wrapper = mount(Legend, { props: { ...defaultProps } })
    const legend = wrapper.element as HTMLElement
    expect(legend.style.display).toBe('flex')
    expect(legend.style.flexDirection).toBe('column')
  })

  test('it should extend style prop', () => {
    const wrapper = mount(Legend, {
      props: { ...defaultProps, style: { display: 'block' } }
    })
    const legend = wrapper.element as HTMLElement
    expect(legend.style.display).toBe('block')
    expect(legend.style.flexDirection).toBe('column')
  })

  test('it should pass through direction prop to style prop', () => {
    const wrapper = mount(Legend, {
      props: { ...defaultProps, direction: 'row' }
    })
    const legend = wrapper.element as HTMLElement
    expect(legend.style.display).toBe('flex')
    expect(legend.style.flexDirection).toBe('row')
  })

  test('it should pass through legendLabelProps to legend labels', () => {
    const style = { fontFamily: 'Comic Sans MS' }
    const wrapper = mount(Legend, {
      props: {
        ...defaultProps,
        // DEVIATION: React version passes `id` which isn't in LegendLabelOwnProps; cast to allow extra HTML attributes
        legendLabelProps: { id: 'test-legend-label', style } as any
      }
    })

    const labelElement = wrapper.find('#test-legend-label')
    expect(labelElement.exists()).toBe(true)
    // DEVIATION: Vue Test Utils doesn't have toHaveStyle; check computed style attribute directly
    expect((labelElement.element as HTMLElement).style.fontFamily).toBe('Comic Sans MS')
  })
})
