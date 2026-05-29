// @vitest-environment jsdom
import { describe, it, expect } from 'vite-plus/test'
import combineBarStackData from '../../src/utils/combineBarStackData'
import type { BarStackSeriesConfig } from '../../src/utils/combineBarStackData'

type Datum = { x: number; y: number }

const accessors = {
  xAccessor: (d: Datum) => d.x,
  yAccessor: (d: Datum) => d.y
}

const series1: BarStackSeriesConfig<any, any, Datum> = {
  dataKey: 'bar1',
  data: [
    { x: 10, y: 5 },
    { x: 7, y: -5 }
  ],
  ...accessors
}

const series2: BarStackSeriesConfig<any, any, Datum> = {
  dataKey: 'bar2',
  data: [
    { x: 10, y: 5 },
    { x: 7, y: 20 }
  ],
  ...accessors
}

// DEVIATION: The React test passes React children (BarSeries elements) to combineBarStackData.
// The Vue version takes BarStackSeriesConfig[] directly instead.
const seriesConfigs = [series1, series2]

describe('combineBarStackData', () => {
  it('should be defined', () => {
    expect(combineBarStackData).toBeDefined()
  })

  it('should combine data by x stack value when horizontal=false', () => {
    expect(combineBarStackData(seriesConfigs)).toEqual([
      { stack: 10, bar1: 5, bar2: 5, positiveSum: 10, negativeSum: 0 },
      { stack: 7, bar1: -5, bar2: 20, positiveSum: 20, negativeSum: -5 }
    ])
  })
  it('should combine data by y stack value when horizontal=true', () => {
    expect(combineBarStackData(seriesConfigs, true)).toEqual([
      { stack: 5, bar1: 10, bar2: 10, positiveSum: 20, negativeSum: 0 },
      { stack: -5, bar1: 7, positiveSum: 7, negativeSum: 0 },
      { stack: 20, bar2: 7, positiveSum: 7, negativeSum: 0 }
    ])
  })
})
