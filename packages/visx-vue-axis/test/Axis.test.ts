import { describe, it, expect, vi, beforeEach, afterEach } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { scaleBand, scaleLinear } from '@visx-vue/scale'
import { Axis } from '../src'
import type { AxisRendererProps } from '../src'
import { addMock, removeMock } from './svgMock'

const axisProps = {
  orientation: 'left' as const,
  scale: scaleLinear({
    range: [10, 0],
    round: true,
    domain: [0, 10]
  }),
  label: 'test axis'
}

function mountInSvg(
  component: ReturnType<typeof defineComponent>,
  props: Record<string, unknown> = {},
  slotFn?: (scope: unknown) => unknown
) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  document.body.appendChild(svg)
  const wrapper = mount(component, {
    props,
    attachTo: svg,
    slots: slotFn ? { default: slotFn } : undefined
  })
  return { wrapper, svg }
}

function cleanup(wrapper: ReturnType<typeof mount>, svg: SVGSVGElement) {
  wrapper.unmount()
  document.body.removeChild(svg)
}

describe('<Axis />', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    addMock()
  })
  afterEach(removeMock)

  it('should be defined', () => {
    expect(Axis).toBeDefined()
  })

  it('should render with class .visx-axis', () => {
    const { wrapper, svg } = mountInSvg(Axis, { ...axisProps })
    expect(wrapper.find('.visx-axis').exists()).toBe(true)
    cleanup(wrapper, svg)
  })

  it('should call default slot (children) with required args', () => {
    const mockFn = vi.fn(() => null)
    const { wrapper, svg } = mountInSvg(Axis, { ...axisProps }, mockFn)

    expect(mockFn).toHaveBeenCalled()
    const args = mockFn.mock.calls[0][0] as AxisRendererProps<typeof axisProps.scale>
    expect(args.axisFromPoint).toBeDefined()
    expect(args.axisToPoint).toBeDefined()
    expect(args.horizontal).toBeDefined()
    expect(args.tickSign).toBeDefined()
    expect(args.numTicks).toBeDefined()
    expect(args.label).toBeDefined()
    expect(args.rangePadding).toBeDefined()
    expect(args.tickLength).toBeDefined()
    expect(args.tickFormat).toBeDefined()
    expect(args.tickPosition).toBeDefined()
    expect(args.ticks).toBeDefined()
    expect(Object.keys(args.ticks[0])).toEqual(['value', 'index', 'from', 'to', 'formattedValue'])
    cleanup(wrapper, svg)
  })

  it('should set user-specified class names', () => {
    const { wrapper, svg } = mountInSvg(Axis, {
      ...axisProps,
      axisClassName: 'axis-test-class',
      axisLineClassName: 'axisline-test-class',
      labelClassName: 'label-test-class',
      tickClassName: 'tick-test-class'
    })

    expect(wrapper.find('.visx-axis.axis-test-class').exists()).toBe(true)
    expect(wrapper.find('.visx-axis-line.axisline-test-class').exists()).toBe(true)
    expect(wrapper.find('.visx-axis-label.label-test-class').exists()).toBe(true)
    expect(wrapper.find('.visx-axis-tick.tick-test-class').exists()).toBe(true)
    cleanup(wrapper, svg)
  })

  it('should pass the output of tickLabelProps to tick labels', () => {
    const tickProps = { fontSize: 50, fill: 'magenta' }
    const { wrapper, svg } = mountInSvg(Axis, {
      ...axisProps,
      tickLabelProps: () => tickProps
    })

    const tickLabels = wrapper.findAll('text')
    expect(tickLabels.length).toBeGreaterThan(0)
    // filter for tick labels (not the axis label)
    const tickLabel = tickLabels.find((el) => !el.classes().includes('visx-axis-label'))!
    expect(tickLabel.attributes('font-size')).toBe('50')
    expect(tickLabel.attributes('fill')).toBe('magenta')
    cleanup(wrapper, svg)
  })

  it('should call the tickLabelProps func with correct signature', () => {
    const tickLabelPropsSpy = vi.fn((_value: unknown, _index: unknown, _values: unknown) => ({}))
    const { wrapper, svg } = mountInSvg(Axis, {
      ...axisProps,
      tickLabelProps: tickLabelPropsSpy
    })

    const firstCall = tickLabelPropsSpy.mock.calls[0]
    expect(typeof firstCall[0]).toBe('number')
    expect(typeof firstCall[1]).toBe('number')
    expect(Array.isArray(firstCall[2])).toBe(true)
    cleanup(wrapper, svg)
  })

  it('should pass labelProps to the axis label', () => {
    const labelProps = { fontSize: 50, fill: 'magenta' }
    const { wrapper, svg } = mountInSvg(Axis, {
      ...axisProps,
      labelProps
    })

    const label = wrapper.find('.visx-axis-label')
    expect(label.attributes('font-size')).toBe('50')
    expect(label.attributes('fill')).toBe('magenta')
    cleanup(wrapper, svg)
  })

  it('should handle hideZero prop correctly', () => {
    const { wrapper: wrapperAll, svg: svg1 } = mountInSvg(Axis, {
      ...axisProps,
      hideZero: false
    })
    const { wrapper: wrapperHidden, svg: svg2 } = mountInSvg(Axis, {
      ...axisProps,
      hideZero: true
    })

    const allLines = wrapperAll.findAll('.visx-axis-tick line')
    const hiddenZero = wrapperHidden.findAll('.visx-axis-tick line')

    expect(hiddenZero.length).toBeGreaterThan(0)
    expect(allLines.length).toBe(hiddenZero.length + 1)
    cleanup(wrapperAll, svg1)
    cleanup(wrapperHidden, svg2)
  })

  it('should handle axis line visibility', () => {
    const { wrapper: visible, svg: svg1 } = mountInSvg(Axis, {
      ...axisProps,
      hideAxisLine: false
    })
    expect(visible.find('.visx-axis-line').exists()).toBe(true)
    cleanup(visible, svg1)

    const { wrapper: hidden, svg: svg2 } = mountInSvg(Axis, {
      ...axisProps,
      hideAxisLine: true
    })
    expect(hidden.find('.visx-axis-line').exists()).toBe(false)
    cleanup(hidden, svg2)
  })

  it('should handle ticks visibility', () => {
    const { wrapper: visible, svg: svg1 } = mountInSvg(Axis, {
      ...axisProps,
      hideTicks: false
    })
    expect(visible.findAll('.visx-axis-tick line').length).toBeGreaterThan(0)
    cleanup(visible, svg1)

    const { wrapper: hidden, svg: svg2 } = mountInSvg(Axis, {
      ...axisProps,
      hideTicks: true
    })
    expect(hidden.findAll('.visx-axis-tick line').length).toBe(0)
    cleanup(hidden, svg2)
  })

  it('should render specified tick values', () => {
    const { wrapper: empty, svg: svg1 } = mountInSvg(Axis, {
      ...axisProps,
      tickValues: []
    })
    expect(empty.findAll('.visx-axis-tick').length).toBe(0)
    cleanup(empty, svg1)

    const { wrapper: single, svg: svg2 } = mountInSvg(Axis, {
      ...axisProps,
      tickValues: [2]
    })
    expect(single.findAll('.visx-axis-tick').length).toBe(1)
    cleanup(single, svg2)

    const { wrapper: multiple, svg: svg3 } = mountInSvg(Axis, {
      ...axisProps,
      tickValues: [0, 1, 2, 3, 4, 5, 6]
    })
    expect(multiple.findAll('.visx-axis-tick').length).toBe(7)
    cleanup(multiple, svg3)
  })

  it('should format ticks correctly', () => {
    const { wrapper, svg } = mountInSvg(Axis, {
      ...axisProps,
      tickValues: [0],
      tickFormat: () => 'test!!!'
    })

    const tickText = wrapper.find('.visx-axis-tick text')
    expect(tickText.text()).toBe('test!!!')
    cleanup(wrapper, svg)
  })

  it('should provide tick index to tickFormat function', () => {
    const { wrapper, svg } = mountInSvg(Axis, {
      ...axisProps,
      tickValues: [9],
      tickFormat: (_val: unknown, i: number) => `index-${i}`
    })

    const tickText = wrapper.find('.visx-axis-tick text')
    expect(tickText.text()).toBe('index-0')
    cleanup(wrapper, svg)
  })

  it('should handle tick styling', () => {
    const { wrapper, svg } = mountInSvg(Axis, {
      ...axisProps,
      tickValues: [0],
      strokeWidth: 2
    })

    const tickLines = wrapper.findAll('line')
    expect(tickLines.length).toBeGreaterThan(0)
    expect(tickLines[0].attributes('stroke-width')).toBe('2')
    expect(tickLines[0].attributes('stroke-linecap')).toBe('square')
    cleanup(wrapper, svg)
  })

  it('should handle band scales', () => {
    const { wrapper, svg } = mountInSvg(Axis, {
      orientation: 'bottom' as const,
      scale: scaleBand({
        range: [10, 0],
        round: true,
        domain: ['a', 'b']
      }),
      tickStroke: 'blue'
    })

    const lines = wrapper.findAll('line')
    expect(lines.length).toBeGreaterThan(0)

    const firstLine = lines[0]
    const secondLine = lines[1]

    expect(firstLine.attributes('x1')).toBe('8')
    expect(firstLine.attributes('y1')).toBe('0')
    expect(firstLine.attributes('x2')).toBe('8')
    expect(firstLine.attributes('y2')).toBe('8')

    expect(secondLine.attributes('x1')).toBe('3')
    expect(secondLine.attributes('y1')).toBe('0')
    expect(secondLine.attributes('x2')).toBe('3')
    expect(secondLine.attributes('y2')).toBe('8')
    cleanup(wrapper, svg)
  })

  it('should expose its ref via an innerRef prop', () => {
    const fakeRef = ref<SVGGElement | null>(null)
    const { wrapper, svg } = mountInSvg(Axis, {
      ...axisProps,
      innerRef: fakeRef
    })

    const axisElement = wrapper.find('g.visx-axis').element
    expect(fakeRef.value).toBe(axisElement)
    cleanup(wrapper, svg)
  })
})
