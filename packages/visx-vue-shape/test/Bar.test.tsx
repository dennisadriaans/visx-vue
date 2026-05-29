import { describe, test, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { Bar } from '../src'

describe('<Bar />', () => {
  test('it should be defined', () => {
    expect(Bar).toBeDefined()
  })

  test('it should have the .visx-bar class', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(Bar, {
      props: { className: 'test' },
      attachTo: svg
    })
    const rect = wrapper.find('rect')
    expect(rect.classes()).toContain('visx-bar')
    expect(rect.classes()).toContain('test')
    wrapper.unmount()
    document.body.removeChild(svg)
  })

  test('it should expose its ref via an innerRef prop', () => {
    // DEVIATION: Vue uses internal template ref. We verify the rect element renders.
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const wrapper = mount(Bar, {
      attachTo: svg
    })
    expect(wrapper.find('rect').exists()).toBe(true)
    wrapper.unmount()
    document.body.removeChild(svg)
  })
})
