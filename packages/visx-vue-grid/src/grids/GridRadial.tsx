import { defineComponent, useAttrs, type PropType, type CSSProperties } from 'vue'
import { Arc } from '@visx-vue/shape'
import { Group } from '@visx-vue/group'
import type { ScaleInput } from '@visx-vue/scale'
import { getTicks } from '@visx-vue/scale'
import type { CommonGridProps, GridScale } from '../types'

export type GridRadialProps<Scale extends GridScale> = CommonGridProps & {
  /** `@visx/scale` or `d3-scale` object used to convert value to position. */
  scale: Scale
  /**
   * Exact values used to generate grid lines using `scale`.
   * Overrides `numTicks` if specified.
   */
  tickValues?: ScaleInput<Scale>[]
  /**
   * If specified, the arc of each radial grid line will have this thickness, useful for fills.
   */
  arcThickness?: number
  /**
   * The end angle of the arc of radial grid lines in radians.
   */
  endAngle?: number
  /**
   * The class name applied to all radial lines.
   */
  lineClassName?: string
  /**
   * The color applied to the fill of the radial lines.
   */
  fill?: string
  /**
   * The fill opacity applied to the fill of the radial lines.
   */
  fillOpacity?: number
  /**
   * The start angle of the arc of radial grid lines in radians.
   */
  startAngle?: number
}

export type AllGridRadialProps<Scale extends GridScale> = GridRadialProps<Scale> &
  Record<string, unknown>

export const GridRadial = defineComponent({
  name: 'GridRadial',
  inheritAttrs: false,
  props: {
    arcThickness: { type: Number as PropType<number>, default: undefined },
    className: { type: String as PropType<string>, default: undefined },
    endAngle: { type: Number as PropType<number>, default: 2 * Math.PI },
    fill: { type: String as PropType<string>, default: 'transparent' },
    fillOpacity: { type: Number as PropType<number>, default: 1 },
    left: { type: Number as PropType<number>, default: 0 },
    lineClassName: { type: String as PropType<string>, default: undefined },
    lineStyle: { type: Object as PropType<CSSProperties>, default: undefined },
    numTicks: { type: Number as PropType<number>, default: 10 },
    scale: { type: Function as PropType<GridScale>, required: true },
    startAngle: { type: Number as PropType<number>, default: 0 },
    stroke: { type: String as PropType<string>, default: '#eaf0f6' },
    strokeWidth: { type: [String, Number] as PropType<string | number>, default: 1 },
    strokeDasharray: { type: String as PropType<string>, default: undefined },
    tickValues: { type: Array as PropType<unknown[]>, default: undefined },
    top: { type: Number as PropType<number>, default: 0 }
  },
  setup(props) {
    const attrs = useAttrs()

    return () => {
      const radii = props.tickValues ?? getTicks(props.scale, props.numTicks)
      const innerRadius = Math.min(...(props.scale as unknown as { domain(): number[] }).domain())

      const arcAttrs = {
        fill: props.fill,
        fillOpacity: props.fillOpacity,
        stroke: props.stroke,
        strokeWidth: props.strokeWidth,
        strokeDasharray: props.strokeDasharray,
        ...attrs
      }

      return (
        <Group
          className={['visx-grid-radial', props.className].filter(Boolean).join(' ')}
          top={props.top}
          left={props.left}
        >
          {radii.map((radius, i) => (
            <Arc
              key={`radial-grid-${radius}-${i}`}
              className={props.lineClassName}
              startAngle={props.startAngle}
              endAngle={props.endAngle}
              innerRadius={
                props.scale(
                  props.arcThickness ? (radius as number) - props.arcThickness : innerRadius
                ) as number
              }
              outerRadius={props.scale(radius) as number}
              style={props.lineStyle}
              {...arcAttrs}
            />
          ))}
        </Group>
      )
    }
  }
})

export default GridRadial
