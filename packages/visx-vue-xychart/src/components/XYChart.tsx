import { defineComponent, inject, watchEffect, useSlots, type PropType } from "vue";
import { ParentSize } from "@visx-vue/responsive";
import type { ResizeObserverPolyfill } from "@visx-vue/responsive";
import type { AxisScaleOutput } from "@visx-vue/axis";
import type { ScaleConfig } from "@visx-vue/scale";

import { DataContextKey } from "../context/DataContext";
import type { InferDataContext } from "../context/DataContext";
import { TooltipContextKey } from "../context/TooltipContext";
import { EventEmitterContextKey } from "../context/EventEmitterContext";
import type { Margin, EventHandlerParams } from "../types";
import type { DataProviderProps } from "../providers/DataProvider";
import DataProvider from "../providers/DataProvider";
import TooltipProvider from "../providers/TooltipProvider";
import EventEmitterProvider from "../providers/EventEmitterProvider";
import useEventEmitters from "../hooks/useEventEmitters";
import useEventHandlers, {
  POINTER_EVENTS_ALL,
  POINTER_EVENTS_NEAREST,
} from "../hooks/useEventHandlers";
import { XYCHART_EVENT_SOURCE } from "../constants";

const DEFAULT_MARGIN: Margin = { top: 50, right: 50, bottom: 50, left: 50 };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type XYChartProps<
  XScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>,
  YScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>,
  Datum extends object,
> = {
  /** aria-label for the chart svg element. */
  accessibilityLabel?: string;
  /** Whether to capture and dispatch pointer events to EventEmitter context. */
  captureEvents?: boolean;
  /** Total width of the desired chart svg, including margin. */
  width?: number;
  /** Total height of the desired chart svg, including margin. */
  height?: number;
  /** Margin to apply around the outside. */
  margin?: Margin;
  /** If DataContext is not available, XYChart will wrap itself in a DataProvider and set this as the theme. */
  theme?: DataProviderProps<XScaleConfig, YScaleConfig>["theme"];
  /** If DataContext is not available, XYChart will wrap itself in a DataProvider and set this as the xScale config. */
  xScale?: DataProviderProps<XScaleConfig, YScaleConfig>["xScale"];
  /** If DataContext is not available, XYChart will wrap itself in a DataProvider and set this as the yScale config. */
  yScale?: DataProviderProps<XScaleConfig, YScaleConfig>["yScale"];
  /** Determines whether Series will be plotted horizontally. By default this will try to be inferred based on scale types. */
  horizontal?: boolean | "auto";
  /** Callback invoked for onPointerMove events for the nearest Datum to the PointerEvent. */
  onPointerMove?: (params: EventHandlerParams<Datum>) => void;
  /** Callback invoked for onPointerOut events. */
  onPointerOut?: (event: PointerEvent) => void;
  /** Callback invoked for onPointerUp events for the nearest Datum to the PointerEvent. */
  onPointerUp?: (params: EventHandlerParams<Datum>) => void;
  /** Callback invoked for onPointerDown events for the nearest Datum to the PointerEvent. */
  onPointerDown?: (params: EventHandlerParams<Datum>) => void;
  /** Whether to invoke PointerEvent handlers for all dataKeys, or the nearest dataKey. */
  pointerEventsDataKey?: "all" | "nearest";
  /**
   * Responsive charts, <Tooltip />, and <AnnotationLabel /> depend on ResizeObserver
   * which may be polyfilled globally, passed to individual components or injected once
   * into this component.
   */
  resizeObserverPolyfill?: ResizeObserverPolyfill;
};

const allowedEventSources = [XYCHART_EVENT_SOURCE];

