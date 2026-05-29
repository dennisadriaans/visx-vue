import { defineComponent, ref, useSlots, type PropType, type CSSProperties } from 'vue'
import { useElementBounding } from '@vueuse/core'
import { Group } from '@visx-vue/group'
import { useAnnotationContext } from '../context'
import AnchorLine from './LabelAnchorLine'
import type { LabelProps } from './Label'

const wrapperStyle: CSSProperties = { display: 'inline-block' }

export type HtmlLabelProps = Pick<
  LabelProps,
  | 'anchorLineStroke'
  | 'className'
  | 'horizontalAnchor'
  | 'resizeObserverPolyfill'
  | 'showAnchorLine'
  | 'verticalAnchor'
  | 'x'
  | 'y'
> & {
  /** Optional styles to apply to the HTML container. */
  containerStyle?: CSSProperties
}

export const HtmlLabel = defineComponent({
  name: 'HtmlLabel',
  props: {
    anchorLineStroke: { type: String as PropType<string>, default: '#222' },
    className: { type: String as PropType<string>, default: undefined },
    containerStyle: { type: Object as PropType<CSSProperties>, default: undefined },
    horizontalAnchor: {
      type: String as PropType<'start' | 'middle' | 'end' | 'inherit'>,
      default: undefined
    },
    resizeObserverPolyfill: { type: Function as PropType<unknown>, default: undefined },
    showAnchorLine: { type: Boolean as PropType<boolean>, default: true },
    verticalAnchor: {
      type: String as PropType<'start' | 'middle' | 'end'>,
      default: undefined
    },
    x: { type: Number as PropType<number>, default: undefined },
    y: { type: Number as PropType<number>, default: undefined }
  },
  setup(props) {
    const slots = useSlots()
    const annotationContext = useAnnotationContext()

    const labelRef = ref<HTMLDivElement | null>(null)
    const labelBounds = useElementBounding(labelRef)

    return () => {
      const width = labelBounds.width.value
      const height = labelBounds.height.value

      const { x: ctxX = 0, y: ctxY = 0, dx = 0, dy = 0 } = annotationContext.value

      const horizontalAnchor =
        props.horizontalAnchor ||
        (Math.abs(dx) < Math.abs(dy) ? 'middle' : dx > 0 ? 'start' : 'end')
      const verticalAnchor =
        props.verticalAnchor || (Math.abs(dx) > Math.abs(dy) ? 'middle' : dy > 0 ? 'start' : 'end')

      let adjustedX: number = props.x == null ? ctxX + dx : props.x
      let adjustedY: number = props.y == null ? ctxY + dy : props.y

      if (horizontalAnchor === 'middle') adjustedX -= width / 2
      if (horizontalAnchor === 'end') adjustedX -= width
      if (verticalAnchor === 'middle') adjustedY -= height / 2
      if (verticalAnchor === 'end') adjustedY -= height

      return (
        <Group
          top={adjustedY}
          left={adjustedX}
          className={['visx-annotationlabel', props.className].filter(Boolean).join(' ')}
          {...({ 'pointer-events': 'none' } as any)}
        >
          <foreignObject
            width={width}
            height={height}
            overflow="visible"
          >
            <div
              ref={labelRef}
              style={
                props.containerStyle ? { ...wrapperStyle, ...props.containerStyle } : wrapperStyle
              }
            >
              {slots.default?.()}
            </div>
          </foreignObject>
          {props.showAnchorLine && (
            <AnchorLine
              anchorLineOrientation={Math.abs(dx) > Math.abs(dy) ? 'vertical' : 'horizontal'}
              anchorLineStroke={props.anchorLineStroke!}
              verticalAnchor={verticalAnchor as 'start' | 'middle' | 'end'}
              horizontalAnchor={horizontalAnchor}
              width={width}
              height={height}
            />
          )}
        </Group>
      )
    }
  }
})

export default HtmlLabel
