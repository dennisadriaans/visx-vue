import { defineComponent, computed, useSlots, type Component, type PropType } from "vue";
import type { ScaleInput } from "@visx-vue/scale";
import { coerceNumber } from "@visx-vue/scale";
import type {
  AnnotationProps as VisxAnnotationProps,
  EditableAnnotationProps,
} from "@visx-vue/annotation";
import { useDataContext } from "../../../context/DataContext";
import getScaleBandwidth from "../../../utils/getScaleBandwidth";
import isValidNumber from "../../../typeguards/isValidNumber";
import type { AxisScale } from "../../../types/axis";

export type BaseAnnotationProps = {
  /** Annotation component to render. */
  AnnotationComponent: Component;
  /** Key for series to which datum belongs (used for x/yAccessors). Alternatively xAccessor + yAccessor may be specified. */
  dataKey?: string;
  /** Datum to annotate, used for Annotation positioning. */
  datum: object;
  /** If dataKey is not specified, you must specify an xAccessor for datum. */
  xAccessor?: (d: object) => ScaleInput<AxisScale>;
  /** If dataKey is not specified, you must specify an yAccessor for datum. */
  yAccessor?: (d: object) => ScaleInput<AxisScale>;
  /** Label offset x direction. */
  dx?: number;
  /** Label offset y direction. */
  dy?: number;
  /** Whether the label position is editable. */
  canEditLabel?: boolean;
  /** Whether the subject position is editable. */
  canEditSubject?: boolean;
  /** Callback invoked on drag end. */
  onDragEnd?: EditableAnnotationProps["onDragEnd"];
  /** Callback invoked on drag move. */
  onDragMove?: EditableAnnotationProps["onDragMove"];
  /** Callback invoked on drag start. */
  onDragStart?: EditableAnnotationProps["onDragStart"];
};

// used for auto-positioning
const minimumLabelDimension = 16;

const BaseAnnotation = defineComponent({
  name: "BaseAnnotation",
  props: {
    AnnotationComponent: { type: [Object, Function] as PropType<Component>, required: true },
    dataKey: { type: String as PropType<string>, default: undefined },
    datum: { type: Object as PropType<object>, required: true },
    xAccessor: {
      type: Function as PropType<(d: object) => ScaleInput<AxisScale>>,
      default: undefined,
    },
    yAccessor: {
      type: Function as PropType<(d: object) => ScaleInput<AxisScale>>,
      default: undefined,
    },
    dx: { type: Number as PropType<number>, default: 0 },
    dy: { type: Number as PropType<number>, default: 0 },
    canEditLabel: { type: Boolean as PropType<boolean>, default: undefined },
    canEditSubject: { type: Boolean as PropType<boolean>, default: undefined },
    onDragEnd: {
      type: Function as PropType<EditableAnnotationProps["onDragEnd"]>,
      default: undefined,
    },
    onDragMove: {
      type: Function as PropType<EditableAnnotationProps["onDragMove"]>,
      default: undefined,
    },
    onDragStart: {
      type: Function as PropType<EditableAnnotationProps["onDragStart"]>,
      default: undefined,
    },
  },
  setup(props) {
    const slots = useSlots();
    const dataContext = useDataContext();

    const xBandWidth = computed(() => {
      const xScale = dataContext.xScale;
      return xScale ? getScaleBandwidth(xScale) : 0;
    });

    const yBandWidth = computed(() => {
      const yScale = dataContext.yScale;
      return yScale ? getScaleBandwidth(yScale) : 0;
    });

    return () => {
      const { innerHeight, innerWidth, margin, xScale, yScale, dataRegistry } = dataContext;

      if ((!props.xAccessor || !props.yAccessor) && !props.dataKey) {
        console.warn(
          "[@visx-vue/xychart/BaseAnnotation]: dataKey or x/yAccessors must be specified.",
        );
        return null;
      }

      const registryEntry =
        (props.xAccessor && props.yAccessor) || props.dataKey == null
          ? null
          : dataRegistry?.get(props.dataKey);
      const xAccessor = props.xAccessor || registryEntry?.xAccessor;
      const yAccessor = props.yAccessor || registryEntry?.yAccessor;

      if (
        !xScale ||
        !yScale ||
        !innerWidth ||
        !innerHeight ||
        !xAccessor ||
        !yAccessor ||
        !margin
      ) {
        return null;
      }

      const x = (coerceNumber(xScale(xAccessor(props.datum))) ?? NaN) + xBandWidth.value / 2;
      const y = (coerceNumber(yScale(yAccessor(props.datum))) ?? NaN) + yBandWidth.value / 2;
      const dx =
        x + props.dx + minimumLabelDimension > margin.left + innerWidth ? -props.dx : props.dx;
      const dy =
        y + props.dy + minimumLabelDimension > margin.top + innerHeight ? -props.dy : props.dy;

      if (!isValidNumber(x) || !isValidNumber(y)) {
        return null;
      }

      const AnnotationComp = props.AnnotationComponent as any;

      return (
        <AnnotationComp
          width={innerWidth}
          height={innerHeight}
          canEditLabel={props.canEditLabel}
          canEditSubject={props.canEditSubject}
          onDragEnd={props.onDragEnd}
          onDragMove={props.onDragMove}
          onDragStart={props.onDragStart}
          x={x}
          y={y}
          dx={dx}
          dy={dy}
        >
          {slots.default?.()}
        </AnnotationComp>
      );
    };
  },
});

export default BaseAnnotation;
