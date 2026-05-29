import { defineComponent, useAttrs, useSlots, type PropType } from 'vue'
import type { PickD3Scale, ScaleInput } from '@visx-vue/scale'
import type { LegendProps } from './Legend'
import Legend from './Legend'
import type { LabelFormatterFactory } from '../types'
import identity from '../util/identity'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyThresholdScale = PickD3Scale<'threshold', any, any, any>

const formatZero = (label: unknown) => (label === 0 ? '0' : label || '')

type TransformProps = {
  /** The delimiter string to use between threshold values. */
  labelDelimiter?: string
  /** The prefix to use for the lower threshold label. */
  labelLower?: string
  /** The prefix to use for the upper threshold label. */
  labelUpper?: string
}

export type LegendThresholdProps<Scale extends AnyThresholdScale> = LegendProps<Scale> &
  TransformProps & {
    labelTransform?: LabelFormatterFactory<Scale>
  }

/** Default transform implicitly assumes that Datum is of type number. */
function defaultTransform<Scale extends AnyThresholdScale>({
  labelDelimiter,
  labelLower,
  labelUpper
}: TransformProps): LabelFormatterFactory<Scale> {
  return ({ scale, labelFormat }) => {
    const scaleRange = scale.range()

    type Datum = ScaleInput<Scale>

    return (d, i) => {
      const [d0, d1] =
        scaleRange.length >= i ? scale.invertExtent(scaleRange[i]) : [undefined, undefined]

      let delimiter = ` ${labelDelimiter} `
      let text = ''
      let value: number | Datum | undefined

      if (d0 == null && typeof d1 === 'number') {
        delimiter = labelLower || delimiter
        value = d1 - Math.abs(2 * d1 - 1)
        text = `${delimiter}${formatZero(labelFormat(d1, i))}`
      } else if (d0 != null && d1 != null) {
        value = d
        text = `${formatZero(labelFormat(d0, i))}${delimiter}${formatZero(labelFormat(d1, i))}`
      } else if (typeof d0 === 'number' && d1 == null) {
        delimiter = labelUpper || delimiter
        value = d0 + Math.abs(2 * d0 + 1)
        text = `${delimiter}${formatZero(labelFormat(d0, i))}`
      }

      return {
        extent: [d0, d1],
        value: scale(value),
        text,
        datum: d,
        index: i
      }
    }
  }
}

export const LegendThreshold = defineComponent({
  name: 'LegendThreshold',
  inheritAttrs: false,
  props: {
    scale: { type: [Object, Function] as PropType<AnyThresholdScale>, required: true },
    domain: { type: Array as PropType<any[]>, default: undefined },
    labelFormat: { type: Function as PropType<any>, default: identity },
    labelTransform: { type: Function as PropType<LabelFormatterFactory<any>>, default: undefined },
    labelDelimiter: { type: String as PropType<string>, default: 'to' },
    labelLower: { type: String as PropType<string>, default: 'Less than ' },
    labelUpper: { type: String as PropType<string>, default: 'More than ' }
  },
  setup(props) {
    const attrs = useAttrs()
    const slots = useSlots()

    return () => {
      const domain =
        props.domain ||
        (props.scale as any)
          .range()
          .map((output: any) => (props.scale as any).invertExtent(output)[0])

      const labelTransform =
        props.labelTransform ||
        defaultTransform({
          labelDelimiter: props.labelDelimiter,
          labelLower: props.labelLower,
          labelUpper: props.labelUpper
        })

      return (
        <Legend
          {...(attrs as Record<string, unknown>)}
          scale={props.scale}
          domain={domain}
          labelFormat={props.labelFormat}
          labelTransform={labelTransform}
          v-slots={slots}
        />
      )
    }
  }
})

export default LegendThreshold
