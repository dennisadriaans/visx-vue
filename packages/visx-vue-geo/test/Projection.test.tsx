import { describe, test, expect, vi } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import type { GeometryCollection } from 'geojson'
import { Projection } from '../src/Projection'

// Pre-computed GeoJSON features equivalent to running topojson-client's feature()
// on the mockTopology from the React tests. Two simple polygons.
const data: GeometryCollection[] = [
  {
    type: 'Polygon',
    coordinates: [
      [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0],
        [0, 0]
      ]
    ]
  },
  {
    type: 'Polygon',
    coordinates: [
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        [0, 0]
      ]
    ]
  }
] as unknown as GeometryCollection[]

describe('<Projection />', () => {
  const defaultProps = { data }

  test('it should be defined', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    expect(() => mount(Projection, { props: { ...defaultProps }, attachTo: svg })).not.toThrow()
    svg.remove()
  })

  test('it should pass className', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(Projection, {
      props: { ...defaultProps, className: 'visx-new' },
      attachTo: svg
    })
    const path = wrapper.find('path')
    expect(path.classes()).toContain('visx-geo-mercator')
    expect(path.classes()).toContain('visx-new')
    svg.remove()
  })

  test('it should create two paths', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(Projection, {
      props: { ...defaultProps },
      attachTo: svg
    })
    const paths = wrapper.findAll('path')
    expect(paths).toHaveLength(2)
    svg.remove()
  })

  test('it should pass prop to path', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(Projection, {
      props: { ...defaultProps },
      attrs: { stroke: 'red' },
      attachTo: svg
    })
    const paths = wrapper.findAll('path')
    paths.forEach((path) => {
      expect(path.attributes('stroke')).toBe('red')
    })
    svg.remove()
  })

  test('it should call projectionFunc prop function', () => {
    const projectionFunc = vi.fn()
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    mount(Projection, {
      props: { ...defaultProps, projectionFunc },
      attachTo: svg
    })
    expect(projectionFunc).toHaveBeenCalledTimes(1)
    // Verify projection is passed
    expect(projectionFunc.mock.calls[0]?.[0]).toBeDefined()
    svg.remove()
  })

  test('it should call centroid prop function', () => {
    const centroid = vi.fn()
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    mount(Projection, {
      props: { ...defaultProps, centroid },
      attachTo: svg
    })
    expect(centroid).toHaveBeenCalledTimes(2)
    // Verify centroid coordinates and feature are passed
    expect(centroid.mock.calls[0]?.[0]).toEqual(expect.any(Array))
    expect(centroid.mock.calls[0]?.[1]).toEqual(expect.any(Object))
    svg.remove()
  })
})
