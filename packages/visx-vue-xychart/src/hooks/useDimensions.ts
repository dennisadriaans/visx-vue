import { ref } from "vue";
import type { Margin } from "../types";

const DEFAULT_DIMS = {
  width: 0,
  height: 0,
  margin: { top: 0, right: 0, bottom: 0, left: 0 } as Margin,
};

export type Dimensions = typeof DEFAULT_DIMS;

/** A composable for accessing and setting memoized width, height, and margin chart dimensions. */
export default function useDimensions(initialDims?: Partial<Dimensions>) {
  const width = ref(initialDims?.width ?? DEFAULT_DIMS.width);
  const height = ref(initialDims?.height ?? DEFAULT_DIMS.height);
  const margin = ref<Margin>(initialDims?.margin ?? { ...DEFAULT_DIMS.margin });

  function setDimensions(dims: Dimensions) {
    if (
      dims.width !== width.value ||
      dims.height !== height.value ||
      dims.margin.left !== margin.value.left ||
      dims.margin.right !== margin.value.right ||
      dims.margin.top !== margin.value.top ||
      dims.margin.bottom !== margin.value.bottom
    ) {
      width.value = dims.width;
      height.value = dims.height;
      margin.value = dims.margin;
    }
  }

  return { width, height, margin, setDimensions };
}
