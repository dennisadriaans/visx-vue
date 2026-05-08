import { defineComponent, ref, useSlots, watchEffect, type Component, type PropType } from "vue";
import {
  Annotation as VisxAnnotation,
  EditableAnnotation as VisxEditableAnnotation,
} from "@visx-vue/annotation";
import type { BaseAnnotationProps } from "./private/BaseAnnotation";
import BaseAnnotation from "./private/BaseAnnotation";

/**
 * Internal component that wraps an Annotation and animates x/y position changes
 * via a CSS transition on a wrapping <g> element.
 */
const BaseAnimatedAnnotation = defineComponent({
  name: "BaseAnimatedAnnotation",
  props: {
    AnnotationComponent: { type: [Object, Function] as PropType<Component>, required: true },
    x: { type: Number as PropType<number>, default: 0 },
    y: { type: Number as PropType<number>, default: 0 },
  },
  setup(props) {
    const slots = useSlots();
    // Track the delta from last position for animation
    const lastXY = ref({ x: props.x, y: props.y });
    const translateX = ref(0);
    const translateY = ref(0);

    watchEffect(() => {
      // Animate the delta between previous and current positions
      translateX.value = 0;
      translateY.value = 0;
      lastXY.value = { x: props.x, y: props.y };
    });

    return () => {
      const AnnotationComp = props.AnnotationComponent as any;
      return (
        <g
          style={{
            transition: "transform 0.3s ease-out",
            transform: `translate(${translateX.value}px, ${translateY.value}px)`,
          }}
        >
          <AnnotationComp x={props.x} y={props.y}>
            {slots.default?.()}
          </AnnotationComp>
        </g>
      );
    };
  },
});

export type AnimatedAnnotationProps = { editable?: boolean } & Omit<
  BaseAnnotationProps,
  "AnnotationComponent"
>;

const AnimatedAnnotation = defineComponent({
  name: "AnimatedAnnotation",
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

    const AnimationWrapper = defineComponent({
      name: "AnnotationAnimationWrapper",
      props: {
        x: { type: Number as PropType<number>, default: 0 },
        y: { type: Number as PropType<number>, default: 0 },
      },
      setup(innerProps) {
        const innerSlots = useSlots();
        return () => (
          <BaseAnimatedAnnotation
            AnnotationComponent={props.editable ? VisxEditableAnnotation : VisxAnnotation}
            x={innerProps.x}
            y={innerProps.y}
          >
            {innerSlots.default?.()}
          </BaseAnimatedAnnotation>
        );
      },
    });

    return () => (
      <BaseAnnotation
        AnnotationComponent={AnimationWrapper}
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

export default AnimatedAnnotation;
