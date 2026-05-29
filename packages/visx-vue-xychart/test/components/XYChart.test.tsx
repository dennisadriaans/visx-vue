// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vite-plus/test'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { XYChart, DataProvider } from '../../src'
import { useDataContext } from '../../src/context/DataContext'

const chartProps = {
  xScale: { type: 'linear' as const },
  yScale: { type: 'linear' as const },
  width: 100,
  height: 100
}

describe('<XYChart />', () => {
  it('should be defined', () => {
    expect(XYChart).toBeDefined()
  })

  it('should warn if DataProvider is not available and no x- or yScale config is passed', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const wrapper = mount(XYChart, {
      slots: {
        default: () => h('rect')
      }
    })

    expect(warnSpy).toHaveBeenCalledWith(
      '[@visx-vue/xychart] XYChart: When no DataProvider is available in context, you must pass xScale & yScale config to XYChart.'
    )

    // Component should return null and not render an SVG
    expect(wrapper.find('svg').exists()).toBe(false)

    warnSpy.mockRestore()
  })

  it('should render an svg', () => {
    const wrapper = mount(XYChart, {
      props: chartProps,
      slots: {
        default: () => h('rect')
      }
    })
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('should render children', () => {
    const wrapper = mount(XYChart, {
      props: chartProps,
      slots: {
        default: () => h('rect', { id: 'xychart-child' })
      }
    })
    expect(wrapper.find('#xychart-child').exists()).toBe(true)
  })

  it('should update the registry dimensions', async () => {
    const spy = vi.fn()
    const width = 123
    const height = 456

    const DataConsumer = defineComponent({
      setup() {
        const data = useDataContext()
        spy(data)
        return () => null
      }
    })

    mount(DataProvider, {
      props: {
        xScale: { type: 'linear' },
        yScale: { type: 'linear' }
      },
      slots: {
        default: () => (
          <XYChart
            width={width}
            height={height}
          >
            <DataConsumer />
          </XYChart>
        )
      }
    })

    await flushPromises()
    await nextTick()

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        width,
        height
      })
    )
  })
})
