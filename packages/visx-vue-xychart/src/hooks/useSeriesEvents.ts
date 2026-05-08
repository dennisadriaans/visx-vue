import { inject } from "vue";
import type { AxisScale } from "@visx-vue/axis";
import { TooltipContextKey } from "../context/TooltipContext";
import type { EventHandlerParams, SeriesProps, TooltipContextType } from "../types";
import useEventEmitters from "./useEventEmitters";
import type { PointerEventHandlerParams } from "./useEventHandlers";
import useEventHandlers from "./useEventHandlers";

export type SeriesEventsParams<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object,
> = Pick<
  SeriesProps<XScale, YScale, Datum>,
  | "enableEvents"
  | "onBlur"
  | "onFocus"
  | "onPointerMove"
  | "onPointerOut"
  | "onPointerUp"
  | "onPointerDown"
> &
  Pick<
    PointerEventHandlerParams<XScale, YScale, Datum>,
    "dataKey" | "allowedSources" | "findNearestDatum"
  > & {
    /** The source of emitted events. */
    source: string;
  };

/** This composable simplifies the logic for initializing Series event emitters + handlers. */
export default function useSeriesEvents<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object,
>({
  dataKey,
  enableEvents,
  findNearestDatum,
  onBlur: onBlurProps,
  onFocus: onFocusProps,
  onPointerMove: onPointerMoveProps,
  onPointerOut: onPointerOutProps,
  onPointerUp: onPointerUpProps,
  onPointerDown: onPointerDownProps,
  source,
  allowedSources,
}: SeriesEventsParams<XScale, YScale, Datum>) {
  const { showTooltip, hideTooltip } = (inject(TooltipContextKey, null) ??
    {}) as TooltipContextType<Datum>;

  function onPointerMove(params: EventHandlerParams<Datum>) {
    showTooltip(params);
    if (onPointerMoveProps) onPointerMoveProps(params);
  }
  function onFocus(params: EventHandlerParams<Datum>) {
    showTooltip(params);
    if (onFocusProps) onFocusProps(params);
  }
  function onPointerOut(event: PointerEvent) {
    hideTooltip();
    if (event && onPointerOutProps) onPointerOutProps(event);
  }
  function onBlur(event: FocusEvent) {
    hideTooltip();
    if (event && onBlurProps) onBlurProps(event);
  }
  function onPointerDown(params: EventHandlerParams<Datum>) {
    showTooltip(params);
    if (onPointerDownProps) onPointerDownProps(params);
  }

  useEventHandlers({
    dataKey,
    findNearestDatum,
    onBlur: enableEvents ? onBlur : undefined,
    onFocus: enableEvents ? onFocus : undefined,
    onPointerMove: enableEvents ? onPointerMove : undefined,
    onPointerOut: enableEvents ? onPointerOut : undefined,
    onPointerUp: enableEvents ? onPointerUpProps : undefined,
    onPointerDown: enableEvents ? onPointerDown : undefined,
    allowedSources,
  });

  return useEventEmitters({
    source,
    onBlur: !!onBlurProps && enableEvents,
    onFocus: !!onFocusProps && enableEvents,
    onPointerMove: !!onPointerMoveProps && enableEvents,
    onPointerOut: !!onPointerOutProps && enableEvents,
    onPointerUp: !!onPointerUpProps && enableEvents,
    onPointerDown: !!onPointerDownProps && enableEvents,
  });
}
