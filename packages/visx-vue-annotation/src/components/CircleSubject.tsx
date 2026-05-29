import { defineComponent, useAttrs, type PropType } from 'vue'
import type { AnnotationContextType } from '../types'
import { useAnnotationContext } from '../context'

export type CircleSubjectProps = Pick<AnnotationContextType, 'x' | 'y'> & {
  /** Optional className to apply to CircleSubject in addition to 'visx-annotation-subject'. */
  className?: string
  /** Color of CircleSubject. */
  stroke?: string
  /** Radius of CircleSubject. */
  radius?: number
}

export const CircleSubject = defineComponent({
  name: 'CircleSubject',
  inheritAttrs: false,
  props: {
    className: { type: String as PropType<string>, default: undefined },
    x: { type: Number as PropType<number>, default: undefined },
    y: { type: Number as PropType<number>, default: undefined },
    stroke: { type: String as PropType<string>, default: '#222' },
    radius: { type: Number as PropType<number>, default: 16 }
  },
  setup(props) {
    const attrs = useAttrs()
    const annotationContext = useAnnotationContext()

    return () => {
      const ctx = annotationContext.value

      return (
        <circle
          class={['visx-annotation-subject', 'visx-annotation-subject-circle', props.className]}
          cx={props.x || ctx.x}
          cy={props.y || ctx.y}
          r={props.radius}
          fill="transparent"
          stroke={props.stroke}
          {...{ 'pointer-events': 'none' }}
          {...attrs}
        />
      )
    }
  }
})

export default CircleSubject
