import { defineComponent, useAttrs, useSlots, type PropType, type CSSProperties } from "vue";
import { Line } from "@visx-vue/shape";
import type { LineProps } from "@visx-vue/shape";
import { Group } from "@visx-vue/group";
import { Point } from "@visx-vue/point";
import type { ScaleInput } from "@visx-vue/scale";
import { getTicks, coerceNumber } from "@visx-vue/scale";
import type { CommonGridProps, GridScale, GridLines } from "../types";
import getScaleBandwidth from "../utils/getScaleBandwidth";
import toSvgProps from "../utils/toSvgProps";

export type GridColumnsProps<Scale extends GridScale> = CommonGridProps & {
  /** `@visx/scale` or `d3-scale` object used to convert value to position. */
  scale: Scale;
  /**
   * Exact values used to generate grid lines using `scale`.
   * Overrides `numTicks` if specified.
   */
  tickValues?: ScaleInput<Scale>[];
  /** Total height of each grid column line. */
  height: number;
};

export type AllGridColumnsProps<Scale extends GridScale> = GridColumnsProps<Scale> &
  Omit<LineProps & Record<string, unknown>, keyof GridColumnsProps<Scale>>;

export const GridColumns = defineComponent({
  name: "GridColumns",
  inheritAttrs: false,
  props: {
    top: { type: Number as PropType<number>, default: 0 },
    left: { type: Number as PropType<number>, default: 0 },
    scale: { type: Function as PropType<GridScale>, required: true },
    height: { type: Number as PropType<number>, required: true },
    stroke: { type: String as PropType<string>, default: "#eaf0f6" },
    strokeWidth: { type: [String, Number] as PropType<string | number>, default: 1 },
    strokeDasharray: { type: String as PropType<string>, default: undefined },
    className: { type: String as PropType<string>, default: undefined },
    numTicks: { type: Number as PropType<number>, default: 10 },
    lineStyle: { type: Object as PropType<CSSProperties>, default: undefined },
    offset: { type: Number as PropType<number>, default: undefined },
    tickValues: { type: Array as PropType<unknown[]>, default: undefined },
  },
  setup(props) {
    const attrs = useAttrs();
    const slots = useSlots();

    return () => {
      const ticks = props.tickValues ?? getTicks(props.scale, props.numTicks);
      const scaleOffset = (props.offset ?? 0) + getScaleBandwidth(props.scale) / 2;
      const tickLines: GridLines = ticks.map((d, index) => {
        const x = (coerceNumber(props.scale(d)) ?? 0) + scaleOffset;
        return {
          index,
          from: new Point({ x, y: 0 }),
          to: new Point({ x, y: props.height }),
        };
      });

      const childrenSlot = slots.default as ((props: { lines: GridLines }) => unknown) | undefined;

      const lineProps = toSvgProps({
        stroke: props.stroke,
        strokeWidth: props.strokeWidth,
        strokeDasharray: props.strokeDasharray,
        ...attrs,
      });

      return (
        <Group
          className={["visx-columns", props.className].filter(Boolean).join(" ")}
          top={props.top}
          left={props.left}
        >
          {{
            default: () =>
              childrenSlot
                ? childrenSlot({ lines: tickLines })
                : tickLines.map(({ from, to, index }) => (
                    <Line
                      key={`column-line-${index}`}
                      from={from}
                      to={to}
                      style={props.lineStyle}
                      {...lineProps}
                    />
                  )),
          }}
        </Group>
      );
    };
  },
});

export default GridColumns;
