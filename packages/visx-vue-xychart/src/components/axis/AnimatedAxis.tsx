import { defineComponent, useAttrs, type PropType } from "vue";
import { AnimatedAxis as VxAnimatedAxis } from "@visx-vue/spring";
import type { AnimationTrajectory } from "@visx-vue/spring";
import type { BaseAxisProps } from "./BaseAxis";
import BaseAxis from "./BaseAxis";

export type AnimatedAxisProps = Omit<BaseAxisProps, "AxisComponent"> & {
  /** Animation trajectory of axis ticks. */
  animationTrajectory?: AnimationTrajectory;
};

const AnimatedAxis = defineComponent({
  name: "AnimatedAxis",
  inheritAttrs: false,
  props: {
    orientation: { type: String as PropType<"top" | "bottom" | "left" | "right">, required: true },
    animationTrajectory: { type: String as PropType<AnimationTrajectory>, default: undefined },
  },
  setup(props) {
    const attrs = useAttrs();
    return () => (
      <BaseAxis
        AxisComponent={VxAnimatedAxis}
        orientation={props.orientation}
        animationTrajectory={props.animationTrajectory}
        {...attrs}
      />
    );
  },
});

export default AnimatedAxis;
