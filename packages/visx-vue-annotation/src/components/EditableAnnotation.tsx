import { defineComponent, useSlots, type PropType, type SVGAttributes } from 'vue'
import { useDrag } from '@visx-vue/drag'
import type {
  UseDrag,
  HandlerArgs as DragHandlerArgs,
  MouseTouchOrPointerEvent
} from '@visx-vue/drag'
import type { AnnotationContextType } from '../types'
import Annotation from './Annotation'

export type EditableAnnotationProps = Pick<AnnotationContextType, 'x' | 'y' | 'dx' | 'dy'> & {
  /** Width of the possible drag canvas (e.g., SVG container). */
  width: number
  /** Height of the possible drag canvas (e.g., SVG container). */
  height: number
  /** Whether the Label position (dx, dy) is editable. */
  canEditLabel?: boolean
  /** Whether the Subject position (x, y) is editable. */
  canEditSubject?: boolean
  /** Optional circle props to set on the subject drag handle. */
  subjectDragHandleProps?: SVGAttributes
  /** Optional circle props to set on the label drag handle. */
  labelDragHandleProps?: SVGAttributes
  /** Callback invoked on drag start. */
  onDragStart?: (args: EditableAnnotationHandlerArgs) => void
  /** Callback invoked on drag move. */
  onDragMove?: (args: EditableAnnotationHandlerArgs) => void
  /** Callback invoked on drag end. */
  onDragEnd?: (args: EditableAnnotationHandlerArgs) => void
}

export type EditableAnnotationHandlerArgs = {
  x: number
  y: number
  dx: number
  dy: number
  event: MouseTouchOrPointerEvent
}

const defaultDragHandleProps = {
  r: 10,
  fill: 'transparent',
  stroke: '#777',
  'stroke-dasharray': '4,2',
  'stroke-width': 2
}

export const EditableAnnotation = defineComponent({
  name: 'EditableAnnotation',
  props: {
    canEditLabel: { type: Boolean as PropType<boolean>, default: true },
    canEditSubject: { type: Boolean as PropType<boolean>, default: true },
    dx: { type: Number as PropType<number>, default: 0 },
    dy: { type: Number as PropType<number>, default: 0 },
    height: { type: Number as PropType<number>, required: true },
    labelDragHandleProps: { type: Object as PropType<SVGAttributes>, default: undefined },
    onDragEnd: {
      type: Function as PropType<(args: EditableAnnotationHandlerArgs) => void>,
      default: undefined
    },
    onDragMove: {
      type: Function as PropType<(args: EditableAnnotationHandlerArgs) => void>,
      default: undefined
    },
    onDragStart: {
      type: Function as PropType<(args: EditableAnnotationHandlerArgs) => void>,
      default: undefined
    },
    subjectDragHandleProps: { type: Object as PropType<SVGAttributes>, default: undefined },
    width: { type: Number as PropType<number>, required: true },
    x: { type: Number as PropType<number>, default: 0 },
    y: { type: Number as PropType<number>, default: 0 }
  },
  setup(props) {
    const slots = useSlots()

    // Use let bindings to allow cross-referencing between drags
    // (functions close over these and they are assigned before any event fires)
    let subjectDrag: UseDrag
    let labelDrag: UseDrag

    function handleDragStart({ event }: DragHandlerArgs) {
      if (props.onDragStart) {
        props.onDragStart({
          event,
          x: (props.x ?? 0) + (subjectDrag?.dx ?? 0),
          y: (props.y ?? 0) + (subjectDrag?.dy ?? 0),
          dx: (props.dx ?? 0) + (labelDrag?.dx ?? 0),
          dy: (props.dy ?? 0) + (labelDrag?.dy ?? 0)
        })
      }
    }

    function handleDragMove({ event }: DragHandlerArgs) {
      if (props.onDragMove) {
        props.onDragMove({
          event,
          x: (props.x ?? 0) + (subjectDrag?.dx ?? 0),
          y: (props.y ?? 0) + (subjectDrag?.dy ?? 0),
          dx: (props.dx ?? 0) + (labelDrag?.dx ?? 0),
          dy: (props.dy ?? 0) + (labelDrag?.dy ?? 0)
        })
      }
    }

    function handleDragEnd({ event }: DragHandlerArgs) {
      if (props.onDragEnd) {
        props.onDragEnd({
          event,
          x: (props.x ?? 0) + (subjectDrag?.dx ?? 0),
          y: (props.y ?? 0) + (subjectDrag?.dy ?? 0),
          dx: (props.dx ?? 0) + (labelDrag?.dx ?? 0),
          dy: (props.dy ?? 0) + (labelDrag?.dy ?? 0)
        })
      }
    }

    subjectDrag = useDrag({
      onDragStart: handleDragStart,
      onDragMove: handleDragMove,
      onDragEnd: handleDragEnd,
      get x() {
        return props.x ?? 0
      },
      get y() {
        return props.y ?? 0
      }
    })

    labelDrag = useDrag({
      onDragStart: handleDragStart,
      onDragMove: handleDragMove,
      onDragEnd: handleDragEnd,
      get x() {
        return props.dx ?? 0
      },
      get y() {
        return props.dy ?? 0
      }
    })

    return () => (
      <>
        <Annotation
          x={(props.x ?? 0) + subjectDrag.dx}
          y={(props.y ?? 0) + subjectDrag.dy}
          dx={(props.dx ?? 0) + labelDrag.dx}
          dy={(props.dy ?? 0) + labelDrag.dy}
        >
          {slots.default?.()}
        </Annotation>
        {subjectDrag.isDragging && (
          <rect
            width={props.width}
            height={props.height}
            onMousemove={subjectDrag.dragMove}
            onMouseup={subjectDrag.dragEnd}
            fill="transparent"
          />
        )}
        {props.canEditSubject && (
          <circle
            cx={props.x ?? 0}
            cy={props.y ?? 0}
            transform={`translate(${subjectDrag.dx},${subjectDrag.dy})`}
            onMousemove={subjectDrag.dragMove}
            onMouseup={subjectDrag.dragEnd}
            onMousedown={subjectDrag.dragStart}
            onTouchstart={subjectDrag.dragStart}
            onTouchmove={subjectDrag.dragMove}
            onTouchend={subjectDrag.dragEnd}
            cursor={subjectDrag.isDragging ? 'grabbing' : 'grab'}
            {...defaultDragHandleProps}
            {...(props.subjectDragHandleProps || {})}
          />
        )}
        {labelDrag.isDragging && (
          <rect
            width={props.width}
            height={props.height}
            onMousemove={labelDrag.dragMove}
            onMouseup={labelDrag.dragEnd}
            fill="transparent"
          />
        )}
        {props.canEditLabel && (
          <circle
            cx={(props.x ?? 0) + subjectDrag.dx + (props.dx ?? 0)}
            cy={(props.y ?? 0) + subjectDrag.dy + (props.dy ?? 0)}
            transform={`translate(${labelDrag.dx},${labelDrag.dy})`}
            onMousemove={labelDrag.dragMove}
            onMouseup={labelDrag.dragEnd}
            onMousedown={labelDrag.dragStart}
            onTouchstart={labelDrag.dragStart}
            onTouchmove={labelDrag.dragMove}
            onTouchend={labelDrag.dragEnd}
            cursor={labelDrag.isDragging ? 'grabbing' : 'grab'}
            {...defaultDragHandleProps}
            {...(props.labelDragHandleProps || {})}
          />
        )}
      </>
    )
  }
})

export default EditableAnnotation
