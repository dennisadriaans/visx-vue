import { defineComponent, type CSSProperties, type PropType } from "vue";
import { Drag, type HandlerArgs as DragArgs } from "@visx-vue/drag";
import type { BaseBrushState, UpdateBrush } from "./BaseBrush";
import type { ResizeTriggerAreas } from "./types";

export type BrushCornerProps = {
  stageWidth: number;
  stageHeight: number;
  brush: BaseBrushState;
  updateBrush: (update: UpdateBrush) => void;
  onBrushEnd?: (brush: BaseBrushState) => void;
  type: ResizeTriggerAreas;
  style?: CSSProperties;
  corner: { x: number; y: number; width: number; height: number };
};

export const BrushCorner = defineComponent({
  name: "BrushCorner",
  props: {
    stageWidth: { type: Number as PropType<number>, required: true },
    stageHeight: { type: Number as PropType<number>, required: true },
    brush: { type: Object as PropType<BaseBrushState>, required: true },
    updateBrush: { type: Function as PropType<(update: UpdateBrush) => void>, required: true },
    onBrushEnd: { type: Function as PropType<(brush: BaseBrushState) => void>, default: undefined },
    type: { type: String as PropType<ResizeTriggerAreas>, required: true },
    style: { type: Object as PropType<CSSProperties>, default: undefined },
    corner: {
      type: Object as PropType<{ x: number; y: number; width: number; height: number }>,
      required: true,
    },
  },
  setup(props) {
    function cornerDragMove(drag: DragArgs) {
      if (!drag.isDragging) return;

      props.updateBrush((prevBrush: Readonly<BaseBrushState>) => {
        const { start, end } = prevBrush;

        const xMax = Math.max(start.x, end.x);
        const xMin = Math.min(start.x, end.x);
        const yMax = Math.max(start.y, end.y);
        const yMin = Math.min(start.y, end.y);

        let moveX = 0;
        let moveY = 0;

        switch (props.type) {
          case "topRight":
            moveX = xMax + drag.dx;
            moveY = yMin + drag.dy;
            return {
              ...prevBrush,
              activeHandle: props.type,
              extent: {
                ...prevBrush.extent,
                x0: Math.max(Math.min(moveX, start.x), prevBrush.bounds.x0),
                x1: Math.min(Math.max(moveX, start.x), prevBrush.bounds.x1),
                y0: Math.max(Math.min(moveY, end.y), prevBrush.bounds.y0),
                y1: Math.min(Math.max(moveY, end.y), prevBrush.bounds.y1),
              },
            };

          case "topLeft":
            moveX = xMin + drag.dx;
            moveY = yMin + drag.dy;
            return {
              ...prevBrush,
              activeHandle: props.type,
              extent: {
                ...prevBrush.extent,
                x0: Math.max(Math.min(moveX, end.x), prevBrush.bounds.x0),
                x1: Math.min(Math.max(moveX, end.x), prevBrush.bounds.x1),
                y0: Math.max(Math.min(moveY, end.y), prevBrush.bounds.y0),
                y1: Math.min(Math.max(moveY, end.y), prevBrush.bounds.y1),
              },
            };

          case "bottomLeft":
            moveX = xMin + drag.dx;
            moveY = yMax + drag.dy;
            return {
              ...prevBrush,
              activeHandle: props.type,
              extent: {
                ...prevBrush.extent,
                x0: Math.max(Math.min(moveX, end.x), prevBrush.bounds.x0),
                x1: Math.min(Math.max(moveX, end.x), prevBrush.bounds.x1),
                y0: Math.max(Math.min(moveY, start.y), prevBrush.bounds.y0),
                y1: Math.min(Math.max(moveY, start.y), prevBrush.bounds.y1),
              },
            };

          case "bottomRight":
            moveX = xMax + drag.dx;
            moveY = yMax + drag.dy;
            return {
              ...prevBrush,
              activeHandle: props.type,
              extent: {
                ...prevBrush.extent,
                x0: Math.max(Math.min(moveX, start.x), prevBrush.bounds.x0),
                x1: Math.min(Math.max(moveX, start.x), prevBrush.bounds.x1),
                y0: Math.max(Math.min(moveY, start.y), prevBrush.bounds.y0),
                y1: Math.min(Math.max(moveY, start.y), prevBrush.bounds.y1),
              },
            };

          // BrushCorner skips edges use BrushHandle for those
          case "top":
          case "right":
          case "bottom":
          case "left":
          default:
            return prevBrush;
        }
      });
    }

    function cornerDragEnd() {
      props.updateBrush((prevBrush: Readonly<BaseBrushState>) => {
        const { extent } = prevBrush;
        const newStart = {
          x: Math.min(extent.x0, extent.x1),
          y: Math.min(extent.y0, extent.y0),
        };
        const newEnd = {
          x: Math.max(extent.x0, extent.x1),
          y: Math.max(extent.y0, extent.y1),
        };
        const nextBrush: BaseBrushState = {
          ...prevBrush,
          start: newStart,
          end: newEnd,
          activeHandle: null,
          domain: {
            x0: Math.min(newStart.x, newEnd.x),
            x1: Math.max(newStart.x, newEnd.x),
            y0: Math.min(newStart.y, newEnd.y),
            y1: Math.max(newStart.y, newEnd.y),
          },
        } as BaseBrushState;
        if (props.onBrushEnd) {
          props.onBrushEnd(nextBrush);
        }

        return nextBrush;
      });
    }

    return () => {
      const cursor =
        props.style?.cursor ||
        (props.type === "topLeft" || props.type === "bottomRight" ? "nwse-resize" : "nesw-resize");
      const pointerEvents = props.brush.activeHandle || props.brush.isBrushing ? "none" : "all";

      return (
        <Drag
          width={props.stageWidth}
          height={props.stageHeight}
          onDragMove={cornerDragMove}
          onDragEnd={cornerDragEnd}
          resetOnStart
        >
          {{
            default: ({
              dragMove,
              dragEnd,
              dragStart,
              isDragging,
            }: {
              dragMove: (e: any) => void;
              dragEnd: (e: any) => void;
              dragStart: (e: any) => void;
              isDragging: boolean;
            }) => (
              <g>
                {isDragging && (
                  <rect
                    fill="transparent"
                    width={props.stageWidth}
                    height={props.stageHeight}
                    style={{ cursor }}
                    onPointermove={dragMove}
                    onPointerup={dragEnd}
                  />
                )}
                <rect
                  fill="transparent"
                  onPointerdown={dragStart}
                  onPointermove={dragMove}
                  onPointerup={dragEnd}
                  class={`visx-brush-corner-${props.type}`}
                  style={{ cursor, pointerEvents: pointerEvents as any, ...props.style }}
                  x={props.corner.x}
                  y={props.corner.y}
                  width={props.corner.width}
                  height={props.corner.height}
                />
              </g>
            ),
          }}
        </Drag>
      );
    };
  },
});

export default BrushCorner;
