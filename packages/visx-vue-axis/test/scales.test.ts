import { describe, it, expect, beforeEach, afterEach } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import {
  scaleBand,
  scaleLinear,
  scaleLog,
  scaleOrdinal,
  scalePoint,
  scalePower,
  scaleQuantile,
  scaleQuantize,
  scaleSymlog,
  scaleThreshold,
  scaleTime,
  scaleUtc
} from '@visx-vue/scale'
import { Axis } from '../src'
import { addMock, removeMock } from './svgMock'

const axisProps = {
  orientation: 'left' as const,
  label: 'test axis'
}

function mountInSvg(props: Record<string, unknown>) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  document.body.appendChild(svg)
  const wrapper = mount(Axis, {
    props: props as any,
    attachTo: svg
  })
  return { wrapper, svg }
}

function cleanup(wrapper: ReturnType<typeof mount>, svg: SVGSVGElement) {
  wrapper.unmount()
  document.body.removeChild(svg)
}

describe('Axis scales', () => {
  beforeEach(addMock)
  afterEach(removeMock)

  it('should render with scaleBand', () => {
    const { wrapper, svg } = mountInSvg({
      ...axisProps,
      scale: scaleBand({
        range: [10, 0],
        round: true,
        domain: ['a', 'b', 'c']
      })
    })
    expect(wrapper.text()).toContain('test axis')
    cleanup(wrapper, svg)
  })

  it('should render with scaleLinear', () => {
    const { wrapper, svg } = mountInSvg({
      ...axisProps,
      scale: scaleLinear({
        range: [10, 0],
        round: true,
        domain: [0, 10]
      })
    })
    expect(wrapper.text()).toContain('test axis')
    cleanup(wrapper, svg)
  })

  it('should render with scaleLog', () => {
    const { wrapper, svg } = mountInSvg({
      ...axisProps,
      scale: scaleLog({
        range: [10, 0],
        round: true,
        domain: [1, 10, 100, 1000]
      })
    })
    expect(wrapper.text()).toContain('test axis')
    cleanup(wrapper, svg)
  })

  it('should render with scaleOrdinal', () => {
    const { wrapper, svg } = mountInSvg({
      ...axisProps,
      scale: scaleOrdinal({
        range: [0, 10],
        domain: ['a', 'b', 'c']
      })
    })
    expect(wrapper.text()).toContain('test axis')
    cleanup(wrapper, svg)
  })

  it('should render with scalePoint', () => {
    const { wrapper, svg } = mountInSvg({
      ...axisProps,
      scale: scalePoint({
        range: [0, 10],
        round: true,
        domain: ['a', 'b', 'c']
      })
    })
    expect(wrapper.text()).toContain('test axis')
    cleanup(wrapper, svg)
  })

  it('should render with scalePower', () => {
    const { wrapper, svg } = mountInSvg({
      ...axisProps,
      scale: scalePower({
        range: [1, 2, 3, 4, 5],
        domain: [1, 10, 100, 1000, 10000]
      })
    })
    expect(wrapper.text()).toContain('test axis')
    cleanup(wrapper, svg)
  })

  it('should render with scaleQuantile', () => {
    const { wrapper, svg } = mountInSvg({
      ...axisProps,
      scale: scaleQuantile({
        range: [0, 2, 4, 6, 8, 10],
        domain: [1, 10, 100, 1000, 10000]
      })
    })
    expect(wrapper.text()).toContain('test axis')
    cleanup(wrapper, svg)
  })

  it('should render with scaleQuantize', () => {
    const { wrapper, svg } = mountInSvg({
      ...axisProps,
      scale: scaleQuantize({
        range: [1, 10],
        domain: [1, 10]
      })
    })
    expect(wrapper.text()).toContain('test axis')
    cleanup(wrapper, svg)
  })

  it('should render with scaleSymlog', () => {
    const { wrapper, svg } = mountInSvg({
      ...axisProps,
      scale: scaleSymlog({
        range: [1, 10],
        domain: [1, 10]
      })
    })
    expect(wrapper.text()).toContain('test axis')
    cleanup(wrapper, svg)
  })

  it('should render with scaleThreshold', () => {
    const { wrapper, svg } = mountInSvg({
      ...axisProps,
      scale: scaleThreshold({
        range: [1, 10],
        domain: [1, 10]
      })
    })
    expect(wrapper.text()).toContain('test axis')
    cleanup(wrapper, svg)
  })

  it('should render with scaleTime', () => {
    const { wrapper, svg } = mountInSvg({
      ...axisProps,
      scale: scaleTime({
        range: [1, 10],
        domain: [new Date('2020-01-01'), new Date('2020-01-05')]
      })
    })
    expect(wrapper.text()).toContain('test axis')
    cleanup(wrapper, svg)
  })

  it('should render with scaleUtc', () => {
    const { wrapper, svg } = mountInSvg({
      ...axisProps,
      scale: scaleUtc({
        range: [1, 10],
        domain: [new Date('2020-01-01'), new Date('2020-01-05')]
      })
    })
    expect(wrapper.text()).toContain('test axis')
    cleanup(wrapper, svg)
  })
})
