import { defineComponent, useAttrs, type PropType } from 'vue'
import { LinearGradient } from './LinearGradient'

export const GradientPurpleTeal = defineComponent({
  name: 'GradientPurpleTeal',
  inheritAttrs: false,
  props: {
    id: { type: String as PropType<string>, required: true },
    from: { type: String, default: '#5B247A' },
    to: { type: String, default: '#1BCEDF' }
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
