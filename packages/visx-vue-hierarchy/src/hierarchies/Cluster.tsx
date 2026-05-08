import { defineComponent, useSlots, type PropType, type Component } from "vue";
import { Group } from "@visx-vue/group";
import type { HierarchyNode, HierarchyPointNode, HierarchyPointLink } from "d3-hierarchy";
import { cluster as d3cluster } from "d3-hierarchy";
import DefaultLink from "../HierarchyDefaultLink";
import DefaultNode from "../HierarchyDefaultNode";

export type NodeComponentProps<Datum> = { node: HierarchyPointNode<Datum> };
export type LinkComponentProps<Datum> = { link: HierarchyPointLink<Datum> };

export type ClusterProps<Datum> = {
  /** The root hierarchy node from which to derive the cluster layout. */
  root: HierarchyNode<Datum>;
  /** top offset applied to the g element container. */
  top?: number;
  /** left offset applied to the g element container. */
  left?: number;
  /** className applied to the g element container. */
  className?: string;
  /**
   * Sets this cluster layout's size to the specified two-element array of numbers [width, height].
   */
  size?: [number, number];
  /**
   * Sets this cluster layout's node size to the specified two-element array of numbers [width, height].
   */
  nodeSize?: [number, number];
  /** Sets the separation accessor, used to separate neighboring leaves. */
  separation?: (a: HierarchyPointNode<Datum>, b: HierarchyPointNode<Datum>) => number;
  /** Component which renders a single cluster link, passed the link object. */
  linkComponent?: Component;
  /** Component which renders a single cluster node, passed the node object. */
  nodeComponent?: Component;
};

export const Cluster = defineComponent({
  name: "Cluster",
  props: {
    root: { type: Object as PropType<HierarchyNode<unknown>>, required: true as const },
    top: { type: Number as PropType<number>, default: undefined },
    left: { type: Number as PropType<number>, default: undefined },
    className: { type: String as PropType<string>, default: undefined },
    size: { type: Array as unknown as PropType<[number, number]>, default: undefined },
    nodeSize: { type: Array as unknown as PropType<[number, number]>, default: undefined },
    separation: {
      type: Function as PropType<
        (a: HierarchyPointNode<unknown>, b: HierarchyPointNode<unknown>) => number
      >,
      default: undefined,
    },
    linkComponent: { type: [Object, Function] as PropType<Component>, default: DefaultLink },
    nodeComponent: { type: [Object, Function] as PropType<Component>, default: DefaultNode },
  },
  setup(props) {
    const slots = useSlots();

    return () => {
      const cluster = d3cluster<unknown>();
      if (props.size) cluster.size(props.size);
      if (props.nodeSize !== undefined) cluster.nodeSize(props.nodeSize);
      if (props.separation) cluster.separation(props.separation);

      const data = cluster(props.root.copy());

      if (slots.default) return slots.default({ data });

      const LinkComp = props.linkComponent as any;
      const NodeComp = props.nodeComponent as any;

      return (
        <Group top={props.top} left={props.left} class={["visx-cluster", props.className]}>
          {LinkComp &&
            data.links().map((link: any, i: number) => (
              <Group key={`cluster-link-${i}`}>
                <LinkComp link={link} />
              </Group>
            ))}
          {NodeComp &&
            data.descendants().map((node: any, i: number) => (
              <Group key={`cluster-node-${i}`}>
                <NodeComp node={node} />
              </Group>
            ))}
        </Group>
      );
    };
  },
});

export default Cluster;
