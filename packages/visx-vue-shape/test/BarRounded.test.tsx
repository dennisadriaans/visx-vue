import { describe, it, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { BarRounded } from '../src'
import { getBarRoundedPath } from '../src/shapes/BarRounded'

const testProps = { x: 0, y: 0, width: 10, height: 20, radius: 2 }

describe('<BarRounded />', () => {
  it('should be defined', () => {
    expect(BarRounded).toBeDefined()
  })

  it('should have the .visx-bar-rounded class', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(BarRounded, {
      props: { ...testProps, className: 'test' },
      attachTo: svg
    })
    const path = wrapper.find('path')
    expect(path.classes()).toContain('visx-bar-rounded')
    expect(path.classes()).toContain('test')
    wrapper.unmount()
    document.body.removeChild(svg)
  })

  it('should expose its ref via an innerRef prop', () => {
    // DEVIATION: Vue uses internal template ref. We verify the path element renders.
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(BarRounded, {
      props: { ...testProps },
      attachTo: svg
    })
    expect(wrapper.find('path').exists()).toBe(true)
    wrapper.unmount()
    document.body.removeChild(svg)
  })

  it('should support getBarRoundedPath utility', () => {
    // DEVIATION: React exports useBarRoundedPath hook; Vue exports getBarRoundedPath function
    const path = getBarRoundedPath({ ...testProps, all: true })
    expect(path).toBe(
      'M2,0 h6 a2,2 0 0 1 2,2 v16 a2,2 0 0 1 -2,2 h-6 a2,2 0 0 1 -2,-2 v-16 a2,2 0 0 1 2,-2z'
    )
  })

  it('should generate correct paths for different corner configurations', () => {
    const cases = [
      {
        props: { topLeft: true },
        expected: 'M2,0 h6 h2v2 v16 v2h-2 h-6 h-2v-2 v-16 a2,2 0 0 1 2,-2z'
      },
      {
        props: { topRight: true },
        expected: 'M2,0 h6 a2,2 0 0 1 2,2 v16 v2h-2 h-6 h-2v-2 v-16 v-2h2z'
      },
      {
        props: { bottomLeft: true },
        expected: 'M2,0 h6 h2v2 v16 v2h-2 h-6 a2,2 0 0 1 -2,-2 v-16 v-2h2z'
      },
      {
        props: { bottomRight: true },
        expected: 'M2,0 h6 h2v2 v16 a2,2 0 0 1 -2,2 h-6 h-2v-2 v-16 v-2h2z'
      },
      {
        props: { top: true },
        expected: 'M2,0 h6 a2,2 0 0 1 2,2 v16 v2h-2 h-6 h-2v-2 v-16 a2,2 0 0 1 2,-2z'
      },
      {
        props: { bottom: true },
        expected: 'M2,0 h6 h2v2 v16 a2,2 0 0 1 -2,2 h-6 a2,2 0 0 1 -2,-2 v-16 v-2h2z'
      },
      {
        props: { left: true },
        expected: 'M2,0 h6 h2v2 v16 v2h-2 h-6 a2,2 0 0 1 -2,-2 v-16 a2,2 0 0 1 2,-2z'
      },
      {
        props: { right: true },
        expected: 'M2,0 h6 a2,2 0 0 1 2,2 v16 a2,2 0 0 1 -2,2 h-6 h-2v-2 v-16 v-2h2z'
      },
      {
        props: { all: true },
        expected:
          'M2,0 h6 a2,2 0 0 1 2,2 v16 a2,2 0 0 1 -2,2 h-6 a2,2 0 0 1 -2,-2 v-16 a2,2 0 0 1 2,-2z'
      }
    ]

    cases.forEach(({ props, expected }) => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      document.body.appendChild(svg)
      const wrapper = mount(BarRounded, {
        props: { ...testProps, ...props },
        attachTo: svg
      })
      expect(wrapper.find('path').attributes('d')).toBe(expected)
      wrapper.unmount()
      document.body.removeChild(svg)
    })
  })

  it('should clamp radius to the center of the shortest side of the rect', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(BarRounded, {
      props: { ...testProps, topLeft: true, width: 4, radius: 400 },
      attachTo: svg
    })
    const r = Math.min(4, testProps.height) / 2
    expect(wrapper.find('path').attributes('d')).toBe(
      `M2,0 h0 h2v2 v16 v2h-2 h0 h-2v-2 v-16 a${r},${r} 0 0 1 ${r},-${r}z`
    )
    wrapper.unmount()
    document.body.removeChild(svg)
  })
})
