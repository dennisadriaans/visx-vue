import { describe, test, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { ClipPath, CircleClipPath, RectClipPath } from '../src'

describe('ClipPath Components', () => {
  describe('<ClipPath />', () => {
    test('it should be defined', () => {
      expect(ClipPath).toBeDefined()
    })

    test('it should render defs and clipPath elements', () => {
      const wrapper = mount(() => <ClipPath id="test" />)
      expect(wrapper.find('defs').exists()).toBe(true)
      expect(wrapper.find('clipPath').exists()).toBe(true)
    })

    test('it should assign the passed id to the clipPath', () => {
      const wrapper = mount(() => <ClipPath id="best_clip" />)
      const clipPath = wrapper.find('clipPath')
      expect(clipPath.exists()).toBe(true)
      expect(clipPath.attributes('id')).toBe('best_clip')
    })

    test('it should render children', () => {
      const wrapper = mount(() => (
        <svg>
          <ClipPath id="test">
            <circle r={5} />
          </ClipPath>
        </svg>
      ))
      const circle = wrapper.find('circle')
      expect(circle.exists()).toBe(true)
      expect(circle.attributes('r')).toBe('5')
    })
  })

  describe('<RectClipPath />', () => {
    test('it should be defined', () => {
      expect(RectClipPath).toBeDefined()
    })

    test('it should render a rect inside a clipPath', () => {
      const wrapper = mount(() => (
        <svg>
          <RectClipPath id="test" />
        </svg>
      ))
      expect(wrapper.find('clipPath').exists()).toBe(true)
      expect(wrapper.find('rect').exists()).toBe(true)
    })

    test('it should pass props to the rect', () => {
      const wrapper = mount(() => (
        <svg>
          <RectClipPath
            id="test"
            width={100}
            height={200}
            x={10}
            y={20}
          />
        </svg>
      ))
      const rect = wrapper.find('rect')
      expect(rect.exists()).toBe(true)
      expect(rect.attributes('width')).toBe('100')
      expect(rect.attributes('height')).toBe('200')
      expect(rect.attributes('x')).toBe('10')
      expect(rect.attributes('y')).toBe('20')
    })
  })

  describe('<CircleClipPath />', () => {
    test('it should be defined', () => {
      expect(CircleClipPath).toBeDefined()
    })

    test('it should render a circle inside a clipPath', () => {
      const wrapper = mount(() => (
        <svg>
          <CircleClipPath id="test" />
        </svg>
      ))
      expect(wrapper.find('clipPath').exists()).toBe(true)
      expect(wrapper.find('circle').exists()).toBe(true)
    })

    test('it should pass props to the circle', () => {
      const wrapper = mount(() => (
        <svg>
          <CircleClipPath
            id="test"
            r={50}
            cx={100}
            cy={200}
          />
        </svg>
      ))
      const circle = wrapper.find('circle')
      expect(circle.exists()).toBe(true)
      expect(circle.attributes('r')).toBe('50')
      expect(circle.attributes('cx')).toBe('100')
      expect(circle.attributes('cy')).toBe('200')
    })
  })
})
