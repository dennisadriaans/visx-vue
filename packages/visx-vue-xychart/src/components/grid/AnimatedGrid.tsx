import { defineComponent, useAttrs, type PropType, h } from "vue";
import { AnimatedGridRows, AnimatedGridColumns } from "@visx-vue/spring";
import type { AnimationTrajectory } from "@visx-vue/spring";
import type { BaseGridProps } from "./BaseGrid";
import BaseGrid from "./BaseGrid";

export type AnimatedGridProps = Omit<
  BaseGridProps,
  "GridRowsComponent" | "GridColumnsComponent"
> & {
  /** Animation trajectory of grid lines. */
  animationTrajectory?: AnimationTrajectory;
};

const AnimatedGrid = defineComponent({
  name: "AnimatedGrid",
  inheritAttrs: false,
  props: {
    animationTrajectory: { type: String as PropType<AnimationTrajectory>, default: undefined },
    rows: { type: Boolean as PropType<boolean>, default: true },
    columns: { type: Boolean as PropType<boolean>, default: true },
  },
  setup(props) {
    const attrs = useAttrs();

    // Create wrapper components that pass animationTrajectory through
    const RowsComponent = defineComponent({
      name: "AnimatedGridRowsWrapper",
      inheritAttrs: false,
      setup() {
        const innerAttrs = useAttrs();
        return () =>
          h(AnimatedGridRows as any, {
            animationTrajectory: props.animationTrajectory,
            ...innerAttrs,
          });
      },
    });

    const ColumnsComponent = defineComponent({
      name: "AnimatedGridColumnsWrapper",
      inheritAttrs: false,
      setup() {
        const innerAttrs = useAttrs();
        return () =>
          h(AnimatedGridColumns as any, {
            animationTrajectory: props.animationTrajectory,
            ...innerAttrs,
          });
      },
    });

    return () => (
      <BaseGrid
        GridRowsComponent={RowsComponent}
        GridColumnsComponent={ColumnsComponent}
        rows={props.rows}
        columns={props.columns}
        {...attrs}
      />
    );
  },
});

export default AnimatedGrid;
