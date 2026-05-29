import { defineComponent, type PropType, type VNode, h } from 'vue'
import { Axis } from '@visx-vue/axis'
import type { AxisScale, TicksRendererProps } from '@visx-vue/axis'
import AnimatedTicks from './AnimatedTicks'
import type { AnimationTrajectory } from '../types'

export default defineComponent({
  name: 'AnimatedAxis',
  inheritAttrs: false,
  props: {
    animationTrajectory: { type: String as PropType<AnimationTrajectory>, default: undefined },
    tickComponent: {
      type: Function as PropType<(props: any) => VNode | VNode[] | null>,
      default: undefined
    },
    // All Axis props are passed through via attrs
    scale: { type: Function as PropType<AxisScale>, required: true },
    orientation: { type: String as PropType<string>, default: 'bottom' }
  },
  setup(props, { attrs }) {
    return () => {
      const { animationTrajectory, tickComponent, ...restProps } = props

      // Create a custom ticksComponent that wraps AnimatedTicks
      function ticksComponent(ticksProps: TicksRendererProps<AxisScale>) {
        return h(AnimatedTicks, {
          ...ticksProps,
          tickComponent,
          animationTrajectory
        })
      }

      return h(Axis as any, {
        ...attrs,
        ...restProps,
        ticksComponent
      })
    }
  }
})
