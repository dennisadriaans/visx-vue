import { ref, watch, type Ref } from "vue";
import { Gesture } from "@use-gesture/vanilla";
import { localPoint } from "@visx-vue/event";
import {
  composeMatrices,
  inverseMatrix,
  applyMatrixToPoint,
  applyInverseMatrixToPoint,
  translateMatrix,
  identityMatrix,
  scaleMatrix,
} from "./util/matrix";
import type {
  TransformMatrix,
  Point,
  Translate,
  Scale,
  ScaleSignature,
  PinchDelta,
  PinchGestureState,
  GenericWheelEvent,
  InteractionEvent,
  Zoom,
} from "./types";

const defaultInitialTransformMatrix: TransformMatrix = {
  scaleX: 1,
  scaleY: 1,
  translateX: 0,
  translateY: 0,
  skewX: 0,
  skewY: 0,
};

const defaultWheelDelta = (event: GenericWheelEvent): Scale =>
  -event.deltaY > 0 ? { scaleX: 1.1, scaleY: 1.1 } : { scaleX: 0.9, scaleY: 0.9 };

const defaultPinchDelta: PinchDelta = ({ offset: [s], lastOffset: [lastS] }) => ({
  scaleX: s - lastS < 0 ? 0.9 : 1.1,
  scaleY: s - lastS < 0 ? 0.9 : 1.1,
});

export interface UseZoomOptions {
  /** Width of the zoom container. */
  width: number;
  /** Height of the zoom container. */
  height: number;
  /** Minimum x scale value for transform. */
  scaleXMin?: number;
  /** Maximum x scale value for transform. */
  scaleXMax?: number;
  /** Minimum y scale value for transform. */
  scaleYMin?: number;
  /** Maximum y scale value for transform. */
  scaleYMax?: number;
  /** Initial transform matrix to apply. */
  initialTransformMatrix?: TransformMatrix;
  /**
   * A function that returns { scaleX, scaleY } factors to scale the matrix by on wheel events.
   * Scale factors greater than 1 will increase (zoom in), less than 1 will decrease (zoom out).
   */
  wheelDelta?: (event: GenericWheelEvent) => Scale;
  /**
   * A function that returns { scaleX, scaleY } factors to scale the matrix by on pinch events.
   * Scale factors greater than 1 will increase (zoom in), less than 1 will decrease (zoom out).
   */
  pinchDelta?: PinchDelta;
  /**
   * By default constrain() will only constrain scale values. To change
   * constraints you can pass in your own constrain function.
   */
  constrain?: (transform: TransformMatrix, prevTransform: TransformMatrix) => TransformMatrix;
}

