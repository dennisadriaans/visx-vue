import { defineComponent, type PropType } from "vue";
import { Pattern } from "./Pattern";
import { PatternOrientation, type PatternOrientationType } from "./constants";

export function pathForOrientation({
  height,
  orientation,
}: {
  height: number;
  orientation: PatternOrientationType;
}) {
  switch (orientation) {
    case PatternOrientation.horizontal:
      return `M 0,${height / 2} l ${height},0`;
    case PatternOrientation.diagonal:
      return `M 0,${height} l ${height},${-height} M ${-height / 4},${height / 4} l ${height / 2},${
        -height / 2
      }
             M ${(3 / 4) * height},${(5 / 4) * height} l ${height / 2},${-height / 2}`;
    case PatternOrientation.diagonalRightToLeft:
      return `M 0,0 l ${height},${height}
        M ${-height / 4},${(3 / 4) * height} l ${height / 2},${height / 2}
        M ${(3 / 4) * height},${-height / 4} l ${height / 2},${height / 2}`;
    case PatternOrientation.vertical:
    default:
      return `M ${height / 2}, 0 l 0, ${height}`;
  }
}

export type PatternLinesProps = {
  /** Unique id for the pattern. */
  id: string;
  /** Width of the pattern element. */
  width: number;
  /** Height of the pattern element. */
  height: number;
  /** className applied to line path element. */
  className?: string;
  /** Background color applied behind lines. */
  background?: string;
  /** Stroke color applied to path elements. */
  stroke?: string;
  /** strokeWidth applied to path elements. */
  strokeWidth?: number | string;
  /** strokeDasharray applied to path elements. */
  strokeDasharray?: string | number;
  /** strokeLinecap applied to path elements. */
  strokeLinecap?: "square" | "butt" | "round" | "inherit";
  /** shapeRendering applied to path elements. */
  shapeRendering?: string | number;
  /** Array of orientations to render (can mix multiple). */
  orientation?: PatternOrientationType[];
};

export const PatternLines = defineComponent({
  name: "PatternLines",
  props: {
    id: { type: String as PropType<string>, required: true },
    width: { type: Number as PropType<number>, required: true },
    height: { type: Number as PropType<number>, required: true },
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
    orientation: { type: Array as PropType<PatternOrientationType[]>, default: () => ["vertical"] },
  },
  setup(props) {
    return () => {
      const orientations = Array.isArray(props.orientation)
        ? props.orientation
        : [props.orientation];

      return (
        <Pattern id={props.id} width={props.width} height={props.height}>
          {!!props.background && (
            <rect
              class="visx-pattern-line-background"
              width={props.width}
              height={props.height}
              fill={props.background}
            />
          )}
          {orientations.map((o, i) => (
            <path
              key={`visx-${props.id}-line-${o}-${i}`}
              class={["visx-pattern-line", props.className]}
              d={pathForOrientation({ orientation: o, height: props.height })}
              stroke={props.stroke}
              stroke-width={props.strokeWidth}
              stroke-dasharray={props.strokeDasharray}
              stroke-linecap={props.strokeLinecap}
              shape-rendering={props.shapeRendering}
            />
          ))}
        </Pattern>
      );
    };
  },
});
