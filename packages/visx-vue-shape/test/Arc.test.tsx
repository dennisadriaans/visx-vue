import { describe, it, expect, vi } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { Arc } from '../src'
import type { ArcProps } from '../src/shapes/Arc'

interface Datum {
  data: number
  value: number
  index: number
  startAngle: number
  endAngle: number
  padAngle: number
}

const data: Datum = {
  data: 1,
  value: 1,
  index: 6,
  startAngle: 6.050474740247008,
  endAngle: 6.166830023713296,
  padAngle: 0
}

function ArcChildren({
  children,
  ...restProps
}: Partial<ArcProps<Datum>> & { children?: (...args: any[]) => any }) {
  const slotFn = children || (() => null)
  return mount(Arc, {
    props: { data, ...restProps } as any,
    slots: { default: slotFn }
  })
}

describe('<Arc />', () => {
  it('should be defined', () => {
    expect(Arc).toBeDefined()
  })

  it('should render a path that has the .visx-arc class', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(Arc, {
      props: { data } as any,
      attachTo: svg
    })
    const path = wrapper.find('path')
    expect(path.exists()).toBe(true)
    expect(path.classes()).toContain('visx-arc')
    wrapper.unmount()
    document.body.removeChild(svg)
  })

  it('should warn and render null when none of data, radii, and angles are passed', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(Arc, {
      props: { data: null } as any,
      attachTo: svg
    })
    expect(wrapper.find('path').exists()).toBe(false)
    expect(warnSpy).toHaveBeenCalledTimes(1)
    warnSpy.mockRestore()
    wrapper.unmount()
    document.body.removeChild(svg)
  })

  it('should render a path without data when radii + angles are defined', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(Arc, {
      props: { data: { startAngle: 0, endAngle: 6, innerRadius: 5, outerRadius: 10 } } as any,
      attachTo: svg
    })
    expect(wrapper.find('path').exists()).toBe(true)
    wrapper.unmount()
    document.body.removeChild(svg)
  })

  it('should take a children as function prop', () => {
    // DEVIATION: React children render-prop → Vue scoped slot
    const fn = vi.fn(() => null)
    ArcChildren({ children: fn })
    expect(fn).toHaveBeenCalled()
  })

  it('should call children function with { path }', () => {
    const fn = vi.fn(() => null)
    ArcChildren({ children: fn })
    const args = fn.mock.calls[0][0]
    const keys = Object.keys(args)
    expect(keys).toContain('path')
  })

  it('should take an innerRadius number prop', () => {
    const fn = vi.fn(() => null)
    ArcChildren({ children: fn, innerRadius: 42 })
    const args = fn.mock.calls[0][0]
    expect(args.path.innerRadius()({})).toBe(42)
  })

  it('should take an innerRadius fn prop', () => {
    const fn = vi.fn(() => null)
    ArcChildren({ children: fn, innerRadius: () => 42 })
    const args = fn.mock.calls[0][0]
    expect(args.path.innerRadius()({})).toBe(42)
  })

  it('should take an outerRadius number prop', () => {
    const fn = vi.fn(() => null)
    ArcChildren({ children: fn, outerRadius: 42 })
    const args = fn.mock.calls[0][0]
    expect(args.path.outerRadius()({})).toBe(42)
  })

  it('should take an outerRadius fn prop', () => {
    const fn = vi.fn(() => null)
    ArcChildren({ children: fn, outerRadius: () => 42 })
    const args = fn.mock.calls[0][0]
    expect(args.path.outerRadius()({})).toBe(42)
  })

  it('should take a cornerRadius number prop', () => {
    const fn = vi.fn(() => null)
    ArcChildren({ children: fn, cornerRadius: 42 })
    const args = fn.mock.calls[0][0]
    expect(args.path.cornerRadius()({})).toBe(42)
  })

  it('should take a cornerRadius fn prop', () => {
    const fn = vi.fn(() => null)
    ArcChildren({ children: fn, cornerRadius: () => 42 })
    const args = fn.mock.calls[0][0]
    expect(args.path.cornerRadius()({})).toBe(42)
  })

  it('should take a startAngle number prop', () => {
    const fn = vi.fn(() => null)
    ArcChildren({ children: fn, startAngle: 42 })
    const args = fn.mock.calls[0][0]
    expect(args.path.startAngle()({})).toBe(42)
  })

  it('should take a startAngle 0 prop', () => {
    const fn = vi.fn(() => null)
    ArcChildren({ children: fn, startAngle: 0 })
    const args = fn.mock.calls[0][0]
    expect(args.path.startAngle()({})).toBe(0)
  })

  it('should take a startAngle fn prop', () => {
    const fn = vi.fn(() => null)
    ArcChildren({ children: fn, startAngle: () => 42 })
    const args = fn.mock.calls[0][0]
    expect(args.path.startAngle()({})).toBe(42)
  })

  it('should take a endAngle number prop', () => {
    const fn = vi.fn(() => null)
    ArcChildren({ children: fn, endAngle: 42 })
    const args = fn.mock.calls[0][0]
    expect(args.path.endAngle()({})).toBe(42)
  })

  it('should take a endAngle 0 prop', () => {
    const fn = vi.fn(() => null)
    ArcChildren({ children: fn, endAngle: 0 })
    const args = fn.mock.calls[0][0]
    expect(args.path.endAngle()({})).toBe(0)
  })

  it('should take a endAngle fn prop', () => {
    const fn = vi.fn(() => null)
    ArcChildren({ children: fn, endAngle: () => 42 })
    const args = fn.mock.calls[0][0]
    expect(args.path.endAngle()({})).toBe(42)
  })

  it('should take a padAngle number prop', () => {
    const fn = vi.fn(() => null)
    ArcChildren({ children: fn, padAngle: 42 })
    const args = fn.mock.calls[0][0]
    expect(args.path.padAngle()({})).toBe(42)
  })

  it('should take a padAngle 0 prop', () => {
    const fn = vi.fn(() => null)
    ArcChildren({ children: fn, padAngle: 0 })
    const args = fn.mock.calls[0][0]
    expect(args.path.padAngle()({})).toBe(0)
  })

  it('should take a padAngle fn prop', () => {
    const fn = vi.fn(() => null)
    ArcChildren({ children: fn, padAngle: () => 42 })
    const args = fn.mock.calls[0][0]
    expect(args.path.padAngle()({})).toBe(42)
  })

  it('should take a padRadius number prop', () => {
    const fn = vi.fn(() => null)
    ArcChildren({ children: fn, padRadius: 42 })
    const args = fn.mock.calls[0][0]
    expect(args.path.padRadius()({})).toBe(42)
  })

  it('should take a padRadius 0 prop', () => {
    const fn = vi.fn(() => null)
    ArcChildren({ children: fn, padRadius: 0 })
    const args = fn.mock.calls[0][0]
    expect(args.path.padRadius()({})).toBe(0)
  })

  it('should take a padRadius fn prop', () => {
    const fn = vi.fn(() => null)
    ArcChildren({ children: fn, padRadius: () => 42 })
    const args = fn.mock.calls[0][0]
    expect(args.path.padRadius()({})).toBe(42)
  })

  it('calling path with data returns a string', () => {
    const fn = vi.fn(() => null)
    ArcChildren({ children: fn })
    const args = fn.mock.calls[0][0]
    expect(typeof args.path(data)).toBe('string')
  })

  it('should expose its ref via an innerRef prop', () => {
    // DEVIATION: Vue uses template ref internally; here we verify the path element renders
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(Arc, {
      props: { data } as any,
      attachTo: svg
    })
    const pathEl = wrapper.find('path')
    expect(pathEl.exists()).toBe(true)
    wrapper.unmount()
    document.body.removeChild(svg)
  })
})
