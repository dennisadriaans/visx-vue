import { defineComponent, useSlots, type PropType, type SVGAttributes } from "vue";
import { Group } from "@visx-vue/group";
import type { PickD3Scale, ContinuousDomainScaleType } from "@visx-vue/scale";
import type { SharedProps, ChildRenderProps, LineCoords } from "./types";

function verticalToHorizontal({ x1, x2, y1, y2 }: LineCoords) {
  return {
    x1: y1,
    x2: y2,
    y1: x1,
    y2: x2,
  };
}

export type BoxPlotProps = SharedProps & {
  /** Scale for converting input values to pixel offsets. */
  valueScale: PickD3Scale<ContinuousDomainScaleType, number>;
  /** Maximum BoxPlot value. */
  max?: number;
  /** Minimum BoxPlot value. */
  min?: number;
  /** First quartile BoxPlot value. */
  firstQuartile?: number;
  /** Third quartile BoxPlot value. */
  thirdQuartile?: number;
  /** Median BoxPlot value. */
  median?: number;
  /** Width of the BoxPlot. */
  boxWidth?: number;
  /** Fill color to apply to outlier circles and BoxPlot rect. */
  fill?: string;
  /** Fill color opacity to apply to outlier circles and BoxPlot rect. */
  fillOpacity?: number | string;
  /** Stroke color to apply to outlier circles, BoxPlot rect, and min/median/max lines. */
  stroke?: string;
  /** Stroke width to apply to outlier circles, BoxPlot rect, and min/median/max lines. */
  strokeWidth?: number | string;
  /** Rx to apply to BoxPlot rect. */
  rx?: number;
  /** Ry to apply to BoxPlot rect. */
  ry?: number;
  /** Array of outlier values to be rendered. */
  outliers?: number[];
  /** Props to pass to the median glyph line. */
  medianProps?: SVGAttributes;
  /** Props to pass to the maximum glyph line. */
  maxProps?: SVGAttributes;
  /** Props to pass to the minimum glyph line. */
  minProps?: SVGAttributes;
  /** Props to pass to the box glyph rect. */
  boxProps?: SVGAttributes;
  /** Props to pass to the outlier glyph circles. */
  outlierProps?: SVGAttributes;
  /** Whether to render a container rect element (e.g., to capture mouse events). */
  container?: boolean;
  /** Props to pass to the container glyph rect if rendered. */
  containerProps?: SVGAttributes;
};

