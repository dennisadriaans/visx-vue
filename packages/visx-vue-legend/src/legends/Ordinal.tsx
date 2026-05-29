import { defineComponent, useAttrs, useSlots, type PropType } from 'vue'
import type { PickD3Scale } from '@visx-vue/scale'
import type { LegendProps } from './Legend'
import Legend from './Legend'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyOrdinalScale = PickD3Scale<'ordinal', any, any>

export type LegendOrdinalProps<Scale extends AnyOrdinalScale> = LegendProps<Scale>

export const LegendOrdinal = defineComponent({
  name: 'LegendOrdinal',
  inheritAttrs: false,
  props: {
    scale: { type: [Object, Function] as PropType<AnyOrdinalScale>, required: true }
  },
  setup(props) {
    const attrs = useAttrs()
    const slots = useSlots()

    return () => (
      <Legend
        {...(attrs as Record<string, unknown>)}
        scale={props.scale}
        v-slots={slots}
      />
    )
  }
})

export default LegendOrdinal
