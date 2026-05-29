import { describe, test, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { RadialGradient } from '../src'

describe('<RadialGradient />', () => {
  test('it should be defined', () => {
    expect(RadialGradient).toBeDefined()
  })

  test('it should render without crashing', () => {
    expect(() =>
      mount(() => (
        <svg>
          <RadialGradient id="radial" />
        </svg>
      ))
    ).not.toThrow()
  })
})
