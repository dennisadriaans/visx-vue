import { defineComponent, useAttrs, useSlots, type PropType } from 'vue'
import type { ScaleInput } from '@visx-vue/scale'
import { Group } from '@visx-vue/group'
import { Bar } from './Bar'
import type {
  PositionScale,
  DatumObject,
  AnyScaleBand,
  BaseBarGroupProps,
  BarGroup as BarGroupType,
  GroupKey,
  Accessor,
  $TSFIXME
} from '../types'
import getBandwidth from '../util/getBandwidth'

export type BarGroupProps<
  Datum extends DatumObject,
  Key extends GroupKey = GroupKey,
  X0Scale extends AnyScaleBand = AnyScaleBand,
  X1Scale extends AnyScaleBand = AnyScaleBand
> = BaseBarGroupProps<Datum, Key> & {
  /** Returns the value mapped to the x0 (group position) of a bar */
  x0: Accessor<Datum, ScaleInput<X0Scale>>
  /** @visx/scale or d3-scale that takes an x0 value (position of group) and maps it to an x0 axis position of the group. */
  x0Scale: X0Scale
  /** @visx/scale or d3-scale that takes a group key and maps it to an x axis position (within a group). */
  x1Scale: X1Scale
  /** @visx/scale or d3-scale that takes an y value (Datum[key]) and maps it to a y axis position. */
  yScale: PositionScale
  /** Total height of the y-axis. */
  height: number
}

export const BarGroup = defineComponent({
  name: 'BarGroup',
  inheritAttrs: false,
  props: {
    data: { type: Array as PropType<DatumObject[]>, required: true },
    className: { type: String as PropType<string>, default: undefined },
    top: { type: Number as PropType<number>, default: undefined },
    left: { type: Number as PropType<number>, default: undefined },
    x0: { type: Function as PropType<Accessor<$TSFIXME, $TSFIXME>>, required: true },
    x0Scale: { type: Function as PropType<AnyScaleBand>, required: true },
    x1Scale: { type: Function as PropType<AnyScaleBand>, required: true },
    yScale: { type: Function as PropType<PositionScale>, required: true },
    color: { type: Function as PropType<(key: GroupKey, index: number) => string>, required: true },
    keys: { type: Array as PropType<GroupKey[]>, required: true },
    height: { type: Number as PropType<number>, required: true }
  },
  setup(props) {
    const attrs = useAttrs()
    const slots = useSlots()

    return () => {
      const barWidth = getBandwidth(props.x1Scale)

      const barGroups: BarGroupType<GroupKey>[] = props.data.map((group, i) => ({
        index: i,
        x0: props.x0Scale(props.x0(group))!,
        bars: props.keys.map((key, j) => {
          const value = group[key]
          return {
            index: j,
            key,
            value,
            width: barWidth,
            x: props.x1Scale(key) || 0,
            y: props.yScale(value) || 0,
            color: props.color(key, j),
            height: props.height - (props.yScale(value) || 0)
          }
        })
      }))

      if (slots.default) return slots.default({ barGroups })

      return (
        <Group
          class={['visx-bar-group', props.className]}
          top={props.top}
          left={props.left}
        >
          {{
            default: () =>
              barGroups.map((barGroup) => (
                <Group
                  key={`bar-group-${barGroup.index}-${barGroup.x0}`}
                  left={barGroup.x0}
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

export default BarGroup
