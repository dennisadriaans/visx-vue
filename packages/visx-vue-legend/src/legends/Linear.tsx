import { defineComponent, useAttrs, useSlots, type PropType } from 'vue'
import type { PickD3Scale } from '@visx-vue/scale'
import type { LegendProps } from './Legend'
import Legend from './Legend'
import defaultDomain from '../util/defaultDomain'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyLinearScale = PickD3Scale<'linear', any>

export type LegendLinearProps<Scale extends AnyLinearScale> = {
  /** Number of discrete steps to show in the legend. */
  steps?: number
} & LegendProps<Scale>

export const LegendLinear = defineComponent({
  name: 'LegendLinear',
  inheritAttrs: false,
  props: {
    steps: { type: Number as PropType<number>, default: 5 },
    scale: { type: [Object, Function] as PropType<AnyLinearScale>, required: true },
    domain: { type: Array as PropType<any[]>, default: undefined }
  },
  setup(props) {
    const attrs = useAttrs()
    const slots = useSlots()

    return () => {
      const domain = props.domain || defaultDomain({ steps: props.steps, scale: props.scale })
      return (
        <Legend
          {...(attrs as Record<string, unknown>)}
          scale={props.scale}
          domain={domain}
          v-slots={slots}
        />
      )
    }
  }
})

export default LegendLinear