export const BoxPlot = defineComponent({
  name: "BoxPlot",
  props: {
    left: { type: Number as PropType<number>, default: 0 },
    top: { type: Number as PropType<number>, default: 0 },
    className: { type: String as PropType<string>, default: undefined },
    max: { type: Number as PropType<number>, default: undefined },
    min: { type: Number as PropType<number>, default: undefined },
    firstQuartile: { type: Number as PropType<number>, default: undefined },
    thirdQuartile: { type: Number as PropType<number>, default: undefined },
    median: { type: Number as PropType<number>, default: undefined },
    boxWidth: { type: Number as PropType<number>, default: 10 },
    fill: { type: String as PropType<string>, default: undefined },
    fillOpacity: { type: [Number, String] as PropType<number | string>, default: undefined },
    stroke: { type: String as PropType<string>, default: undefined },
    strokeWidth: { type: [Number, String] as PropType<number | string>, default: undefined },
    rx: { type: Number as PropType<number>, default: 2 },
    ry: { type: Number as PropType<number>, default: 2 },
    valueScale: {
      type: Function as PropType<PickD3Scale<ContinuousDomainScaleType, number>>,
      required: true,
    },
    outliers: { type: Array as PropType<number[]>, default: () => [] },
    horizontal: { type: Boolean as PropType<boolean>, default: undefined },
    medianProps: { type: Object as PropType<SVGAttributes>, default: () => ({}) },
    maxProps: { type: Object as PropType<SVGAttributes>, default: () => ({}) },
    minProps: { type: Object as PropType<SVGAttributes>, default: () => ({}) },
    boxProps: { type: Object as PropType<SVGAttributes>, default: () => ({}) },
    outlierProps: { type: Object as PropType<SVGAttributes>, default: () => ({}) },
    container: { type: Boolean as PropType<boolean>, default: false },
    containerProps: { type: Object as PropType<SVGAttributes>, default: () => ({}) },
  },
  setup(props) {
    const slots = useSlots();

    return () => {
      const offset = props.horizontal ? props.top : props.left;
      const center = offset + (props.boxWidth || 0) / 2;
      const valueRange = props.valueScale.range();

      const minValue = props.valueScale(props.min ?? 0);
      const firstQuartileValue = props.valueScale(props.firstQuartile ?? 0);
      const medianValue = props.valueScale(props.median ?? 0);
      const thirdQuartileValue = props.valueScale(props.thirdQuartile ?? 0);
      const maxValue = props.valueScale(props.max ?? 0);

      const boxplot: ChildRenderProps = {
        valueRange,
        center,
        offset,
        boxWidth: props.boxWidth,
        max: {
          x1: center - (props.boxWidth || 0) / 4,
          x2: center + (props.boxWidth || 0) / 4,
          y1: maxValue,
          y2: maxValue,
        },
        maxToThird: {
          x1: center,
          x2: center,
          y1: maxValue,
          y2: thirdQuartileValue,
        },
        median: {
          x1: offset,
          x2: offset + (props.boxWidth || 0),
          y1: medianValue,
          y2: medianValue,
        },
        minToFirst: {
          x1: center,
          x2: center,
          y1: firstQuartileValue,
          y2: minValue,
        },
        min: {
          x1: center - (props.boxWidth || 0) / 4,
          x2: center + (props.boxWidth || 0) / 4,
          y1: minValue,
          y2: minValue,
        },
        box: {
          x1: offset,
          x2: props.boxWidth || 0,
          y1: thirdQuartileValue,
          y2: Math.abs(thirdQuartileValue - firstQuartileValue),
        },
        container: {
          x1: offset,
          x2: props.boxWidth || 0,
          y1: Math.min(...valueRange),
          y2: Math.abs(valueRange[0] - valueRange[1]),
        },
      };

      if (props.horizontal) {
        boxplot.max = verticalToHorizontal(boxplot.max);
        boxplot.maxToThird = verticalToHorizontal(boxplot.maxToThird);
        boxplot.box.y1 = firstQuartileValue;
        boxplot.box = verticalToHorizontal(boxplot.box);
        boxplot.median = verticalToHorizontal(boxplot.median);
        boxplot.minToFirst = verticalToHorizontal(boxplot.minToFirst);
        boxplot.min = verticalToHorizontal(boxplot.min);
        boxplot.container = verticalToHorizontal(boxplot.container);
        boxplot.container.y1 = Math.min(...valueRange);
      }

      if (slots.default) return <>{slots.default(boxplot)}</>;

      return (
        <Group class={["visx-boxplot", props.className]}>
          {props.outliers.map((d, i) => {
            const cx = props.horizontal ? props.valueScale(d) : center;
            const cy = props.horizontal ? center : props.valueScale(d);
            return (
              <circle
                key={`visx-boxplot-outlier-${i}`}
                class="visx-boxplot-outlier"
                cx={cx}
                cy={cy}
                r={4}
                stroke={props.stroke}
                stroke-width={props.strokeWidth}
                fill={props.fill}
                fill-opacity={props.fillOpacity}
                {...props.outlierProps}
              />
            );
          })}
          <line
            class="visx-boxplot-max"
            x1={boxplot.max.x1}
            y1={boxplot.max.y1}
            x2={boxplot.max.x2}
            y2={boxplot.max.y2}
            stroke={props.stroke}
            stroke-width={props.strokeWidth}
            {...props.maxProps}
          />
          <line
            class="visx-boxplot-max-to-third"
            x1={boxplot.maxToThird.x1}
            y1={boxplot.maxToThird.y1}
            x2={boxplot.maxToThird.x2}
            y2={boxplot.maxToThird.y2}
            stroke={props.stroke}
            stroke-width={props.strokeWidth}
          />
          <rect
            class="visx-boxplot-box"
            x={boxplot.box.x1}
            y={boxplot.box.y1}
            width={boxplot.box.x2}
            height={boxplot.box.y2}
            stroke={props.stroke}
            stroke-width={props.strokeWidth}
            fill={props.fill}
            fill-opacity={props.fillOpacity}
            rx={props.rx}
            ry={props.ry}
            {...props.boxProps}
          />
          <line
            class="visx-boxplot-median"
            x1={boxplot.median.x1}
            y1={boxplot.median.y1}
            x2={boxplot.median.x2}
            y2={boxplot.median.y2}
            stroke={props.stroke}
            stroke-width={props.strokeWidth}
            {...props.medianProps}
          />
          <line
            class="visx-boxplot-min-to-first"
            x1={boxplot.minToFirst.x1}
            y1={boxplot.minToFirst.y1}
            x2={boxplot.minToFirst.x2}
            y2={boxplot.minToFirst.y2}
            stroke={props.stroke}
            stroke-width={props.strokeWidth}
          />
          <line
            class="visx-boxplot-min"
            x1={boxplot.min.x1}
            y1={boxplot.min.y1}
            x2={boxplot.min.x2}
            y2={boxplot.min.y2}
            stroke={props.stroke}
            stroke-width={props.strokeWidth}
            {...props.minProps}
          />
          {props.container && (
            <rect
              x={boxplot.container.x1}
              y={boxplot.container.y1}
              width={boxplot.container.x2}
              height={boxplot.container.y2}
              fill-opacity="0"
              {...props.containerProps}
            />
          )}
        </Group>
      );
    };
  },
});
