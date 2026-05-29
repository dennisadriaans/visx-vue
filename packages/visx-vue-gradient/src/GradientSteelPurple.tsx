import { defineComponent, useAttrs, type PropType } from 'vue'
import { LinearGradient } from './LinearGradient'

export const GradientSteelPurple = defineComponent({
  name: 'GradientSteelPurple',
  inheritAttrs: false,
  props: {
    id: { type: String as PropType<string>, required: true },
    from: { type: String, default: '#65799B' },
    to: { type: String, default: '#5E2563' }
  },
  setup(props) {
    const attrs = useAttrs()
    return () => (
      <LinearGradient
        id={props.id}
        from={props.from}
        to={props.to}
        {...attrs}
      />
    )
  }
})
