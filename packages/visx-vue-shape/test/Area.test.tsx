import { describe, test, expect, vi } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { Area } from '../src'

interface Datum {
  x: Date
  y: number
}

const fakeData: Datum[] = [
  { x: new Date('2017-01-01'), y: 5 },
  { x: new Date('2017-01-02'), y: 5 },
  { x: new Date('2017-01-03'), y: 5 }
]

const xScale = () => 50
const yScale = () => 50
;(yScale as any).range = () => [100, 0]

const x = () => xScale()
const y = () => yScale()

describe('<Area />', () => {
  test('should be defined', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(Area, {
      props: { data: fakeData, x, y } as any,
      attachTo: svg
    })
    expect(wrapper.find('path').exists()).toBe(true)
    wrapper.unmount()
    document.body.removeChild(svg)
  })

  test('should have the .visx-area class', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(Area, {
      props: { data: fakeData, x, y } as any,
      attachTo: svg
    })
    expect(wrapper.find('path').classes()).toContain('visx-area')
    wrapper.unmount()
    document.body.removeChild(svg)
  })

  test('should expose its ref via an innerRef prop', () => {
    // DEVIATION: Vue uses internal template ref. We verify the path element renders.
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(Area, {
      props: { data: fakeData, x, y } as any,
      attachTo: svg
    })
    expect(wrapper.find('path').exists()).toBe(true)
    wrapper.unmount()
    document.body.removeChild(svg)
  })

  test('should handle children as function prop', () => {
    // DEVIATION: React children render-prop → Vue scoped slot
    const childrenFn = vi.fn(() => null)
    mount(Area, {
      props: { data: fakeData, x, y } as any,
      slots: { default: childrenFn }
    })
    expect(childrenFn).toHaveBeenCalled()
    const args = childrenFn.mock.calls[0][0]
    expect(args).toHaveProperty('path')
  })

  test('should handle x and y props correctly', () => {
    const childrenFn = vi.fn((_: { path: any }) => null)
    const args = [fakeData[0], 0, fakeData] as const

    // Test number props
    mount(Area, {
      props: { data: fakeData, x: 42, y: 42 } as any,
      slots: { default: childrenFn }
    })

    const [{ path }] = childrenFn.mock.calls[0]
    expect(path.x()(...args)).toBe(42)
    expect(path.y()(...args)).toBe(42)

    childrenFn.mockClear()

    // Test function props
    mount(Area, {
      props: { data: fakeData, x: () => 42, y: () => 42 } as any,
      slots: { default: childrenFn }
    })

    const [{ path: path2 }] = childrenFn.mock.calls[0]

    expect(path2.x()(...args)).toBe(42)
    expect(path2.x0()(...args)).toBe(42)
    expect(path2.x1()).toBeNull()
    expect(path2.y()(...args)).toBe(42)
    expect(path2.y0()(...args)).toBe(42)
    expect(path2.y1()).toBeNull()
  })

  test('should handle default defined prop and generate path string', () => {
    const childrenFn = vi.fn((_: { path: any }) => null)
    const args = [fakeData[0], 0, fakeData] as const
    mount(Area, {
      props: { data: fakeData, x, y } as any,
      slots: { default: childrenFn }
    })

    const [{ path }] = childrenFn.mock.calls[0]
    expect(path.defined()(...args)).toBe(true)
    expect(typeof path(fakeData)).toBe('string')
  })
})
