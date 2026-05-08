import { defineComponent, useSlots, type PropType } from "vue";
import {
  Annotation as VisxAnnotation,
  EditableAnnotation as VisxEditableAnnotation,
} from "@visx-vue/annotation";
import type { BaseAnnotationProps } from "./private/BaseAnnotation";
import BaseAnnotation from "./private/BaseAnnotation";

export type AnnotationProps = { editable?: boolean } & Omit<
  BaseAnnotationProps,
  "AnnotationComponent"
>;

const Annotation = defineComponent({
  name: "XYChartAnnotation",
  props: {
    editable: { type: Boolean as PropType<boolean>, default: false },
    dataKey: { type: String as PropType<string>, default: undefined },
    datum: { type: Object as PropType<object>, required: true },
    xAccessor: { type: Function as PropType<BaseAnnotationProps["xAccessor"]>, default: undefined },
    yAccessor: { type: Function as PropType<BaseAnnotationProps["yAccessor"]>, default: undefined },
    dx: { type: Number as PropType<number>, default: 0 },
    dy: { type: Number as PropType<number>, default: 0 },
    canEditLabel: { type: Boolean as PropType<boolean>, default: undefined },
    canEditSubject: { type: Boolean as PropType<boolean>, default: undefined },
    onDragEnd: { type: Function as PropType<BaseAnnotationProps["onDragEnd"]>, default: undefined },
    onDragMove: {
      type: Function as PropType<BaseAnnotationProps["onDragMove"]>,
      default: undefined,
    },
    onDragStart: {
      type: Function as PropType<BaseAnnotationProps["onDragStart"]>,
      default: undefined,
    },
  },
  setup(props) {
    const slots = useSlots();

    return () => (
      <BaseAnnotation
        AnnotationComponent={props.editable ? VisxEditableAnnotation : VisxAnnotation}
        dataKey={props.dataKey}
        datum={props.datum}
        xAccessor={props.xAccessor}
        yAccessor={props.yAccessor}
        dx={props.dx}
        dy={props.dy}
        canEditLabel={props.canEditLabel}
        canEditSubject={props.canEditSubject}
        onDragEnd={props.onDragEnd}
        onDragMove={props.onDragMove}
        onDragStart={props.onDragStart}
      >
        {slots.default?.()}
      </BaseAnnotation>
    );
  },
});

export default Annotation;
