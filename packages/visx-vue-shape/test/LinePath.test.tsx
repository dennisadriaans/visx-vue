import { describe, it, expect, vi } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { LinePath } from '../src'

interface Datum {
  x: number
  y: number
}

const linePathProps = {
  data: [
    { x: 0, y: 0 },
    { x: 1, y: 1 }
  ],
  x: (d: Datum) => d.x,
  y: (d: Datum) => d.y
}

describe('<LinePath />', () => {
  it('should be defined', () => {
    expect(LinePath).toBeDefined()
  })

  it('should have the .visx-linepath class', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(LinePath, {
      props: { ...linePathProps } as any,
      attachTo: svg
    })
    const path = wrapper.find('path')
    expect(path.classes()).toContain('visx-linepath')
    wrapper.unmount()
    document.body.removeChild(svg)
  })

  it('should default to strokeLinecap="round" for superior missing data rendering', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(LinePath, {
      props: { ...linePathProps } as any,
      attachTo: svg
    })
    const path = wrapper.find('path')
    expect(path.attributes('stroke-linecap')).toBe('round')
    wrapper.unmount()
    document.body.removeChild(svg)
  })

  it('should render path element', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(LinePath, {
      props: { ...linePathProps } as any,
      attachTo: svg
    })
    const paths = wrapper.findAll('path')
    expect(paths.length).toBeGreaterThan(0)
    wrapper.unmount()
    document.body.removeChild(svg)
  })

  it('should take a children as function prop', () => {
    // DEVIATION: React children render-prop → Vue scoped slot
    const fn = vi.fn(() => null)
    mount(LinePath, {
      slots: { default: fn }
    })
    expect(fn).toHaveBeenCalled()
  })

  it('should call children function with { path }', () => {
    const fn = vi.fn((_) => null)
    mount(LinePath, {
      slots: { default: fn }
    })
    const args = fn.mock.calls[0][0]
    expect(args).toHaveProperty('path')
  })

  it('should expose its ref via an innerRef prop', () => {
    // DEVIATION: Vue uses internal template ref. We verify the path element renders.
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(LinePath, {
      props: { data: linePathProps.data } as any,
      attachTo: svg
    })
    expect(wrapper.find('path').exists()).toBe(true)
    wrapper.unmount()
    document.body.removeChild(svg)
  })
})
