import { describe, test, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { PatternCircles } from '../src'

describe('<PatternCircles />', () => {
  test('should be defined', () => {
    expect(PatternCircles).toBeDefined()
  })

  test('should render a rect background if background prop defined', () => {
    const wrapper = mount(() => (
      <svg>
        <PatternCircles
          id="test"
          height={4}
          width={4}
          background="blue"
        />
      </svg>
    ))
    const rect = wrapper.find('pattern rect')
    expect(rect.exists()).toBe(true)
    expect(rect.attributes('fill')).toBe('blue')
  })

  test('should not render a rect background if no background prop', () => {
    const wrapper = mount(() => (
      <svg>
        <PatternCircles
          id="test"
          height={4}
          width={4}
        />
      </svg>
    ))
    const rect = wrapper.find('pattern rect')
    expect(rect.exists()).toBe(false)
  })
})
