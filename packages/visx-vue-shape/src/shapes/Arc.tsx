import { defineComponent, ref, useAttrs, useSlots, type PropType } from "vue";
import type { $TSFIXME, ArcPathConfig, Accessor } from "../types";
import { arc as arcPath } from "../util/D3ShapeFactories";

export type ArcProps<Datum> = {
  /** className applied to path element. */
  className?: string;
  /** A Datum for which to generate an arc. */
  data?: Datum;
} & ArcPathConfig<Datum>;

export const Arc = defineComponent({
  name: "Arc",
  inheritAttrs: false,
  props: {
    className: { type: String as PropType<string>, default: undefined },
    data: { type: null as unknown as PropType<unknown>, default: undefined },
    innerRadius: {
      type: [Number, Function] as PropType<number | Accessor<unknown, number>>,
      default: undefined,
    },
    outerRadius: {
      type: [Number, Function] as PropType<number | Accessor<unknown, number>>,
      default: undefined,
    },
    cornerRadius: {
      type: [Number, Function] as PropType<number | Accessor<unknown, number>>,
      default: undefined,
    },
    startAngle: {
      type: [Number, Function] as PropType<number | Accessor<unknown, number>>,
      default: undefined,
    },
    endAngle: {
      type: [Number, Function] as PropType<number | Accessor<unknown, number>>,
      default: undefined,
    },
    padAngle: {
      type: [Number, Function] as PropType<number | Accessor<unknown, number>>,
      default: undefined,
    },
    padRadius: {
      type: [Number, Function] as PropType<number | Accessor<unknown, number>>,
      default: undefined,
    },
  },
  setup(props) {
    const attrs = useAttrs();
    const slots = useSlots();
    const innerRef = ref<SVGPathElement | null>(null);

    return () => {
      const path = arcPath({
        innerRadius: props.innerRadius,
        outerRadius: props.outerRadius,
        cornerRadius: props.cornerRadius,
        startAngle: props.startAngle,
        endAngle: props.endAngle,
        padAngle: props.padAngle,
        padRadius: props.padRadius,
      });

      if (slots.default) return slots.default({ path });
      if (
        !props.data &&
        (props.startAngle == null ||
          props.endAngle == null ||
          props.innerRadius == null ||
          props.outerRadius == null)
      ) {
        console.warn(
          "[@visx-vue/shape/Arc]: expected data because one of startAngle, endAngle, innerRadius, outerRadius is undefined. Bailing.",
        );
        return null;
      }

      return (
        <path
          ref={innerRef}
          class={["visx-arc", props.className]}
          d={path(props.data as $TSFIXME) || ""}
          {...attrs}
        />
      );
    };
  },
});

export default Arc;
