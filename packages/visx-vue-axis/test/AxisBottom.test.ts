import { describe, it, expect, beforeEach, afterEach } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { scaleLinear } from '@visx-vue/scale'
import { AxisBottom } from '../src'
import { addMock, removeMock } from './svgMock'

const axisProps = {
  scale: scaleLinear({
    range: [10, 0],
    round: true,
    domain: [0, 10]
  })
}

function mountInSvg(props: Record<string, unknown> = {}) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  document.body.appendChild(svg)
  const wrapper = mount(AxisBottom, {
    props: { ...axisProps, ...props } as any,
    attachTo: svg
  })
  return { wrapper, svg }
}

function cleanup(wrapper: ReturnType<typeof mount>, svg: SVGSVGElement) {
  wrapper.unmount()
  document.body.removeChild(svg)
}

describe('<AxisBottom />', () => {
  beforeEach(addMock)
  afterEach(removeMock)

  it('should be defined', () => {
    expect(AxisBottom).toBeDefined()
  })

  it('should render without crashing', () => {
    const { wrapper, svg } = mountInSvg()
    expect(wrapper.find('.visx-axis').exists()).toBe(true)
    cleanup(wrapper, svg)
  })

  it('should render with default class names', () => {
    const { wrapper, svg } = mountInSvg()
    const axis = wrapper.find('.visx-axis')
    expect(axis.classes()).toContain('visx-axis-bottom')
    cleanup(wrapper, svg)
  })

  it('should render with custom props', () => {
    const { wrapper, svg } = mountInSvg({
      axisClassName: 'axis-test-class',
      axisLineClassName: 'axisline-test-class',
      labelClassName: 'label-test-class',
      tickClassName: 'tick-test-class',
      labelOffset: 3,
      tickLength: 15
    })

    const axis = wrapper.find('.visx-axis')
    expect(axis.classes()).toContain('axis-test-class')
    expect(wrapper.find('.axisline-test-class').exists()).toBe(true)
    expect(wrapper.find('.tick-test-class').exists()).toBe(true)
    cleanup(wrapper, svg)
  })

  it('should render label correctly', () => {
    const label = 'test label'
    const { wrapper, svg } = mountInSvg({ label })
    expect(wrapper.text()).toContain(label)
    cleanup(wrapper, svg)
  })

  it('should render with different labelOffsets', () => {
    const { wrapper, svg } = mountInSvg({ labelOffset: 50, label: 'test' })
    const label = wrapper.find('.visx-axis-label')
    expect(label.attributes('y')).toBe('78')
    cleanup(wrapper, svg)
  })

  it('should have default tickLength of 8', () => {
    const { wrapper, svg } = mountInSvg()
    const ticks = wrapper.findAll('.visx-axis-tick line')
    ticks.forEach((tick) => {
      expect(tick.attributes('y2')).toBe('8')
    })
    cleanup(wrapper, svg)
  })

  it('should set custom tickLength', () => {
    const tickLength = 15
    const { wrapper, svg } = mountInSvg({ tickLength })
    const ticks = wrapper.findAll('.visx-axis-tick line')
    ticks.forEach((tick) => {
      expect(tick.attributes('y2')).toBe('15')
    })
    cleanup(wrapper, svg)
  })
})
