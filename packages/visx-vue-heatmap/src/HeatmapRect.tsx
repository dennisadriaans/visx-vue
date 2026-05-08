import { defineComponent, useAttrs, useSlots, type PropType } from "vue";
import { Group } from "@visx-vue/group";
import type { GenericCell, ColorScale, OpacityScale } from "./types";

export type HeatmapRectProps<ColumnDatum, BinDatum> = {
  /** Array of column data (one per column desired) for the heatmap. */
  data?: ColumnDatum[];
  /** Left offset applied to heatmap wrapper g element. */
  left?: number;
  /** Top offset applied to heatmap wrapper g element. */
  top?: number;
  /** Width of a rect bin. */
  binWidth?: number;
  /** Height of a rect bin. */
  binHeight?: number;
  /**  */
  x0?: number;
  /** Pixel gap between heatmap rects. */
  gap?: number;
  /** Given a column index, returns the x position of a rect cell. */
  xScale: (columnIndex: number) => number;
  /** Given a row index, returns the y position of a rect cell. */
  yScale: (rowIndex: number) => number;
  /** Given a count value, returns the desired rect fill color. */
  colorScale?: ColorScale;
  /** Given a count value, returns the desired rect fill opacity. */
  opacityScale?: OpacityScale;
  /** Accessor that returns an array of cell BinDatums (rows) for the provided ColumnData. */
  bins?: (column: ColumnDatum) => BinDatum[];
  /** Accessor that returns the count for the provided Bin. */
  count?: (bin: BinDatum) => number;
  /** className to apply to each heatmap rect element. */
  className?: string;
};

export type RectCell<ColumnDatum, BinDatum> = GenericCell<ColumnDatum, BinDatum> & {
  /** binWidth less grid gap (effective width). */
  width: number;
  /** binHeight less grid gap (effective height). */
  height: number;
  /** x position of the cell rect. */
  x: number;
  /** y position of the cell rect. */
  y: number;
};

export type ComponentProps<ColumnDatum, BinDatum> = HeatmapRectProps<ColumnDatum, BinDatum> &
  Omit<
    Record<string, unknown>,
    | keyof HeatmapRectProps<ColumnDatum, BinDatum>
    | "width"
    | "height"
    | "x"
    | "y"
    | "fill"
    | "fillOpacity"
  >;

export type RectCellSlotProps<ColumnDatum, BinDatum> = {
  cells: RectCell<ColumnDatum, BinDatum>[][];
};

export const HeatmapRect = defineComponent({
  name: "HeatmapRect",
  inheritAttrs: false,
  props: {
    data: { type: Array as PropType<unknown[]>, default: () => [] },
    left: { type: Number as PropType<number>, default: undefined },
    top: { type: Number as PropType<number>, default: undefined },
    binWidth: { type: Number as PropType<number>, default: 6 },
    binHeight: { type: Number as PropType<number>, default: 6 },
    x0: { type: Number as PropType<number>, default: 0 },
    gap: { type: Number as PropType<number>, default: 1 },
    xScale: {
      type: Function as PropType<(columnIndex: number) => number>,
      required: true as const,
    },
    yScale: { type: Function as PropType<(rowIndex: number) => number>, required: true as const },
    colorScale: { type: Function as PropType<ColorScale>, default: () => undefined },
    opacityScale: { type: Function as PropType<OpacityScale>, default: () => 1 },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bins: { type: Function as PropType<(column: any) => any[]>, default: (d: any) => d?.bins },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    count: { type: Function as PropType<(bin: any) => number>, default: (d: any) => d?.count },
    className: { type: String as PropType<string>, default: undefined },
  },
  setup(props) {
    const attrs = useAttrs();
    const slots = useSlots();

    return () => {
      const width = props.binWidth - props.gap;
      const height = props.binHeight - props.gap;

      const heatmap: RectCell<unknown, unknown>[][] = (props.data as unknown[]).map(
        (datum, column) => {
          const x = props.xScale(column);
          return props.bins(datum).map((bin, row) => {
            const countValue = props.count(bin);
            return {
              bin,
              row,
              column,
              datum,
              width,
              height,
              gap: props.gap,
              count: countValue,
              x: x + props.x0,
              y: props.yScale(row) + props.gap,
              color: props.colorScale?.(countValue),
              opacity: props.opacityScale?.(countValue) ?? 1,
            };
          });
        },
      );

      if (slots.default) return slots.default({ cells: heatmap });

      return (
        <Group class="visx-heatmap-rects" top={props.top} left={props.left}>
          {heatmap.map((_bins) =>
            _bins.map((bin) => (
              <rect
                key={`heatmap-tile-rect-${bin.row}-${bin.column}`}
                class={["visx-heatmap-rect", props.className]}
                width={bin.width}
                height={bin.height}
                x={bin.x}
                y={bin.y}
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
