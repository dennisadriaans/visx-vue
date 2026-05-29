import { defineComponent, useAttrs, useSlots, type PropType } from 'vue'
import type { $TSFIXME, AccessorForArrayItem, StackKey } from '../types'
import { Stack } from './Stack'

export type AreaStackProps<Datum, Key> = {
  className?: string
  top?: number
  left?: number
  keys?: Key[]
  data: Datum[]
  curve?: $TSFIXME
  defined?: AccessorForArrayItem<$TSFIXME, boolean>
  x?: number | AccessorForArrayItem<$TSFIXME, number>
  x0?: number | AccessorForArrayItem<$TSFIXME, number>
  x1?: number | AccessorForArrayItem<$TSFIXME, number>
  y0?: number | AccessorForArrayItem<$TSFIXME, number>
  y1?: number | AccessorForArrayItem<$TSFIXME, number>
  value?: number | ((...args: any[]) => number)
  order?: string
  offset?: string
  color?: (key: Key, index: number) => string
}

export const AreaStack = defineComponent({
  name: 'AreaStack',
  inheritAttrs: false,
  props: {
    className: { type: String as PropType<string>, default: undefined },
    top: { type: Number as PropType<number>, default: undefined },
    left: { type: Number as PropType<number>, default: undefined },
    keys: { type: Array as PropType<StackKey[]>, default: undefined },
    data: { type: Array as PropType<unknown[]>, required: true },
    curve: { type: Function as PropType<$TSFIXME>, default: undefined },
    defined: {
      type: Function as PropType<AccessorForArrayItem<$TSFIXME, boolean>>,
      default: undefined
    },
    x: {
      type: [Number, Function] as PropType<number | AccessorForArrayItem<$TSFIXME, number>>,
      default: undefined
    },
    x0: {
      type: [Number, Function] as PropType<number | AccessorForArrayItem<$TSFIXME, number>>,
      default: undefined
    },
    x1: {
      type: [Number, Function] as PropType<number | AccessorForArrayItem<$TSFIXME, number>>,
      default: undefined
    },
    y0: {
      type: [Number, Function] as PropType<number | AccessorForArrayItem<$TSFIXME, number>>,
      default: undefined
    },
    y1: {
      type: [Number, Function] as PropType<number | AccessorForArrayItem<$TSFIXME, number>>,
      default: undefined
    },
    value: {
      type: [Number, Function] as PropType<number | ((...args: any[]) => number)>,
      default: undefined
    },
    order: { type: String as PropType<string>, default: undefined },
    offset: { type: String as PropType<string>, default: undefined },
    color: {
      type: Function as PropType<(key: StackKey, index: number) => string>,
      default: undefined
    }
  },
  setup(props) {
    const attrs = useAttrs()
    const slots = useSlots()

    return () => {
      const defaultRenderer = ({ stacks, path }: { stacks: $TSFIXME[]; path: $TSFIXME }) =>
        stacks.map((series: $TSFIXME, i: number) => (
          <path
            class={['visx-area-stack', props.className]}
            key={`area-stack-${i}-${series.key || ''}`}
            d={path(series) || ''}
            fill={props.color?.(series.key, i)}
            {...attrs}
          />
        ))

      return (
        <Stack
          className={props.className}
          top={props.top}
          left={props.left}
          keys={props.keys}
          data={props.data}
          curve={props.curve}
          defined={props.defined}
          x={props.x}
          x0={props.x0}
          x1={props.x1}
          y0={props.y0}
          y1={props.y1}
          value={props.value}
          order={props.order}
          offset={props.offset}
          color={props.color}
        >
          {{
            default: slots.default || defaultRenderer
          }}
        </Stack>
      )
    }
  }
})

export default AreaStack
