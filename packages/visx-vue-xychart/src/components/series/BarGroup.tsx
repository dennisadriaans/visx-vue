import { defineComponent, type PropType } from "vue";
import type { AxisScale } from "@visx-vue/axis";
import type { ScaleInput } from "@visx-vue/scale";
import type { SeriesProps } from "../../types";
import BaseBarGroup from "./private/BaseBarGroup";
import type { BaseBarGroupProps, BarGroupSeriesConfig } from "./private/BaseBarGroup";
import Bars from "./private/Bars";

export type BarGroupProps<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object,
> = Omit<BaseBarGroupProps<XScale, YScale, Datum>, "BarsComponent">;

export default defineComponent({
  name: "BarGroup",
  props: {
    series: {
      type: Array as PropType<BarGroupSeriesConfig<AxisScale, AxisScale, object>[]>,
      required: true,
    },
    padding: { type: Number as PropType<number>, default: 0.1 },
    sortBars: { type: Function as PropType<(a: string, b: string) => number>, default: undefined },
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
    return () => <BaseBarGroup {...props} BarsComponent={Bars} />;
  },
});
