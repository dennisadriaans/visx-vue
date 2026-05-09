import { defineComponent, computed, inject, type Component, type PropType } from "vue";
import type { SeriesPoint } from "@visx-vue/vendor/d3-shape";
import type { StackOffset, StackOrder } from "@visx-vue/shape";
import { getFirstItem, getSecondItem, getBandwidth } from "@visx-vue/shape";
import type { AxisScale } from "@visx-vue/axis";
import type { ScaleInput } from "@visx-vue/scale";
import { DataContextKey } from "../../../context/DataContext";
import type {
  Bar,
  BarStackDatum,
  CombinedStackData,
  DataContextType,
  NearestDatumArgs,
  NearestDatumReturnType,
  SeriesProps,
} from "../../../types";
import isValidNumber from "../../../typeguards/isValidNumber";
import { getStackValue } from "../../../utils/combineBarStackData";
import { BARSTACK_EVENT_SOURCE, XYCHART_EVENT_SOURCE } from "../../../constants";
import useSeriesEvents from "../../../hooks/useSeriesEvents";
import findNearestStackDatum from "../../../utils/findNearestStackDatum";
import useStackedData from "../../../hooks/useStackedData";

/**
 * Config for an individual series within a BarStack.
 * Replaces React's children introspection pattern.
 */
export type BarStackSeriesConfig<
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

export type BaseBarStackProps<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object,
> = {
  /** Array of series configs — replaces React's children introspection. */
  series: BarStackSeriesConfig<XScale, YScale, Datum>[];
  /** Rendered component which is passed BarsProps by BaseBarStack after processing. */
  BarsComponent: Component;
  order?: StackOrder;
  offset?: StackOffset;
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
  name: "BaseBarStack",
  props: {
    series: {
      type: Array as PropType<BarStackSeriesConfig<AxisScale, AxisScale, object>[]>,
      required: true,
    },
    BarsComponent: { type: [Object, Function] as PropType<Component>, required: true },
    order: { type: String as PropType<StackOrder>, default: undefined },
    offset: { type: String as PropType<StackOffset>, default: undefined },
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
    type XScale = AxisScale;
    type YScale = AxisScale;
    type StackBar = SeriesPoint<CombinedStackData<XScale, YScale>>;

    const dataContext = inject(DataContextKey, {}) as Partial<
      DataContextType<XScale, YScale, BarStackDatum<XScale, YScale>>
    >;

    const seriesConfigs = computed(() =>
      props.series.map((s) => ({
        dataKey: s.dataKey,
        data: s.data,
        xAccessor: s.xAccessor,
        yAccessor: s.yAccessor,
      })),
    );

    const { dataKeys, stackedData } = useStackedData({
      seriesConfigs,
      order: props.order,
      offset: props.offset,
    });

    // custom logic to find the nearest BarStackDatum and return the original Datum
    function findNearestDatum(
      params: NearestDatumArgs<XScale, YScale, BarStackDatum<XScale, YScale>>,
    ): NearestDatumReturnType<object> {
      const seriesConfig = props.series.find((s) => s.dataKey === params.dataKey);
      return seriesConfig
        ? findNearestStackDatum(params, seriesConfig.data, dataContext.horizontal)
        : null;
    }

    const ownEventSourceKey = computed(
      () => `${BARSTACK_EVENT_SOURCE}-${dataKeys.value.join("-")}`,
    );

    const eventEmitters = useSeriesEvents({
      dataKey: dataKeys.value,
      enableEvents: props.enableEvents,
      // @ts-expect-error Datum input + return type differ for BarStack
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
      if (registryEntries.some((entry) => entry == null) || !xScale || !yScale || !colorScale) {
        return null;
      }

      const barThickness = getBandwidth(horizontal ? yScale : xScale);
      const halfBarThickness = barThickness / 2;

      let getWidth: (bar: StackBar) => number | undefined;
      let getHeight: (bar: StackBar) => number | undefined;
      let getX: (bar: StackBar) => number | undefined;
      let getY: (bar: StackBar) => number | undefined;

      if (horizontal) {
        getWidth = (bar) =>
          (xScale(getSecondItem(bar)) ?? NaN) - (xScale(getFirstItem(bar)) ?? NaN);
        getHeight = () => barThickness;
        getX = (bar) => xScale(getFirstItem(bar));
        getY = (bar) =>
          "bandwidth" in yScale
            ? yScale(getStackValue(bar.data))
            : Math.max((yScale(getStackValue(bar.data)) ?? NaN) - halfBarThickness);
      } else {
        getWidth = () => barThickness;
        getHeight = (bar) =>
          (yScale(getFirstItem(bar)) ?? NaN) - (yScale(getSecondItem(bar)) ?? NaN);
        getX = (bar) =>
          "bandwidth" in xScale
            ? xScale(getStackValue(bar.data))
            : Math.max((xScale(getStackValue(bar.data)) ?? NaN) - halfBarThickness);
        getY = (bar) => yScale(getSecondItem(bar));
      }

      const barSeries = stackedData.value
        .map((barStack, stackIndex) => {
          const entry = dataRegistry?.get(barStack.key);
          if (!entry) return null;

          const seriesConfig = props.series.find((s) => s.dataKey === barStack.key);
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
            key: barStack.key,
            radius,
            radiusAll,
            radiusBottom,
            radiusLeft,
            radiusRight,
            radiusTop,
            bars: barStack
              .map((bar, index) => {
                const barX = getX(bar);
                if (!isValidNumber(barX)) return null;
                const barY = getY(bar);
                if (!isValidNumber(barY)) return null;
                const barWidth = getWidth(bar);
                if (!isValidNumber(barWidth)) return null;
                const barHeight = getHeight(bar);
                if (!isValidNumber(barHeight)) return null;

                const barSeriesDatum = colorAccessor ? seriesConfig?.data[index] : null;

                return {
                  key: `${stackIndex}-${barStack.key}-${index}`,
                  x: barX,
                  y: barY,
                  width: barWidth,
                  height: barHeight,
                  fill:
                    barSeriesDatum && colorAccessor
                      ? colorAccessor(barSeriesDatum, index)
                      : colorScale(barStack.key),
                };
              })
              .filter((bar) => bar) as Bar[],
          };
        })
        .filter((series) => series);

      const BarsTag = props.BarsComponent as any;

      return (
        <g class="visx-bar-stack">
          {barSeries.map((series) =>
            series
              ? h(BarsTag, {
                  horizontal,
                  xScale,
                  yScale,
                  ...series,
                  ...eventEmitters,
                  key: series.key,
                })
              : null,
          )}
        </g>
      );
    };
  },
});
