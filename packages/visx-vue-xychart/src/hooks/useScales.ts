import type { AxisScaleOutput, AxisScale } from "@visx-vue/axis";
import type { ScaleConfig, ScaleInput } from "@visx-vue/scale";
import { createScale, scaleCanBeZeroed } from "@visx-vue/scale";
import { extent as d3Extent } from "@visx-vue/vendor/d3-array";
import { computed, type Ref } from "vue";
import type DataRegistry from "../classes/DataRegistry";
import isDiscreteScale from "../utils/isDiscreteScale";

/** A composable for creating reactive x- and y-scales. */
export default function useScales<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object,
>({
  dataRegistry,
  xRange,
  xScaleConfig,
  yRange,
  yScaleConfig,
}: {
  xScaleConfig: ScaleConfig<AxisScaleOutput>;
  yScaleConfig: ScaleConfig<AxisScaleOutput>;
  dataRegistry: Omit<DataRegistry<XScale, YScale, Datum>, "registry" | "registryKeys">;
  xRange: Ref<[number, number]> | [number, number];
  yRange: Ref<[number, number]> | [number, number];
}) {
  const xScale = computed(() => {
    const range = "value" in xRange ? xRange.value : xRange;
    const [xMin, xMax] = range;
    const registryKeys = dataRegistry.keys();
    const registryEntries = registryKeys.map((key) => dataRegistry.get(key));

    type XScaleInput = ScaleInput<XScale>;

    const xValues = registryEntries.reduce<XScaleInput[]>(
      (combined, entry) =>
        entry ? combined.concat(entry.data.map((d: Datum) => entry.xAccessor(d))) : combined,
      [],
    );

    // d3Extent scale returns NaN domain for empty arrays
    if (xValues.length === 0) return undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const xDomain = isDiscreteScale(xScaleConfig) ? xValues : d3Extent(xValues as any);

    let scale = (
      scaleCanBeZeroed(xScaleConfig)
        ? createScale({
            range: [xMin, xMax],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            domain: xDomain as any,
            zero: true,
            ...xScaleConfig,
          })
        : createScale({
            range: [xMin, xMax],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            domain: xDomain as any,
            ...xScaleConfig,
          })
    ) as XScale;

    // apply any scale updates from the registry
    registryEntries.forEach((entry) => {
      if (entry?.xScale) scale = entry.xScale(scale);
    });

    return scale;
  });

  const yScale = computed(() => {
    const range = "value" in yRange ? yRange.value : yRange;
    const [yMin, yMax] = range;
    const registryKeys = dataRegistry.keys();
    const registryEntries = registryKeys.map((key) => dataRegistry.get(key));

    type YScaleInput = ScaleInput<YScale>;

    const yValues = registryEntries.reduce<YScaleInput[]>(
      (combined, entry) =>
        entry ? combined.concat(entry.data.map((d: Datum) => entry.yAccessor(d))) : combined,
      [],
    );

    // d3Extent scale returns NaN domain for empty arrays
    if (yValues.length === 0) return undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const yDomain = isDiscreteScale(yScaleConfig) ? yValues : d3Extent(yValues as any);

    let scale = (
      scaleCanBeZeroed(yScaleConfig)
        ? createScale({
            range: [yMin, yMax],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            domain: yDomain as any,
            zero: true,
            ...yScaleConfig,
          })
        : createScale({
            range: [yMin, yMax],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            domain: yDomain as any,
            ...yScaleConfig,
          })
    ) as YScale;

    // apply any scale updates from the registry
    registryEntries.forEach((entry) => {
      if (entry?.yScale) scale = entry.yScale(scale);
    });

    return scale;
  });

  return { xScale, yScale };
}
