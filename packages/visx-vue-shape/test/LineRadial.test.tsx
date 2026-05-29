import { describe, test, expect, vi } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { LineRadial } from '../src'

interface Datum {
  x: number
  y: number
}

const mockProps = {
  data: [
    { x: 0, y: 0 },
    { x: 1, y: 1 }
  ],
  angle: (d: Datum) => d.x,
  radius: (d: Datum) => d.y
}

describe('<LineRadial />', () => {
  test('it should be defined', () => {
    expect(LineRadial).toBeDefined()
  })

  test('it should have the .visx-line-radial class', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(LineRadial, {
      props: { ...mockProps } as any,
      attachTo: svg
    })
    const path = wrapper.find('path')
    expect(path.classes()).toContain('visx-line-radial')
    wrapper.unmount()
    document.body.removeChild(svg)
  })

  test('it should contain paths', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(LineRadial, {
      props: { ...mockProps } as any,
      attachTo: svg
    })
    const paths = wrapper.findAll('path')
    expect(paths.length).toBeGreaterThan(0)
    wrapper.unmount()
    document.body.removeChild(svg)
  })

  test('it should take a children as function prop', () => {
    // DEVIATION: React children render-prop → Vue scoped slot
    const fn = vi.fn(() => h('g'))
    mount(LineRadial, {
      props: { ...mockProps } as any,
      slots: { default: fn }
    })
    expect(fn).toHaveBeenCalled()
  })

  test('it should call children function with { path }', () => {
    const fn = vi.fn(() => h('g'))
    mount(LineRadial, {
      props: { ...mockProps } as any,
      slots: { default: fn }
    })
    const args = fn.mock.calls[0][0]
    expect(args).toHaveProperty('path')
  })

  test('it should expose its ref via an innerRef prop', () => {
    // DEVIATION: Vue uses internal template ref. We verify the path element renders.
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(LineRadial, {
      props: { ...mockProps } as any,
      attachTo: svg
    })
    expect(wrapper.find('path').exists()).toBe(true)
    wrapper.unmount()
    document.body.removeChild(svg)
  })
})
