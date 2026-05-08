import { defineComponent, type PropType } from "vue";
import type { LinkProvidedProps } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DefaultLink = defineComponent({
  name: "DefaultLink",
  props: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    link: { type: Object as PropType<any>, default: undefined },
  },
  setup(props) {
    return () => {
      const { link } = props;
      return link?.source && link.target ? (
        <line
          x1={link.source.x}
          y1={link.source.y}
          x2={link.target.x}
          y2={link.target.y}
          stroke-width={2}
          stroke="#999"
          stroke-opacity={0.6}
        />
      ) : null;
    };
  },
});

export default DefaultLink;
