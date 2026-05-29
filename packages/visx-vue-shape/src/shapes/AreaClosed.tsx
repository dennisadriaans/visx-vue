import { defineComponent, ref, useAttrs, useSlots, type PropType } from 'vue'
import type { CurveFactory } from '@visx-vue/vendor/d3-shape'
import type { AccessorForArrayItem, PositionScale, BaseAreaProps } from '../types'
import setNumOrAccessor from '../util/setNumberOrNumberAccessor'
import { area } from '../util/D3ShapeFactories'

export type AreaClosedProps<Datum> = BaseAreaProps<Datum> & {
  yScale: PositionScale
}

export const AreaClosed = defineComponent({
  name: 'AreaClosed',
  inheritAttrs: false,
  props: {
    x: {
      type: [Number, Function] as PropType<number | AccessorForArrayItem<unknown, number>>,
      default: undefined
    },
    x0: {
      type: [Number, Function] as PropType<number | AccessorForArrayItem<unknown, number>>,
      default: undefined
    },
    x1: {
      type: [Number, Function] as PropType<number | AccessorForArrayItem<unknown, number>>,
      default: undefined
    },
    y: {
      type: [Number, Function] as PropType<number | AccessorForArrayItem<unknown, number>>,
      default: undefined
    },
    y0: {
      type: [Number, Function] as PropType<number | AccessorForArrayItem<unknown, number>>,
      default: undefined
    },
    y1: {
      type: [Number, Function] as PropType<number | AccessorForArrayItem<unknown, number>>,
      default: undefined
    },
    yScale: { type: Function as PropType<PositionScale>, required: true },
    data: { type: Array as PropType<unknown[]>, default: () => [] },
    defined: {
      type: Function as PropType<AccessorForArrayItem<unknown, boolean>>,
      default: () => true
    },
    className: { type: String as PropType<string>, default: undefined },
    curve: { type: Function as PropType<CurveFactory>, default: undefined }
  },
  setup(props) {
    const attrs = useAttrs()
    const slots = useSlots()
    const innerRef = ref<SVGPathElement | null>(null)

    return () => {
      const path = area({
        x: props.x,
        x0: props.x0,
        x1: props.x1,
        defined: props.defined,
        curve: props.curve
      })
      if (props.y0 == null) {
        /**
         * by default set the baseline to the first element of the yRange
         * @TODO take the minimum instead?
         */
        path.y0(props.yScale.range()[0])
      } else {
        setNumOrAccessor(path.y0, props.y0)
      }
      if (props.y && !props.y1) setNumOrAccessor(path.y1, props.y)
      if (props.y1 && !props.y) setNumOrAccessor(path.y1, props.y1)
      if (slots.default) return slots.default({ path })
      return (
        <path
          ref={innerRef}
          class={['visx-area-closed', props.className]}
          d={path(props.data!) || ''}
          {...attrs}
        />
      )
    }
  }
})

export default AreaClosed
