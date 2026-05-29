import { describe, it, expect, beforeEach, afterEach } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { scaleLinear } from '@visx-vue/scale'
import { AnimatedAxis } from '../src'
import { addMock, removeMock } from './svgMock'

describe('AnimatedAxis', () => {
  const defaultProps = {
    scale: scaleLinear({
      domain: [0, 10],
      range: [0, 100]
    }),
    orientation: 'bottom'
  } as const

  beforeEach(() => {
    addMock()
  })
  afterEach(removeMock)

  it('should be defined', () => {
    expect(AnimatedAxis).toBeDefined()
  })

  it('should render without errors', async () => {
    const wrapper = mount({
      render() {
        return (
          <svg
            width={100}
            height={100}
          >
            <AnimatedAxis {...defaultProps} />
          </svg>
        )
      }
    })

    await wrapper.vm.$nextTick()

    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)

    const axisLine = wrapper.find('.visx-axis-line')
    expect(axisLine.exists()).toBe(true)

    const ticks = wrapper.findAll('.visx-axis-tick')
    expect(ticks.length).toBeGreaterThan(0)

    const labels = wrapper.findAll('text')
    expect(labels.length).toBeGreaterThan(0)
  })
})
