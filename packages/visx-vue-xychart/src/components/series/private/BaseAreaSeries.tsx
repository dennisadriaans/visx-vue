import {
  defineComponent,
  computed,
  inject,
  watchEffect,
  type Component,
  type PropType,
  type VNode,
} from "vue";
import { Area, LinePath } from "@visx-vue/shape";
import type { CurveFactory } from "@visx-vue/vendor/d3-shape";
import type { AxisScale } from "@visx-vue/axis";
import type { ScaleInput } from "@visx-vue/scale";
import { DataContextKey } from "../../../context/DataContext";
import type { DataContextType, GlyphsProps, SeriesProps } from "../../../types";
import getScaledValueFactory from "../../../utils/getScaledValueFactory";
import getScaleBaseline from "../../../utils/getScaleBaseline";
import isValidNumber from "../../../typeguards/isValidNumber";
import { AREASERIES_EVENT_SOURCE, XYCHART_EVENT_SOURCE } from "../../../constants";
import { BaseGlyphSeries } from "./BaseGlyphSeries";
import defaultRenderGlyph from "./defaultRenderGlyph";
import useSeriesEvents from "../../../hooks/useSeriesEvents";

export type BaseAreaSeriesProps<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object,
> = SeriesProps<XScale, YScale, Datum> & {
  /** Optional accessor to override the baseline value of Area shapes per datum when chart is horizontal. */
  x0Accessor?: SeriesProps<XScale, YScale, Datum>["xAccessor"];
  /** Optional accessor to override the baseline value of Area shapes per datum. */
  y0Accessor?: SeriesProps<XScale, YScale, Datum>["yAccessor"];
  /** Whether to render a Line along value of the Area shape (area is fill only). */
  renderLine?: boolean;
  /** Sets the curve factory for the line generator. */
  curve?: CurveFactory;
  /** Props to be passed to the Line, if rendered. */
  lineProps?: Record<string, unknown>;
  /** Rendered component which is passed path props by BaseAreaSeries after processing. */
  PathComponent?: Component | "path";
  /** Given a datakey, returns its color. */
  colorAccessor?: (dataKey: string) => string | undefined | null;
};

export default defineComponent({
  name: "BaseAreaSeries",
  props: {
    dataKey: { type: String as PropType<string>, required: true },
    data: { type: Array as PropType<object[]>, required: true },
    xAccessor: { type: Function as PropType<(d: object) => ScaleInput<AxisScale>>, required: true },
    yAccessor: { type: Function as PropType<(d: object) => ScaleInput<AxisScale>>, required: true },
    x0Accessor: {
      type: Function as PropType<(d: object) => ScaleInput<AxisScale>>,
      default: undefined,
    },
    y0Accessor: {
      type: Function as PropType<(d: object) => ScaleInput<AxisScale>>,
      default: undefined,
    },
    colorAccessor: {
      type: Function as PropType<(dataKey: string) => string | undefined | null>,
      default: undefined,
    },
    curve: { type: Function as PropType<CurveFactory>, default: undefined },
    lineProps: { type: Object as PropType<Record<string, unknown>>, default: undefined },
    PathComponent: { type: [Object, String] as PropType<Component | "path">, default: "path" },
    renderLine: { type: Boolean as PropType<boolean>, default: true },
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

    const ownEventSourceKey = computed(() => `${AREASERIES_EVENT_SOURCE}-${props.dataKey}`);

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
      const getScaledX0 = props.x0Accessor
        ? getScaledValueFactory(xScale, props.x0Accessor)
        : undefined;
      const getScaledY0 = props.y0Accessor
        ? getScaledValueFactory(yScale, props.y0Accessor)
        : undefined;
      const isDefined = (d: object) =>
        isValidNumber(xScale(xAccessor(d))) && isValidNumber(yScale(yAccessor(d)));
      const color = colorScale?.(props.dataKey) ?? theme?.colors?.[0] ?? "#222";

      const numericScaleBaseline = getScaleBaseline(horizontal ? xScale : yScale);
      const accessors = horizontal
        ? {
            x0: getScaledX0 ?? numericScaleBaseline,
            x1: getScaledX,
            y: getScaledY,
          }
        : {
            x: getScaledX,
            y0: getScaledY0 ?? numericScaleBaseline,
            y1: getScaledY,
          };

      const PathTag = props.PathComponent as any;
      const captureFocusEvents = Boolean(props.onFocus || props.onBlur);

      const renderGlyphs = ({ glyphs }: GlyphsProps<AxisScale, AxisScale, object>) =>
        captureFocusEvents
          ? glyphs.map((glyph) =>
              defaultRenderGlyph({
                ...glyph,
                color: "transparent",
                onFocus: eventEmitters.onFocus,
                onBlur: eventEmitters.onBlur,
              }),
            )
          : null;

      return (
        <>
          <Area {...(accessors as any)} curve={props.curve} defined={isDefined as any}>
            {{
              default: ({ path }: { path: (data: object[]) => string | null }) => (
                <PathTag
                  class="visx-area"
                  stroke="transparent"
                  fill={color}
                  stroke-linecap="round"
                  d={path(data) || ""}
                  {...eventEmitters}
                />
              ),
            }}
          </Area>
          {props.renderLine && (
            <LinePath
              x={getScaledX as any}
              y={getScaledY as any}
              defined={isDefined as any}
              curve={props.curve}
              {...(props.lineProps || {})}
            >
              {{
                default: ({ path }: { path: (data: object[]) => string | null }) => (
                  <PathTag
                    class="visx-line"
                    fill="transparent"
                    stroke={color}
                    stroke-width={2}
                    pointer-events="none"
                    stroke-linecap="round"
                    {...(props.lineProps || {})}
                    d={path(data) || ""}
                  />
                ),
              }}
            </LinePath>
          )}
          {captureFocusEvents && (
            <BaseGlyphSeries
              dataKey={props.dataKey}
              data={data}
              xAccessor={xAccessor}
              yAccessor={yAccessor}
              renderGlyphs={renderGlyphs}
            />
          )}
        </>
      );
    };
  },
});
