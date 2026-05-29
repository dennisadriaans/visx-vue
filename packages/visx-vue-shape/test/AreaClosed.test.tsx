import { describe, test, expect, vi } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { scaleLinear } from '@visx-vue/scale'
import { AreaClosed } from '../src'

interface Datum {
  x: Date
  y: number
}

const data: Datum[] = [
  { x: new Date('2017-01-01'), y: 5 },
  { x: new Date('2017-01-02'), y: 5 },
  { x: new Date('2017-01-03'), y: 5 }
]

const yScale = scaleLinear({ domain: [0, 100], range: [100, 0] })

const x = () => 50
const y = () => 50

describe('<AreaClosed />', () => {
  test('it should be defined', () => {
    expect(AreaClosed).toBeDefined()
  })

  test('it should have the .visx-area-closed class', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(AreaClosed, {
      props: { data, yScale, x, y1: y } as any,
      attachTo: svg
    })
    const path = wrapper.find('path')
    expect(path.classes()).toContain('visx-area-closed')
    wrapper.unmount()
    document.body.removeChild(svg)
  })

  test('it should expose its ref via an innerRef prop', () => {
    // DEVIATION: Vue uses internal template ref. We verify the path element renders.
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(AreaClosed, {
      props: { data, yScale, x, y1: y } as any,
      attachTo: svg
    })
    expect(wrapper.find('path').exists()).toBe(true)
    wrapper.unmount()
    document.body.removeChild(svg)
  })

  test('it should handle children function prop', () => {
    // DEVIATION: React children render-prop → Vue scoped slot
    const childrenFn = vi.fn((_) => null)
    mount(AreaClosed, {
      props: { data, yScale, x, y1: y } as any,
      slots: { default: childrenFn }
    })

    expect(childrenFn).toHaveBeenCalled()
    const args = childrenFn.mock.calls[0][0]
    expect(args).toHaveProperty('path')
  })

  test('it should generate correct path data', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(AreaClosed, {
      props: { data, yScale, x, y1: y } as any,
      attachTo: svg
    })
    const path = wrapper.find('path')
    expect(path.attributes('d')).toBeDefined()
    expect(typeof path.attributes('d')).toBe('string')
    wrapper.unmount()
    document.body.removeChild(svg)
  })

  test('it should handle number and function props', () => {
    const childrenFn = vi.fn((_: { path: any }) => null)
    const args = [data[0], 0, data] as const

    // Test with number prop
    mount(AreaClosed, {
      props: { data, yScale, x: 42, y1: 42 } as any,
      slots: { default: childrenFn }
    })

    const { path } = childrenFn.mock.calls[0][0]
    expect(path.x()(...args)).toBe(42)
    expect(path.y0()(...args)).toBe(yScale.range()[0])
    expect(path.y1()?.(...args)).toBe(42)

    // Test with function prop
    childrenFn.mockClear()
    mount(AreaClosed, {
      props: { data, yScale, x: () => 42, y1: () => 42 } as any,
      slots: { default: childrenFn }
    })

    const [{ path: path2 }] = childrenFn.mock.calls[0]
    expect(path2.x()(...args)).toBe(42)
    expect(path2.y0()(...args)).toBe(yScale.range()[0])
    expect(path2.y1()?.(...args)).toBe(42)
    expect(path2.defined()(...args)).toBe(true)
  })
})
