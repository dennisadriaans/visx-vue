import { describe, test, expect, beforeEach, afterEach } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { scaleThreshold } from '@visx-vue/scale'
import { LegendThreshold } from '../src'
import { addMock, removeMock } from './svgMock'

describe('<LegendThreshold />', () => {
  beforeEach(addMock)
  afterEach(removeMock)

  test('it should be defined', () => {
    expect(LegendThreshold).toBeDefined()
  })

  test('should render LegendShape with the correct color', () => {
    const domain = [1, 2, 9]
    const range = ['green', 'purple', 'blue', 'pink']
    const thresholdScale = scaleThreshold({
      domain,
      range
    })

    const wrapper = mount(LegendThreshold, {
      props: { scale: thresholdScale },
      attrs: { 'data-testid': 'thresholdLegend' }
    })

    const legendItems = wrapper.findAll('[data-testid="thresholdLegend"]')

    range.forEach((color, index) => {
      const legendItem = legendItems[index]
      const legendShape = legendItem?.find('.visx-legend-shape')
      const shapeDiv = legendShape?.find('div')
      expect((shapeDiv!.element as HTMLElement).style.background).toBe(color)
    })
  })

  test('should render LegendShape with the correct color with a negitive domain', () => {
    const domain = [-3, -1]
    const range = ['green', 'purple', 'blue']
    const thresholdScale1 = scaleThreshold({
      domain,
      range
    })

    const wrapper = mount(LegendThreshold, {
      props: { scale: thresholdScale1 },
      attrs: { 'data-testid': 'thresholdLegend' }
    })

    const legendItems = wrapper.findAll('[data-testid="thresholdLegend"]')

    range.forEach((color, index) => {
      const legendItem = legendItems[index]
      const legendShape = legendItem?.find('.visx-legend-shape')
      const shapeDiv = legendShape?.find('div')
      expect((shapeDiv!.element as HTMLElement).style.background).toBe(color)
    })
  })

  test('should render LegendShape with the correct color with 0', () => {
    const domain = [0, 1, 4]
    const range = ['green', 'purple', 'blue', 'pink']
    const thresholdScale1 = scaleThreshold({
      domain,
      range
    })

    const wrapper = mount(LegendThreshold, {
      props: { scale: thresholdScale1 },
      attrs: { 'data-testid': 'thresholdLegend' }
    })

    const legendItems = wrapper.findAll('[data-testid="thresholdLegend"]')

    range.forEach((color, index) => {
      const legendItem = legendItems[index]
      const legendShape = legendItem?.find('.visx-legend-shape')
      const shapeDiv = legendShape?.find('div')
      expect((shapeDiv!.element as HTMLElement).style.background).toBe(color)
    })
  })
})
