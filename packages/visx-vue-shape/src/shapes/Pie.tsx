import { defineComponent, useAttrs, useSlots, type PropType } from "vue";
import type { PieArcDatum as PieArcDatumType } from "@visx-vue/vendor/d3-shape";
import type { $TSFIXME, Accessor, ArcPathConfig, PiePathConfig } from "../types";
import { arc as arcPath, pie as piePath } from "../util/D3ShapeFactories";
import { Group } from "@visx-vue/group";

export type PieArcDatum<Datum> = PieArcDatumType<Datum>;

export type ProvidedProps<Datum> = {
  path: ReturnType<typeof arcPath<PieArcDatum<Datum>>>;
  arcs: PieArcDatum<Datum>[];
  pie: ReturnType<typeof piePath<Datum>>;
};

export type PieProps<Datum> = {
  /** className applied to path element. */
  className?: string;
  /** Top offset of rendered Pie. */
  top?: number;
  /** Left offset of rendered Pie. */
  left?: number;
  /** Array of data to generate a Pie for. */
  data?: Datum[];
  /** Optional render function invoked for each Datum to render something (e.g., a Label) at each pie centroid. */
  centroid?: (xyCoords: [number, number], arc: PieArcDatum<Datum>) => any;
  /** Invoked for each datum, returns the value for a given Pie segment/arc datum. */
  pieValue?: PiePathConfig<Datum>["value"];
  /** Comparator function to sort *arcs*, overridden by pieSortValues if defined. */
  pieSort?: PiePathConfig<Datum>["sort"];
  /** Comparator function to sort arc *values*, overrides pieSort if defined. */
  pieSortValues?: PiePathConfig<Datum>["sortValues"];
  /** Optional accessor function to return the fill string value of a given arc. */
  fill?: string | ((pieArcDatum: PieArcDatum<Datum>) => string);
} & Pick<PiePathConfig<Datum>, "startAngle" | "endAngle" | "padAngle"> &
  Pick<
    ArcPathConfig<PieArcDatum<Datum>>,
    "innerRadius" | "outerRadius" | "cornerRadius" | "padRadius"
  >;

export const Pie = defineComponent({
  name: "Pie",
  inheritAttrs: false,
  props: {
    className: { type: String as PropType<string>, default: undefined },
    top: { type: Number as PropType<number>, default: undefined },
    left: { type: Number as PropType<number>, default: undefined },
    data: { type: Array as PropType<unknown[]>, default: () => [] },
    centroid: {
      type: Function as PropType<(xyCoords: [number, number], arc: $TSFIXME) => any>,
      default: undefined,
    },
    innerRadius: {
      type: [Number, Function] as PropType<number | Accessor<$TSFIXME, number>>,
      default: 0,
    },
    outerRadius: {
      type: [Number, Function] as PropType<number | Accessor<$TSFIXME, number>>,
      default: undefined,
    },
    cornerRadius: {
      type: [Number, Function] as PropType<number | Accessor<$TSFIXME, number>>,
      default: undefined,
    },
    startAngle: {
      type: [Number, Function] as PropType<number | ((...args: any[]) => number)>,
      default: undefined,
    },
    endAngle: {
      type: [Number, Function] as PropType<number | ((...args: any[]) => number)>,
      default: undefined,
    },
    padAngle: {
      type: [Number, Function] as PropType<number | ((...args: any[]) => number)>,
      default: undefined,
    },
    padRadius: {
      type: [Number, Function] as PropType<number | Accessor<$TSFIXME, number>>,
      default: undefined,
    },
    pieSort: {
      type: [Function, null] as unknown as PropType<null | ((a: unknown, b: unknown) => number)>,
      default: undefined,
    },
    pieSortValues: {
      type: [Function, null] as unknown as PropType<null | ((a: number, b: number) => number)>,
      default: undefined,
    },
    pieValue: { type: Function as PropType<Accessor<unknown, number>>, default: undefined },
    fill: {
      type: [String, Function] as PropType<string | ((pieArcDatum: $TSFIXME) => string)>,
      default: "",
    },
  },
  setup(props) {
    const attrs = useAttrs();
    const slots = useSlots();

    return () => {
      const path = arcPath<$TSFIXME>({
        innerRadius: props.innerRadius,
        outerRadius: props.outerRadius,
        cornerRadius: props.cornerRadius,
        padRadius: props.padRadius,
      });

      const pieGen = piePath<$TSFIXME>({
        startAngle: props.startAngle,
        endAngle: props.endAngle,
        padAngle: props.padAngle,
        value: props.pieValue,
        sort: props.pieSort,
        sortValues: props.pieSortValues,
      });

      const arcs = pieGen(props.data!);
      if (slots.default) return slots.default({ arcs, path, pie: pieGen });

      return (
        <Group class="visx-pie-arcs-group" top={props.top} left={props.left}>
          {arcs.map((arc: $TSFIXME, i: number) => (
            <g key={`pie-arc-${i}`}>
              <path
                class={["visx-pie-arc", props.className]}
                d={path(arc) || ""}
                fill={
                  props.fill == null || typeof props.fill === "string"
                    ? props.fill
                    : props.fill(arc)
                }
                {...attrs}
              />
              {props.centroid?.(path.centroid(arc), arc)}
            </g>
          ))}
        </Group>
      );
    };
  },
});

export default Pie;
