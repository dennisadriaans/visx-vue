import { defineComponent, computed, inject, type Component, type PropType, type VNode } from "vue";
import type { SeriesPoint } from "@visx-vue/vendor/d3-shape";
import type { StackOffset, StackOrder } from "@visx-vue/shape";
import { LinePath, Area, getFirstItem, getSecondItem } from "@visx-vue/shape";
import { coerceNumber } from "@visx-vue/scale";
import type { CurveFactory } from "@visx-vue/vendor/d3-shape";
import type { AxisScale } from "@visx-vue/axis";
import type { ScaleInput } from "@visx-vue/scale";
import { DataContextKey } from "../../../context/DataContext";
import type {
  CombinedStackData,
  DataContextType,
  GlyphsProps,
  NearestDatumArgs,
  NearestDatumReturnType,
  SeriesProps,
} from "../../../types";
import { BaseGlyphSeries } from "./BaseGlyphSeries";
import useStackedData from "../../../hooks/useStackedData";
import { getStackValue } from "../../../utils/combineBarStackData";
import isValidNumber from "../../../typeguards/isValidNumber";
import findNearestStackDatum from "../../../utils/findNearestStackDatum";
import { AREASTACK_EVENT_SOURCE, XYCHART_EVENT_SOURCE } from "../../../constants";
import useSeriesEvents from "../../../hooks/useSeriesEvents";
import defaultRenderGlyph from "./defaultRenderGlyph";
import getScaleBandwidth from "../../../utils/getScaleBandwidth";

/**
 * Config for an individual series within an AreaStack.
 * Replaces React's children introspection pattern.
 */
export type AreaStackSeriesConfig<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object,
> = {
  dataKey: string;
  data: Datum[];
  xAccessor: (d: Datum) => ScaleInput<XScale>;
  yAccessor: (d: Datum) => ScaleInput<YScale>;
  /** Fill color override for the area. */
  fill?: string;
  /** Additional SVG path props for the area. */
  areaProps?: Record<string, unknown>;
  /** Props to be passed to the Line, if rendered. */
  lineProps?: Record<string, unknown>;
};

