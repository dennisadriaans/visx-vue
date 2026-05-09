import { defineComponent, type PropType } from "vue";
import type { CurveFactory } from "@visx-vue/vendor/d3-shape";
import type { AxisScale } from "@visx-vue/axis";
import type { StackOffset, StackOrder } from "@visx-vue/shape";
import type { SeriesProps } from "../../types";
import BaseAreaStack from "./private/BaseAreaStack";
import type { AreaStackSeriesConfig } from "./private/BaseAreaStack";
import AnimatedPath from "./private/AnimatedPath";

export default defineComponent({
  name: "AnimatedAreaStack",
  props: {
    series: {
      type: Array as PropType<AreaStackSeriesConfig<AxisScale, AxisScale, object>[]>,
      required: true,
    },
    curve: { type: Function as PropType<CurveFactory>, default: undefined },
    renderLine: { type: Boolean as PropType<boolean>, default: false },
    order: { type: [Function, String] as PropType<StackOrder>, default: undefined },
    offset: { type: [Function, String] as PropType<StackOffset>, default: undefined },
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
    return () => (
      <BaseAreaStack
        series={props.series}
        PathComponent={AnimatedPath}
        curve={props.curve}
        renderLine={props.renderLine}
        order={props.order}
        offset={props.offset}
        enableEvents={props.enableEvents}
        onPointerMove={props.onPointerMove}
        onPointerOut={props.onPointerOut}
        onPointerUp={props.onPointerUp}
        onPointerDown={props.onPointerDown}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
      />
    );
  },
});
