import { describe, it, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { scaleLinear } from '@visx-vue/scale'
import { AnimatedGridColumns } from '../src'

describe('AnimatedGridColumns', () => {
  const defaultProps = {
    scale: scaleLinear({ domain: [0, 10], range: [0, 10] }),
    width: 100,
    height: 100,
    numTicks: 5
  }

  it('should be defined', () => {
    expect(AnimatedGridColumns).toBeDefined()
  })

  it('should render without crashing', () => {
    const wrapper = mount({
      render() {
        return (
          <svg>
            <AnimatedGridColumns {...defaultProps} />
          </svg>
        )
      }
    })

    const gridGroup = wrapper.find('g.visx-columns')
    expect(gridGroup.exists()).toBe(true)
  })
})
