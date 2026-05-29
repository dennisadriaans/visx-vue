import { defineComponent, useAttrs, useSlots, type PropType, type CSSProperties } from 'vue'
import { Line } from '@visx-vue/shape'
import type { LineProps } from '@visx-vue/shape'
import { Group } from '@visx-vue/group'
import { Point } from '@visx-vue/point'
import type { ScaleInput } from '@visx-vue/scale'
import { getTicks, coerceNumber } from '@visx-vue/scale'
import type { CommonGridProps, GridScale, GridLines } from '../types'
import getScaleBandwidth from '../utils/getScaleBandwidth'
import toSvgProps from '../utils/toSvgProps'

export type GridRowsProps<Scale extends GridScale> = CommonGridProps & {
  /** `@visx/scale` or `d3-scale` object used to convert value to position. */
  scale: Scale
  /**
   * Exact values used to generate grid lines using `scale`.
   * Overrides `numTicks` if specified.
   */
  tickValues?: ScaleInput<Scale>[]
  /** Total width of each grid row line. */
  width: number
}

export type AllGridRowsProps<Scale extends GridScale> = GridRowsProps<Scale> &
  Omit<LineProps & Record<string, unknown>, keyof GridRowsProps<Scale>>

export const GridRows = defineComponent({
  name: 'GridRows',
  inheritAttrs: false,
  props: {
    top: { type: Number as PropType<number>, default: 0 },
    left: { type: Number as PropType<number>, default: 0 },
    scale: { type: Function as PropType<GridScale>, required: true },
    width: { type: Number as PropType<number>, required: true },
    stroke: { type: String as PropType<string>, default: '#eaf0f6' },
    strokeWidth: { type: [String, Number] as PropType<string | number>, default: 1 },
    strokeDasharray: { type: String as PropType<string>, default: undefined },
    className: { type: String as PropType<string>, default: undefined },
    numTicks: { type: Number as PropType<number>, default: 10 },
    lineStyle: { type: Object as PropType<CSSProperties>, default: undefined },
    offset: { type: Number as PropType<number>, default: undefined },
    tickValues: { type: Array as PropType<unknown[]>, default: undefined }
  },
  setup(props) {
    const attrs = useAttrs()
    const slots = useSlots()

    return () => {
      const ticks = props.tickValues ?? getTicks(props.scale, props.numTicks)
      const scaleOffset = (props.offset ?? 0) + getScaleBandwidth(props.scale) / 2
      const tickLines: GridLines = ticks.map((d, index) => {
        const y = (coerceNumber(props.scale(d)) ?? 0) + scaleOffset
        return {
          index,
          from: new Point({ x: 0, y }),
          to: new Point({ x: props.width, y })
        }
      })

      const childrenSlot = slots.default as ((props: { lines: GridLines }) => unknown) | undefined

      const lineProps = toSvgProps({
        stroke: props.stroke,
        strokeWidth: props.strokeWidth,
        strokeDasharray: props.strokeDasharray,
        ...attrs
      })

      return (
        <Group
          className={['visx-rows', props.className].filter(Boolean).join(' ')}
          top={props.top}
          left={props.left}
        >
          {{
            default: () =>
              childrenSlot
                ? childrenSlot({ lines: tickLines })
                : tickLines.map(({ from, to, index }) => (
                    <Line
                      key={`row-line-${index}`}
                      from={from}
                      to={to}
                      style={props.lineStyle}
                      {...lineProps}
                    />
                  ))
          }}
        </Group>
      )
    }
  }
})

export default GridRows
