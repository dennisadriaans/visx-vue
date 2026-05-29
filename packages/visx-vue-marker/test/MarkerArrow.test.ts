import { describe, test, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { MarkerArrow } from '../src'

describe('<MarkerArrow />', () => {
  test('it should be defined', () => {
    expect(MarkerArrow).toBeDefined()
  })

  test('it should render marker with polyline', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)

    const wrapper = mount(MarkerArrow, {
      attachTo: svg,
      props: { id: 'marker-arrow-test' }
    })

    const marker = wrapper.find('marker')
    const polyline = wrapper.find('polyline')

    expect(marker.exists()).toBe(true)
    expect(marker.attributes('id')).toBe('marker-arrow-test')
    expect(polyline.exists()).toBe(true)

    wrapper.unmount()
  })

  test('it should size correctly', () => {
    const size = 8
    const strokeWidth = 1
    const max = size + strokeWidth * 2
    const midX = size
    const midY = max / 2

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)

    const wrapper = mount(MarkerArrow, {
      attachTo: svg,
      props: { id: 'marker-arrow-test', size, strokeWidth }
    })

    const marker = wrapper.find('marker')
    expect(marker.exists()).toBe(true)
    expect(marker.attributes('markerwidth')).toBe(max.toString())
    expect(marker.attributes('markerheight')).toBe(max.toString())
    expect(marker.attributes('refx')).toBe(midX.toString())
    expect(marker.attributes('refy')).toBe(midY.toString())

    const g = wrapper.find('g')
    expect(g.exists()).toBe(true)
    expect(g.attributes('transform')).toBe(`translate(${strokeWidth}, ${strokeWidth})`)

    const polyline = wrapper.find('polyline')
    expect(polyline.exists()).toBe(true)
    expect(polyline.attributes('points')).toBe('0 0, 8 4, 0 8')

    wrapper.unmount()
  })
})
