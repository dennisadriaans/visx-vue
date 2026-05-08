import { defineComponent, type PropType } from "vue";

type Node = { x: number; y: number };

export type LinkProps = {
  link?: { source: Node; target: Node };
};

const DEFAULT_LINK = { source: { x: 0, y: 0 }, target: { x: 0, y: 0 } };

export const HierarchyDefaultLink = defineComponent({
  name: "HierarchyDefaultLink",
  props: {
    link: {
      type: Object as PropType<{ source: Node; target: Node }>,
      default: () => DEFAULT_LINK,
    },
  },
  setup(props) {
    return () => (
      <line
        x1={props.link.source.x}
        y1={props.link.source.y}
        x2={props.link.target.x}
        y2={props.link.target.y}
        stroke-width={2}
        stroke="#999"
        stroke-opacity={0.6}
      />
    );
  },
});

export default HierarchyDefaultLink;
