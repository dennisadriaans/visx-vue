import { defineComponent, type PropType } from 'vue'
import { PatternPath } from './PatternPath'

export type PatternHexagonsProps = {
  /** Unique id for the pattern. */
  id: string
  /** Height of the pattern element. */
  height: number
  /** Size of the hexagon shape. */
  size?: number
  /** Fill applied to hexagons. */
  fill?: string
  /** className applied to hexagon path element. */
  className?: string
  /** Background color applied behind hexagons. */
  background?: string
  /** Stroke color applied to hexagon paths. */
  stroke?: string
  /** strokeWidth applied to hexagon paths. */
  strokeWidth?: number | string
  /** strokeDasharray applied to hexagon paths. */
  strokeDasharray?: string | number
  /** strokeLinecap applied to hexagon paths. */
  strokeLinecap?: 'square' | 'butt' | 'round' | 'inherit'
  /** shapeRendering applied to hexagon paths. */
  shapeRendering?: string | number
}

export const PatternHexagons = defineComponent({
  name: 'PatternHexagons',
  props: {
    id: { type: String as PropType<string>, required: true },
    height: { type: Number as PropType<number>, required: true },
    size: { type: Number as PropType<number>, default: 3 },
    fill: { type: String as PropType<string>, default: undefined },
    className: { type: String as PropType<string>, default: undefined },
    background: { type: String as PropType<string>, default: undefined },
    stroke: { type: String as PropType<string>, default: undefined },
    strokeWidth: { type: [Number, String] as PropType<number | string>, default: undefined },
    strokeDasharray: { type: [String, Number] as PropType<string | number>, default: undefined },
    strokeLinecap: {
      type: String as PropType<'square' | 'butt' | 'round' | 'inherit'>,
      default: undefined
    },
    shapeRendering: { type: [String, Number] as PropType<string | number>, default: undefined }
  },
  setup(props) {
    return () => {
      const sqrtSize = Math.sqrt(props.size)
      return (
        <PatternPath
          className={['visx-pattern-hexagon', props.className].filter(Boolean).join(' ')}
          path={`M ${props.height},0 l ${props.height},0 l ${props.height / 2},${(props.height * sqrtSize) / 2} l ${
            -props.height / 2
          },${(props.height * sqrtSize) / 2} l ${-props.height},0 l ${-props.height / 2},${
            (-props.height * sqrtSize) / 2
          } Z M 0,${(props.height * sqrtSize) / 2} l ${props.height / 2},0 M ${3 * props.height},${
            (props.height * sqrtSize) / 2
          } l ${-props.height / 2},0`}
          id={props.id}
          width={props.size}
          height={sqrtSize}
          fill={props.fill}
          stroke={props.stroke}
          strokeWidth={props.strokeWidth}
          strokeDasharray={props.strokeDasharray}
          strokeLinecap={props.strokeLinecap}
          shapeRendering={props.shapeRendering}
          background={props.background}
        />
      )
    }
  }
})
