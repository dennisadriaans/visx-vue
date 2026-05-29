import { describe, it, expect, vi } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { Polygon } from '../src'

describe('<Polygon />', () => {
  it('should be defined', () => {
    expect(Polygon).toBeDefined()
  })

  it('should render an octagon', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(Polygon, {
      props: { sides: 8, size: 25 },
      attachTo: svg
    })
    const polygon = wrapper.find('polygon')
    expect(polygon.exists()).toBe(true)
    const points = polygon.attributes('points')?.split(' ')
    expect(points).toHaveLength(8)
    wrapper.unmount()
    document.body.removeChild(svg)
  })

  it('should add classname', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(Polygon, {
      props: { sides: 6, size: 25, className: 'a-polygon' },
      attachTo: svg
    })
    const polygon = wrapper.find('polygon')
    expect(polygon.exists()).toBe(true)
    expect(polygon.classes()).toContain('visx-polygon')
    expect(polygon.classes()).toContain('a-polygon')
    wrapper.unmount()
    document.body.removeChild(svg)
  })

  it('should add onClick handler', () => {
    const fn = vi.fn()
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(Polygon, {
      props: { sides: 6, size: 25, className: 'a-polygon' },
      attrs: { onClick: fn },
      attachTo: svg
    })
    const polygon = wrapper.find('polygon')
    expect(polygon.exists()).toBe(true)
    polygon.trigger('click')
    expect(fn).toHaveBeenCalled()
    wrapper.unmount()
    document.body.removeChild(svg)
  })

  it('should render children function', () => {
    // DEVIATION: React children render-prop → Vue scoped slot
    const fn = vi.fn(() => h('g', { 'data-testid': 'child' }))
    const wrapper = mount(Polygon, {
      props: { sides: 8, size: 25 },
      slots: { default: fn }
    })
    expect(fn).toHaveBeenCalled()
    expect(wrapper.find('[data-testid="child"]').exists()).toBe(true)
  })

  it('should pass points to children function', () => {
    const fn = vi.fn(() => null)
    mount(Polygon, {
      props: { sides: 8, size: 25 },
      slots: { default: fn }
    })
    const args = fn.mock.calls[0][0]
    expect(args).toHaveProperty('points')
    expect(args.points).toHaveLength(8)
  })
})
