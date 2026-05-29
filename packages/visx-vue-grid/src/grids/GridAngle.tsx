import { defineComponent, useAttrs, type PropType, type CSSProperties } from 'vue'
import { Line } from '@visx-vue/shape'
import type { LineProps } from '@visx-vue/shape'
import { Group } from '@visx-vue/group'
import { Point } from '@visx-vue/point'
import type { ScaleInput } from '@visx-vue/scale'
import { getTicks, coerceNumber } from '@visx-vue/scale'
import type { CommonGridProps, GridScale } from '../types'
import polarToCartesian from '../utils/polarToCartesian'
import toSvgProps from '../utils/toSvgProps'

export type GridAngleProps<Scale extends GridScale> = CommonGridProps & {
  /** `@visx/scale` or `d3-scale` object used to convert value to angle. */
  scale: Scale
  /**
   * Exact values used to generate angle grid lines using `scale`.
   * Overrides `numTicks` if specified.
   */
  tickValues?: ScaleInput<Scale>[]
  /**
   * Radius which determines the start position of angle lines.
   */
  innerRadius?: number
  /**
   * Radius which determines the end position of angle lines.
   */
  outerRadius: number
  /**
   * The class name applied to all angle lines.
   */
  lineClassName?: string
}

export type AllGridAngleProps<Scale extends GridScale> = GridAngleProps<Scale> &
  Omit<LineProps & Record<string, unknown>, keyof GridAngleProps<Scale>>

export const GridAngle = defineComponent({
  name: 'GridAngle',
  inheritAttrs: false,
  props: {
    className: { type: String as PropType<string>, default: undefined },
    innerRadius: { type: Number as PropType<number>, default: 0 },
    left: { type: Number as PropType<number>, default: 0 },
    lineClassName: { type: String as PropType<string>, default: undefined },
    lineStyle: { type: Object as PropType<CSSProperties>, default: undefined },
    numTicks: { type: Number as PropType<number>, default: 10 },
    outerRadius: { type: Number as PropType<number>, default: 0 },
    scale: { type: Function as PropType<GridScale>, required: true },
    stroke: { type: String as PropType<string>, default: '#eaf0f6' },
    strokeDasharray: { type: String as PropType<string>, default: undefined },
    strokeWidth: { type: [String, Number] as PropType<string | number>, default: 1 },
    tickValues: { type: Array as PropType<unknown[]>, default: undefined },
    top: { type: Number as PropType<number>, default: 0 }
  },
  setup(props) {
    const attrs = useAttrs()

    return () => {
      const ticks = props.tickValues ?? getTicks(props.scale, props.numTicks)

      const lineProps = toSvgProps({
        stroke: props.stroke,
        strokeWidth: props.strokeWidth,
        strokeDasharray: props.strokeDasharray,
        ...attrs
      })

      return (
        <Group
          className={['visx-grid-angle', props.className].filter(Boolean).join(' ')}
          top={props.top}
          left={props.left}
        >
          {ticks.map((tick, i) => {
            const angle = (coerceNumber(props.scale(tick)) ?? Math.PI / 2) - Math.PI / 2
            return (
              <Line
                key={`polar-grid-${tick}-${i}`}
                className={props.lineClassName}
                from={new Point(polarToCartesian({ angle, radius: props.innerRadius }))}
                to={new Point(polarToCartesian({ angle, radius: props.outerRadius }))}
                style={props.lineStyle}
                {...lineProps}
              />
            )
          })}
        </Group>
      )
    }
  }
})

export default GridAngle
