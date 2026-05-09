import { defineComponent, computed, useAttrs, type Component, type PropType } from "vue";
import type { AxisProps as VxAxisProps, TickLabelProps } from "@visx-vue/axis";
import type { ScaleInput } from "@visx-vue/scale";
import { useDataContext } from "../../context/DataContext";
import type { AxisScale } from "../../types/axis";

export type BaseAxisProps = Omit<VxAxisProps<AxisScale>, "scale" | "orientation"> & {
  /** Required axis orientation. */
  orientation: "top" | "bottom" | "left" | "right";
} & {
  /** Rendered component which is passed VxAxisProps by BaseAxis after processing. */
  AxisComponent: Component;
};

/**
 * Component which handles all xychart-specific logic for axes,
 * and passes processed props to a specified Axis / AnimatedAxis component.
 */
const BaseAxis = defineComponent({
  name: "BaseAxis",
  inheritAttrs: false,
  props: {
    AxisComponent: { type: [Object, Function] as PropType<Component>, required: true },
    orientation: { type: String as PropType<"top" | "bottom" | "left" | "right">, required: true },
    tickLabelProps: {
      type: [Function, Object] as PropType<
        TickLabelProps<ScaleInput<AxisScale>> | Record<string, unknown>
      >,
      default: undefined,
    },
    labelProps: { type: Object as PropType<Record<string, unknown>>, default: undefined },
    stroke: { type: String as PropType<string>, default: undefined },
    strokeWidth: { type: [Number, String] as PropType<number | string>, default: undefined },
    tickLength: { type: Number as PropType<number>, default: undefined },
    tickStroke: { type: String as PropType<string>, default: undefined },
    top: { type: Number as PropType<number>, default: undefined },
    left: { type: Number as PropType<number>, default: undefined },
    label: { type: String as PropType<string>, default: undefined },
    numTicks: { type: Number as PropType<number>, default: undefined },
    hideAxisLine: { type: Boolean as PropType<boolean>, default: undefined },
    hideTicks: { type: Boolean as PropType<boolean>, default: undefined },
    hideZero: { type: Boolean as PropType<boolean>, default: undefined },
    rangePadding: {
      type: [Number, Object] as PropType<number | { start?: number; end?: number }>,
      default: undefined,
    },
    tickFormat: {
      type: Function as PropType<
        (
          value: ScaleInput<AxisScale>,
          index: number,
          values: { value: ScaleInput<AxisScale>; index: number }[],
        ) => string
      >,
      default: undefined,
    },
    tickValues: { type: Array as PropType<ScaleInput<AxisScale>[]>, default: undefined },
    animationTrajectory: { type: String as PropType<string>, default: undefined },
  },
  setup(props) {
    const attrs = useAttrs();
    const dataContext = useDataContext();

    const axisStyles = computed(() => {
      const { theme } = dataContext;
      const { orientation } = props;
      return orientation === "left" || orientation === "right"
        ? theme?.axisStyles?.y?.[orientation]
        : theme?.axisStyles?.x?.[orientation];
    });

    const tickLabelPropsComputed = computed<TickLabelProps<ScaleInput<AxisScale>> | undefined>(
      () => {
        const { orientation } = props;
        const { margin } = dataContext;
        const styles = axisStyles.value;
        const maybeTickLabelProps = props.tickLabelProps;

        if (!maybeTickLabelProps && !styles) return undefined;

        return ((
          value: ScaleInput<AxisScale>,
          index: number,
          values: { value: ScaleInput<AxisScale>; index: number }[],
        ) => ({
          ...styles?.tickLabel,
          width:
            orientation === "left" || orientation === "right" ? margin?.[orientation] : undefined,
          ...(typeof maybeTickLabelProps === "function"
            ? maybeTickLabelProps(value, index, values)
            : maybeTickLabelProps),
        })) as TickLabelProps<ScaleInput<AxisScale>>;
      },
    );

    return () => {
      const { xScale, yScale, margin, width, height } = dataContext;
      const { orientation } = props;

      const topOffset =
        orientation === "bottom"
          ? (height ?? 0) - (margin?.bottom ?? 0)
          : orientation === "top"
            ? (margin?.top ?? 0)
            : 0;
      const leftOffset =
        orientation === "left"
          ? (margin?.left ?? 0)
          : orientation === "right"
            ? (width ?? 0) - (margin?.right ?? 0)
            : 0;

      const scale = (orientation === "left" || orientation === "right" ? yScale : xScale) as
        | AxisScale
        | undefined;

      if (!scale) return null;

      const styles = axisStyles.value;
      const AxisComp = props.AxisComponent as any;

      return (
        <AxisComp
          top={props.top ?? topOffset}
          left={props.left ?? leftOffset}
          labelProps={props.labelProps ?? styles?.axisLabel}
          stroke={props.stroke ?? (styles?.axisLine?.stroke as string | undefined)}
          strokeWidth={props.strokeWidth ?? styles?.axisLine?.strokeWidth}
          tickLength={props.tickLength ?? styles?.tickLength}
          tickStroke={props.tickStroke ?? (styles?.tickLine?.stroke as string | undefined)}
          label={props.label}
          numTicks={props.numTicks}
          hideAxisLine={props.hideAxisLine}
          hideTicks={props.hideTicks}
          hideZero={props.hideZero}
          rangePadding={props.rangePadding}
          tickFormat={props.tickFormat}
          tickValues={props.tickValues}
          animationTrajectory={props.animationTrajectory}
          tickLabelProps={tickLabelPropsComputed.value}
          scale={scale}
          orientation={orientation}
          {...attrs}
        />
      );
    };
  },
});

export default BaseAxis;
