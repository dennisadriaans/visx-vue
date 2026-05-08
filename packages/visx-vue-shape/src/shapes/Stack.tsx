import { defineComponent, useAttrs, useSlots, type PropType } from "vue";
import type { SeriesPoint } from "@visx-vue/vendor/d3-shape";
import type { $TSFIXME, AccessorForArrayItem, StackKey, AreaPathConfig } from "../types";
import { area, stack as stackPath } from "../util/D3ShapeFactories";
import { Group } from "@visx-vue/group";

export type StackProps<Datum, Key> = {
  /** Returns a color for a given stack key and index. */
  color?: (key: Key, index: number) => string;
  /** className applied to path element. */
  className?: string;
  /** Top offset of rendered Stack. */
  top?: number;
  /** Left offset of rendered Stack. */
  left?: number;
  /** Array of data for which generates a stack. */
  data: Datum[];
  /** Array of keys corresponding to stack layers. */
  keys?: Key[];
  /** Sets the stack offset. */
  offset?: string;
  /** Sets the stack order. */
  order?: string;
  /** Sets the value accessor for a Datum. */
  value?: number | ((d: Datum, key: Key) => number);
  /** Sets the x0 accessor function, and sets x1 to null. */
  x?: AccessorForArrayItem<SeriesPoint<Datum>, number>;
  /** Specifies the x0 accessor function which defaults to d => d[0]. */
  x0?: AccessorForArrayItem<SeriesPoint<Datum>, number>;
  /** Specifies the x1 accessor function which defaults to null. */
  x1?: AccessorForArrayItem<SeriesPoint<Datum>, number>;
  /** Specifies the y0 accessor function which defaults to d => 0. */
  y0?: AccessorForArrayItem<SeriesPoint<Datum>, number>;
  /** Specifies the y1 accessor function which defaults to d => d[1]. */
  y1?: AccessorForArrayItem<SeriesPoint<Datum>, number>;
} & Pick<AreaPathConfig<SeriesPoint<Datum>>, "defined" | "curve">;

export const Stack = defineComponent({
  name: "Stack",
  inheritAttrs: false,
  props: {
    className: { type: String as PropType<string>, default: undefined },
    top: { type: Number as PropType<number>, default: undefined },
    left: { type: Number as PropType<number>, default: undefined },
    keys: { type: Array as PropType<StackKey[]>, default: undefined },
    data: { type: Array as PropType<unknown[]>, required: true },
    curve: { type: Function as PropType<$TSFIXME>, default: undefined },
    defined: {
      type: Function as PropType<AccessorForArrayItem<$TSFIXME, boolean>>,
      default: undefined,
    },
    x: {
      type: [Number, Function] as PropType<number | AccessorForArrayItem<$TSFIXME, number>>,
      default: undefined,
    },
    x0: {
      type: [Number, Function] as PropType<number | AccessorForArrayItem<$TSFIXME, number>>,
      default: undefined,
    },
    x1: {
      type: [Number, Function] as PropType<number | AccessorForArrayItem<$TSFIXME, number>>,
      default: undefined,
    },
    y0: {
      type: [Number, Function] as PropType<number | AccessorForArrayItem<$TSFIXME, number>>,
      default: undefined,
    },
    y1: {
      type: [Number, Function] as PropType<number | AccessorForArrayItem<$TSFIXME, number>>,
      default: undefined,
    },
    value: {
      type: [Number, Function] as PropType<number | ((...args: any[]) => number)>,
      default: undefined,
    },
    order: { type: String as PropType<string>, default: undefined },
    offset: { type: String as PropType<string>, default: undefined },
    color: {
      type: Function as PropType<(key: StackKey, index: number) => string>,
      default: undefined,
    },
  },
  setup(props) {
    const attrs = useAttrs();
    const slots = useSlots();

    return () => {
      const stackGen = stackPath<$TSFIXME, StackKey>({
        keys: props.keys,
        value: props.value,
        order: props.order as $TSFIXME,
        offset: props.offset as $TSFIXME,
      });
      const path = area<SeriesPoint<$TSFIXME>>({
        x: props.x,
        x0: props.x0,
        x1: props.x1,
        y0: props.y0,
        y1: props.y1,
        curve: props.curve,
        defined: props.defined,
      });

      const stacks = stackGen(props.data as $TSFIXME);

      if (slots.default) return slots.default({ stacks, path, stack: stackGen });

      return (
        <Group top={props.top} left={props.left}>
          {stacks.map((series: $TSFIXME, i: number) => (
            <path
              class={["visx-stack", props.className]}
              key={`stack-${i}-${series.key || ""}`}
              d={path(series) || ""}
              fill={props.color?.(series.key, i)}
              {...attrs}
            />
          ))}
        </Group>
      );
    };
  },
});

export default Stack;
