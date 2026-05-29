import { describe, it, expect, beforeEach, afterEach } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { Text, getStringWidth, useText } from '../src'
import type { TextProps } from '../src'
import type { UseTextResult } from '../src/hooks/useText'
import { addMock, removeMock } from './svgMock'

/**
 * Helper to test the useText composable directly
 * (equivalent of React's renderHook).
 */
function mountUseText(textProps: TextProps) {
  let result!: UseTextResult
  mount(
    defineComponent({
      setup() {
        result = useText(textProps)
        return () => null
      }
    })
  )
  return result
}

describe('getStringWidth()', () => {
  it('should be defined', () => {
    expect(getStringWidth).toBeDefined()
  })
})

describe('<Text />', () => {
  beforeEach(addMock)
  afterEach(removeMock)

  it('should be defined', () => {
    expect(Text).toBeDefined()
  })

  it('Does not wrap long text if enough width', () => {
    const { wordsByLines } = mountUseText({
      width: 300,
      style: { fontFamily: 'Courier' },
      text: 'This is really long text'
    })
    expect(wordsByLines.value).toHaveLength(1)
  })

  it('Wraps text if not enough width', () => {
    const { wordsByLines } = mountUseText({
      width: 200,
      style: { fontFamily: 'Courier' },
      text: 'This is really long text'
    })
    expect(wordsByLines.value).toHaveLength(2)
  })

  it('Does not wrap text if there is enough width', () => {
    const { wordsByLines } = mountUseText({
      width: 300,
      style: { fontSize: '2em', fontFamily: 'Courier' },
      text: 'This is really long text'
    })
    expect(wordsByLines.value).toHaveLength(1)
  })

  it('Does not perform word length calculation if width or scaleToFit props not set', () => {
    const { wordsByLines } = mountUseText({
      text: 'This is really long text'
    })
    expect(wordsByLines.value).toHaveLength(1)
    expect(wordsByLines.value[0].width).toBeUndefined()
  })

  it('Render 0 success when specify the width', () => {
    const wrapper = mount(Text, { props: { x: 0, y: 0, width: 30, text: '0' } })
    const tspan = wrapper.find('tspan')
    expect(tspan.text()).toBe('0')
  })

  it('Render 0 success when not specify the width', () => {
    const wrapper = mount(Text, { props: { x: 0, y: 0, text: '0' } })
    const tspan = wrapper.find('tspan')
    expect(tspan.text()).toBe('0')
  })

  it('Render text when x or y is a percentage', () => {
    const wrapper = mount(Text, { props: { x: '50%', y: '50%', text: 'anything' } })
    const tspan = wrapper.find('tspan')
    expect(tspan.text()).toBe('anything')
  })

  it("Don't Render text when x or y is NaN", () => {
    const wrapper = mount(Text, { props: { x: NaN, y: 10, text: 'anything' } })
    const tspan = wrapper.find('tspan')
    expect(tspan.exists()).toBe(false)
  })

  it('Render text when children 0 is a number', () => {
    const wrapper = mount(Text, { props: { x: 0, y: 0, text: 0 } })
    const tspan = wrapper.find('tspan')
    expect(tspan.text()).toBe('0')
  })

  it('Applies transform if scaleToFit is set', () => {
    const { transform } = mountUseText({
      width: 300,
      scaleToFit: true,
      style: { fontFamily: 'Courier' },
      text: 'This is really long text'
    })
    expect(transform.value).toBe('matrix(1.25, 0, 0, 1.25, 0, 0)')
  })

  it("Does not scale above 1 when scaleToFit is set to 'shrink-only'", () => {
    const { transform } = mountUseText({
      width: 300,
      scaleToFit: 'shrink-only',
      style: { fontFamily: 'Courier' },
      text: 'This is really long text'
    })
    expect(transform.value).toBe('matrix(1, 0, 0, 1, 0, 0)')
  })

  it("Shrinks long text when scaleToFit is set to 'shrink-only'", () => {
    const { transform } = mountUseText({
      width: 30,
      scaleToFit: 'shrink-only',
      style: { fontFamily: 'Courier' },
      text: 'This is really long text'
    })
    expect(transform.value).toBe('matrix(0.125, 0, 0, 0.125, 0, 0)')
  })

  it('Applies transform if angle is given', () => {
    const wrapper = mount(Text, {
      props: {
        width: 300,
        angle: 45,
        style: { fontFamily: 'Courier' },
        text: 'This is really long text'
      }
    })
    const text = wrapper.find('text')
    expect(text.attributes('transform')).toBe('rotate(45, 0, 0)')
  })

  it('Offsets vertically if verticalAnchor is given', () => {
    let wrapper = mount(Text, {
      props: {
        width: 200,
        style: { fontFamily: 'Courier' },
        text: 'This is really long text'
      }
    })
    expect(wrapper.find('tspan').attributes('dy')).toBe('-1em')

    wrapper = mount(Text, {
      props: {
        width: 200,
        verticalAnchor: 'middle' as const,
        style: { fontFamily: 'Courier' },
        text: 'This is really long text'
      }
    })
    expect(wrapper.find('tspan').attributes('dy')).toBe('-0.145em')

    wrapper = mount(Text, {
      props: {
        width: 200,
        verticalAnchor: 'start' as const,
        style: { fontFamily: 'Courier' },
        text: 'This is really long text'
      }
    })
    expect(wrapper.find('tspan').attributes('dy')).toBe('0.71em')
  })
})
