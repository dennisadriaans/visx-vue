import { defineComponent, useAttrs, type PropType } from 'vue'
import { Axis as VisxAxis } from '@visx-vue/axis'
import type { BaseAxisProps } from './BaseAxis'
import BaseAxis from './BaseAxis'

export type AxisProps = Omit<BaseAxisProps, 'AxisComponent'>

const Axis = defineComponent({
  name: 'XYChartAxis',
  inheritAttrs: false,
  props: {
    orientation: { type: String as PropType<'top' | 'bottom' | 'left' | 'right'>, required: true }
  },
  setup(props) {
    const attrs = useAttrs()
    return () => (
      <BaseAxis
        AxisComponent={VisxAxis}
        orientation={props.orientation}
        {...attrs}
      />
    )
  }
})

export default Axis
