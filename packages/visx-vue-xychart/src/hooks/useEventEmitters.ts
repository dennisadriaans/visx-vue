import useEventEmitter from "./useEventEmitter";

type PointerEventEmitterParams = {
  /** Source of the events, e.g., the component name. */
  source: string;
  onBlur?: boolean;
  onFocus?: boolean;
  onPointerMove?: boolean;
  onPointerOut?: boolean;
  onPointerUp?: boolean;
  onPointerDown?: boolean;
};

/**
 * A composable that simplifies creation of handlers for emitting
 * pointermove, pointerout, pointerup, and pointerdown events to EventEmitterContext.
 */
export default function usePointerEventEmitters({
  source,
  onPointerOut = true,
  onPointerMove = true,
  onPointerUp = true,
  onPointerDown = true,
  onFocus = false,
  onBlur = false,
}: PointerEventEmitterParams) {
  const emit = useEventEmitter();

  function emitPointerMove(event: PointerEvent) {
    emit?.("pointermove", event, source);
  }
  function emitPointerOut(event: PointerEvent) {
    emit?.("pointerout", event, source);
  }
  function emitPointerUp(event: PointerEvent) {
    emit?.("pointerup", event, source);
  }
  function emitPointerDown(event: PointerEvent) {
    emit?.("pointerdown", event, source);
  }
  function emitFocus(event: FocusEvent) {
    emit?.("focus", event, source);
  }
  function emitBlur(event: FocusEvent) {
    emit?.("blur", event, source);
  }

  return {
    onPointerMove: onPointerMove ? emitPointerMove : undefined,
    onFocus: onFocus ? emitFocus : undefined,
    onBlur: onBlur ? emitBlur : undefined,
    onPointerOut: onPointerOut ? emitPointerOut : undefined,
    onPointerUp: onPointerUp ? emitPointerUp : undefined,
    onPointerDown: onPointerDown ? emitPointerDown : undefined,
  };
}
