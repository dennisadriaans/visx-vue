import { defineComponent, type PropType } from 'vue'
import { PatternPath } from './PatternPath'

export type PatternWavesProps = {
  /** Unique id for the pattern. */
  id: string
  /** Width of the pattern element. */
  width: number
  /** Height of the pattern element. */
  height: number
  /** fill color applied to path. */
  fill?: string
  /** className applied to the path element. */
  className?: string
  /** Background color applied behind path. */
  background?: string
  /** Stroke color applied to path. */
  stroke?: string
  /** strokeWidth applied to path. */
  strokeWidth?: number | string
  /** strokeDasharray applied to path. */
  strokeDasharray?: string | number
  /** strokeLinecap applied to path. */
  strokeLinecap?: 'square' | 'butt' | 'round' | 'inherit'
  /** shapeRendering applied to path. */
  shapeRendering?: string | number
}

export const PatternWaves = defineComponent({
  name: 'PatternWaves',
  props: {
    id: { type: String as PropType<string>, required: true },
    width: { type: Number as PropType<number>, required: true },
    height: { type: Number as PropType<number>, required: true },
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
    return () => (
      <PatternPath
        className={['visx-pattern-wave', props.className].filter(Boolean).join(' ')}
        path={`M 0 ${props.height / 2} c ${props.height / 8} ${-props.height / 4} , ${(props.height * 3) / 8} ${
          -props.height / 4
        } , ${props.height / 2} 0
             c ${props.height / 8} ${props.height / 4} , ${(props.height * 3) / 8} ${props.height / 4} , ${
               props.height / 2
             } 0 M ${-props.height / 2} ${props.height / 2}
             c ${props.height / 8} ${props.height / 4} , ${(props.height * 3) / 8} ${props.height / 4} , ${
               props.height / 2
             } 0 M ${props.height} ${props.height / 2}
             c ${props.height / 8} ${-props.height / 4} , ${(props.height * 3) / 8} ${-props.height / 4} , ${props.height / 2} 0`}
        id={props.id}
        width={props.width}
        height={props.height}
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
})
