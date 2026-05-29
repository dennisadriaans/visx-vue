import { describe, test, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import {
  scaleBand,
  scaleLinear,
  scaleOrdinal,
  scaleThreshold,
  scaleQuantile
} from '@visx-vue/scale'

import {
  Legend,
  LegendLinear,
  LegendOrdinal,
  LegendSize,
  LegendThreshold,
  LegendQuantile
} from '../src'

describe('Legend scales', () => {
  test('should render with scaleLinear', () => {
    const linearScale = scaleLinear<number>({
      domain: [0, 10],
      range: [1, 5, 10, 15, 20]
    })

    const wrapper1 = mount(LegendLinear, { props: { scale: linearScale } })
    expect(wrapper1.find('.visx-legend').exists()).toBe(true)

    const wrapper2 = mount(LegendSize, { props: { scale: linearScale } })
    expect(wrapper2.find('.visx-legend').exists()).toBe(true)

    const wrapper3 = mount(Legend, { props: { scale: linearScale } })
    expect(wrapper3.find('.visx-legend').exists()).toBe(true)
  })

  test('should render with scaleOrdinal', () => {
    const ordinalScale = scaleOrdinal<string, string>({
      domain: ['a', 'b', 'c', 'd'],
      range: ['#66d981', '#71f5ef', '#4899f1', '#7d81f6']
    })

    const wrapper1 = mount(LegendOrdinal, { props: { scale: ordinalScale } })
    expect(wrapper1.element).toBeTruthy()

    const wrapper2 = mount(Legend, { props: { scale: ordinalScale } })
    expect(wrapper2.element).toBeTruthy()
  })

  test('should render with scaleBand', () => {
    const bandScale = scaleBand<string>({
      domain: ['a', 'b', 'c', 'd'],
      range: [1, 10]
    })

    const wrapper = mount(Legend, { props: { scale: bandScale } })
    expect(wrapper.element).toBeTruthy()
  })

  test('should render with scaleThreshold', () => {
    const thresholdScale = scaleThreshold<number, string>({
      domain: [0.01, 0.02, 0.04, 0.06, 0.08, 0.1],
      range: ['#f2f0f7', '#dadaeb', '#bcbddc', '#9e9ac8', '#756bb1', '#54278f']
    })

    const wrapper1 = mount(LegendThreshold, { props: { scale: thresholdScale } })
    expect(wrapper1.element).toBeTruthy()

    const wrapper2 = mount(Legend, { props: { scale: thresholdScale } })
    expect(wrapper2.element).toBeTruthy()
  })

  test('should render with scaleQuantile', () => {
    const quantileScale = scaleQuantile<string>({
      domain: [0.01, 0.02, 0.04, 0.06, 0.08, 0.1],
      range: ['#f2f0f7', '#dadaeb', '#bcbddc', '#9e9ac8', '#756bb1', '#54278f']
    })

    const wrapper1 = mount(LegendQuantile, { props: { scale: quantileScale } })
    expect(wrapper1.element).toBeTruthy()

    const wrapper2 = mount(Legend, { props: { scale: quantileScale } })
    expect(wrapper2.element).toBeTruthy()
  })
})
