import { defineComponent, type PropType } from "vue";

export type NodeProps = {
  node?: { x: number; y: number; r?: number };
};

const DEFAULT_NODE = { x: 0, y: 0, r: 15 };

export const HierarchyDefaultNode = defineComponent({
  name: "HierarchyDefaultNode",
  props: {
    node: {
      type: Object as PropType<{ x: number; y: number; r?: number }>,
      default: () => DEFAULT_NODE,
    },
  },
  setup(props) {
    return () => (
      <circle cx={props.node.x} cy={props.node.y} r={props.node.r || 15} fill="#21D4FD" />
    );
  },
});

export default HierarchyDefaultNode;
