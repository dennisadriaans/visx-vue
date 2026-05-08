import { defineComponent, useAttrs, type PropType } from "vue";
import { Marker } from "./Marker";

export const MarkerLine = defineComponent({
  name: "MarkerLine",
  inheritAttrs: false,
  props: {
    id: { type: String as PropType<string>, required: true },
    size: { type: Number as PropType<number>, default: 9 },
    fill: { type: String as PropType<string>, default: undefined },
    stroke: { type: String as PropType<string>, default: undefined },
    strokeWidth: { type: Number as PropType<number>, default: 1 },
  },
  setup(props) {
    const attrs = useAttrs();

    return () => {
      const max = Math.max(props.size, props.strokeWidth * 2);
      const midX = max / 2;
      const midY = props.size / 2;

      return (
        <Marker
          id={props.id}
          markerWidth={max}
          markerHeight={props.size}
          refX={midX}
          refY={midY}
          orient="auto"
          markerUnits="strokeWidth"
          fill={props.fill || props.stroke}
          stroke="none"
          {...attrs}
        >
          <rect width={props.strokeWidth} height={props.size} x={midX} />
        </Marker>
      );
    };
  },
});
