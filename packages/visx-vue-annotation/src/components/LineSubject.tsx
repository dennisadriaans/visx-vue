import { defineComponent, useAttrs, type PropType } from 'vue'
import { useAnnotationContext } from '../context'

export type LineSubjectProps = {
  /** Optional className to apply to LineSubject in addition to 'visx-annotation-subject'. */
  className?: string
  /** Color of LineSubject. */
  stroke?: string
  /** strokeWidth of LineSubject. */
  strokeWidth?: number
  /** Orientation of line. */
  orientation?: 'vertical' | 'horizontal'
  /** x position of LineSubject (for vertical LineSubjects). */
  x?: number
  /** y position of LineSubject (for horizontal LineSubjects). */
  y?: number
  /** The minimum coordinate of the line. */
  min: number
  /** The maximum coordinate of the line. */
  max: number
}

export const LineSubject = defineComponent({
  name: 'LineSubject',
  inheritAttrs: false,
  props: {
    className: { type: String as PropType<string>, default: undefined },
    stroke: { type: String as PropType<string>, default: '#222' },
    orientation: { type: String as PropType<'vertical' | 'horizontal'>, default: 'vertical' },
    x: { type: Number as PropType<number>, default: undefined },
    y: { type: Number as PropType<number>, default: undefined },
    min: { type: Number as PropType<number>, required: true },
    max: { type: Number as PropType<number>, required: true }
  },
  setup(props) {
    const attrs = useAttrs()
    const annotationContext = useAnnotationContext()

    return () => {
      const ctx = annotationContext.value
      const lineIsVertical = props.orientation === 'vertical'

      return (
        <line
          class={['visx-annotation-subject', 'visx-annotation-subject-line', props.className]}
          x1={lineIsVertical ? props.x || ctx.x : props.min}
          x2={lineIsVertical ? props.x || ctx.x : props.max}
          y1={lineIsVertical ? props.min : props.y || ctx.y}
          y2={lineIsVertical ? props.max : props.y || ctx.y}
          fill="transparent"
          stroke={props.stroke}
          {...{ 'pointer-events': 'none' }}
          {...attrs}
        />
      )
    }
  }
})

export default LineSubject
