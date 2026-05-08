import { defineComponent, useAttrs } from "vue";
import { GridRows, GridColumns } from "@visx-vue/grid";
import type { BaseGridProps } from "./BaseGrid";
import BaseGrid from "./BaseGrid";

export type GridProps = Omit<BaseGridProps, "GridRowsComponent" | "GridColumnsComponent">;

const Grid = defineComponent({
  name: "XYChartGrid",
  inheritAttrs: false,
  setup() {
    const attrs = useAttrs();
    return () => (
      <BaseGrid GridRowsComponent={GridRows} GridColumnsComponent={GridColumns} {...attrs} />
    );
  },
});

export default Grid;
