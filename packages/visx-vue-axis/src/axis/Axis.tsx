import { defineComponent, useSlots, type PropType, type VNode } from "vue";
import { Group } from "@visx-vue/group";
import { getTicks, coerceNumber } from "@visx-vue/scale";
import type {
  SharedAxisProps,
  AxisScale,
  AxisRendererProps,
  TickFormatter,
  TickLabelProps,
  TickRendererProps,
  TicksRendererProps,
} from "../types";
import AxisRenderer from "./AxisRenderer";
import getTickPosition from "../utils/getTickPosition";
import getTickFormatter from "../utils/getTickFormatter";
import createPoint from "../utils/createPoint";
import type { OrientationType } from "../constants/orientation";
import Orientation from "../constants/orientation";
import getAxisRangePaddingConfig from "../utils/getAxisRangePaddingConfig";
import type { TextProps } from "@visx-vue/text";

export type AxisProps<Scale extends AxisScale> = SharedAxisProps<Scale> & {
  orientation?: OrientationType;
};

export const Axis = defineComponent({
  name: "Axis",
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
    labelOffset: { type: Number as PropType<number>, default: 14 },
    labelProps: { type: Object as PropType<Partial<TextProps>>, default: undefined },
    left: { type: Number as PropType<number>, default: 0 },
    numTicks: { type: Number as PropType<number>, default: 10 },
    orientation: { type: String as PropType<OrientationType>, default: Orientation.bottom },
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
      const format = props.tickFormat ?? getTickFormatter(props.scale);

      const isLeft = props.orientation === Orientation.left;
      const isTop = props.orientation === Orientation.top;
      const horizontal = isTop || props.orientation === Orientation.bottom;

      const tickPosition = getTickPosition(props.scale);
      const tickSign = isLeft || isTop ? -1 : 1;

      const range = props.scale.range();
      const rangePaddingConfig = getAxisRangePaddingConfig(props.rangePadding);

      const axisFromPoint = createPoint(
        { x: Number(range[0]) + 0.5 - rangePaddingConfig.start, y: 0 },
        horizontal,
      );
      const axisToPoint = createPoint(
        { x: Number(range[range.length - 1]) + 0.5 + rangePaddingConfig.end, y: 0 },
        horizontal,
      );

      const filteredTickValues = (props.tickValues ?? getTicks(props.scale, props.numTicks))
        .filter((value) => !props.hideZero || (value !== 0 && value !== "0"))
        .map((value, index) => ({ value, index }));

      const ticks = filteredTickValues.map(({ value, index }) => {
        const scaledValue = coerceNumber(tickPosition(value));

        return {
          value,
          index,
          from: createPoint({ x: scaledValue, y: 0 }, horizontal),
          to: createPoint({ x: scaledValue, y: props.tickLength * tickSign }, horizontal),
          formattedValue: format(value, index, filteredTickValues),
        };
      });

      const renderProps: AxisRendererProps<AxisScale> = {
        axisFromPoint,
        axisLineClassName: props.axisLineClassName,
        axisToPoint,
        hideAxisLine: props.hideAxisLine,
        hideTicks: props.hideTicks,
        hideZero: props.hideZero,
        horizontal,
        label: props.label,
        labelClassName: props.labelClassName,
        labelOffset: props.labelOffset,
        labelProps: props.labelProps,
        numTicks: props.numTicks,
        orientation: props.orientation,
        rangePadding: props.rangePadding,
        scale: props.scale,
        stroke: props.stroke,
        strokeWidth: props.strokeWidth,
        strokeDasharray: props.strokeDasharray,
        tickClassName: props.tickClassName,
        tickComponent: props.tickComponent,
        ticksComponent: props.ticksComponent,
        tickFormat: format,
        tickLabelProps: props.tickLabelProps,
        tickLength: props.tickLength,
        tickLineProps: props.tickLineProps,
        tickStroke: props.tickStroke,
        tickTransform: props.tickTransform,
        tickPosition,
        tickSign: tickSign as 1 | -1,
        ticks,
      };

      return (
        <Group
          className={["visx-axis", props.axisClassName].filter(Boolean).join(" ")}
          innerRef={props.innerRef}
          top={props.top}
          left={props.left}
        >
          {{
            default: () =>
              slots.default ? (slots.default as any)(renderProps) : AxisRenderer(renderProps),
          }}
        </Group>
      );
    };
  },
});

export default Axis;
