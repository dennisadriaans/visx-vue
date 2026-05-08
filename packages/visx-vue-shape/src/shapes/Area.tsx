import { defineComponent, ref, useAttrs, useSlots, type PropType } from "vue";
import type { CurveFactory } from "@visx-vue/vendor/d3-shape";
import type { AccessorForArrayItem, BaseAreaProps } from "../types";
import { area } from "../util/D3ShapeFactories";

export type AreaProps<Datum> = BaseAreaProps<Datum>;

export const Area = defineComponent({
  name: "Area",
  inheritAttrs: false,
  props: {
    x: {
      type: [Number, Function] as PropType<number | AccessorForArrayItem<unknown, number>>,
      default: undefined,
    },
    x0: {
      type: [Number, Function] as PropType<number | AccessorForArrayItem<unknown, number>>,
      default: undefined,
    },
    x1: {
      type: [Number, Function] as PropType<number | AccessorForArrayItem<unknown, number>>,
      default: undefined,
    },
    y: {
      type: [Number, Function] as PropType<number | AccessorForArrayItem<unknown, number>>,
      default: undefined,
    },
    y0: {
      type: [Number, Function] as PropType<number | AccessorForArrayItem<unknown, number>>,
      default: undefined,
    },
    y1: {
      type: [Number, Function] as PropType<number | AccessorForArrayItem<unknown, number>>,
      default: undefined,
    },
    data: { type: Array as PropType<unknown[]>, default: () => [] },
    defined: {
      type: Function as PropType<AccessorForArrayItem<unknown, boolean>>,
      default: () => true,
    },
    className: { type: String as PropType<string>, default: undefined },
    curve: { type: Function as PropType<CurveFactory>, default: undefined },
  },
  setup(props) {
    const attrs = useAttrs();
    const slots = useSlots();
    const innerRef = ref<SVGPathElement | null>(null);

    return () => {
      const path = area({
        x: props.x,
        x0: props.x0,
        x1: props.x1,
        y: props.y,
        y0: props.y0,
        y1: props.y1,
        defined: props.defined,
        curve: props.curve,
      });
      if (slots.default) return slots.default({ path });
      return (
        <path
          ref={innerRef}
          class={["visx-area", props.className]}
          d={path(props.data!) || ""}
          {...attrs}
        />
      );
    };
  },
});

export default Area;
