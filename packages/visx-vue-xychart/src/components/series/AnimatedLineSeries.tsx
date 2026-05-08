import { defineComponent, type PropType } from "vue";
import type { CurveFactory, CurveFactoryLineOnly } from "@visx-vue/vendor/d3-shape";
import type { AxisScale } from "@visx-vue/axis";
import type { ScaleInput } from "@visx-vue/scale";
import type { SeriesProps } from "../../types";
import BaseLineSeries from "./private/BaseLineSeries";
import type { BaseLineSeriesProps } from "./private/BaseLineSeries";
import AnimatedPath from "./private/AnimatedPath";

export type AnimatedLineSeriesProps<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object,
> = Omit<BaseLineSeriesProps<XScale, YScale, Datum>, "PathComponent">;

export default defineComponent({
  name: "AnimatedLineSeries",
  props: {
    dataKey: { type: String as PropType<string>, required: true },
    data: { type: Array as PropType<object[]>, required: true },
    xAccessor: { type: Function as PropType<(d: object) => ScaleInput<AxisScale>>, required: true },
    yAccessor: { type: Function as PropType<(d: object) => ScaleInput<AxisScale>>, required: true },
    colorAccessor: {
      type: Function as PropType<(dataKey: string) => string | undefined | null>,
      default: undefined,
    },
    curve: { type: Function as PropType<CurveFactory | CurveFactoryLineOnly>, default: undefined },
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
    return () => <BaseLineSeries {...props} PathComponent={AnimatedPath} />;
  },
});