export type BaseAreaStackProps<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object,
> = {
  /** Array of series configs — replaces React's children introspection. */
  series: AreaStackSeriesConfig<XScale, YScale, Datum>[];
  /** Rendered component which is passed path props by BaseAreaStack after processing. */
  PathComponent?: Component | "path";
  /** Sets the curve factory for the line generator. */
  curve?: CurveFactory;
  /** Whether to render a Line along value of the Area shape. */
  renderLine?: boolean;
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

const identity = (_: unknown) => _;

export default defineComponent({
  name: "BaseAreaStack",
  props: {
    series: {
      type: Array as PropType<AreaStackSeriesConfig<AxisScale, AxisScale, object>[]>,
      required: true,
    },
    PathComponent: { type: [Object, String] as PropType<Component | "path">, default: "path" },
    curve: { type: Function as PropType<CurveFactory>, default: undefined },
    renderLine: { type: Boolean as PropType<boolean>, default: true },
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
    type AreaStackDatum = SeriesPoint<CombinedStackData<AxisScale, AxisScale>>;

    const dataContext = inject(DataContextKey, {}) as Partial<
      DataContextType<AxisScale, AxisScale, AreaStackDatum>
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
      seriesConfigs: seriesConfigs.value,
      order: props.order,
      offset: props.offset,
    });

    // custom logic to find the nearest AreaStackDatum and return the original Datum
    function findNearestDatum(
      params: NearestDatumArgs<AxisScale, AxisScale, AreaStackDatum>,
    ): NearestDatumReturnType<object> {
      const seriesConfig = props.series.find((s) => s.dataKey === params.dataKey);
      return seriesConfig
        ? findNearestStackDatum(params, seriesConfig.data, dataContext.horizontal)
        : null;
    }

    const ownEventSourceKey = computed(
      () => `${AREASTACK_EVENT_SOURCE}-${dataKeys.value.join("-")}`,
    );

    const eventEmitters = useSeriesEvents({
      dataKey: dataKeys.value,
      enableEvents: props.enableEvents,
      // @ts-expect-error Datum input + return type differ for AreaStack
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

    // render invisible glyphs for focusing if onFocus/onBlur are defined
    const captureFocusEvents = computed(() => Boolean(props.onFocus || props.onBlur));

    function renderGlyphs({ glyphs }: GlyphsProps<AxisScale, AxisScale, AreaStackDatum>) {
      return captureFocusEvents.value
        ? glyphs.map((glyph) =>
            defaultRenderGlyph({
              ...glyph,
              color: "transparent",
              onFocus: eventEmitters.onFocus,
              onBlur: eventEmitters.onBlur,
            }),
          )
        : null;
    }

    return () => {
      const { colorScale, dataRegistry, horizontal, xScale, yScale, theme } = dataContext;

      // if scales and data are not available in the registry, bail
      if (
        dataKeys.value.some((key) => dataRegistry?.get(key) == null) ||
        !xScale ||
        !yScale ||
        !colorScale
      ) {
        return null;
      }

      const xOffset = getScaleBandwidth(xScale) / 2;
      const yOffset = getScaleBandwidth(yScale) / 2;

      const accessors = horizontal
        ? {
            y: (d: AreaStackDatum) => (coerceNumber(yScale(getStackValue(d.data))) ?? 0) + yOffset,
            x0: (d: AreaStackDatum) => (coerceNumber(xScale(getFirstItem(d))) ?? 0) + xOffset,
            x1: (d: AreaStackDatum) => (coerceNumber(xScale(getSecondItem(d))) ?? 0) + xOffset,
            defined: (d: AreaStackDatum) =>
              isValidNumber(yScale(getStackValue(d.data))) &&
              isValidNumber(xScale(getSecondItem(d))),
          }
        : {
            x: (d: AreaStackDatum) => (coerceNumber(xScale(getStackValue(d.data))) ?? 0) + xOffset,
            y0: (d: AreaStackDatum) => (coerceNumber(yScale(getFirstItem(d))) ?? 0) + yOffset,
            y1: (d: AreaStackDatum) => (coerceNumber(yScale(getSecondItem(d))) ?? 0) + yOffset,
            defined: (d: AreaStackDatum) =>
              isValidNumber(xScale(getStackValue(d.data))) &&
              isValidNumber(yScale(getSecondItem(d))),
          };

      // build stacks with area + line props per series
      const stacks = stackedData.value.map((stack, stackIndex) => {
        const seriesConfig = props.series.find((s) => s.dataKey === stack.key);

        const areaProps: Record<string, unknown> = {
          fill: seriesConfig?.fill ?? colorScale?.(stack.key) ?? theme?.colors?.[0] ?? "#222",
          ...seriesConfig?.areaProps,
        };

        return {
          key: `${stackIndex}-${stack.key}`,
          dataKey: stack.key,
          accessors,
          data: stack,
          areaProps,
          lineProps: seriesConfig?.lineProps,
        };
      });

      const PathTag = props.PathComponent as any;

      return (
        <g class="visx-area-stack">
          {stacks.map((stack) => (
            <Area key={stack.key} curve={props.curve} {...(stack.accessors as any)}>
              {{
                default: ({ path }: { path: (data: AreaStackDatum[]) => string | null }) => (
                  <PathTag
                    class="visx-area"
                    stroke="transparent"
                    d={path(stack.data) || ""}
                    {...stack.areaProps}
                    {...eventEmitters}
                  />
                ),
              }}
            </Area>
          ))}
          {props.renderLine &&
            stacks.map((stack) => (
              <LinePath
                key={`line-${stack.key}`}
                x={
                  ((stack.accessors as Record<string, unknown>).x ||
                    (stack.accessors as Record<string, unknown>).x1) as any
                }
                y={
                  ((stack.accessors as Record<string, unknown>).y ||
                    (stack.accessors as Record<string, unknown>).y1) as any
                }
                defined={stack.accessors.defined as any}
                curve={props.curve}
                {...(stack.lineProps || {})}
              >
                {{
                  default: ({ path }: { path: (data: AreaStackDatum[]) => string | null }) => (
                    <PathTag
                      class="visx-line"
                      fill="transparent"
                      stroke={stack.areaProps.fill}
                      stroke-width={2}
                      pointer-events="none"
                      {...(stack.lineProps || {})}
                      d={path(stack.data) || ""}
                    />
                  ),
                }}
              </LinePath>
            ))}
          {captureFocusEvents.value &&
            stacks.map((_, i) => {
              // render in reverse stack order to tab to top-values first
              const stack = stacks[stacks.length - i - 1];
              return (
                <BaseGlyphSeries
                  key={`glyphs-${stack.key}`}
                  dataKey={stack.dataKey}
                  data={stack.data}
                  xAccessor={
                    ((stack.accessors as Record<string, unknown>).x ||
                      (stack.accessors as Record<string, unknown>).x1) as (
                      d: object,
                    ) => ScaleInput<AxisScale>
                  }
                  yAccessor={
                    ((stack.accessors as Record<string, unknown>).y ||
                      (stack.accessors as Record<string, unknown>).y1) as (
                      d: object,
                    ) => ScaleInput<AxisScale>
                  }
                  // accessors include scaling, so just return the scaled value
                  renderGlyphs={
                    renderGlyphs as (
                      p: GlyphsProps<AxisScale, AxisScale, object>,
                    ) => VNode | VNode[] | null
                  }
                />
              );
            })}
        </g>
      );
    };
  },
});
