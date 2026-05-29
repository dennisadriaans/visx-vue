import { describe, it, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { scaleLinear } from '@visx-vue/scale'
import { GridPolar } from '../src'

const gridProps = {
  innerRadius: 0,
  outerRadius: 10,
  scaleAngle: scaleLinear({ range: [1, 100], domain: [1, 10] }),
  scaleRadial: scaleLinear({ range: [1, 100], domain: [1, 10] })
}

describe('<GridPolar />', () => {
  it('should be defined', () => {
    expect(GridPolar).toBeDefined()
  })

  it('should render with class .visx-grid-polar', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(GridPolar, {
      props: { ...gridProps } as any,
      attachTo: svg
    })
    expect(wrapper.find('.visx-grid-polar').exists()).toBe(true)
    wrapper.unmount()
    document.body.removeChild(svg)
  })

  it('should render both angle and radial grid lines', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(GridPolar, {
      props: { ...gridProps } as any,
      attachTo: svg
    })

    // Look for actual rendered lines rather than mocked components
    const lines = wrapper.findAll('line')
    const arcs = wrapper.findAll('path') // radial grids are rendered as arcs/paths

    expect(lines.length).toBeGreaterThan(0) // Should have some angle lines
    expect(arcs.length).toBeGreaterThan(0) // Should have some radial lines

    wrapper.unmount()
    document.body.removeChild(svg)
  })
})
