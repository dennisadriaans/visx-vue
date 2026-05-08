import { defineComponent, type PropType, type VNode } from "vue";
import { Orientation } from "@visx-vue/axis";
import type { ComputedTick, TicksRendererProps, AxisScale } from "@visx-vue/axis";
import { Text } from "@visx-vue/text";
import useLineTransitionConfig from "../spring-configs/useLineTransitionConfig";
import type { AnimationTrajectory } from "../types";

export default defineComponent({
  name: "AnimatedTicks",
  props: {
    hideTicks: { type: Boolean as PropType<boolean>, default: false },
    horizontal: { type: Boolean as PropType<boolean>, default: false },
    orientation: { type: String as PropType<string>, default: "bottom" },
    scale: { type: Function as PropType<AxisScale>, required: true },
    tickClassName: { type: String as PropType<string>, default: undefined },
    tickComponent: {
      type: Function as PropType<(props: any) => VNode | VNode[] | null>,
      default: undefined,
    },
    tickLabelProps: { type: Array as PropType<Record<string, unknown>[]>, default: () => [] },
    tickStroke: { type: String as PropType<string>, default: "#222" },
    tickTransform: { type: String as PropType<string>, default: undefined },
    ticks: { type: Array as PropType<ComputedTick<AxisScale>[]>, default: () => [] },
    tickLineProps: { type: Object as PropType<Record<string, unknown>>, default: undefined },
    strokeWidth: { type: [String, Number] as PropType<string | number>, default: undefined },
    animationTrajectory: { type: String as PropType<AnimationTrajectory>, default: undefined },
  },
  setup(props) {
    return () => {
      // Compute transition config for enter positions
      const config = useLineTransitionConfig({
        scale: props.scale,
        animateXOrY: props.horizontal ? "x" : "y",
        animationTrajectory: props.animationTrajectory,
      });

      return (
        <>
          {props.ticks.map((item, index) => {
            if (item == null) return null;

            // Use enter/update positions (final positions) for rendering
            const { fromX, toX, fromY, toY, opacity } = config.enter(item);
            const tickLabelProps = props.tickLabelProps[index] ?? props.tickLabelProps[0] ?? {};

            return (
              <g
                key={`tick-${item.value}-${item.index}`}
                class={["visx-axis-tick", props.tickClassName]}
                transform={props.tickTransform}
              >
                {!props.hideTicks && (
                  <line
                    x1={fromX}
                    x2={toX}
                    y1={fromY}
                    y2={toY}
                    stroke={props.tickStroke}
                    stroke-linecap="square"
                    stroke-opacity={opacity}
                    {...(props.tickLineProps || {})}
                  />
                )}
                <g
                  transform={`translate(${toX ?? 0},${
                    (toY ?? 0) +
                    (props.orientation === Orientation.bottom &&
                    typeof tickLabelProps.fontSize === "number"
                      ? ((tickLabelProps.fontSize as number) ?? 10)
                      : 0)
                  })`}
                  opacity={opacity}
                >
                  {props.tickComponent ? (
                    props.tickComponent({
                      ...tickLabelProps,
                      x: toX,
                      y: toY,
                      formattedValue: item.formattedValue,
                    })
                  ) : (
                    <Text {...tickLabelProps}>{item.formattedValue}</Text>
                  )}
                </g>
              </g>
            );
          })}
        </>
      );
    };
  },
});
