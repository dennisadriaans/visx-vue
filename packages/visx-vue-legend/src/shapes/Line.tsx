import { defineComponent, type CSSProperties, type PropType } from "vue";
import { Group } from "@visx-vue/group";

export type ShapeShapeLineProps = {
  /** The stroke color for the line. Note: Despite the name, this is used as the stroke, not fill. */
  fill?: string;
  /** Width of the line. */
  width?: string | number;
  /** Height of the container. The line is vertically centered. */
  height?: string | number;
  /** Additional CSS styles to apply to the line. The strokeWidth from style is used for line thickness. */
  style?: CSSProperties;
};

export const LineShape = defineComponent({
  name: "LineShape",
  inheritAttrs: false,
  props: {
    fill: { type: String as PropType<string>, default: undefined },
    width: { type: [String, Number] as PropType<string | number>, default: undefined },
    height: { type: [String, Number] as PropType<string | number>, default: undefined },
    style: { type: Object as PropType<CSSProperties>, default: undefined },
  },
  setup(props) {
    return () => {
      const cleanHeight =
        typeof props.height === "string" || typeof props.height === "undefined" ? 0 : props.height;
      const lineThickness =
        typeof props.style?.strokeWidth === "number" ? props.style.strokeWidth : 2;
      return (
        <svg width={props.width} height={props.height}>
          <Group top={cleanHeight / 2 - lineThickness / 2}>
            <line
              x1={0}
              x2={props.width}
              y1={0}
              y2={0}
              stroke={props.fill}
              stroke-width={lineThickness}
              style={props.style}
            />
          </Group>
        </svg>
      );
    };
  },
});

export default LineShape;
