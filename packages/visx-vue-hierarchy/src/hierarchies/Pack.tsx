import { defineComponent, useSlots, type PropType, type Component } from "vue";
import { Group } from "@visx-vue/group";
import type { HierarchyNode, HierarchyCircularNode } from "d3-hierarchy";
import { pack as d3pack } from "d3-hierarchy";
import DefaultNode from "../HierarchyDefaultNode";

export type NodeComponentProps<Datum> = { node: HierarchyCircularNode<Datum> };

export type PackProps<Datum> = {
  /** The root hierarchy node from which to derive the pack layout. */
  root: HierarchyNode<Datum>;
  /** top offset applied to the g element container. */
  top?: number;
  /** left offset applied to the g element container. */
  left?: number;
  /** className applied to the g element container. */
  className?: string;
  /**
   * Radius accessor function which defines the radius of each leaf node.
   */
  radius?: (node: HierarchyNode<Datum>) => number;
  /** Sets the pack layout size to the defined [width, height]. */
  size?: [number, number];
  /**
   * Sets this pack layout's padding accessor to the specified number,
   * which determines approximate separation of nodes in the resulting pack.
   */
  padding?: number;
  /** Component which renders a single pack node, passed the node object. */
  nodeComponent?: Component;
};

export const Pack = defineComponent({
  name: "Pack",
  props: {
    root: { type: Object as PropType<HierarchyNode<unknown>>, required: true as const },
    top: { type: Number as PropType<number>, default: undefined },
    left: { type: Number as PropType<number>, default: undefined },
    className: { type: String as PropType<string>, default: undefined },
    radius: {
      type: Function as PropType<(node: HierarchyNode<unknown>) => number>,
      default: undefined,
    },
    size: { type: Array as unknown as PropType<[number, number]>, default: undefined },
    padding: { type: Number as PropType<number>, default: undefined },
    nodeComponent: { type: [Object, Function] as PropType<Component>, default: DefaultNode },
  },
  setup(props) {
    const slots = useSlots();

    return () => {
      const pack = d3pack<unknown>();
      if (props.size) pack.size(props.size);
      if (props.radius !== undefined) pack.radius(props.radius);
      if (props.padding) pack.padding(props.padding);

      const data = pack(props.root.copy());

      if (slots.default) return slots.default({ data });

      const NodeComp = props.nodeComponent as any;

      return (
        <Group top={props.top} left={props.left} class={["visx-pack", props.className]}>
          {NodeComp &&
            data.descendants().map((node: any, i: number) => (
              <Group key={`pack-node-${i}`}>
                <NodeComp node={node} />
              </Group>
            ))}
        </Group>
      );
    };
  },
});

export default Pack;
