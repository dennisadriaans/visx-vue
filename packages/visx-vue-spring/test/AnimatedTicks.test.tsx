import { describe, it, expect, beforeEach, afterEach } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { scaleLinear } from '@visx-vue/scale'
import { AnimatedTicks } from '../src'
import { addMock, removeMock } from './svgMock'

describe('AnimatedTicks', () => {
  beforeEach(addMock)
  afterEach(removeMock)

  it('should be defined', () => {
    expect(AnimatedTicks).toBeDefined()
  })

  it('should render tickComponent defined', () => {
    const wrapper = mount({
      render() {
        return (
          <svg>
            <AnimatedTicks
              hideTicks={false}
              horizontal={false}
              orientation="bottom"
              tickComponent={() => <text>Test Component</text>}
              scale={scaleLinear({ domain: [0, 10], range: [0, 10] })}
              tickLabelProps={[]}
              ticks={[
                {
                  from: { x: 0, y: 0 },
                  to: { x: 0, y: 5 },
                  value: 0,
                  index: 0,
                  formattedValue: '0'
                }
              ]}
            />
          </svg>
        )
      }
    })

    expect(wrapper.text()).toContain('Test Component')
  })

  it('should render without errors', () => {
    const wrapper = mount({
      render() {
        return (
          <svg>
            <AnimatedTicks
              hideTicks={false}
              horizontal={false}
              orientation="bottom"
              scale={scaleLinear({ domain: [0, 10], range: [0, 10] })}
              tickLabelProps={[]}
              ticks={[
                {
                  from: { x: 0, y: 0 },
                  to: { x: 0, y: 5 },
                  value: 0,
                  index: 0,
                  formattedValue: '0'
                }
              ]}
            />
          </svg>
        )
      }
    })

    const tickGroup = wrapper.find('.visx-axis-tick')
    expect(tickGroup.exists()).toBe(true)
  })
})
