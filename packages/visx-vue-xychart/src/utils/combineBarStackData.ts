import type { AxisScale } from "@visx-vue/axis";
import type { ScaleInput } from "@visx-vue/scale";
import type { CombinedStackData } from "../types";

/** Config for a single series to be combined into a bar stack. */
export interface BarStackSeriesConfig<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object,
> {
  dataKey: string;
  data: Datum[];
  xAccessor: (d: Datum) => ScaleInput<XScale>;
  yAccessor: (d: Datum) => ScaleInput<YScale>;
}

/** Returns the value which forms a stack group. */
export const getStackValue = <XScale extends AxisScale, YScale extends AxisScale>(
  d: Pick<CombinedStackData<XScale, YScale>, "stack">,
) => d.stack;

/**
 * Merges series configs' `data` by their `stack` value which
 * forms the stack grouping (`x` if vertical, `y` if horizontal)
 * and returns `CombinedStackData[]`.
 */
export default function combineBarStackData<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object,
>(
  seriesConfigs: BarStackSeriesConfig<XScale, YScale, Datum>[],
  horizontal?: boolean,
): CombinedStackData<XScale, YScale>[] {
  const dataByStackValue = new Map<string, CombinedStackData<XScale, YScale>>();

  seriesConfigs.forEach((config) => {
    const { dataKey, data, xAccessor, yAccessor } = config;

    // this should exist but double check
    if (!xAccessor || !yAccessor) return;

    const [stackFn, valueFn] = horizontal ? [yAccessor, xAccessor] : [xAccessor, yAccessor];

    data.forEach((d) => {
      const stack = stackFn(d);
      const numericValue = Number(valueFn(d));
      const stackKey = String(stack);
      if (!dataByStackValue.has(stackKey)) {
        dataByStackValue.set(stackKey, {
          stack,
          positiveSum: 0,
          negativeSum: 0,
        });
      }
      const stackEntry = dataByStackValue.get(stackKey)!;
      stackEntry[dataKey] = numericValue;
      stackEntry[numericValue >= 0 ? "positiveSum" : "negativeSum"] += numericValue;
    });
  });

  return Array.from(dataByStackValue.values());
}
