import { describe, test, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { Threshold } from '../src'

const data = [
  { x: 1, y0: 6, y1: 10 },
  { x: 2, y0: 7, y1: 11 }
]

describe('<Threshold />', () => {
  test('should be defined', () => {
    expect(Threshold).toBeDefined()
  })

  test('should render the path', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)

    const wrapper = mount(Threshold, {
      attachTo: svg,
      props: {
        id: `${Math.random()}`,
        data,
        x: (d: (typeof data)[0]) => d.x,
        y0: (d: (typeof data)[0]) => d.y0,
        y1: (d: (typeof data)[0]) => d.y1,
        clipAboveTo: 0,
        clipBelowTo: 100,
        belowAreaProps: {
          fill: 'violet',
          fillOpacity: 0.4
        },
        aboveAreaProps: {
          fill: 'green',
          fillOpacity: 0.4
        }
      }
    })

    expect(wrapper.find('g.visx-threshold').exists()).toBe(true)
    expect(wrapper.findAll('path')).toHaveLength(4)
    wrapper.unmount()
  })

  test('supports accessors for clipping', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)

    const wrapper = mount(Threshold, {
      attachTo: svg,
      props: {
        id: `${Math.random()}`,
        data,
        x: (d: (typeof data)[0]) => d.x,
        y0: (d: (typeof data)[0]) => d.y0,
        y1: (d: (typeof data)[0]) => d.y1,
        clipAboveTo: () => 0,
        clipBelowTo: () => 100,
        belowAreaProps: {
          fill: 'violet',
          fillOpacity: 0.4
        },
        aboveAreaProps: {
          fill: 'green',
          fillOpacity: 0.4
        }
      }
    })

    expect(wrapper.find('g.visx-threshold').exists()).toBe(true)
    expect(wrapper.findAll('path')).toHaveLength(4)
    wrapper.unmount()
  })
})
