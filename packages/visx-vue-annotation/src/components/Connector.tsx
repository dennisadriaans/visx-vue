import { defineComponent, type PropType, type SVGAttributes } from "vue";
import type { AnnotationContextType } from "../types";
import { useAnnotationContext } from "../context";

export type ConnectorProps = Pick<AnnotationContextType, "x" | "y" | "dx" | "dy"> & {
  /** Optional className to apply to container in addition to 'visx-annotation-connector'. */
  className?: string;
  /** Connector type. */
  type?: "line" | "elbow";
  /** Color of the connector line. */
  stroke?: string;
  /** Optional additional props. */
  pathProps?: SVGAttributes;
};

export const Connector = defineComponent({
  name: "Connector",
  props: {
    className: { type: String as PropType<string>, default: undefined },
    x: { type: Number as PropType<number>, default: undefined },
    y: { type: Number as PropType<number>, default: undefined },
    dx: { type: Number as PropType<number>, default: undefined },
    dy: { type: Number as PropType<number>, default: undefined },
    type: { type: String as PropType<"line" | "elbow">, default: "elbow" },
    stroke: { type: String as PropType<string>, default: "#222" },
    pathProps: { type: Object as PropType<SVGAttributes>, default: undefined },
  },
  setup(props) {
    const annotationContext = useAnnotationContext();

    return () => {
      const ctx = annotationContext.value;
      const x0 = props.x == null ? (ctx.x ?? 0) : props.x;
      const y0 = props.y == null ? (ctx.y ?? 0) : props.y;
      const dx = props.dx == null ? (ctx.dx ?? 0) : props.dx;
      const dy = props.dy == null ? (ctx.dy ?? 0) : props.dy;
      let x1: number = x0;
      let y1: number = y0;
      const x2 = x0 + dx;
      const y2 = y0 + dy;

      if (props.type === "elbow") {
        if (Math.abs(dx) <= Math.abs(dy)) {
          x1 = x2;
          const sign = dy > 0 ? 1 : -1;
          y1 = y0 + sign * Math.abs(x1 - x0);
        } else {
          y1 = y2;
          const sign = dx > 0 ? 1 : -1;
          x1 = x0 + sign * Math.abs(y1 - y0);
        }
      }

      return (
        <path
          class={["visx-annotation-connector", props.className]}
          fill="transparent"
          stroke={props.stroke}
          d={`M${x0},${y0}${props.type === "elbow" ? `L${x1},${y1}` : ""}L${x2},${y2}`}
          {...{ "stroke-width": 1, "pointer-events": "none" }}
          {...(props.pathProps || {})}
        />
      );
    };
  },
});

export default Connector;
