import { defineComponent, ref, useAttrs, useSlots, type PropType } from 'vue'
import type { CurveFactory, CurveFactoryLineOnly } from '@visx-vue/vendor/d3-shape'
import type { AccessorForArrayItem, RadialLinePathConfig } from '../types'
import { radialLine } from '../util/D3ShapeFactories'

export type LineRadialProps<Datum> = {
  /** className applied to path element. */
  className?: string
  /** Array of data for which to generate a radial line shape. */
  data?: Datum[]
  /** Fill color of the path element. */
  fill?: string
} & RadialLinePathConfig<Datum>

export const LineRadial = defineComponent({
  name: 'LineRadial',
  inheritAttrs: false,
  props: {
    className: { type: String as PropType<string>, default: undefined },
    angle: {
      type: [Number, Function] as PropType<number | AccessorForArrayItem<unknown, number>>,
      default: undefined
    },
    radius: {
      type: [Number, Function] as PropType<number | AccessorForArrayItem<unknown, number>>,
      default: undefined
    },
    defined: {
      type: Function as PropType<AccessorForArrayItem<unknown, boolean>>,
      default: undefined
    },
    curve: { type: Function as PropType<CurveFactory | CurveFactoryLineOnly>, default: undefined },
    data: { type: Array as PropType<unknown[]>, default: () => [] },
    fill: { type: String as PropType<string>, default: 'transparent' }
  },
  setup(props) {
    const attrs = useAttrs()
    const slots = useSlots()
    const innerRef = ref<SVGPathElement | null>(null)

    return () => {
      const path = radialLine({
        angle: props.angle,
        radius: props.radius,
        defined: props.defined,
        curve: props.curve
      })
      if (slots.default) return slots.default({ path })
      return (
        <path
          ref={innerRef}
          class={['visx-line-radial', props.className]}
          d={path(props.data!) || ''}
          fill={props.fill}
          {...attrs}
        />
      )
    }
  }
})

export default LineRadial
