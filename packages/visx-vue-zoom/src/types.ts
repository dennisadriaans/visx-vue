import type { Ref } from 'vue'

export type GenericWheelEvent = WheelEvent

export type InteractionEvent = MouseEvent | TouchEvent | PointerEvent

export interface TransformMatrix {
  scaleX: number
  scaleY: number
  translateX: number
  translateY: number
  skewX: number
  skewY: number
}

export interface Point {
  x: number
  y: number
}

export type Translate = Pick<TransformMatrix, 'translateX' | 'translateY'>

export type Scale = Pick<TransformMatrix, 'scaleX' | 'scaleY'>

/** Subset of @use-gesture pinch state used by PinchDelta and handlePinch. */
export interface PinchGestureState {
  offset: [number, number]
  lastOffset: [number, number]
  origin: [number, number]
  memo?: any
  event: TouchEvent | PointerEvent | WheelEvent
  [key: string]: unknown
}

export type PinchDelta = (params: PinchGestureState) => Scale

export interface ScaleSignature {
  scaleX: TransformMatrix['scaleX']
  scaleY?: TransformMatrix['scaleY']
  point?: Point
}

export interface ProvidedZoom<ElementType> {
  /** Sets translateX/Y to the center defined by width and height. */
  center: () => void
  /** Sets the transform matrix to the identity matrix. */
  clear: () => void
  /** Applies the specified scaleX + optional scaleY transform relative to the specified point (or center of canvas if unspecified). */
  scale: (scale: ScaleSignature) => void
  /** Multiplies the current transform matrix by the specified translation. */
  translate: (translate: Translate) => void
  /** Translates to a specific x,y point. */
  translateTo: (point: Point) => void
  /** Sets the translation of the current transform matrix to the specified translation. */
  setTranslate: (translate: Translate) => void
  /**
   * Sets the transform matrix to the specified matrix, constraining the transform
   * scale by default (or applying props.constrain if provided).
   */
  setTransformMatrix: (matrix: TransformMatrix) => void
  /** Resets the transform to the initial transform specified by props. */
  reset: () => void
  /** Callback for a wheel event, updating scale based on wheelDelta, relative to the mouse position. */
  handleWheel: (event: WheelEvent) => void
  /** Callback for a pinch event, updating scale based on pinchDelta, relative to the pinch position. */
  handlePinch: (state: PinchGestureState) => any
  /** Callback for dragEnd, sets isDragging to false. */
  dragEnd: () => void
  /** Callback for dragMove, results in a translate transform. */
  dragMove: (event: InteractionEvent, options?: { offsetX?: number; offsetY?: number }) => void
  /** Callback for dragStart, sets isDragging to true. */
  dragStart: (event: InteractionEvent) => void
  /**
   * Returns a string representation of the matrix transform:
   * matrix(${scaleX}, ${skewY}, ${skewX}, ${scaleY}, ${translateX}, ${translateY})
   */
  toString: () => string
  /** Returns the inverse of the current transform matrix. */
  invert: () => TransformMatrix
  /**
   * Returns the string representation of the inverse of the current transform matrix:
   * matrix(${scaleX}, ${skewY}, ${skewX}, ${scaleY}, ${translateX}, ${translateY})
   */
  toStringInvert: () => string
  /** Applies the current transform matrix to the specified point. */
  applyToPoint: ({ x, y }: Point) => Point
  /** Applies the inverse of the current transform matrix to the specified point. */
  applyInverseToPoint: ({ x, y }: Point) => Point
  /** Ref to attach to the element for automatic gesture handling. */
  containerRef: Ref<ElementType | null>
}

/** Internal state properties exposed by the Zoom component. */
export interface ZoomState {
  /** The initial transform matrix specified by props. */
  initialTransformMatrix: TransformMatrix
  /** The current transform matrix. */
  transformMatrix: TransformMatrix
  /** Whether the user is currently dragging. */
  isDragging: boolean
}

/** Complete Zoom API including methods and state, passed to scoped slot. */
export type Zoom<ElementType> = ProvidedZoom<ElementType> & ZoomState
