import { defineComponent, useAttrs, useSlots, type PropType } from 'vue'
import type { ScaleInput } from '@visx-vue/scale'
import { Group } from '@visx-vue/group'
import { Bar } from './Bar'
import type {
  PositionScale,
  AnyScaleBand,
  DatumObject,
  BarGroupHorizontal as BarGroupHorizontalType,
  BaseBarGroupProps,
  GroupKey,
  Accessor,
  $TSFIXME
} from '../types'
import getBandwidth from '../util/getBandwidth'

export type BarGroupHorizontalProps<
  Datum extends DatumObject,
  Key extends GroupKey = GroupKey,
  Y0Scale extends AnyScaleBand = AnyScaleBand,
  Y1Scale extends AnyScaleBand = AnyScaleBand
> = BaseBarGroupProps<Datum, Key> & {
  /** Returns the value (Datum[key]) mapped to the x of a bar */
  x?: (barValue: number) => number
  /** Returns the value mapped to the y0 (position of group) of a bar */
  y0: Accessor<Datum, ScaleInput<Y0Scale>>
  /** @visx/scale or d3-scale that takes a key value (Datum[key]) and maps it to an x axis position (width of bar). */
  xScale: PositionScale
  /** @visx/scale or d3-scale that takes a y0 value (position of group) and maps it to a y axis position. */
  y0Scale: Y0Scale
  /** @visx/scale or d3-scale that takes a group key and maps it to an y axis position (within a group). */
  y1Scale: Y1Scale
  /** Total width of the x-axis. */
  width: number
}

export const BarGroupHorizontal = defineComponent({
  name: 'BarGroupHorizontal',
  inheritAttrs: false,
  props: {
    data: { type: Array as PropType<DatumObject[]>, required: true },
    className: { type: String as PropType<string>, default: undefined },
    top: { type: Number as PropType<number>, default: undefined },
    left: { type: Number as PropType<number>, default: undefined },
    x: { type: Function as PropType<(barValue: number) => number>, default: () => 0 },
    y0: { type: Function as PropType<Accessor<$TSFIXME, $TSFIXME>>, required: true },
    y0Scale: { type: Function as PropType<AnyScaleBand>, required: true },
    y1Scale: { type: Function as PropType<AnyScaleBand>, required: true },
    xScale: { type: Function as PropType<PositionScale>, required: true },
    color: { type: Function as PropType<(key: GroupKey, index: number) => string>, required: true },
    keys: { type: Array as PropType<GroupKey[]>, required: true },
    width: { type: Number as PropType<number>, required: true }
  },
  setup(props) {
    const attrs = useAttrs()
    const slots = useSlots()

    return () => {
      const barHeight = getBandwidth(props.y1Scale)

      const barGroups: BarGroupHorizontalType<GroupKey>[] = props.data.map((group, i) => ({
        index: i,
        y0: props.y0Scale(props.y0(group)) || 0,
        bars: props.keys.map((key, j) => {
          const value = group[key]
          return {
            index: j,
            key,
            value,
            height: barHeight,
            x: props.x(value) || 0,
            y: props.y1Scale(key) || 0,
            color: props.color(key, j),
            width: props.xScale(value) || 0
          }
        })
      }))

      if (slots.default) return slots.default({ barGroups })

      return (
        <Group
          class={['visx-bar-group-horizontal', props.className]}
          top={props.top}
          left={props.left}
        >
          {{
            default: () =>
              barGroups.map((barGroup) => (
                <Group
                  key={`bar-group-${barGroup.index}-${barGroup.y0}`}
                  top={barGroup.y0}
                >
                  {{
                    default: () =>
                      barGroup.bars.map((bar) => (
                        <Bar
                          key={`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`}
                          x={bar.x}
                          y={bar.y}
                          width={bar.width}
                          height={bar.height}
                          fill={bar.color}
                          {...attrs}
                        />
                      ))
                  }}
                </Group>
              ))
          }}
        </Group>
      )
    }
  }
})

export default BarGroupHorizontal
