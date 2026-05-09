import { defineComponent, type PropType } from "vue";
import useDrag from "./useDrag";
import type { HandlerArgs, UseDragOptions } from "./types";

export type DragProps = UseDragOptions & {
  /** Width of the drag container. */
  width: number;
  /** Height of the drag container. */
  height: number;
  /** Whether to render an invisible rect below children to capture the drag area as defined by width and height. */
  captureDragArea?: boolean;
  /** If defined, parent controls dragging state. */
  isDragging?: boolean;
};

export const Drag = defineComponent({
  name: "Drag",
  props: {
    width: { type: Number as PropType<number>, required: true },
    height: { type: Number as PropType<number>, required: true },
    captureDragArea: { type: Boolean as PropType<boolean>, default: true },
    resetOnStart: { type: Boolean as PropType<boolean>, default: undefined },
    snapToPointer: { type: Boolean as PropType<boolean>, default: true },
    onDragEnd: { type: Function as PropType<(args: HandlerArgs) => void>, default: undefined },
    onDragMove: { type: Function as PropType<(args: HandlerArgs) => void>, default: undefined },
    onDragStart: { type: Function as PropType<(args: HandlerArgs) => void>, default: undefined },
    x: { type: Number as PropType<number>, default: undefined },
    y: { type: Number as PropType<number>, default: undefined },
    dx: { type: Number as PropType<number>, default: undefined },
    dy: { type: Number as PropType<number>, default: undefined },
    isDragging: { type: Boolean as PropType<boolean>, default: undefined },
    restrict: {
      type: Object as PropType<UseDragOptions["restrict"]>,
      default: undefined,
    },
    restrictToPath: {
      type: Object as PropType<SVGGeometryElement | null>,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const drag = useDrag({
      get resetOnStart() {
        return props.resetOnStart;
      },
      get snapToPointer() {
        return props.snapToPointer;
      },
      get onDragEnd() {
        return props.onDragEnd;
      },
      get onDragMove() {
        return props.onDragMove;
      },
      get onDragStart() {
        return props.onDragStart;
      },
      get x() {
        return props.x;
      },
      get y() {
        return props.y;
      },
      get dx() {
        return props.dx;
      },
      get dy() {
        return props.dy;
      },
      get isDragging() {
        return props.isDragging;
      },
      get restrict() {
        return props.restrict;
      },
      get restrictToPath() {
        return props.restrictToPath;
      },
    });

    return () => (
      <>
        {drag.isDragging && props.captureDragArea && (
          <rect
            width={props.width}
            height={props.height}
            onPointerdown={drag.dragStart}
            onPointermove={drag.dragMove}
            onPointerup={drag.dragEnd}
            fill="transparent"
          />
        )}
        {slots.default?.(drag)}
      </>
    );
  },
});

export default Drag;
