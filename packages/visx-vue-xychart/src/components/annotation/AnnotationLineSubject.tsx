import { defineComponent, useAttrs, type PropType } from "vue";
import { LineSubject as BaseLineSubject } from "@visx-vue/annotation";
import type { LineSubjectProps } from "@visx-vue/annotation";
import { useDataContext } from "../../context/DataContext";

export type AnnotationLineSubjectProps = Omit<LineSubjectProps, "min" | "max"> & {
  min?: number;
  max?: number;
};

/** AnnotationLineSubject which provides color and dimensions from context. */
const AnnotationLineSubject = defineComponent({
  name: "AnnotationLineSubject",
  inheritAttrs: false,
  props: {
    min: { type: Number as PropType<number>, default: undefined },
    max: { type: Number as PropType<number>, default: undefined },
    orientation: { type: String as PropType<"vertical" | "horizontal">, default: "vertical" },
  },
  setup(props) {
    const attrs = useAttrs();
    const dataContext = useDataContext();

    return () => {
      const { theme, margin, innerHeight = 0, innerWidth = 0 } = dataContext;
      return (
        <BaseLineSubject
          stroke={theme?.axisStyles.x.bottom.axisLine.stroke as string | undefined}
          min={props.min ?? (props.orientation === "horizontal" ? margin?.left : margin?.top) ?? 0}
          max={
            props.max ??
            (props.orientation === "horizontal"
              ? (margin?.left ?? 0) + innerWidth
              : (margin?.top ?? 0) + innerHeight)
          }
          orientation={props.orientation}
          {...attrs}
        />
      );
    };
  },
});

export default AnnotationLineSubject;
