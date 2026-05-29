import { describe, it, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { LineSubject } from '../src'

describe('<LineSubject />', () => {
  it('should be defined', () => {
    expect(LineSubject).toBeDefined()
  })

  it('should render a line', () => {
    const wrapper = mount({
      render() {
        return (
          <svg
            width={100}
            height={100}
          >
            <LineSubject
              min={0}
              max={100}
              x={50}
              y={50}
            />
          </svg>
        )
      }
    })

    expect(wrapper.find('line').exists()).toBe(true)
  })
})
