import { defineComponent, type PropType } from "vue";
import type { StackOffset, StackOrder } from "@visx-vue/shape";
import type { AxisScale } from "@visx-vue/axis";
import type { SeriesProps } from "../../types";
import BaseBarStack from "./private/BaseBarStack";
import type { BaseBarStackProps, BarStackSeriesConfig } from "./private/BaseBarStack";
import AnimatedBars from "./private/AnimatedBars";

export type AnimatedBarStackProps<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object,
> = Omit<BaseBarStackProps<XScale, YScale, Datum>, "BarsComponent">;

export default defineComponent({
  name: "AnimatedBarStack",
  props: {
    series: {
      type: Array as PropType<BarStackSeriesConfig<AxisScale, AxisScale, object>[]>,
      required: true,
    },
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
    return () => <BaseBarStack {...props} BarsComponent={AnimatedBars} />;
  },
});
