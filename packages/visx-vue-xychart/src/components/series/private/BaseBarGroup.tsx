import { defineComponent, computed, inject, watchEffect, type Component, type PropType } from "vue";
import type { PositionScale } from "@visx-vue/shape";
import { scaleBand } from "@visx-vue/scale";
import type { AxisScale } from "@visx-vue/axis";
import type { ScaleInput } from "@visx-vue/scale";
import { DataContextKey } from "../../../context/DataContext";
import type {
  Bar,
  DataContextType,
  NearestDatumArgs,
  NearestDatumReturnType,
  SeriesProps,
} from "../../../types";
import getScaleBandwidth from "../../../utils/getScaleBandwidth";
import getScaleBaseline from "../../../utils/getScaleBaseline";
import isValidNumber from "../../../typeguards/isValidNumber";
import { BARGROUP_EVENT_SOURCE, XYCHART_EVENT_SOURCE } from "../../../constants";
import useSeriesEvents from "../../../hooks/useSeriesEvents";
import findNearestGroupDatum from "../../../utils/findNearestGroupDatum";

/**
 * Config for an individual series within a BarGroup.
 * Replaces React's children introspection pattern.
 */
export type BarGroupSeriesConfig<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object,
> = {
  dataKey: string;
  data: Datum[];
  xAccessor: (d: Datum) => ScaleInput<XScale>;
  yAccessor: (d: Datum) => ScaleInput<YScale>;
  colorAccessor?: (d: Datum, index: number) => string | null | undefined;
  radius?: number;
  radiusAll?: boolean;
  radiusTop?: boolean;
  radiusRight?: boolean;
  radiusBottom?: boolean;
  radiusLeft?: boolean;
};

export type BaseBarGroupProps<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object,
> = {
  /** Array of series configs — replaces React's children introspection. */
  series: BarGroupSeriesConfig<XScale, YScale, Datum>[];
  /** Group band scale padding, [0, 1] where 0 = no padding, 1 = no bar. */
  padding?: number;
  /** Comparator function to sort dataKeys within a bar group. */
  sortBars?: (dataKeyA: string, dataKeyB: string) => number;
  /** Rendered component which is passed BarsProps by BaseBarGroup after processing. */
  BarsComponent: Component;
} & Pick<
  SeriesProps<XScale, YScale, Datum>,
  | "onPointerMove"
  | "onPointerOut"
  | "onPointerUp"
  | "onPointerDown"
  | "onBlur"
  | "onFocus"
  | "enableEvents"
>;

export default defineComponent({
  name: "BaseBarGroup",
  props: {
    series: {
      type: Array as PropType<BarGroupSeriesConfig<AxisScale, AxisScale, object>[]>,
      required: true,
    },
    padding: { type: Number as PropType<number>, default: 0.1 },
    sortBars: { type: Function as PropType<(a: string, b: string) => number>, default: undefined },
    BarsComponent: { type: [Object, Function] as PropType<Component>, required: true },
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

    const dataKeys = computed(() => props.series.map((s) => s.dataKey));

    // Register all child data
    watchEffect((onCleanup) => {
      if (dataContext.registerData) {
        const dataToRegister = props.series.map((s) => ({
          key: s.dataKey,
          data: s.data,
          xAccessor: s.xAccessor,
          yAccessor: s.yAccessor,
        }));
        dataContext.registerData(dataToRegister);
        onCleanup(() => {
          dataContext.unregisterData?.(dataKeys.value);
        });
      }
    });

    // Create group scale
    const groupScale = computed(() => {
      const { xScale, yScale, horizontal } = dataContext;
      if (!xScale || !yScale) return null;
      return scaleBand<string>({
        domain: props.sortBars ? [...dataKeys.value].sort(props.sortBars) : dataKeys.value,
        range: [0, getScaleBandwidth(horizontal ? yScale : xScale)],
        padding: props.padding,
      });
    });

    function findNearestDatum(
      params: NearestDatumArgs<AxisScale, AxisScale, object>,
    ): NearestDatumReturnType<object> {
      if (!groupScale.value) return null;
      return findNearestGroupDatum(params, groupScale.value, dataContext.horizontal);
    }

    const ownEventSourceKey = computed(
      () => `${BARGROUP_EVENT_SOURCE}-${dataKeys.value.join("-")}}`,
    );

    const eventEmitters = useSeriesEvents({
      dataKey: dataKeys.value,
      enableEvents: props.enableEvents,
      findNearestDatum,
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
      const { colorScale, dataRegistry, horizontal, xScale, yScale } = dataContext;

      const registryEntries = dataKeys.value.map((key) => dataRegistry?.get(key));

      // if scales and data are not available in the registry, bail
      if (
        registryEntries.some((entry) => entry == null) ||
        !xScale ||
        !yScale ||
        !colorScale ||
        !groupScale.value
      ) {
        return null;
      }

      const xZeroPosition = xScale ? getScaleBaseline(xScale) : 0;
      const yZeroPosition = yScale ? getScaleBaseline(yScale) : 0;
      const barThickness = getScaleBandwidth(groupScale.value);

      const barSeries = registryEntries.map((entry) => {
        if (!entry) return null;
        const { xAccessor, yAccessor, data, key } = entry;

        const getLength = (d: object) =>
          horizontal
            ? (xScale(xAccessor(d)) ?? NaN) - xZeroPosition
            : (yScale(yAccessor(d)) ?? NaN) - yZeroPosition;

        const getGroupPosition = horizontal
          ? (d: object) => yScale(yAccessor(d)) ?? NaN
          : (d: object) => xScale(xAccessor(d)) ?? NaN;

        const withinGroupPosition = groupScale.value!.call(null, key) ?? 0;

        const getX = horizontal
          ? (d: object) => xZeroPosition + Math.min(0, getLength(d))
          : (d: object) => getGroupPosition(d) + withinGroupPosition;

        const getY = horizontal
          ? (d: object) => getGroupPosition(d) + withinGroupPosition
          : (d: object) => yZeroPosition + Math.min(0, getLength(d));

        const getWidth = horizontal ? (d: object) => Math.abs(getLength(d)) : () => barThickness;
        const getHeight = horizontal ? () => barThickness : (d: object) => Math.abs(getLength(d));

        const seriesConfig = props.series.find((s) => s.dataKey === key);
        const {
          colorAccessor,
          radius,
          radiusAll,
          radiusBottom,
          radiusLeft,
          radiusRight,
          radiusTop,
        } = seriesConfig || {};

        return {
          key,
          radius,
          radiusAll,
          radiusBottom,
          radiusLeft,
          radiusRight,
          radiusTop,
          bars: data
            .map((bar, index) => {
              const barX = getX(bar);
              if (!isValidNumber(barX)) return null;
              const barY = getY(bar);
              if (!isValidNumber(barY)) return null;
              const barWidth = getWidth(bar);
              if (!isValidNumber(barWidth)) return null;
              const barHeight = getHeight(bar);
              if (!isValidNumber(barHeight)) return null;

              return {
                key: `${key}-${index}`,
                x: barX,
                y: barY,
                width: barWidth,
                height: barHeight,
                fill: colorAccessor?.(bar, index) ?? colorScale(key),
              };
            })
            .filter((bar) => bar) as Bar[],
        };
      });

      const BarsTag = props.BarsComponent as any;

      return (
        <g class="visx-bar-group">
          {barSeries.map(
            (series) =>
              series && (
                <BarsTag
                  horizontal={horizontal}
                  xScale={xScale}
                  yScale={yScale}
                  {...series}
                  {...eventEmitters}
                  key={series.key}
                />
              ),
          )}
        </g>
      );
    };
  },
});
