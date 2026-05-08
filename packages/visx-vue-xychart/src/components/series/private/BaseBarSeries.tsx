import { defineComponent, computed, inject, watchEffect, type Component, type PropType } from "vue";
import type { AxisScale } from "@visx-vue/axis";
import type { ScaleInput } from "@visx-vue/scale";
import { DataContextKey } from "../../../context/DataContext";
import type { Bar, BarsProps, DataContextType, SeriesProps } from "../../../types";
import getScaledValueFactory from "../../../utils/getScaledValueFactory";
import getScaleBandwidth from "../../../utils/getScaleBandwidth";
import getScaleBaseline from "../../../utils/getScaleBaseline";
import isValidNumber from "../../../typeguards/isValidNumber";
import { BARSERIES_EVENT_SOURCE, XYCHART_EVENT_SOURCE } from "../../../constants";
import useSeriesEvents from "../../../hooks/useSeriesEvents";

export type BaseBarSeriesProps<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object,
> = SeriesProps<XScale, YScale, Datum> & {
  /** Rendered component which is passed BarsProps by BaseBarSeries after processing. */
  BarsComponent: Component;
  /**
   * Specify bar padding when bar thickness does not come from a `band` scale.
   * Accepted values are [0, 1], 0 = no padding, 1 = no bar, defaults to 0.1.
   */
  barPadding?: number;
  /** Given a Datum, returns its color. Falls back to theme color if unspecified or if a null-ish value is returned. */
  colorAccessor?: (d: Datum, index: number) => string | null | undefined;
} & Pick<
    BarsProps<XScale, YScale>,
    "radius" | "radiusAll" | "radiusTop" | "radiusRight" | "radiusBottom" | "radiusLeft"
  >;

// Fallback bandwidth estimate assumes no missing data values
const getFallbackBandwidth = (fullBarWidth: number, barPadding: number) =>
  fullBarWidth * (1 - Math.min(1, Math.max(0, barPadding)));

export default defineComponent({
  name: "BaseBarSeries",
  props: {
    dataKey: { type: String as PropType<string>, required: true },
    data: { type: Array as PropType<object[]>, required: true },
    xAccessor: { type: Function as PropType<(d: object) => ScaleInput<AxisScale>>, required: true },
    yAccessor: { type: Function as PropType<(d: object) => ScaleInput<AxisScale>>, required: true },
    BarsComponent: { type: [Object, Function] as PropType<Component>, required: true },
    barPadding: { type: Number as PropType<number>, default: 0.1 },
    colorAccessor: {
      type: Function as PropType<(d: object, index: number) => string | null | undefined>,
      default: undefined,
    },
    enableEvents: { type: Boolean as PropType<boolean>, default: true },
    radius: { type: Number as PropType<number>, default: undefined },
    radiusAll: { type: Boolean as PropType<boolean>, default: undefined },
    radiusTop: { type: Boolean as PropType<boolean>, default: undefined },
    radiusRight: { type: Boolean as PropType<boolean>, default: undefined },
    radiusBottom: { type: Boolean as PropType<boolean>, default: undefined },
    radiusLeft: { type: Boolean as PropType<boolean>, default: undefined },
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

    const ownEventSourceKey = computed(() => `${BARSERIES_EVENT_SOURCE}-${props.dataKey}`);

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
      const {
        xScale,
        yScale,
        colorScale,
        horizontal,
        theme,
        innerWidth = 0,
        innerHeight = 0,
      } = dataContext;
      const registryEntry = dataContext.dataRegistry?.get(props.dataKey);

      if (!xScale || !yScale || !registryEntry) return null;

      const data = registryEntry.data;
      const xAccessor = registryEntry.xAccessor;
      const yAccessor = registryEntry.yAccessor;

      const getScaledX = getScaledValueFactory(xScale, xAccessor);
      const getScaledY = getScaledValueFactory(yScale, yAccessor);
      const scaleBandwidth = getScaleBandwidth(horizontal ? yScale : xScale);
      const barThickness =
        scaleBandwidth ||
        getFallbackBandwidth(
          (horizontal ? innerHeight : innerWidth) / data.length,
          props.barPadding,
        );

      const xZeroPosition = xScale ? getScaleBaseline(xScale) : 0;
      const yZeroPosition = yScale ? getScaleBaseline(yScale) : 0;
      const color = colorScale?.(props.dataKey) ?? theme?.colors?.[0] ?? "#222";

      const xOffset = horizontal ? 0 : -barThickness / 2;
      const yOffset = horizontal ? -barThickness / 2 : 0;
      const bars = data
        .map((datum, index) => {
          const x = getScaledX(datum) + xOffset;
          if (!isValidNumber(x)) return null;
          const y = getScaledY(datum) + yOffset;
          if (!isValidNumber(y)) return null;
          const barLength = horizontal ? x - xZeroPosition : y - yZeroPosition;
          if (!isValidNumber(barLength)) return null;

          return {
            key: `${index}`,
            x: horizontal ? xZeroPosition + Math.min(0, barLength) : x,
            y: horizontal ? y : yZeroPosition + Math.min(0, barLength),
            width: horizontal ? Math.abs(barLength) : barThickness,
            height: horizontal ? barThickness : Math.abs(barLength),
            fill: props.colorAccessor?.(datum, index) ?? color,
          };
        })
        .filter((bar) => bar) as Bar[];

      const BarsTag = props.BarsComponent as any;

      return (
        <g class="vx-bar-series">
          <BarsTag
            bars={bars}
            horizontal={horizontal}
            xScale={xScale}
            yScale={yScale}
            radius={props.radius}
            radiusAll={props.radiusAll}
            radiusTop={props.radiusTop}
            radiusRight={props.radiusRight}
            radiusBottom={props.radiusBottom}
            radiusLeft={props.radiusLeft}
            {...eventEmitters}
          />
        </g>
      );
    };
  },
});
