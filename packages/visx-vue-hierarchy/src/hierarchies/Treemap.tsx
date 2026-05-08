import { defineComponent, useSlots, type PropType, type Component } from "vue";
import { Group } from "@visx-vue/group";
import type { HierarchyRectangularNode, HierarchyNode } from "d3-hierarchy";
import { treemap as d3treemap } from "d3-hierarchy";
import HierarchyDefaultRectNode from "../HierarchyDefaultRectNode";
import setNumberOrNumberAccessor from "../utils/setNumOrNumAccessor";
import type { TileMethod } from "../types";

export type NodeComponentProps<Datum> = { node: HierarchyRectangularNode<Datum> };

type NumberOrNumberAccessor<Datum> = number | ((node: HierarchyRectangularNode<Datum>) => number);

export type TreemapProps<Datum> = {
  /** The root hierarchy node from which to derive the treemap layout. */
  root: HierarchyNode<Datum>;
  /** top offset applied to the g element container. */
  top?: number;
  /** left offset applied to the g element container. */
  left?: number;
  /** className applied to the g element container. */
  className?: string;
  /**
   * Sets the treemap tiling method to the specified function.
   */
  tile?: TileMethod<Datum>;
  /** Sets this treemap layout's size to the specified two-element array of numbers [width, height]. */
  size?: [number, number];
  /** Whether to round treemap values. */
  round?: boolean;
  /** Sets both inner and outer padding to the specified number or accessor. */
  padding?: NumberOrNumberAccessor<Datum>;
  /** Sets padding used to separate a node's adjacent children. */
  paddingInner?: NumberOrNumberAccessor<Datum>;
  /** Sets padding used to separate a node from its children. */
  paddingOuter?: NumberOrNumberAccessor<Datum>;
  /** Sets padding used to separate the top edge of a node from its children. */
  paddingTop?: NumberOrNumberAccessor<Datum>;
  /** Sets padding used to separate the right edge of a node from its children. */
  paddingRight?: NumberOrNumberAccessor<Datum>;
  /** Sets padding used to separate the bottom edge of a node from its children. */
  paddingBottom?: NumberOrNumberAccessor<Datum>;
  /** Sets padding used to separate the left edge of a node from its children. */
  paddingLeft?: NumberOrNumberAccessor<Datum>;
  /** Component which renders a single treemap node, passed the node object. */
  nodeComponent?: Component;
};

export const Treemap = defineComponent({
  name: "Treemap",
  props: {
    root: { type: Object as PropType<HierarchyNode<unknown>>, required: true as const },
    top: { type: Number as PropType<number>, default: undefined },
    left: { type: Number as PropType<number>, default: undefined },
    className: { type: String as PropType<string>, default: undefined },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tile: { type: Function as PropType<TileMethod<any>>, default: undefined },
    size: { type: Array as unknown as PropType<[number, number]>, default: undefined },
    round: { type: Boolean as PropType<boolean>, default: undefined },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    padding: {
      type: [Number, Function] as PropType<NumberOrNumberAccessor<any>>,
      default: undefined,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paddingInner: {
      type: [Number, Function] as PropType<NumberOrNumberAccessor<any>>,
      default: undefined,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paddingOuter: {
      type: [Number, Function] as PropType<NumberOrNumberAccessor<any>>,
      default: undefined,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paddingTop: {
      type: [Number, Function] as PropType<NumberOrNumberAccessor<any>>,
      default: undefined,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paddingRight: {
      type: [Number, Function] as PropType<NumberOrNumberAccessor<any>>,
      default: undefined,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paddingBottom: {
      type: [Number, Function] as PropType<NumberOrNumberAccessor<any>>,
      default: undefined,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paddingLeft: {
      type: [Number, Function] as PropType<NumberOrNumberAccessor<any>>,
      default: undefined,
    },
    nodeComponent: {
      type: [Object, Function] as PropType<Component>,
      default: HierarchyDefaultRectNode,
    },
  },
  setup(props) {
    const slots = useSlots();

    return () => {
      const treemap = d3treemap<unknown>();
      if (props.tile) treemap.tile(props.tile as any);
      if (props.size) treemap.size(props.size);
      if (props.round) treemap.round(props.round);
      if (props.padding) setNumberOrNumberAccessor(treemap.padding, props.padding);
      if (props.paddingInner) setNumberOrNumberAccessor(treemap.paddingInner, props.paddingInner);
      if (props.paddingOuter) setNumberOrNumberAccessor(treemap.paddingOuter, props.paddingOuter);
      if (props.paddingTop) setNumberOrNumberAccessor(treemap.paddingTop, props.paddingTop);
      if (props.paddingRight) setNumberOrNumberAccessor(treemap.paddingRight, props.paddingRight);
      if (props.paddingBottom)
        setNumberOrNumberAccessor(treemap.paddingBottom, props.paddingBottom);
      if (props.paddingLeft) setNumberOrNumberAccessor(treemap.paddingLeft, props.paddingLeft);

      const data = treemap(props.root.copy());

      if (slots.default) return slots.default({ data });

      const NodeComp = props.nodeComponent as any;

      return (
        <Group top={props.top} left={props.left} class={["visx-treemap", props.className]}>
          {NodeComp &&
            data.descendants().map((node: any, i: number) => (
              <Group key={`treemap-node-${i}`}>
                <NodeComp node={node} />
              </Group>
            ))}
        </Group>
      );
    };
  },
});

export default Treemap;
