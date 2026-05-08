import { defineComponent, h, type PropType, type CSSProperties } from "vue";
import { GridColumns } from "@visx-vue/grid";
import type { GridScale, GridLines } from "@visx-vue/grid";
import AnimatedGridLines from "./AnimatedGridLines";
import type { AnimationTrajectory } from "../types";

export default defineComponent({
  name: "AnimatedGridColumns",
  props: {
    scale: { type: Function as PropType<GridScale>, required: true },
    height: { type: Number as PropType<number>, required: true },
    numTicks: { type: Number as PropType<number>, default: undefined },
    tickValues: { type: Array as PropType<unknown[]>, default: undefined },
    offset: { type: Number as PropType<number>, default: undefined },
    className: { type: String as PropType<string>, default: undefined },
    animationTrajectory: { type: String as PropType<AnimationTrajectory>, default: undefined },
    top: { type: Number as PropType<number>, default: undefined },
    left: { type: Number as PropType<number>, default: undefined },
    stroke: { type: String as PropType<string>, default: undefined },
    strokeWidth: { type: [String, Number] as PropType<string | number>, default: undefined },
    strokeDasharray: { type: String as PropType<string>, default: undefined },
    lineStyle: { type: Object as PropType<CSSProperties>, default: undefined },
  },
  setup(props) {
    return () => {
      return h(
        GridColumns,
        {
          scale: props.scale,
          height: props.height,
          numTicks: props.numTicks,
          tickValues: props.tickValues,
          className: props.className,
          offset: props.offset,
          top: props.top,
          left: props.left,
        },
        {
          default: ({ lines }: { lines: GridLines }) =>
            h(AnimatedGridLines, {
              scale: props.scale,
              lines,
              animationTrajectory: props.animationTrajectory,
              animateXOrY: "x",
              lineKey: (line: GridLines[number]) => `column-${line?.from?.x ?? ""}-${line.index}`,
              stroke: props.stroke,
              strokeWidth: props.strokeWidth,
              strokeDasharray: props.strokeDasharray,
              lineStyle: props.lineStyle,
            }),
        },
      );
    };
  },
});
