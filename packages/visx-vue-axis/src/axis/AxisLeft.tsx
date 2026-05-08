import { defineComponent, useSlots, type PropType } from "vue";
import { Axis } from "./Axis";
import Orientation from "../constants/orientation";
import type { AxisScale, TickLabelProps, TickFormatter } from "../types";
import type { TextProps } from "@visx-vue/text";
import type { TickRendererProps, TicksRendererProps } from "../types";
import type { VNode } from "vue";

export const leftTickLabelProps = {
  dx: "-0.25em",
  dy: "0.25em",
  fill: "#222",
  fontFamily: "Arial",
  fontSize: 10,
  textAnchor: "end",
} as const;

export const AxisLeft = defineComponent({
  name: "AxisLeft",
  inheritAttrs: false,
  props: {
    axisClassName: { type: String as PropType<string>, default: undefined },
    axisLineClassName: { type: String as PropType<string>, default: undefined },
    hideAxisLine: { type: Boolean as PropType<boolean>, default: false },
    hideTicks: { type: Boolean as PropType<boolean>, default: false },
    hideZero: { type: Boolean as PropType<boolean>, default: false },
    innerRef: { type: Object as PropType<{ value: SVGGElement | null }>, default: undefined },
    label: { type: String as PropType<string>, default: undefined },
    labelClassName: { type: String as PropType<string>, default: undefined },
    labelOffset: { type: Number as PropType<number>, default: 36 },
    labelProps: { type: Object as PropType<Partial<TextProps>>, default: undefined },
    left: { type: Number as PropType<number>, default: 0 },
    numTicks: { type: Number as PropType<number>, default: 10 },
    rangePadding: {
      type: [Number, Object] as PropType<number | { start?: number; end?: number }>,
      default: 0,
    },
    scale: { type: Function as PropType<AxisScale>, required: true },
    stroke: { type: String as PropType<string>, default: undefined },
    strokeWidth: { type: [Number, String] as PropType<number | string>, default: undefined },
    strokeDasharray: { type: String as PropType<string>, default: undefined },
    tickClassName: { type: String as PropType<string>, default: undefined },
    tickComponent: {
      type: Function as PropType<(tickRendererProps: TickRendererProps) => VNode | VNode[] | null>,
      default: undefined,
    },
    ticksComponent: {
      type: Function as PropType<
        (tickRendererProps: TicksRendererProps<AxisScale>) => VNode | VNode[] | null
      >,
      default: undefined,
    },
    tickFormat: { type: Function as PropType<TickFormatter<unknown>>, default: undefined },
    tickLabelProps: {
      type: [Object, Function] as PropType<TickLabelProps<unknown>>,
      default: undefined,
    },
    tickLength: { type: Number as PropType<number>, default: 8 },
    tickLineProps: { type: Object as PropType<Record<string, unknown>>, default: undefined },
    tickStroke: { type: String as PropType<string>, default: undefined },
    tickTransform: { type: String as PropType<string>, default: undefined },
    tickValues: { type: Array as PropType<unknown[]>, default: undefined },
    top: { type: Number as PropType<number>, default: 0 },
  },
  setup(props) {
    const slots = useSlots();

    return () => {
      const tickLabelPropsFinal: TickLabelProps<unknown> =
        typeof props.tickLabelProps === "function"
          ? props.tickLabelProps
          : {
              ...leftTickLabelProps,
              ...props.tickLabelProps,
            };

      const axisProps = {
        ...props,
        axisClassName: ["visx-axis-left", props.axisClassName].filter(Boolean).join(" "),
        labelOffset: props.labelOffset,
        orientation: Orientation.left,
        tickLabelProps: tickLabelPropsFinal,
        tickLength: props.tickLength,
      };

      return slots.default ? (
        <Axis {...axisProps}>{{ default: (scope: any) => (slots.default as any)(scope) }}</Axis>
      ) : (
        <Axis {...axisProps} />
      );
    };
  },
});

export default AxisLeft;