const XYChart = defineComponent({
  name: "XYChart",
  props: {
    accessibilityLabel: { type: String as PropType<string>, default: "XYChart" },
    captureEvents: { type: Boolean as PropType<boolean>, default: true },
    width: { type: Number as PropType<number>, default: undefined },
    height: { type: Number as PropType<number>, default: undefined },
    margin: { type: Object as PropType<Margin>, default: () => ({ ...DEFAULT_MARGIN }) },
    theme: {
      type: Object as PropType<
        DataProviderProps<ScaleConfig<AxisScaleOutput>, ScaleConfig<AxisScaleOutput>>["theme"]
      >,
      default: undefined,
    },
    xScale: { type: Object as PropType<ScaleConfig<AxisScaleOutput>>, default: undefined },
    yScale: { type: Object as PropType<ScaleConfig<AxisScaleOutput>>, default: undefined },
    horizontal: { type: [Boolean, String] as PropType<boolean | "auto">, default: undefined },
    onPointerMove: {
      type: Function as PropType<(params: EventHandlerParams<object>) => void>,
      default: undefined,
    },
    onPointerOut: { type: Function as PropType<(event: PointerEvent) => void>, default: undefined },
    onPointerUp: {
      type: Function as PropType<(params: EventHandlerParams<object>) => void>,
      default: undefined,
    },
    onPointerDown: {
      type: Function as PropType<(params: EventHandlerParams<object>) => void>,
      default: undefined,
    },
    pointerEventsDataKey: { type: String as PropType<"all" | "nearest">, default: "nearest" },
    resizeObserverPolyfill: {
      type: Function as unknown as PropType<ResizeObserverPolyfill>,
      default: undefined,
    },
  },
  setup(props) {
    const slots = useSlots();

    const dataCtx = inject(DataContextKey, undefined);
    const tooltipContext = inject(TooltipContextKey, undefined);
    const emitterContext = inject(EventEmitterContextKey, undefined);

    const hasDataContext =
      dataCtx !== undefined && (dataCtx as InferDataContext)?.setDimensions !== undefined;
    const hasTooltipContext = tooltipContext !== undefined;
    const hasEmitterContext = emitterContext !== undefined;

    // Only set up event emitters and handlers when all contexts are available
    if (hasDataContext && hasTooltipContext && hasEmitterContext) {
      const eventEmitters = useEventEmitters({ source: XYCHART_EVENT_SOURCE });
      useEventHandlers({
        dataKey:
          props.pointerEventsDataKey === "nearest" ? POINTER_EVENTS_NEAREST : POINTER_EVENTS_ALL,
        onPointerMove: props.onPointerMove,
        onPointerOut: props.onPointerOut,
        onPointerUp: props.onPointerUp,
        onPointerDown: props.onPointerDown,
        allowedSources: allowedEventSources,
      });

      const ctx = dataCtx as InferDataContext;

      // update dimensions in context
      watchEffect(() => {
        if (
          ctx.setDimensions &&
          props.width != null &&
          props.height != null &&
          props.width > 0 &&
          props.height > 0
        ) {
          ctx.setDimensions({ width: props.width, height: props.height, margin: props.margin });
        }
      });

      return () => {
        const { width, height } = props;

        if (width == null || height == null || width <= 0 || height <= 0) {
          return null;
        }

        return (
          <svg width={width} height={height} aria-label={props.accessibilityLabel}>
            {slots.default?.()}
            {props.captureEvents && (
              <rect
                x={props.margin.left}
                y={props.margin.top}
                width={width - props.margin.left - props.margin.right}
                height={height - props.margin.top - props.margin.bottom}
                fill="transparent"
                onPointermove={eventEmitters.onPointerMove}
                onPointerout={eventEmitters.onPointerOut}
                onPointerup={eventEmitters.onPointerUp}
                onPointerdown={eventEmitters.onPointerDown}
              />
            )}
          </svg>
        );
      };
    }

    // If contexts are not available, wrap self in the needed providers
    return () => {
      if (!hasDataContext) {
        if (!props.xScale || !props.yScale) {
          console.warn(
            "[@visx-vue/xychart] XYChart: When no DataProvider is available in context, you must pass xScale & yScale config to XYChart.",
          );
          return null;
        }
        return (
          <DataProvider
            xScale={props.xScale}
            yScale={props.yScale}
            theme={props.theme}
            initialDimensions={{ width: props.width, height: props.height, margin: props.margin }}
            horizontal={props.horizontal}
            resizeObserverPolyfill={props.resizeObserverPolyfill}
          >
            {{ default: () => <XYChart {...props}>{{ default: slots.default }}</XYChart> }}
          </DataProvider>
        );
      }

      if (props.width == null || props.height == null) {
        const resizeObserverPolyfill = (dataCtx as InferDataContext)?.resizeObserverPolyfill;
        return (
          <ParentSize resizeObserverPolyfill={resizeObserverPolyfill}>
            {{
              default: (dims: { width: number; height: number }) => (
                <XYChart
                  {...props}
                  width={props.width == null ? dims.width : props.width}
                  height={props.height == null ? dims.height : props.height}
                >
                  {{ default: slots.default }}
                </XYChart>
              ),
            }}
          </ParentSize>
        );
      }

      if (!hasTooltipContext) {
        return (
          <TooltipProvider>
            {{ default: () => <XYChart {...props}>{{ default: slots.default }}</XYChart> }}
          </TooltipProvider>
        );
      }

      // EventEmitterProvider should be the last wrapper so we do not duplicate handlers
      if (!hasEmitterContext) {
        return (
          <EventEmitterProvider>
            {{ default: () => <XYChart {...props}>{{ default: slots.default }}</XYChart> }}
          </EventEmitterProvider>
        );
      }

      return null;
    };
  },
});

export default XYChart;
