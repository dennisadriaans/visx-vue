import { defineComponent, useAttrs, useSlots, type PropType } from "vue";
import { Group } from "@visx-vue/group";
import type { GenericCell, ColorScale, OpacityScale } from "./types";

export type HeatmapCircleProps<ColumnDatum, BinDatum> = {
  /** Array of column data (one per column desired) for the heatmap. */
  data?: ColumnDatum[];
  /** Left offset applied to heatmap wrapper g element. */
  left?: number;
  /** Top offset applied to heatmap wrapper g element. */
  top?: number;
  /** Pixel gap between heatmap circles. */
  gap?: number;
  /** Pixel radius of heatmap circles. */
  radius?: number;
  /** Given a column index, returns the x position of a circle cell. */
  xScale: (columnIndex: number) => number;
  /** Given a row index, returns the y position of a circle cell. */
  yScale: (rowIndex: number) => number;
  /** Given a count value, returns the desired circle fill color. */
  colorScale?: ColorScale;
  /** Given a count value, returns the desired circle fill opacity. */
  opacityScale?: OpacityScale;
  /** Accessor that returns an array of cell BinDatums (rows) for the provided ColumnData. */
  bins?: (column: ColumnDatum) => BinDatum[];
  /** Accessor that returns the count for the provided Bin. */
  count?: (bin: BinDatum) => number;
  /** className to apply to each heatmap circle element. */
  className?: string;
};

export type CircleCell<ColumnDatum, BinDatum> = GenericCell<ColumnDatum, BinDatum> & {
  /** Computed radius for the circle (radius - gap). */
  r: number;
  /** Input radius for the circle including specified gap. */
  radius: number;
  /** x position of the cell circle center. */
  cx: number;
  /** y position of the cell circle center. */
  cy: number;
};

export type CircleCellSlotProps<ColumnDatum, BinDatum> = {
  cells: CircleCell<ColumnDatum, BinDatum>[][];
};

export const HeatmapCircle = defineComponent({
  name: "HeatmapCircle",
  inheritAttrs: false,
  props: {
    data: { type: Array as PropType<unknown[]>, default: () => [] },
    left: { type: Number as PropType<number>, default: undefined },
    top: { type: Number as PropType<number>, default: undefined },
    gap: { type: Number as PropType<number>, default: 1 },
    radius: { type: Number as PropType<number>, default: 6 },
    xScale: {
      type: Function as PropType<(columnIndex: number) => number>,
      required: true as const,
    },
    yScale: { type: Function as PropType<(rowIndex: number) => number>, required: true as const },
    colorScale: { type: Function as PropType<ColorScale>, default: () => undefined },
    opacityScale: { type: Function as PropType<OpacityScale>, default: () => 1 },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bins: {
      type: Function as PropType<(column: any) => any[]>,
      default: (column: any) => column?.bins,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    count: {
      type: Function as PropType<(bin: any) => number>,
      default: (cell: any) => cell?.count,
    },
    className: { type: String as PropType<string>, default: undefined },
  },
  setup(props) {
    const attrs = useAttrs();
    const slots = useSlots();

    return () => {
      const innerRadius = props.radius - props.gap;

      const heatmap: CircleCell<unknown, unknown>[][] = (props.data as unknown[]).map(
        (columnDatum, column) => {
          const x = props.xScale(column);
          return props.bins(columnDatum).map((bin, row) => {
            const countValue = props.count(bin);
            return {
              bin,
              row,
              column,
              datum: columnDatum,
              radius: props.radius,
              gap: props.gap,
              count: countValue,
              cx: props.radius + x,
              cy: props.yScale(row) + props.gap + props.radius,
              r: innerRadius,
              opacity: props.opacityScale?.(countValue) ?? 1,
              color: props.colorScale?.(countValue),
            };
          });
        },
      );

      if (slots.default) return slots.default({ cells: heatmap });

      return (
        <Group class="visx-heatmap-circles" top={props.top} left={props.left}>
          {heatmap.map((columns) =>
            columns.map((bin) => (
              <circle
                key={`heatmap-tile-circle-${bin.row}-${bin.column}`}
                class={["visx-heatmap-circle", props.className]}
                r={bin.r}
                cx={bin.cx}
                cy={bin.cy}
                fill={bin.color}
                fill-opacity={bin.opacity}
                {...attrs}
              />
            )),
          )}
        </Group>
      );
    };
  },
});
