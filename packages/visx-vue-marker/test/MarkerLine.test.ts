import { describe, test, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { MarkerLine } from '../src'

describe('<MarkerLine />', () => {
  test('it should be defined', () => {
    expect(MarkerLine).toBeDefined()
  })

  test('it should render a marker and rect', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)

    const wrapper = mount(MarkerLine, {
      attachTo: svg,
      props: { id: 'marker-line-test' }
    })

    const marker = wrapper.find('marker')
    const rect = wrapper.find('rect')

    expect(marker.exists()).toBe(true)
    expect(rect.exists()).toBe(true)

    wrapper.unmount()
  })

  test('it should render with correct attributes', () => {
    const size = 8
    const strokeWidth = 1
    const stroke = 'blue'

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)

    const wrapper = mount(MarkerLine, {
      attachTo: svg,
      props: { id: 'marker-line-test', size, stroke, strokeWidth }
    })

    // Calculate expected values
    const max = Math.max(size, strokeWidth * 2)
    const midX = max / 2
    const midY = size / 2

    // Check marker attributes
    const marker = wrapper.find('marker')
    expect(marker.attributes('markerwidth')).toBe(max.toString())
    expect(marker.attributes('markerheight')).toBe(size.toString())
    expect(marker.attributes('refx')).toBe(midX.toString())
    expect(marker.attributes('refy')).toBe(midY.toString())
    expect(marker.attributes('fill')).toBe(stroke)

    // Check rect element attributes
    const rect = wrapper.find('rect')
    expect(rect.attributes('width')).toBe(strokeWidth.toString())
    expect(rect.attributes('height')).toBe(size.toString())
    expect(rect.attributes('x')).toBe(midX.toString())

    wrapper.unmount()
  })
})
