import { defineComponent, computed, inject, watchEffect, type PropType, type VNode } from "vue";
import type { AxisScale } from "@visx-vue/axis";
import type { ScaleInput } from "@visx-vue/scale";
import { DataContextKey } from "../../../context/DataContext";
import type { DataContextType, GlyphProps, GlyphsProps, SeriesProps } from "../../../types";
import getScaledValueFactory from "../../../utils/getScaledValueFactory";
import isValidNumber from "../../../typeguards/isValidNumber";
import { GLYPHSERIES_EVENT_SOURCE, XYCHART_EVENT_SOURCE } from "../../../constants";
import useSeriesEvents from "../../../hooks/useSeriesEvents";

export type BaseGlyphSeriesProps<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object,
> = SeriesProps<XScale, YScale, Datum> & {
  /** Given a Datum, returns its color. Falls back to theme color if unspecified or if a null-ish value is returned. */
  colorAccessor?: (d: Datum, index: number) => string | null | undefined;
  /** The size of a `Glyph`, a `number` or a function which takes a `Datum` and returns a `number`. */
  size?: number | ((d: Datum) => number);
  /** Function which handles rendering glyphs. */
  renderGlyphs: (glyphsProps: GlyphsProps<XScale, YScale, Datum>) => VNode | VNode[] | null;
};

/**
 * Inner component that renders glyphs at data points.
 * Exported so it can be used by BaseLineSeries/BaseAreaSeries for focus glyph rendering.
 */
export function BaseGlyphSeries<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object,
>(renderProps: BaseGlyphSeriesProps<XScale, YScale, Datum> & { xScale?: XScale; yScale?: YScale }) {
  // This is used as a direct function call, not as a component
  return (
    <BaseGlyphSeriesComponent
      dataKey={renderProps.dataKey}
      data={renderProps.data}
      xAccessor={renderProps.xAccessor as any}
      yAccessor={renderProps.yAccessor as any}
      colorAccessor={renderProps.colorAccessor as any}
      size={renderProps.size as any}
      renderGlyphs={renderProps.renderGlyphs as any}
      enableEvents={renderProps.enableEvents}
      onBlur={renderProps.onBlur as any}
      onFocus={renderProps.onFocus as any}
      onPointerMove={renderProps.onPointerMove as any}
      onPointerOut={renderProps.onPointerOut as any}
      onPointerUp={renderProps.onPointerUp as any}
      onPointerDown={renderProps.onPointerDown as any}
    />
  );
}

const BaseGlyphSeriesComponent = defineComponent({
  name: "BaseGlyphSeries",
  props: {
    dataKey: { type: String as PropType<string>, required: true },
    data: { type: Array as PropType<object[]>, required: true },
    xAccessor: { type: Function as PropType<(d: object) => ScaleInput<AxisScale>>, required: true },
    yAccessor: { type: Function as PropType<(d: object) => ScaleInput<AxisScale>>, required: true },
    colorAccessor: {
      type: Function as PropType<(d: object, index: number) => string | null | undefined>,
      default: undefined,
    },
    size: { type: [Number, Function] as PropType<number | ((d: object) => number)>, default: 8 },
    renderGlyphs: {
      type: Function as PropType<
        (glyphsProps: GlyphsProps<AxisScale, AxisScale, object>) => VNode | VNode[] | null
      >,
      required: true,
    },
    enableEvents: { type: Boolean as PropType<boolean>, default: true },
    onPointerMove: {
      type: Function as PropType<SeriesProps<AxisScale, AxisScale, object>["onPointerMove"]>,
      default: undefined,
    },
    onPointerOut: {
      type: Function as PropType<SeriesProps<AxisScale, AxisScale, object>["onPointerOut"]>,
      default: undefined,
    },
    onPointerUp: {
      type: Function as PropType<SeriesProps<AxisScale, AxisScale, object>["onPointerUp"]>,
      default: undefined,
    },
    onPointerDown: {
      type: Function as PropType<SeriesProps<AxisScale, AxisScale, object>["onPointerDown"]>,
      default: undefined,
    },
    onFocus: {
      type: Function as PropType<SeriesProps<AxisScale, AxisScale, object>["onFocus"]>,
      default: undefined,
    },
    onBlur: {
      type: Function as PropType<SeriesProps<AxisScale, AxisScale, object>["onBlur"]>,
      default: undefined,
    },
  },
  setup(props) {
    const dataContext = inject(DataContextKey, {}) as Partial<
      DataContextType<AxisScale, AxisScale, object>
    >;

    // Register data
    watchEffect((onCleanup) => {
      if (dataContext.dataRegistry) {
        dataContext.dataRegistry.registerData({
          key: props.dataKey,
          data: props.data,
          xAccessor: props.xAccessor,
          yAccessor: props.yAccessor,
        });
        onCleanup(() => {
          dataContext.dataRegistry?.unregisterData(props.dataKey);
        });
      }
    });

    const ownEventSourceKey = computed(() => `${GLYPHSERIES_EVENT_SOURCE}-${props.dataKey}`);

    const eventEmitters = useSeriesEvents({
      dataKey: props.dataKey,
      enableEvents: props.enableEvents,
      onBlur: props.onBlur,
      onFocus: props.onFocus,
      onPointerMove: props.onPointerMove,
      onPointerOut: props.onPointerOut,
      onPointerUp: props.onPointerUp,
      onPointerDown: props.onPointerDown,
      source: ownEventSourceKey.value,
      allowedSources: [XYCHART_EVENT_SOURCE, ownEventSourceKey.value],
    });

    return () => {
      const { xScale, yScale, colorScale, theme, horizontal } = dataContext;
      const registryEntry = dataContext.dataRegistry?.get(props.dataKey);

      if (!xScale || !yScale || !registryEntry) return null;

      const data = registryEntry.data;
      const xAccessor = registryEntry.xAccessor;
      const yAccessor = registryEntry.yAccessor;

      const getScaledX = getScaledValueFactory(xScale, xAccessor);
      const getScaledY = getScaledValueFactory(yScale, yAccessor);
      const color = colorScale?.(props.dataKey) ?? theme?.colors?.[0] ?? "#222";

      const glyphs = data
        .map((datum, i) => {
          const x = getScaledX(datum);
          if (!isValidNumber(x)) return null;
          const y = getScaledY(datum);
          if (!isValidNumber(y)) return null;
          return {
            key: `${i}`,
            x,
            y,
            color: props.colorAccessor?.(datum, i) ?? color,
            size: typeof props.size === "function" ? props.size(datum) : (props.size ?? 8),
            datum,
            index: i,
          };
        })
        .filter((point) => point) as GlyphProps<object>[];

      return <>{props.renderGlyphs({ glyphs, xScale, yScale, horizontal, ...eventEmitters })}</>;
    };
  },
});

export default BaseGlyphSeriesComponent;
