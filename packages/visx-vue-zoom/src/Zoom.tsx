import { defineComponent, type PropType } from "vue";
import useZoom from "./useZoom";
import type { TransformMatrix, Scale, GenericWheelEvent, PinchDelta } from "./types";

export type ZoomProps = {
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
   */
  wheelDelta?: (event: GenericWheelEvent) => Scale;
  /**
   * A function that returns { scaleX, scaleY } factors to scale the matrix by on pinch events.
   */
  pinchDelta?: PinchDelta;
  /**
   * By default constrain() will only constrain scale values. To change
   * constraints you can pass in your own constrain function.
   */
  constrain?: (transform: TransformMatrix, prevTransform: TransformMatrix) => TransformMatrix;
};

export const Zoom = defineComponent({
  name: "Zoom",
  props: {
    width: { type: Number as PropType<number>, required: true },
    height: { type: Number as PropType<number>, required: true },
    scaleXMin: { type: Number as PropType<number>, default: undefined },
    scaleXMax: { type: Number as PropType<number>, default: undefined },
    scaleYMin: { type: Number as PropType<number>, default: undefined },
    scaleYMax: { type: Number as PropType<number>, default: undefined },
    initialTransformMatrix: {
      type: Object as PropType<TransformMatrix>,
      default: undefined,
    },
    wheelDelta: {
      type: Function as PropType<(event: GenericWheelEvent) => Scale>,
      default: undefined,
    },
    pinchDelta: {
      type: Function as PropType<PinchDelta>,
      default: undefined,
    },
    constrain: {
      type: Function as PropType<
        (transform: TransformMatrix, prevTransform: TransformMatrix) => TransformMatrix
      >,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const zoom = useZoom({
      get width() {
        return props.width;
      },
      get height() {
        return props.height;
      },
      get scaleXMin() {
        return props.scaleXMin;
      },
      get scaleXMax() {
        return props.scaleXMax;
      },
      get scaleYMin() {
        return props.scaleYMin;
      },
      get scaleYMax() {
        return props.scaleYMax;
      },
      get initialTransformMatrix() {
        return props.initialTransformMatrix;
      },
      get wheelDelta() {
        return props.wheelDelta;
      },
      get pinchDelta() {
        return props.pinchDelta;
      },
      get constrain() {
        return props.constrain;
      },
    });

    return () => slots.default?.(zoom);
  },
});

export default Zoom;
