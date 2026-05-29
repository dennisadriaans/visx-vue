import { describe, test, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { Glyph } from '../src'

describe('<Glyph />', () => {
  const mountGlyph = (props = {}) =>
    mount(() => (
      <svg>
        <Glyph {...props} />
      </svg>
    ))

  test('it should be defined', () => {
    expect(Glyph).toBeDefined()
  })

  test('it should render with default className', () => {
    const wrapper = mountGlyph()
    const glyph = wrapper.find('.visx-glyph')
    expect(glyph.exists()).toBe(true)
    expect(glyph.classes()).toContain('visx-glyph')
  })

  test('it should render with custom className', () => {
    const wrapper = mountGlyph({ className: 'test' })
    const glyph = wrapper.find('.test')
    expect(glyph.exists()).toBe(true)
    expect(glyph.classes()).toContain('test')
  })

  test('it should apply transform with top/left props', () => {
    const wrapper = mountGlyph({ top: 2, left: 2 })
    const glyph = wrapper.find('.visx-glyph')
    expect(glyph.attributes('transform')).toBe('translate(2, 2)')
  })
})
