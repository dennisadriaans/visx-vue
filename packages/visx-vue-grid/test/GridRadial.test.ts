import { describe, it, expect, vi, beforeEach } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { scaleLinear } from '@visx-vue/scale'
import { GridRadial } from '../src'

const gridProps = {
  innerRadius: 0,
  outerRadius: 10,
  scale: scaleLinear({
    range: [1, 100],
    domain: [1, 10]
  }),
  startAngle: 0,
  endAngle: Math.PI * 2
}

describe('<GridRadial />', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(GridRadial).toBeDefined()
  })

  it('should render with class .visx-grid-radial', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(GridRadial, {
      props: { ...gridProps } as any,
      attachTo: svg
    })
    const group = wrapper.find('.visx-grid-radial')
    expect(group.exists()).toBe(true)
    wrapper.unmount()
    document.body.removeChild(svg)
  })

  it('should set user-specified lineClassName', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(GridRadial, {
      props: { ...gridProps, lineClassName: 'test-class' } as any,
      attachTo: svg
    })
    const paths = wrapper.findAll('path')
    expect(paths.length).toBeGreaterThan(0)
    paths.forEach((path) => {
      expect(path.classes()).toContain('test-class')
    })
    wrapper.unmount()
    document.body.removeChild(svg)
  })

  it('should render `numTicks` grid line arcs', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(GridRadial, {
      props: { ...gridProps, numTicks: 5 } as any,
      attachTo: svg
    })
    const paths = wrapper.findAll('path.visx-arc')
    expect(paths).toHaveLength(5)
    wrapper.unmount()
    document.body.removeChild(svg)

    const svg2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg2)
    const wrapper2 = mount(GridRadial, {
      props: { ...gridProps, numTicks: 10 } as any,
      attachTo: svg2
    })
    const paths2 = wrapper2.findAll('path.visx-arc')
    expect(paths2).toHaveLength(10)
    wrapper2.unmount()
    document.body.removeChild(svg2)
  })

  it('should render grid line arcs according to tickValues', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(GridRadial, {
      props: { ...gridProps, tickValues: [1, 2, 3] } as any,
      attachTo: svg
    })
    const paths = wrapper.findAll('path.visx-arc')
    expect(paths).toHaveLength(3)
    wrapper.unmount()
    document.body.removeChild(svg)
  })
})
