import { reactive, ref, toRef, watch } from "vue";
import { Point, subtractPoints, sumPoints } from "@visx-vue/point";
import { localPoint } from "@visx-vue/event";
import restrictPoint from "./util/restrictPoint";
import useSamplesAlongPath from "./util/useSamplesAlongPath";
import type { DragState, MouseTouchOrPointerEvent, UseDrag, UseDragOptions } from "./types";

/** Composable for dragging, returns a reactive `UseDrag` object. */
export default function useDrag(options: UseDragOptions = {}): UseDrag {
  const dragState = reactive<DragState>({
    x: options.x,
    y: options.y,
    dx: options.dx ?? 0,
    dy: options.dy ?? 0,
    isDragging: false,
  });

  // Track distance between pointer on dragStart and position of element being dragged
  const dragStartPointerOffset = ref<Point>(new Point({ x: 0, y: 0 }));

  const restrictToPathRef = toRef(() => options.restrictToPath);
  const restrictToPathSamples = useSamplesAlongPath(restrictToPathRef);

  // Sync prop position changes into state
  watch(
    () => ({ x: options.x, y: options.y, dx: options.dx, dy: options.dy }),
    (newVal, oldVal) => {
      if (
        newVal.x !== oldVal?.x ||
        newVal.y !== oldVal?.y ||
        newVal.dx !== oldVal?.dx ||
        newVal.dy !== oldVal?.dy
      ) {
        dragState.x = newVal.x;
        dragState.y = newVal.y;
        dragState.dx = newVal.dx ?? 0;
        dragState.dy = newVal.dy ?? 0;
      }
    },
  );

  // Sync isDragging prop
  watch(
    () => options.isDragging,
    (newVal) => {
      if (newVal !== undefined && dragState.isDragging !== newVal) {
        dragState.isDragging = newVal;
      }
    },
  );

  function handleDragStart(event: MouseTouchOrPointerEvent) {
    const resetOnStart = options.resetOnStart ?? false;
    const snapToPointer = options.snapToPointer ?? true;
    const restrict = options.restrict ?? {};

    const { x: stateX = 0, y: stateY = 0, dx: stateDx, dy: stateDy } = dragState;
    const currentPoint = new Point({
      x: (stateX || 0) + stateDx,
      y: (stateY || 0) + stateDy,
    });
    const eventPoint = localPoint(event) || new Point({ x: 0, y: 0 });
    const point = snapToPointer ? eventPoint : currentPoint;
    const dragPoint = restrictPoint(point, restrictToPathSamples.value, restrict);

    dragStartPointerOffset.value = subtractPoints(currentPoint, eventPoint);

    dragState.isDragging = true;
    dragState.dx = resetOnStart ? 0 : stateDx;
    dragState.dy = resetOnStart ? 0 : stateDy;
    dragState.x = resetOnStart ? dragPoint.x : dragPoint.x - stateDx;
    dragState.y = resetOnStart ? dragPoint.y : dragPoint.y - stateDy;

    options.onDragStart?.({ ...dragState, event });
  }

  function handleDragMove(event: MouseTouchOrPointerEvent) {
    if (!dragState.isDragging) return;
    const snapToPointer = options.snapToPointer ?? true;
    const restrict = options.restrict ?? {};

    const { x: stateX = 0, y: stateY = 0 } = dragState;
    const pointerPoint = localPoint(event) || new Point({ x: 0, y: 0 });
    const point = snapToPointer
      ? pointerPoint
      : sumPoints(pointerPoint, dragStartPointerOffset.value);
    const dragPoint = restrictPoint(point, restrictToPathSamples.value, restrict);

    dragState.dx = dragPoint.x - stateX;
    dragState.dy = dragPoint.y - stateY;

    options.onDragMove?.({ ...dragState, event });
  }

  function handleDragEnd(event: MouseTouchOrPointerEvent) {
    dragState.isDragging = false;

    options.onDragEnd?.({ ...dragState, event });
  }

  // Return a reactive object that spreads DragState + handler functions.
  // Using a getter-based object so consumers always see the latest reactive state.
  return {
    get x() {
      return dragState.x;
    },
    get y() {
      return dragState.y;
    },
    get dx() {
      return dragState.dx;
    },
    get dy() {
      return dragState.dy;
    },
    get isDragging() {
      return dragState.isDragging;
    },
    dragEnd: handleDragEnd,
    dragMove: handleDragMove,
    dragStart: handleDragStart,
  };
}
