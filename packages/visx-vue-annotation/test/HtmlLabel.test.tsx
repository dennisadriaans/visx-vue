import { describe, it, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { HtmlLabel } from '../src'

describe('<HtmlLabel />', () => {
  it('should render HTML content', () => {
    const wrapper = mount({
      render() {
        return (
          <svg>
            <HtmlLabel>
              <h1>Hello, HTML</h1>
            </HtmlLabel>
          </svg>
        )
      }
    })

    expect(wrapper.find('h1').exists()).toBe(true)
  })
})
