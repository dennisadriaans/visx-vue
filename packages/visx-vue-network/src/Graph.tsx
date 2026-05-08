import { defineComponent, type PropType, type Component } from "vue";
import { Group } from "@visx-vue/group";
import Links from "./Links";
import Nodes from "./Nodes";
import DefaultNode from "./DefaultNode";
import DefaultLink from "./DefaultLink";
import type {
  Graph as GraphType,
  DefaultNode as DefaultNodeType,
  Link as LinkType,
  LinkProvidedProps,
  NodeProvidedProps,
} from "./types";

export type GraphProps<Link, Node> = {
  /** Graph to render nodes and links for. */
  graph?: GraphType<Link, Node>;
  /** Component for rendering a single Link. */
  linkComponent?: Component;
  /** Component for rendering a single Node. */
  nodeComponent?: Component;
  /** Top transform offset to apply to links and nodes. */
  top?: number;
  /** Left transform offset to apply to links and nodes. */
  left?: number;
};

export const Graph = defineComponent({
  name: "Graph",
  props: {
    graph: { type: Object as PropType<GraphType<unknown, unknown>>, default: undefined },
    linkComponent: { type: [Object, Function] as PropType<Component>, default: DefaultLink },
    nodeComponent: { type: [Object, Function] as PropType<Component>, default: DefaultNode },
    top: { type: Number as PropType<number>, default: undefined },
    left: { type: Number as PropType<number>, default: undefined },
  },
  setup(props) {
    return () => {
      const { graph } = props;
      return graph ? (
        <Group top={props.top} left={props.left}>
          <Links links={graph.links} linkComponent={props.linkComponent} />
          <Nodes nodes={graph.nodes} nodeComponent={props.nodeComponent} />
        </Group>
      ) : null;
    };
  },
});

export default Graph;
