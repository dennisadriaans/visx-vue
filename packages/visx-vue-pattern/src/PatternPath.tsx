import { defineComponent, type PropType } from "vue";
import { Pattern } from "./Pattern";

export type PatternPathProps = {
  /** Unique id for the pattern. */
  id: string;
  /** Width of the pattern element. */
  width: number;
  /** Height of the pattern element. */
  height: number;
  /** d attribute of the path element */
  path?: string;
  /** fill color applied to path. */
  fill?: string;
  /** className applied to the path element. */
  className?: string;
  /** Background color applied behind path. */
  background?: string;
  /** Stroke color applied to path. */
  stroke?: string;
  /** strokeWidth applied to path. */
  strokeWidth?: number | string;
  /** strokeDasharray applied to path. */
  strokeDasharray?: string | number;
  /** strokeLinecap applied to path. */
  strokeLinecap?: "square" | "butt" | "round" | "inherit";
  /** shapeRendering applied to path. */
  shapeRendering?: string | number;
};

export const PatternPath = defineComponent({
  name: "PatternPath",
  props: {
    id: { type: String as PropType<string>, required: true },
    width: { type: Number as PropType<number>, required: true },
    height: { type: Number as PropType<number>, required: true },
    path: { type: String as PropType<string>, default: undefined },
    fill: { type: String as PropType<string>, default: "transparent" },
    className: { type: String as PropType<string>, default: undefined },
    background: { type: String as PropType<string>, default: undefined },
    stroke: { type: String as PropType<string>, default: undefined },
    strokeWidth: { type: [Number, String] as PropType<number | string>, default: undefined },
    strokeDasharray: { type: [String, Number] as PropType<string | number>, default: undefined },
    strokeLinecap: {
      type: String as PropType<"square" | "butt" | "round" | "inherit">,
      default: "square",
    },
    shapeRendering: { type: [String, Number] as PropType<string | number>, default: "auto" },
  },
  setup(props) {
    return () => (
      <Pattern id={props.id} width={props.width} height={props.height}>
        {!!props.background && (
          <rect width={props.width} height={props.height} fill={props.background} />
        )}
        <path
          class={["visx-pattern-path", props.className]}
          d={props.path}
          fill={props.fill}
          stroke={props.stroke}
          stroke-width={props.strokeWidth}
          stroke-dasharray={props.strokeDasharray}
          stroke-linecap={props.strokeLinecap}
          shape-rendering={props.shapeRendering}
        />
      </Pattern>
    );
  },
});
