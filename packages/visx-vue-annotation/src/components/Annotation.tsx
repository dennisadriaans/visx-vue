import { defineComponent, computed, useSlots, type PropType } from "vue";
import type { AnnotationContextType } from "../types";
import { provideAnnotationContext } from "../context";

export type AnnotationProps = Pick<AnnotationContextType, "x" | "y" | "dx" | "dy">;

export const Annotation = defineComponent({
  name: "Annotation",
  props: {
    x: { type: Number as PropType<number>, default: undefined },
    y: { type: Number as PropType<number>, default: undefined },
    dx: { type: Number as PropType<number>, default: undefined },
    dy: { type: Number as PropType<number>, default: undefined },
  },
  setup(props) {
    const slots = useSlots();

    const value = computed(() => ({
      x: props.x,
      y: props.y,
      dx: props.dx,
      dy: props.dy,
    }));

    provideAnnotationContext(value);

    return () => <>{slots.default?.()}</>;
  },
});

export default Annotation;
