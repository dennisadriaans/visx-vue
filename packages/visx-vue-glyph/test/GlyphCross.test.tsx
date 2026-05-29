import { describe, test, expect, vi } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { GlyphCross } from '../src'

describe('<GlyphCross />', () => {
  const mountGlyph = (props = {}, slotFn?: (...args: any[]) => any) =>
    mount(() => (
      <svg>
        <GlyphCross {...props}>{{ default: slotFn }}</GlyphCross>
      </svg>
    ))

  test('should be defined', () => {
    expect(GlyphCross).toBeDefined()
  })

  test('should render with correct class', () => {
    const wrapper = mountGlyph()
    expect(wrapper.find('.visx-glyph').exists()).toBe(true)
  })

  test('should render with custom className', () => {
    const wrapper = mountGlyph({ className: 'test' })
    expect(wrapper.find('.test').exists()).toBe(true)
  })

  // DEVIATION: React uses children render prop; Vue uses scoped default slot
  test('should call children function', () => {
    const fn = vi.fn(() => <g />)
    mountGlyph({}, fn)
    expect(fn).toHaveBeenCalled()
  })

  test('should pass path to children function', () => {
    const fn = vi.fn(() => <g />)
    mountGlyph({}, fn)
    const args = fn.mock.calls[0][0]
    expect(args).toHaveProperty('path')
  })

  test('should handle numeric size prop', () => {
    const fn = vi.fn(() => <g />)
    mountGlyph({ size: 42 }, fn)
    const args = fn.mock.calls[0][0]
    expect(args.path.size()()).toBe(42)
  })

  test('should handle function size prop', () => {
    const fn = vi.fn(() => <g />)
    mountGlyph({ size: () => 42 }, fn)
    const args = fn.mock.calls[0][0]
    expect(args.path.size()()).toBe(42)
  })
})
