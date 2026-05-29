import { describe, test, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { HeatmapCircle } from '../src'

const data: {
  bin: number
  bins: { bin: number; count: number }[]
}[] = [{ bin: 0, bins: [{ bin: 0, count: 1 }] }]

const xScale = () => 50
const yScale = () => 50

describe('<HeatmapCircle />', () => {
  test('it should be defined', () => {
    expect(HeatmapCircle).toBeDefined()
  })

  test('it should have the .visx-heatmap-circles class', () => {
    const wrapper = mount(() => (
      <svg>
        <HeatmapCircle
          data={data}
          xScale={xScale}
          yScale={yScale}
        />
      </svg>
    ))
    expect(wrapper.find('.visx-heatmap-circles').exists()).toBe(true)
  })

  test('it should have the .visx-heatmap-circle class', () => {
    const wrapper = mount(() => (
      <svg>
        <HeatmapCircle
          data={data}
          xScale={xScale}
          yScale={yScale}
          className="test"
        />
      </svg>
    ))
    const circle = wrapper.find('circle')
    expect(circle.classes()).toContain('visx-heatmap-circle')
    expect(circle.classes()).toContain('test')
  })

  test('it should set <circle /> r to radius - gap', () => {
    const wrapper = mount(() => (
      <svg>
        <HeatmapCircle
          data={data}
          xScale={xScale}
          yScale={yScale}
          radius={10}
          gap={2}
        />
      </svg>
    ))
    expect(wrapper.find('circle').attributes('r')).toBe('8')
  })
})
