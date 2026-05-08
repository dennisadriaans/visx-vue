import { defineComponent, type PropType } from "vue";
import { Area } from "@visx-vue/shape";
import { ClipPath } from "@visx-vue/clip-path";
import type { CurveFactory } from "@visx-vue/vendor/d3-shape";
import type { Area as D3Area } from "@visx-vue/vendor/d3-shape";

type NumberAccessor<Datum> = (datum: Datum, index: number, data: Datum[]) => number;

export type ThresholdProps<Datum> = {
  /** className applied to container g element. */
  className?: string;
  /** Sets the curve factory (from @visx/curve or d3-curve) for the area generator. Defaults to curveLinear. */
  curve?: CurveFactory;
  /** Specifies a constant value, or an accessor called per datum, above which the *upper area* is clipped. */
  clipAboveTo: NumberAccessor<Datum> | number;
  /** Specifies a constant value, or an accessor called per datum, below which the *lower area* is clipped. */
  clipBelowTo: NumberAccessor<Datum> | number;
  /** id for this threshold. If not set, multiple Threshold's on a page may conflict and interfere with each other. */
  id: string;
  /** Array of data for which to generate a threshold area shape. */
  data: Datum[];
  /**
   * The defined accessor for the shape. The final area shape includes all points for which this
   * function returns true. By default all points are defined.
   */
  defined?: (datum: Datum, index: number, data: Datum[]) => boolean;
  /**
   * For the Area shape, specifies the x accessor function for a datum, which defaults to `d => d[0]`.
   * Alternatively this may be a constant x value.
   */
  x: NumberAccessor<Datum> | number;
  /**
   * For the Area shape, specifies the accessor function (or constant value) which generates
   * the "lower" area bound to which "belowAreaProps" and "clipBelow" props apply. Defaults to `d => 0`.
   */
  y0: NumberAccessor<Datum> | number;
  /**
   * For the Area shape, specifies the accessor function (or constant value) which generates
   * the "upper" area bound to which "aboveAreaProps" and "clipAbove" props apply. Defaults to `d => d[1]`.
   */
  y1: NumberAccessor<Datum> | number;
  /** Additional props passed to the "above" Area shape. */
  aboveAreaProps?: Record<string, unknown>;
  /** Additional props passed to the "below" Area shape. */
  belowAreaProps?: Record<string, unknown>;
};

export const Threshold = defineComponent({
  name: "Threshold",
  props: {
    className: { type: String as PropType<string>, default: undefined },
    curve: { type: Function as PropType<CurveFactory>, default: undefined },
    clipAboveTo: {
      type: [Number, Function] as PropType<NumberAccessor<unknown> | number>,
      required: true as const,
    },
    clipBelowTo: {
      type: [Number, Function] as PropType<NumberAccessor<unknown> | number>,
      required: true as const,
    },
    id: { type: String as PropType<string>, default: "" },
    data: { type: Array as PropType<unknown[]>, required: true as const },
    defined: {
      type: Function as PropType<(datum: unknown, index: number, data: unknown[]) => boolean>,
      default: undefined,
    },
    x: {
      type: [Number, Function] as PropType<NumberAccessor<unknown> | number>,
      required: true as const,
    },
    y0: {
      type: [Number, Function] as PropType<NumberAccessor<unknown> | number>,
      required: true as const,
    },
    y1: {
      type: [Number, Function] as PropType<NumberAccessor<unknown> | number>,
      required: true as const,
    },
    aboveAreaProps: { type: Object as PropType<Record<string, unknown>>, default: undefined },
    belowAreaProps: { type: Object as PropType<Record<string, unknown>>, default: undefined },
  },
  setup(props) {
    return () => (
      <g class={["visx-threshold", props.className]}>
        <Area
          curve={props.curve}
          data={props.data}
          x={props.x}
          y1={props.y1}
          defined={props.defined}
        >
          {{
            default: ({ path }: { path: D3Area<unknown> }) => {
              // TS cannot infer the correct method overload
              let belowPath = null;
              let abovePath = null;
              if (typeof props.clipBelowTo === "number")
                belowPath = path.y0(props.clipBelowTo)(props.data);
              else belowPath = path.y0(props.clipBelowTo)(props.data);
              if (typeof props.clipAboveTo === "number")
                abovePath = path.y0(props.clipAboveTo)(props.data);
              else abovePath = path.y0(props.clipAboveTo)(props.data);

              return (
                <g>
                  <ClipPath id={`threshold-clip-below-${props.id}`}>
                    <path d={belowPath || ""} />
                  </ClipPath>
                  <ClipPath id={`threshold-clip-above-${props.id}`}>
                    <path d={abovePath || ""} />
                  </ClipPath>
                </g>
              );
            },
          }}
        </Area>
        <Area
          curve={props.curve}
          data={props.data}
          defined={props.defined}
          x={props.x}
          y0={props.y0}
          y1={props.y1}
          {...{ strokeWidth: 0, clipPath: `url(#threshold-clip-below-${props.id})` }}
          {...(props.belowAreaProps || {})}
        />
        <Area
          curve={props.curve}
          data={props.data}
          defined={props.defined}
          x={props.x}
          y0={props.y0}
          y1={props.y1}
          {...{ strokeWidth: 0, clipPath: `url(#threshold-clip-above-${props.id})` }}
          {...(props.aboveAreaProps || {})}
        />
      </g>
    );
  },
});

export default Threshold;
