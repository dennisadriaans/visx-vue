import { defineComponent, type PropType } from "vue";
import type { AxisScale } from "@visx-vue/axis";
import type { ScaleInput } from "@visx-vue/scale";
import type { SeriesProps } from "../../types";
import BaseBarSeries from "./private/BaseBarSeries";
import type { BaseBarSeriesProps } from "./private/BaseBarSeries";
import Bars from "./private/Bars";

export type BarSeriesProps<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object,
> = Omit<BaseBarSeriesProps<XScale, YScale, Datum>, "BarsComponent">;

export default defineComponent({
  name: "BarSeries",
  props: {
    dataKey: { type: String as PropType<string>, required: true },
    data: { type: Array as PropType<object[]>, required: true },
    xAccessor: { type: Function as PropType<(d: object) => ScaleInput<AxisScale>>, required: true },
    yAccessor: { type: Function as PropType<(d: object) => ScaleInput<AxisScale>>, required: true },
    colorAccessor: {
      type: Function as PropType<(d: object, index: number) => string | null | undefined>,
      default: undefined,
    },
    barPadding: { type: Number as PropType<number>, default: 0.1 },
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
    return () => <BaseBarSeries {...props} BarsComponent={Bars} />;
  },
});
