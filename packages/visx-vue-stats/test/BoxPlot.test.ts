import { describe, test, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { scaleLinear } from '@visx-vue/scale'
import { BoxPlot, computeStats } from '../src'

const data = [1, 2, 3, 4, 5, 6, 6, 7, 8, 9, 1]
const { boxPlot: boxPlotData } = computeStats(data)
const { min, firstQuartile, median, thirdQuartile, max, outliers } = boxPlotData

const valueScale = scaleLinear<number>({
  range: [10, 0],
  round: true,
  domain: [0, 10]
})

describe('<BoxPlot />', () => {
  const renderBoxPlot = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', '100')
    svg.setAttribute('height', '100')
    document.body.appendChild(svg)

    return mount(BoxPlot, {
      attachTo: svg,
      props: {
        min,
        max,
        left: 0,
        firstQuartile,
        thirdQuartile,
        median,
        boxWidth: 100,
        valueScale,
        outliers
      }
    })
  }

  test('it should be defined', () => {
    expect(BoxPlot).toBeDefined()
  })

  test('it should have className .visx-boxplot', () => {
    const wrapper = renderBoxPlot()
    expect(wrapper.find('.visx-boxplot').exists()).toBe(true)
    wrapper.unmount()
  })

  test('it should render 5 lines and one rectangle', () => {
    const wrapper = renderBoxPlot()
    const boxPlotGroup = wrapper.find('.visx-boxplot')
    expect(boxPlotGroup.findAll('line')).toHaveLength(5)
    expect(boxPlotGroup.findAll('rect')).toHaveLength(1)
    wrapper.unmount()
  })
})
