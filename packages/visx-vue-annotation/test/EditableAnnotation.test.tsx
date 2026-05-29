import { describe, it, expect, beforeEach, afterEach } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { EditableAnnotation } from '../src'
import { addMock, removeMock } from './svgMock'

describe('<EditableAnnotation />', () => {
  const defaultProps = {
    width: 100,
    height: 100,
    x: 0,
    y: 0,
    dx: 0,
    dy: 0
  }

  function renderComponent(props?: Record<string, unknown>) {
    return mount({
      render() {
        return (
          <svg>
            <EditableAnnotation
              {...defaultProps}
              {...props}
            >
              <text data-testid="child-content">Child content</text>
            </EditableAnnotation>
          </svg>
        )
      }
    })
  }

  beforeEach(() => {
    addMock()
  })
  afterEach(removeMock)

  it('should be defined', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should render two resize handles by default', () => {
    const wrapper = renderComponent()
    const circles = wrapper.findAll('circle')
    expect(circles).toHaveLength(2)
  })

  it('should render one resize handle if canEditLabel is false', () => {
    const wrapper = renderComponent({ canEditLabel: false })
    const circles = wrapper.findAll('circle')
    expect(circles).toHaveLength(1)
  })

  it('should render one resize handle if canEditSubject is false', () => {
    const wrapper = renderComponent({ canEditSubject: false })
    const circles = wrapper.findAll('circle')
    expect(circles).toHaveLength(1)
  })

  it('should render children content', () => {
    const wrapper = renderComponent()
    expect(wrapper.find('[data-testid="child-content"]').exists()).toBe(true)
  })

  it('should render with correct initial positions', () => {
    const wrapper = renderComponent({
      x: 10,
      y: 20,
      dx: 30,
      dy: 40
    })

    const circles = wrapper.findAll('circle')
    const [subjectHandle, labelHandle] = circles

    expect(subjectHandle.attributes('cx')).toBe('10')
    expect(subjectHandle.attributes('cy')).toBe('20')
    expect(labelHandle.attributes('cx')).toBe('40') // x + dx
    expect(labelHandle.attributes('cy')).toBe('60') // y + dy
  })
})
