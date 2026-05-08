import { defineComponent, type PropType, type SVGAttributes } from "vue";
import { Drag, type HandlerArgs as DragArgs } from "@visx-vue/drag";
import type { BaseBrushState, UpdateBrush } from "./BaseBrush";
import type { BrushPageOffset, BrushingType } from "./types";
import { getPageCoordinates } from "./utils";

const DRAGGING_OVERLAY_STYLES = { cursor: "move" };

type PointerHandler = (event: PointerEvent) => void;

export type BrushSelectionProps = {
  width: number;
  height: number;
  stageWidth: number;
  stageHeight: number;
  brush: BaseBrushState;
  updateBrush: (update: UpdateBrush) => void;
  onMoveSelectionChange?: (type?: BrushingType, options?: BrushPageOffset) => void;
  onBrushStart?: (brush: DragArgs) => void;
  onBrushEnd?: (brush: BaseBrushState) => void;
  disableDraggingSelection: boolean;
  onMouseLeave: PointerHandler;
  onMouseMove: PointerHandler;
  onMouseUp: PointerHandler;
  onClick: PointerHandler;
  selectedBoxStyle: SVGAttributes;
  isControlled?: boolean;
  isDragInProgress?: boolean;
};

export const BrushSelection = defineComponent({
  name: "BrushSelection",
  props: {
    width: { type: Number as PropType<number>, required: true },
    height: { type: Number as PropType<number>, required: true },
    stageWidth: { type: Number as PropType<number>, required: true },
    stageHeight: { type: Number as PropType<number>, required: true },
    brush: { type: Object as PropType<BaseBrushState>, required: true },
    updateBrush: { type: Function as PropType<(update: UpdateBrush) => void>, required: true },
    onMoveSelectionChange: {
      type: Function as PropType<(type?: BrushingType, options?: BrushPageOffset) => void>,
      default: undefined,
    },
    onBrushStart: { type: Function as PropType<(brush: DragArgs) => void>, default: undefined },
    onBrushEnd: {
      type: Function as PropType<(brush: BaseBrushState) => void>,
      default: undefined,
    },
    disableDraggingSelection: { type: Boolean as PropType<boolean>, required: true },
    onMouseLeave: { type: Function as PropType<PointerHandler>, default: undefined },
    onMouseMove: { type: Function as PropType<PointerHandler>, default: undefined },
    onMouseUp: { type: Function as PropType<PointerHandler>, default: undefined },
    onClick: { type: Function as PropType<PointerHandler>, default: undefined },
    selectedBoxStyle: { type: Object as PropType<SVGAttributes>, default: () => ({}) },
    isControlled: { type: Boolean as PropType<boolean>, default: undefined },
    isDragInProgress: { type: Boolean as PropType<boolean>, default: undefined },
  },
  setup(props) {
    function selectionDragStart(drag: DragArgs) {
      if (props.onMoveSelectionChange) {
        props.onMoveSelectionChange("move", getPageCoordinates(drag.event));
      }
      if (props.onBrushStart) {
        props.onBrushStart(drag);
      }
    }

    function selectionDragMove(drag: DragArgs) {
      if (props.isControlled) return;

      props.updateBrush((prevBrush: BaseBrushState) => {
        const { x: x0, y: y0 } = prevBrush.start;
        const { x: x1, y: y1 } = prevBrush.end;
        const validDx =
          drag.dx > 0
            ? Math.min(drag.dx, prevBrush.bounds.x1 - x1)
            : Math.max(drag.dx, prevBrush.bounds.x0 - x0);

        const validDy =
          drag.dy > 0
            ? Math.min(drag.dy, prevBrush.bounds.y1 - y1)
            : Math.max(drag.dy, prevBrush.bounds.y0 - y0);

        return {
          ...prevBrush,
          isBrushing: true,
          extent: {
            ...prevBrush.extent,
            x0: x0 + validDx,
            x1: x1 + validDx,
            y0: y0 + validDy,
            y1: y1 + validDy,
          },
        };
      });
    }

    function selectionDragEnd() {
      if (!props.isControlled) {
        props.updateBrush((prevBrush: BaseBrushState) => {
          const nextBrush = {
            ...prevBrush,
            isBrushing: false,
            start: {
              ...prevBrush.start,
              x: Math.min(prevBrush.extent.x0, prevBrush.extent.x1),
              y: Math.min(prevBrush.extent.y0, prevBrush.extent.y1),
            },
            end: {
              ...prevBrush.end,
              x: Math.max(prevBrush.extent.x0, prevBrush.extent.x1),
              y: Math.max(prevBrush.extent.y0, prevBrush.extent.y1),
            },
          };
          if (props.onBrushEnd) {
            props.onBrushEnd(nextBrush);
          }
          return nextBrush;
        });
      }

      if (props.onMoveSelectionChange) {
        props.onMoveSelectionChange();
      }
    }

    return () => (
      <Drag
        width={props.width}
        height={props.height}
        resetOnStart
        onDragStart={selectionDragStart}
        onDragMove={selectionDragMove}
        onDragEnd={selectionDragEnd}
        isDragging={props.isControlled ? props.isDragInProgress : undefined}
      >
        {{
          default: ({
            isDragging,
            dragStart,
            dragEnd,
            dragMove,
          }: {
            isDragging: boolean;
            dragStart: (e: any) => void;
            dragEnd: (e: any) => void;
            dragMove: (e: any) => void;
          }) => (
            <g>
              {isDragging && (
                <rect
                  width={props.stageWidth}
                  height={props.stageHeight}
                  fill="transparent"
                  onPointerup={props.isControlled ? undefined : dragEnd}
                  onPointermove={dragMove}
                  onPointerleave={props.isControlled ? undefined : dragEnd}
                  style={DRAGGING_OVERLAY_STYLES}
                />
              )}
              <rect
                x={Math.min(props.brush.extent.x0, props.brush.extent.x1)}
                y={Math.min(props.brush.extent.y0, props.brush.extent.y1)}
                width={props.width}
                height={props.height}
                class="visx-brush-selection"
                onPointerdown={props.disableDraggingSelection ? undefined : dragStart}
                onPointerleave={(event: PointerEvent) => {
                  if (props.onMouseLeave) props.onMouseLeave(event);
                }}
                onPointermove={(event: PointerEvent) => {
                  dragMove(event);
                  if (props.onMouseMove) props.onMouseMove(event);
                }}
                onPointerup={(event: PointerEvent) => {
                  if (!props.isControlled) {
                    dragEnd(event);
                  }
                  if (props.onMouseUp) props.onMouseUp(event);
                }}
                onClick={(event: MouseEvent) => {
                  if (props.onClick) props.onClick(event as unknown as PointerEvent);
                }}
                style={{
                  pointerEvents:
                    props.brush.isBrushing || props.brush.activeHandle ? "none" : "all",
                  cursor: props.disableDraggingSelection ? undefined : "move",
                }}
                {...props.selectedBoxStyle}
              />
            </g>
          ),
        }}
      </Drag>
    );
  },
});

export default BrushSelection;
