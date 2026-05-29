import { computed, inject, toValue, watchEffect } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import type { SeriesPoint } from '@visx-vue/vendor/d3-shape'
import { stack as d3stack } from '@visx-vue/vendor/d3-shape'
import { stackOffset, stackOrder } from '@visx-vue/shape'
import type { StackOffset } from '@visx-vue/shape'
import type { StackOrder } from '@visx-vue/shape'
import { extent } from '@visx-vue/vendor/d3-array'
import type { AxisScale } from '@visx-vue/axis'
import type { ScaleInput } from '@visx-vue/scale'
import { DataContextKey } from '../context/DataContext'
import type { CombinedStackData, DataContextType } from '../types'
import getBarStackRegistryData from '../utils/getBarStackRegistryData'
import combineBarStackData, { type BarStackSeriesConfig } from '../utils/combineBarStackData'

export interface StackedSeriesConfig<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object
> {
  dataKey: string
  data: Datum[]
  xAccessor: (d: Datum) => ScaleInput<XScale>
  yAccessor: (d: Datum) => ScaleInput<YScale>
}

type UseStackedDataOptions<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object
> = {
  seriesConfigs: MaybeRefOrGetter<StackedSeriesConfig<XScale, YScale, Datum>[]>
  order?: StackOrder
  offset?: StackOffset
}

export default function useStackedData<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object
>({ seriesConfigs, order, offset }: UseStackedDataOptions<XScale, YScale, Datum>) {
  type StackDatum = SeriesPoint<CombinedStackData<XScale, YScale>>

  const { horizontal, registerData, unregisterData } = inject(
    DataContextKey,
    {}
  ) as DataContextType<XScale, YScale, StackDatum>

  // extract data keys from series configs
  const dataKeys = computed(() => toValue(seriesConfigs).map((config) => config.dataKey))

  // group all series data by stack value — format needed by d3Stack
  const combinedData = computed(() =>
    combineBarStackData<XScale, YScale, Datum>(
      toValue(seriesConfigs) as BarStackSeriesConfig<XScale, YScale, Datum>[],
      horizontal
    )
  )

  // stack data
  const stackedData = computed(() => {
    const data = combinedData.value
    const keys = dataKeys.value

    // automatically set offset to diverging if it's undefined and negative values are present
    const hasSomeNegativeValues = offset ? null : data.some((d) => d.negativeSum < 0)

    const stack = d3stack<CombinedStackData<XScale, YScale>, string>()
    stack.keys(keys)
    if (order) stack.order(stackOrder(order))
    if (offset || hasSomeNegativeValues) stack.offset(stackOffset(offset || 'diverging'))

    return stack(data)
  })

  // update the domain to account for the (directional) stacked value
  const comprehensiveDomain = computed(
    () =>
      extent(
        stackedData.value.reduce((allDatum: number[], stack) => {
          stack.forEach(([min, max]) => {
            allDatum.push(min)
            allDatum.push(max)
          })
          return allDatum
        }, [])
      ) as [number, number]
  )

  // register all child data using the stack-transformed values
  watchEffect((onCleanup) => {
    const data = stackedData.value
    const domain = comprehensiveDomain.value
    const keys = dataKeys.value

    const dataToRegister = getBarStackRegistryData(data, domain, horizontal)
    registerData(dataToRegister)

    onCleanup(() => unregisterData(keys))
  })

  return { dataKeys, stackedData }
}
