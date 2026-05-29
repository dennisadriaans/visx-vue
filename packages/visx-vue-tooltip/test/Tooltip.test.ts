import { describe, test, expect, it } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { Tooltip, defaultStyles } from '../src'
import type { CSSProperties } from 'vue'

describe('<Tooltip />', () => {
  test('it should be defined', () => {
    expect(Tooltip).toBeDefined()
  })

  it('should render with the default styles', () => {
    const wrapper = mount(Tooltip, {
      slots: { default: 'Hello' }
    })
    const tooltip = wrapper.element as HTMLElement

    Object.entries(defaultStyles).forEach(([key, value]) => {
      if (key === 'backgroundColor' || key === 'color') {
        // colors may be converted to rgb by the browser
        expect(typeof tooltip.style[key as any]).toBe('string')
      } else {
        expect(tooltip.style[key as any]).toBe(value)
      }
    })

    wrapper.unmount()
  })

  it('should render with no default styles', () => {
    const wrapper = mount(Tooltip, {
      props: { unstyled: true },
      slots: { default: 'Hello' }
    })
    const tooltip = wrapper.element as HTMLElement

    Object.keys(defaultStyles).forEach((key) => {
      expect(tooltip.style[key as any]).toBe('')
    })

    wrapper.unmount()
  })

  it('should overwrite default styles when given the style prop', () => {
    const newStyles: CSSProperties = {
      position: 'relative',
      backgroundColor: 'green',
      color: 'red',
      padding: '0.8rem',
      borderRadius: '13px',
      fontSize: '17px',
      boxShadow: '0 2px 3px rgba(133,133,133,0.5)',
      lineHeight: '2em'
    }

    const wrapper = mount(Tooltip, {
      props: { style: newStyles }
    })
    const tooltip = wrapper.element as HTMLElement

    Object.entries(newStyles).forEach(([key, value]) => {
      expect(tooltip.style[key as any]).toBe(value)
    })

    wrapper.unmount()
  })
})
