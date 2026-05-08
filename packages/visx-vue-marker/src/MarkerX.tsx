import { defineComponent, useAttrs, type PropType } from "vue";
import { MarkerCross } from "./MarkerCross";

export const MarkerX = defineComponent({
  name: "MarkerX",
  inheritAttrs: false,
  props: {
    id: { type: String as PropType<string>, required: true },
    size: { type: Number as PropType<number>, default: undefined },
    strokeWidth: { type: Number as PropType<number>, default: undefined },
  },
  setup(props) {
    const attrs = useAttrs();

    return () => (
      <MarkerCross
        orient={45}
        id={props.id}
        size={props.size}
        strokeWidth={props.strokeWidth}
        {...attrs}
      />
    );
  },
});
