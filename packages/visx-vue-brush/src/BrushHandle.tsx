import { defineComponent, type PropType, type VNode } from 'vue'
import { Drag, type HandlerArgs as DragArgs } from '@visx-vue/drag'
import type { BaseBrushState, UpdateBrush } from './BaseBrush'
import type { BrushPageOffset, BrushingType, ResizeTriggerAreas } from './types'
import { getPageCoordinates } from './utils'

type HandleProps = {
  x: number
  y: number
  width: number
  height: number
}

export type BrushHandleProps = {
  stageWidth: number
  stageHeight: number
  brush: BaseBrushState
  updateBrush: (update: UpdateBrush) => void
  onBrushStart?: (brush: DragArgs) => void
  onBrushEnd?: (brush: BaseBrushState) => void
  type: ResizeTriggerAreas
  handle: HandleProps
  isControlled?: boolean
  isDragInProgress?: boolean
  onBrushHandleChange?: (type?: BrushingType, options?: BrushPageOffset) => void
  renderBrushHandle?: (props: BrushHandleRenderProps) => VNode
}

export type BrushHandleRenderProps = HandleProps & {
  /** if brush extent is not active this prop is set to false */
  isBrushActive: boolean
  className: string
}

export const BrushHandle = defineComponent({
  name: 'BrushHandle',
  props: {
    stageWidth: { type: Number as PropType<number>, required: true },
    stageHeight: { type: Number as PropType<number>, required: true },
    brush: { type: Object as PropType<BaseBrushState>, required: true },
    updateBrush: { type: Function as PropType<(update: UpdateBrush) => void>, required: true },
    onBrushStart: { type: Function as PropType<(brush: DragArgs) => void>, default: undefined },
    onBrushEnd: { type: Function as PropType<(brush: BaseBrushState) => void>, default: undefined },
    type: { type: String as PropType<ResizeTriggerAreas>, required: true },
    handle: {
      type: Object as PropType<HandleProps>,
      required: true
    },
    isControlled: { type: Boolean as PropType<boolean>, default: undefined },
    isDragInProgress: { type: Boolean as PropType<boolean>, default: undefined },
    onBrushHandleChange: {
      type: Function as PropType<(type?: BrushingType, options?: BrushPageOffset) => void>,
      default: undefined
    },
    renderBrushHandle: {
      type: Function as PropType<(props: BrushHandleRenderProps) => VNode>,
      default: undefined
    }
  },
  setup(props) {
    function handleDragStart(drag: DragArgs) {
      if (props.onBrushHandleChange) {
        props.onBrushHandleChange(props.type, getPageCoordinates(drag.event))
      }
      if (props.onBrushStart) {
        props.onBrushStart(drag)
      }
    }

    function handleDragMove(drag: DragArgs) {
      if (!drag.isDragging || props.isControlled) return

      props.updateBrush((prevBrush: BaseBrushState) => {
        const { start, end } = prevBrush
        let move = 0
        const xMax = Math.max(start.x, end.x)
        const xMin = Math.min(start.x, end.x)
        const yMax = Math.max(start.y, end.y)
        const yMin = Math.min(start.y, end.y)
        switch (props.type) {
          case 'right':
            move = xMax + drag.dx
            return {
              ...prevBrush,
              activeHandle: props.type,
              extent: {
                ...prevBrush.extent,
                x0: Math.max(Math.min(move, start.x), prevBrush.bounds.x0),
                x1: Math.min(Math.max(move, start.x), prevBrush.bounds.x1)
              }
            }
          case 'left':
            move = xMin + drag.dx
            return {
              ...prevBrush,
              activeHandle: props.type,
              extent: {
                ...prevBrush.extent,
                x0: Math.min(move, end.x),
                x1: Math.max(move, end.x)
              }
            }
          case 'bottom':
            move = yMax + drag.dy
            return {
              ...prevBrush,
              activeHandle: props.type,
              extent: {
                ...prevBrush.extent,
                y0: Math.min(move, start.y),
                y1: Math.max(move, start.y)
              }
            }
          case 'top':
            move = yMin + drag.dy
            return {
              ...prevBrush,
              activeHandle: props.type,
              extent: {
                ...prevBrush.extent,
                y0: Math.min(move, end.y),
                y1: Math.max(move, end.y)
              }
            }
          // BrushHandle skips corners use BrushCorner for those
          case 'topLeft':
          case 'topRight':
          case 'bottomLeft':
          case 'bottomRight':
          default:
            return prevBrush
        }
      })
    }

    function handleDragEnd() {
      if (!props.isControlled) {
        props.updateBrush((prevBrush: BaseBrushState) => {
          const { extent } = prevBrush
          const newStart = {
            x: Math.min(extent.x0, extent.x1),
            y: Math.min(extent.y0, extent.y0)
          }
          const newEnd = {
            x: Math.max(extent.x0, extent.x1),
            y: Math.max(extent.y0, extent.y1)
          }
          const nextBrush: BaseBrushState = {
            ...prevBrush,
            start: newStart,
            end: newEnd,
            activeHandle: null,
            isBrushing: false,
            extent: {
              x0: Math.min(newStart.x, newEnd.x),
              x1: Math.max(newStart.x, newEnd.x),
              y0: Math.min(newStart.y, newEnd.y),
              y1: Math.max(newStart.y, newEnd.y)
            }
          }
          if (props.onBrushEnd) {
            props.onBrushEnd(nextBrush)
          }

          return nextBrush
        })
      }

      if (props.onBrushHandleChange) {
        props.onBrushHandleChange()
      }
    }

    return () => {
      const { x, y, width, height } = props.handle
      const cursor = props.type === 'right' || props.type === 'left' ? 'ew-resize' : 'ns-resize'

      return (
        <Drag
          width={props.stageWidth}
          height={props.stageHeight}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
          resetOnStart
          isDragging={props.isControlled ? props.isDragInProgress : undefined}
        >
          {{
            default: ({
              dragStart,
              dragEnd,
              dragMove,
              isDragging
            }: {
              dragStart: (e: any) => void
              dragEnd: (e: any) => void
              dragMove: (e: any) => void
              isDragging: boolean
            }) => (
              <g>
                {/** capture mouse events while dragging */}
                {isDragging && (
                  <rect
                    fill="transparent"
                    width={props.stageWidth}
                    height={props.stageHeight}
                    style={{ cursor }}
                    onPointermove={dragMove}
                    onPointerup={props.isControlled ? undefined : dragEnd}
                    onPointerleave={props.isControlled ? undefined : dragEnd}
                  />
                )}
                {!props.renderBrushHandle && (
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill="transparent"
                    class={`visx-brush-handle-${props.type}`}
                    onPointerdown={dragStart}
                    onPointermove={dragMove}
                    onPointerup={props.isControlled ? undefined : dragEnd}
                    style={{
                      cursor,
                      pointerEvents:
                        !!props.brush.activeHandle || !!props.brush.isBrushing ? 'none' : 'all'
                    }}
                  />
                )}
                {props.renderBrushHandle && (
                  <g
                    onPointerdown={dragStart}
                    onPointermove={dragMove}
                    onPointerup={props.isControlled ? undefined : dragEnd}
                  >
                    {props.renderBrushHandle({
                      ...props.handle,
                      height: props.stageHeight,
                      className: `visx-brush-handle-${props.type}`,
                      isBrushActive: props.brush.extent.x0 !== -1 && props.brush.extent.x1 !== -1
                    })}
                  </g>
                )}
              </g>
            )
          }}
        </Drag>
      )
    }
  }
})

export default BrushHandle
