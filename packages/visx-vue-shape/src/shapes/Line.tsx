import { defineComponent, ref, useAttrs, type PropType } from "vue";

interface Point {
  x?: number;
  y?: number;
}

export type LineProps = {
  /** className to apply to line element. */
  className?: string;
  /** fill color applied to line element. */
  fill?: string;
  /** Starting x,y point of the line. */
  from?: Point;
  /** Ending x,y point of the line. */
  to?: Point;
};

export const Line = defineComponent({
  name: "Line",
  inheritAttrs: false,
  props: {
    className: { type: String as PropType<string>, default: undefined },
    fill: { type: String as PropType<string>, default: "transparent" },
    from: { type: Object as PropType<Point>, default: () => ({ x: 0, y: 0 }) },
    to: { type: Object as PropType<Point>, default: () => ({ x: 1, y: 1 }) },
  },
  setup(props) {
    const attrs = useAttrs();
    const innerRef = ref<SVGLineElement | null>(null);

    return () => {
      const isRectilinear = props.from!.x === props.to!.x || props.from!.y === props.to!.y;
      return (
        <line
          ref={innerRef}
          class={["visx-line", props.className]}
          x1={props.from!.x}
          y1={props.from!.y}
          x2={props.to!.x}
          y2={props.to!.y}
          fill={props.fill}
          shape-rendering={isRectilinear ? "crispEdges" : "auto"}
          {...attrs}
        />
      );
    };
  },
});

export default Line;
