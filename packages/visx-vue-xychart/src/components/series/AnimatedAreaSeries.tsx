import { defineComponent, type PropType } from "vue";
import type { CurveFactory } from "@visx-vue/vendor/d3-shape";
import type { AxisScale } from "@visx-vue/axis";
import type { ScaleInput } from "@visx-vue/scale";
import type { SeriesProps } from "../../types";
import BaseAreaSeries from "./private/BaseAreaSeries";
import type { BaseAreaSeriesProps } from "./private/BaseAreaSeries";
import AnimatedPath from "./private/AnimatedPath";

export type AnimatedAreaSeriesProps<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object,
> = Omit<BaseAreaSeriesProps<XScale, YScale, Datum>, "PathComponent">;

export default defineComponent({
  name: "AnimatedAreaSeries",
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
    return () => <BaseAreaSeries {...props} PathComponent={AnimatedPath} />;
  },
});
