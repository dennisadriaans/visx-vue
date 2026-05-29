import { describe, it, expect, beforeEach, afterEach } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { scaleLinear } from '@visx-vue/scale'
import { AxisRight } from '../src'
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
  const wrapper = mount(AxisRight, {
    props: { ...axisProps, ...props } as any,
    attachTo: svg
  })
  return { wrapper, svg }
}

function cleanup(wrapper: ReturnType<typeof mount>, svg: SVGSVGElement) {
  wrapper.unmount()
  document.body.removeChild(svg)
}

describe('<AxisRight />', () => {
  beforeEach(addMock)
  afterEach(removeMock)

  it('should be defined', () => {
    expect(AxisRight).toBeDefined()
  })

  it('should render with default props', () => {
    const { wrapper, svg } = mountInSvg()
    const axis = wrapper.find('.visx-axis-right')
    expect(axis.exists()).toBe(true)

    const ticks = wrapper.findAll('.visx-axis-tick')
    expect(ticks.length).toBeGreaterThan(0)
    cleanup(wrapper, svg)
  })

  it('should apply custom class names', () => {
    const { wrapper, svg } = mountInSvg({
      axisClassName: 'axis-test-class',
      axisLineClassName: 'axisline-test-class',
      labelClassName: 'label-test-class',
      tickClassName: 'tick-test-class'
    })

    expect(wrapper.find('.axis-test-class').exists()).toBe(true)
    expect(wrapper.find('.axisline-test-class').exists()).toBe(true)
    expect(wrapper.find('.tick-test-class').exists()).toBe(true)
    cleanup(wrapper, svg)
  })

  it('should render label correctly', () => {
    const label = 'test'
    const { wrapper, svg } = mountInSvg({ label })
    const labelElement = wrapper.find('.visx-axis-label')
    expect(labelElement.text()).toContain(label)
    cleanup(wrapper, svg)
  })

  it('should rotate label by default', () => {
    const { wrapper, svg } = mountInSvg({ label: 'Test Label' })
    const label = wrapper.find('text.visx-axis-label')
    expect(label.attributes('transform')).toBe('rotate(90)')
    cleanup(wrapper, svg)
  })

  it('should use default labelOffset of 36', () => {
    const { wrapper, svg } = mountInSvg({ label: 'Test Label' })
    const label = wrapper.find('.visx-axis-label')
    expect(label.attributes('y')).toBe('-44')
    expect(label.attributes('x')).toBe('5')
    cleanup(wrapper, svg)
  })

  it('should apply custom labelOffset', () => {
    const labelOffset = 3
    const { wrapper, svg } = mountInSvg({ label: 'Test Label', labelOffset })
    const label = wrapper.find('.visx-axis-label')
    expect(label.attributes('y')).toBe('-11')
    expect(label.attributes('x')).toBe('5')
    cleanup(wrapper, svg)
  })

  it('should use default tickLength', () => {
    const { wrapper, svg } = mountInSvg()
    const tick = wrapper.find('.visx-axis-tick line')
    expect(tick.attributes('x2')).toBe('8')
    cleanup(wrapper, svg)
  })

  it('should set custom tickLength', () => {
    const tickLength = 15
    const { wrapper, svg } = mountInSvg({ tickLength })
    const tick = wrapper.find('.visx-axis-tick line')
    expect(tick.attributes('x2')).toBe(`${tickLength}`)
    cleanup(wrapper, svg)
  })
})
