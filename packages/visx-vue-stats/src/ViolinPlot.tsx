import { defineComponent, useAttrs, useSlots, type PropType } from "vue";
import type { PickD3Scale, ContinuousDomainScaleType } from "@visx-vue/scale";
import { scaleLinear } from "@visx-vue/scale";
import { line, curveCardinal } from "@visx-vue/vendor/d3-shape";

export type ViolinPlotProps<Datum extends object = object> = {
  /** Left pixel offset of the glyph. */
  left?: number;
  /** Top pixel offset of the glyph. */
  top?: number;
  /** Classname to apply to parent group element. */
  className?: string;
  /** Whether the glyph should be rendered horizontally instead of vertically. */
  horizontal?: boolean;
  /** Scale for converting values to pixel offsets. */
  valueScale: PickD3Scale<ContinuousDomainScaleType, number>;
  /** Data used to draw the violin plot glyph. Violin plot values and counts should be able to be derived from data. */
  data: Datum[];
  /** Given a datum, returns the count for it. */
  count?: (d: Datum) => number;
  /** Given a datum, returns the value for it. */
  value?: (d: Datum) => number;
  /** Width of the violin plot glyph. */
  width?: number;
};

const defaultCountAccessor = (d: { count?: unknown }) =>
  typeof d.count === "number" ? d.count : 0;
const defaultValueAccessor = (d: { value?: unknown }) =>
  typeof d.value === "number" ? d.value : 0;

export const ViolinPlot = defineComponent({
  name: "ViolinPlot",
  props: {
    left: { type: Number as PropType<number>, default: 0 },
    top: { type: Number as PropType<number>, default: 0 },
    className: { type: String as PropType<string>, default: undefined },
    horizontal: { type: Boolean as PropType<boolean>, default: undefined },
    valueScale: {
      type: Function as PropType<PickD3Scale<ContinuousDomainScaleType, number>>,
      required: true,
    },
    data: { type: Array as PropType<object[]>, required: true },
    count: { type: Function as PropType<(d: object) => number>, default: defaultCountAccessor },
    value: { type: Function as PropType<(d: object) => number>, default: defaultValueAccessor },
    width: { type: Number as PropType<number>, default: 10 },
  },
  setup(props) {
    const attrs = useAttrs();
    const slots = useSlots();

    return () => {
      const center = (props.horizontal ? props.top : props.left) + props.width / 2;
      const binCounts = props.data.map((bin) => props.count(bin));
      const widthScale = scaleLinear<number>({
        range: [0, props.width / 2],
        round: true,
        domain: [0, Math.max(...binCounts)],
      });

      let path = "";

      if (props.horizontal) {
        const topCurve = line<object>()
          .x((d) => props.valueScale(props.value(d)) ?? 0)
          .y((d) => center - (widthScale(props.count(d)) ?? 0))
          .curve(curveCardinal);

        const bottomCurve = line<object>()
          .x((d) => props.valueScale(props.value(d)) ?? 0)
          .y((d) => center + (widthScale(props.count(d)) ?? 0))
          .curve(curveCardinal);

        const topCurvePath = topCurve(props.data) || "";
        const bottomCurvePath = bottomCurve([...props.data].reverse()) || "";
        path = `${topCurvePath} ${bottomCurvePath.replace("M", "L")} Z`;
      } else {
        const rightCurve = line<object>()
          .x((d) => center + (widthScale(props.count(d)) ?? 0))
          .y((d) => props.valueScale(props.value(d)) ?? 0)
          .curve(curveCardinal);

        const leftCurve = line<object>()
          .x((d) => center - (widthScale(props.count(d)) ?? 0))
          .y((d) => props.valueScale(props.value(d)) ?? 0)
          .curve(curveCardinal);

        const rightCurvePath = rightCurve(props.data) || "";
        const leftCurvePath = leftCurve([...props.data].reverse()) || "";
        path = `${rightCurvePath} ${leftCurvePath.replace("M", "L")} Z`;
      }

      if (slots.default) return <>{slots.default({ path })}</>;
      return <path class={["visx-violin", props.className]} d={path} {...attrs} />;
    };
  },
});
