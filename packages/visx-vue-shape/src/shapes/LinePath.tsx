import { defineComponent, ref, useAttrs, useSlots, type PropType } from 'vue'
import type { CurveFactory, CurveFactoryLineOnly } from '@visx-vue/vendor/d3-shape'
import type { AccessorForArrayItem, LinePathConfig } from '../types'
import { line } from '../util/D3ShapeFactories'

export type LinePathProps<Datum> = {
  /** Array of data for which to generate a line shape. */
  data?: Datum[]
  /** Fill color of the path element. */
  fill?: string
  /** className applied to path element. */
  className?: string
} & LinePathConfig<Datum>

export const LinePath = defineComponent({
  name: 'LinePath',
  inheritAttrs: false,
  props: {
    data: { type: Array as PropType<unknown[]>, default: () => [] },
    x: {
      type: [Number, Function] as PropType<number | AccessorForArrayItem<unknown, number>>,
      default: undefined
    },
    y: {
      type: [Number, Function] as PropType<number | AccessorForArrayItem<unknown, number>>,
      default: undefined
    },
    fill: { type: String as PropType<string>, default: 'transparent' },
    className: { type: String as PropType<string>, default: undefined },
    curve: { type: Function as PropType<CurveFactory | CurveFactoryLineOnly>, default: undefined },
    defined: {
      type: Function as PropType<AccessorForArrayItem<unknown, boolean>>,
      default: () => true
    }
  },
  setup(props) {
    const attrs = useAttrs()
    const slots = useSlots()
    const innerRef = ref<SVGPathElement | null>(null)

    return () => {
      const path = line({ x: props.x, y: props.y, defined: props.defined, curve: props.curve })
      if (slots.default) return slots.default({ path })
      return (
        <path
          ref={innerRef}
          class={['visx-linepath', props.className]}
          d={path(props.data!) || ''}
          fill={props.fill}
          stroke-linecap="round"
          {...attrs}
        />
      )
    }
  }
})

export default LinePath
