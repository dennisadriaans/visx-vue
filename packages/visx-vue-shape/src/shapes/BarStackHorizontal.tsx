import { defineComponent, useAttrs, useSlots, type PropType } from 'vue'
import type { SeriesPoint } from '@visx-vue/vendor/d3-shape'
import { stack as d3stack } from '@visx-vue/vendor/d3-shape'
import { Group } from '@visx-vue/group'
import type { ScaleInput } from '@visx-vue/scale'
import type { PositionScale, StackKey, Accessor, $TSFIXME } from '../types'
import { getFirstItem, getSecondItem } from '../util/accessors'
import getBandwidth from '../util/getBandwidth'
import setNumOrAccessor from '../util/setNumberOrNumberAccessor'
import stackOrder from '../util/stackOrder'
import stackOffset from '../util/stackOffset'
import { Bar } from './Bar'

export type BarStackHorizontalProps<
  Datum,
  Key extends StackKey = StackKey,
  XScale extends PositionScale = PositionScale,
  YScale extends PositionScale = PositionScale
> = {
  /** Array of data for which to generate stacked bars. */
  data: Datum[]
  /** className applied to Bars. */
  className?: string
  /** Top offset of rendered Bars. */
  top?: number
  /** Left offset of rendered Bars. */
  left?: number
  /** Array of keys corresponding to stack layers. */
  keys?: Key[]
  /** Sets the value accessor for a Datum. */
  value?: number | ((d: Datum, key: Key) => number)
  /** Sets the stack order. */
  order?: string
  /** Sets the stack offset. */
  offset?: string
  /** @visx/scale or d3-scale that takes an x value and maps it to an x axis position. */
  xScale: XScale
  /** @visx/scale or d3-scale that takes a y value and maps it to an y axis position. */
  yScale: YScale
  /** Returns the desired color for a bar with a given key and index. */
  color: (key: Key, index: number) => string
  /** Returns the value mapped to the x0 of a bar. */
  x0?: Accessor<SeriesPoint<Datum>, ScaleInput<XScale>>
  /** Returns the value mapped to the x1 of a bar. */
  x1?: Accessor<SeriesPoint<Datum>, ScaleInput<XScale>>
  /** Returns the value mapped to the y of a bar. */
  y: Accessor<Datum, ScaleInput<YScale>>
}

export const BarStackHorizontal = defineComponent({
  name: 'BarStackHorizontal',
  inheritAttrs: false,
  props: {
    data: { type: Array as PropType<unknown[]>, required: true },
    className: { type: String as PropType<string>, default: undefined },
    top: { type: Number as PropType<number>, default: undefined },
    left: { type: Number as PropType<number>, default: undefined },
    y: { type: Function as PropType<Accessor<$TSFIXME, $TSFIXME>>, required: true },
    x0: { type: Function as PropType<Accessor<$TSFIXME, $TSFIXME>>, default: getFirstItem },
    x1: { type: Function as PropType<Accessor<$TSFIXME, $TSFIXME>>, default: getSecondItem },
    xScale: { type: Function as PropType<PositionScale>, required: true },
    yScale: { type: Function as PropType<PositionScale>, required: true },
    color: { type: Function as PropType<(key: StackKey, index: number) => string>, required: true },
    keys: { type: Array as PropType<StackKey[]>, default: undefined },
    value: {
      type: [Number, Function] as PropType<number | ((...args: any[]) => number)>,
      default: undefined
    },
    order: { type: String as PropType<string>, default: undefined },
    offset: { type: String as PropType<string>, default: undefined }
  },
  setup(props) {
    const attrs = useAttrs()
    const slots = useSlots()

    return () => {
      const stack = d3stack<$TSFIXME, StackKey>()
      if (props.keys) stack.keys(props.keys)
      if (props.value) setNumOrAccessor(stack.value, props.value)
      if (props.order) stack.order(stackOrder(props.order as $TSFIXME))
      if (props.offset) stack.offset(stackOffset(props.offset as $TSFIXME))

      const stacks = stack(props.data as $TSFIXME)
      const barHeight = getBandwidth(props.yScale)

      const barStacks = stacks.map((barStack, i) => {
        const { key } = barStack
        return {
          index: i,
          key,
          bars: barStack.map((bar, j) => {
            const x0 = props.xScale(props.x0!(bar as $TSFIXME)) ?? 0
            const x1 = props.xScale(props.x1!(bar as $TSFIXME)) ?? 0
            const barWidth = Math.abs(x1 - x0)
            const barX = Math.min(x0, x1)
            const barY =
              'bandwidth' in props.yScale
                ? (props.yScale as $TSFIXME)(props.y((bar as $TSFIXME).data))
                : Math.max((props.yScale(props.y((bar as $TSFIXME).data)) || 0) - barWidth / 2)
            return {
              bar: bar as $TSFIXME,
              key,
              index: j,
              height: barHeight,
              width: barWidth,
              x: barX || 0,
              y: barY || 0,
              color: props.color(barStack.key, j)
            }
          })
        }
      })

      console.log('BarStackHorizontal computed barStacks[0]?.bars[0]:', barStacks[0]?.bars[0])

      if (slots.default) return (slots.default as any)({ barStacks })

      return (
        <Group
          class={['visx-bar-stack-horizontal', props.className]}
          top={props.top}
          left={props.left}
        >
          {barStacks.map((barStack) =>
            barStack.bars.map((bar) => (
              <Bar
                key={`bar-stack-${barStack.index}-${bar.index}`}
                x={bar.x}
                y={bar.y}
                height={bar.height}
                width={bar.width}
                fill={bar.color}
                {...attrs}
              />
            ))
          )}
        </Group>
      )
    }
  }
})

export default BarStackHorizontal
