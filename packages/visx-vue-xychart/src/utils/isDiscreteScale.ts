/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxisScaleOutput } from '@visx-vue/axis'
import type { ScaleConfig } from '@visx-vue/scale'

export default function isDiscreteScale(scaleConfig: ScaleConfig<AxisScaleOutput, any, any>) {
  return (
    scaleConfig?.type === 'band' || scaleConfig?.type === 'ordinal' || scaleConfig?.type === 'point'
  )
}
