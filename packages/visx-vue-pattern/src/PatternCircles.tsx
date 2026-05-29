import { defineComponent, type PropType } from 'vue'
import { Pattern } from './Pattern'

export type PatternCirclesProps = {
  /** Unique id for the pattern. */
  id: string
  /** Width of the pattern element. */
  width: number
  /** Height of the pattern element. */
  height: number
  /** Radius of the pattern circles. */
  radius?: number
  /** Fill applied to circles. */
  fill?: string
  /** className applied to circles. */
  className?: string
  /** stroke applied to circles. */
  stroke?: string
  /** strokeWidth applied to circles. */
  strokeWidth?: number | string
  /** strokeDasharray applied to circles. */
  strokeDasharray?: number | string
  /** Whether to fill in circles within the pattern gaps to increase pattern density. */
  complement?: boolean
  /** Background color applied behind circles. */
  background?: string
}

export const PatternCircles = defineComponent({
  name: 'PatternCircles',
  props: {
    id: { type: String as PropType<string>, required: true },
    width: { type: Number as PropType<number>, required: true },
    height: { type: Number as PropType<number>, required: true },
    radius: { type: Number as PropType<number>, default: 2 },
    fill: { type: String as PropType<string>, default: undefined },
    className: { type: String as PropType<string>, default: undefined },
    stroke: { type: String as PropType<string>, default: undefined },
    strokeWidth: { type: [Number, String] as PropType<number | string>, default: undefined },
    strokeDasharray: { type: [Number, String] as PropType<number | string>, default: undefined },
    complement: { type: Boolean as PropType<boolean>, default: false },
    background: { type: String as PropType<string>, default: undefined }
  },
  setup(props) {
    return () => {
      let corners: [number, number][] | undefined
      if (props.complement) {
        corners = [
          [0, 0],
          [0, props.height],
          [props.width, 0],
          [props.width, props.height]
        ]
      }

      return (
        <Pattern
          id={props.id}
          width={props.width}
          height={props.height}
        >
          {!!props.background && (
            <rect
              width={props.width}
              height={props.height}
              fill={props.background}
            />
          )}
          <circle
            class={['visx-pattern-circle', props.className]}
            cx={props.width / 2}
            cy={props.height / 2}
            r={props.radius}
            fill={props.fill}
            stroke={props.stroke}
            stroke-width={props.strokeWidth}
            stroke-dasharray={props.strokeDasharray}
          />
          {corners?.map(([cornerX, cornerY]) => (
            <circle
              key={`${props.id}-complement-${cornerX}-${cornerY}`}
              class={['visx-pattern-circle visx-pattern-circle-complement', props.className]}
              cx={cornerX}
              cy={cornerY}
              r={props.radius}
              fill={props.fill}
              stroke={props.stroke}
              stroke-width={props.strokeWidth}
              stroke-dasharray={props.strokeDasharray}
            />
          ))}
        </Pattern>
      )
    }
  }
})
