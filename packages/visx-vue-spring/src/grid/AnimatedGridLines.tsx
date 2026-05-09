import { defineComponent, type PropType, type CSSProperties } from "vue";
import type { GridScale, GridLines } from "@visx-vue/grid";
import useLineTransitionConfig from "../spring-configs/useLineTransitionConfig";
import type { AnimationTrajectory } from "../types";

export default defineComponent({
  name: "AnimatedGridLines",
  props: {
    lines: { type: Array as PropType<GridLines>, required: true },
    lineKey: { type: Function as PropType<(line: GridLines[number]) => string>, required: true },
    scale: { type: Function as PropType<GridScale>, required: true },
    animateXOrY: { type: String as PropType<"x" | "y">, required: true },
    animationTrajectory: { type: String as PropType<AnimationTrajectory>, default: undefined },
    stroke: { type: String as PropType<string>, default: undefined },
    strokeWidth: { type: [String, Number] as PropType<string | number>, default: undefined },
    lineStyle: { type: Object as PropType<CSSProperties>, default: undefined },
    strokeDasharray: { type: String as PropType<string>, default: undefined },
  },
  setup(props) {
    return () => {
      const config = useLineTransitionConfig({
        scale: props.scale,
        animateXOrY: props.animateXOrY,
        animationTrajectory: props.animationTrajectory,
      });

      return (
        <>
          {props.lines.map((line) => {
            const { fromX, toX, fromY, toY, opacity } = config.enter(line);
            const key = props.lineKey(line);

            return (
              <line
                key={key}
                x1={fromX}
                x2={toX}
                y1={fromY}
                y2={toY}
                stroke={props.stroke}
                stroke-width={props.strokeWidth}
                stroke-opacity={opacity}
                stroke-dasharray={props.strokeDasharray}
                style={props.lineStyle}
              />
            );
          })}
        </>
      );
    };
  },
});