export default function useZoom<ElementType extends Element = Element>(
  options: UseZoomOptions,
): Zoom<ElementType> {
  const initMatrix = options.initialTransformMatrix ?? defaultInitialTransformMatrix;

  const containerRef = ref<ElementType | null>(null) as Ref<ElementType | null>;
  const transformMatrix = ref<TransformMatrix>({ ...initMatrix });
  const isDragging = ref(false);
  const startTranslate = ref<Translate | undefined>(undefined);
  const startPoint = ref<Point | undefined>(undefined);

  function applyConstrain(
    newMatrix: TransformMatrix,
    prevMatrix: TransformMatrix,
  ): TransformMatrix {
    if (options.constrain) return options.constrain(newMatrix, prevMatrix);
    const scaleXMin = options.scaleXMin ?? 0;
    const scaleXMax = options.scaleXMax ?? Infinity;
    const scaleYMin = options.scaleYMin ?? 0;
    const scaleYMax = options.scaleYMax ?? Infinity;
    const { scaleX, scaleY } = newMatrix;
    const shouldConstrainScaleX = scaleX > scaleXMax || scaleX < scaleXMin;
    const shouldConstrainScaleY = scaleY > scaleYMax || scaleY < scaleYMin;
    if (shouldConstrainScaleX || shouldConstrainScaleY) {
      return prevMatrix;
    }
    return newMatrix;
  }

  function setTransformMatrix(newMatrix: TransformMatrix) {
    transformMatrix.value = applyConstrain(newMatrix, transformMatrix.value);
  }

  function applyToPoint({ x, y }: Point): Point {
    return applyMatrixToPoint(transformMatrix.value, { x, y });
  }

  function applyInverseToPoint({ x, y }: Point): Point {
    return applyInverseMatrixToPoint(transformMatrix.value, { x, y });
  }

  function reset() {
    setTransformMatrix(options.initialTransformMatrix ?? defaultInitialTransformMatrix);
  }

  function scale({ scaleX: sx, scaleY: maybeSy, point }: ScaleSignature) {
    const sy = maybeSy ?? sx;
    const cleanPoint = point ?? { x: options.width / 2, y: options.height / 2 };
    const currentMatrix = transformMatrix.value;
    const translatePt = applyInverseMatrixToPoint(currentMatrix, cleanPoint);
    const nextMatrix = composeMatrices(
      currentMatrix,
      translateMatrix(translatePt.x, translatePt.y),
      scaleMatrix(sx, sy),
      translateMatrix(-translatePt.x, -translatePt.y),
    );
    setTransformMatrix(nextMatrix);
    if (isDragging.value) {
      const { translateX, translateY } = transformMatrix.value;
      startPoint.value = point;
      startTranslate.value = { translateX, translateY };
    }
  }

  function translate({ translateX, translateY }: Translate) {
    const nextMatrix = composeMatrices(
      transformMatrix.value,
      translateMatrix(translateX, translateY),
    );
    setTransformMatrix(nextMatrix);
  }

  function setTranslate({ translateX, translateY }: Translate) {
    const nextMatrix = {
      ...transformMatrix.value,
      translateX,
      translateY,
    };
    setTransformMatrix(nextMatrix);
  }

  function translateTo({ x, y }: Point) {
    const point = applyInverseMatrixToPoint(transformMatrix.value, { x, y });
    setTranslate({ translateX: point.x, translateY: point.y });
  }

  function invert(): TransformMatrix {
    return inverseMatrix(transformMatrix.value);
  }

  function toStringInvert(): string {
    const { translateX, translateY, scaleX, scaleY, skewX, skewY } = invert();
    return `matrix(${scaleX}, ${skewY}, ${skewX}, ${scaleY}, ${translateX}, ${translateY})`;
  }

  function dragStart(event: InteractionEvent) {
    const { translateX, translateY } = transformMatrix.value;
    startPoint.value = localPoint(event) || undefined;
    startTranslate.value = { translateX, translateY };
    isDragging.value = true;
  }

  function dragMove(event: InteractionEvent, moveOptions?: { offsetX?: number; offsetY?: number }) {
    if (!isDragging.value || !startPoint.value || !startTranslate.value) return;
    const currentPoint = localPoint(event);
    const dx = currentPoint ? -(startPoint.value.x - currentPoint.x) : -startPoint.value.x;
    const dy = currentPoint ? -(startPoint.value.y - currentPoint.y) : -startPoint.value.y;

    let translateX = startTranslate.value.translateX + dx;
    if (moveOptions?.offsetX) translateX += moveOptions.offsetX ?? 0;
    let translateY = startTranslate.value.translateY + dy;
    if (moveOptions?.offsetY) translateY += moveOptions.offsetY ?? 0;
    setTranslate({ translateX, translateY });
  }

  function dragEnd() {
    startPoint.value = undefined;
    startTranslate.value = undefined;
    isDragging.value = false;
  }

  function handleWheel(event: GenericWheelEvent) {
    event.preventDefault();
    const point = localPoint(event) || undefined;
    const wd = options.wheelDelta ?? defaultWheelDelta;
    const { scaleX: sx, scaleY: sy } = wd(event);
    scale({ scaleX: sx, scaleY: sy, point });
  }

  function handlePinch(state: PinchGestureState) {
    const {
      origin: [ox, oy],
      memo,
    } = state;
    let currentMemo = memo;
    const el = containerRef.value;
    if (el) {
      const { top, left } = currentMemo ?? el.getBoundingClientRect();
      if (!currentMemo) {
        currentMemo = { top, left };
      }
      const pd = options.pinchDelta ?? defaultPinchDelta;
      const { scaleX: sx, scaleY: sy } = pd(state);
      scale({
        scaleX: sx,
        scaleY: sy,
        point: { x: ox - left, y: oy - top },
      });
    }
    return currentMemo;
  }

  function toString(): string {
    const { translateX, translateY, scaleX, scaleY, skewX, skewY } = transformMatrix.value;
    return `matrix(${scaleX}, ${skewY}, ${skewX}, ${scaleY}, ${translateX}, ${translateY})`;
  }

  function center() {
    const centerPoint = { x: options.width / 2, y: options.height / 2 };
    const inverseCentroid = applyInverseToPoint(centerPoint);
    translate({
      translateX: inverseCentroid.x - centerPoint.x,
      translateY: inverseCentroid.y - centerPoint.y,
    });
  }

  function clear() {
    setTransformMatrix(identityMatrix());
  }

  // Set up gesture handling when containerRef is attached to a DOM element
  watch(
    containerRef,
    (el, _old, onCleanup) => {
      if (!el) return;
      const gesture = new Gesture(
        el,
        {
          onDragStart: ({ event }: { event: Event }) => {
            if (!(event instanceof KeyboardEvent)) dragStart(event as InteractionEvent);
          },
          onDrag: ({
            event,
            pinching,
            cancel,
          }: {
            event: Event;
            pinching?: boolean;
            cancel: () => void;
          }) => {
            if (pinching) {
              cancel();
              dragEnd();
            } else if (!(event instanceof KeyboardEvent)) {
              dragMove(event as InteractionEvent);
            }
          },
          onDragEnd: () => dragEnd(),
          onPinch: handlePinch,
          onWheel: ({
            event,
            active,
            pinching,
          }: {
            event: WheelEvent;
            active: boolean;
            pinching?: boolean;
          }) => {
            if (
              // Outside of Safari, the wheel event is fired together with the pinch event
              pinching ||
              // currently onWheelEnd emits one final wheel event which causes 2x scale
              // updates for the last tick. ensuring that the gesture is active avoids this
              !active
            ) {
              return;
            }
            handleWheel(event);
          },
        },
        { eventOptions: { passive: false }, drag: { filterTaps: true } },
      );
      onCleanup(() => gesture.destroy());
    },
    { flush: "post" },
  );

  return {
    get initialTransformMatrix() {
      return options.initialTransformMatrix ?? defaultInitialTransformMatrix;
    },
    get transformMatrix() {
      return transformMatrix.value;
    },
    get isDragging() {
      return isDragging.value;
    },
    center,
    clear,
    scale,
    translate,
    translateTo,
    setTranslate,
    setTransformMatrix,
    reset,
    handleWheel,
    handlePinch,
    dragEnd,
    dragMove,
    dragStart,
    toString,
    invert,
    toStringInvert,
    applyToPoint,
    applyInverseToPoint,
    containerRef,
  };
}
