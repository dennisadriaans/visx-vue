import { describe, it, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { Zoom, inverseMatrix } from '../src'

describe('<Zoom />', () => {
  it('should be defined', () => {
    expect(Zoom).toBeDefined()
  })

  it('should render the children and pass zoom params', () => {
    const initialTransform = {
      scaleX: 1.27,
      scaleY: 1.27,
      translateX: -211.62,
      translateY: 162.59,
      skewX: 0,
      skewY: 0
    }

    const Wrapper = defineComponent({
      setup() {
        return () =>
          h(
            Zoom,
            {
              width: 400,
              height: 400,
              scaleXMin: 1 / 2,
              scaleXMax: 4,
              scaleYMin: 1 / 2,
              scaleYMax: 4,
              initialTransformMatrix: initialTransform
            },
            {
              default: (zoom: { transformMatrix: typeof initialTransform }) => {
                const { scaleX, scaleY, translateX, translateY } = zoom.transformMatrix
                return h('div', {}, [scaleX, scaleY, translateX, translateY].join(','))
              }
            }
          )
      }
    })

    const wrapper = mount(Wrapper)

    expect(wrapper.text()).toBe('1.27,1.27,-211.62,162.59')
  })
})

describe('inverseMatrix', () => {
  it('should be defined', () => {
    expect(inverseMatrix).toBeDefined()
  })
})
