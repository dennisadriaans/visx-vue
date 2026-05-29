import { describe, test, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { scaleLinear } from '@visx-vue/scale'
import { ViolinPlot, computeStats } from '../src'

const data = [1, 2, 3, 4, 5, 6, 6, 7, 8, 9, 1]
const { binData } = computeStats(data)

const valueScale = scaleLinear({
  range: [10, 0],
  round: true,
  domain: [0, 10]
})

describe('<ViolinPlot />', () => {
  test('it should be defined', () => {
    expect(ViolinPlot).toBeDefined()
  })

  test('it should have className .visx-violin', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)

    const wrapper = mount(ViolinPlot, {
      attachTo: svg,
      props: { data: binData, left: 3, width: 100, valueScale }
    })
    expect(wrapper.find('.visx-violin').exists()).toBe(true)
    wrapper.unmount()
  })

  test('it should render one path element', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', '100')
    svg.setAttribute('height', '100')
    document.body.appendChild(svg)

    const wrapper = mount(ViolinPlot, {
      attachTo: svg,
      props: { data: binData, left: 3, width: 100, valueScale }
    })
    expect(wrapper.findAll('path')).toHaveLength(1)
    wrapper.unmount()
  })
})
