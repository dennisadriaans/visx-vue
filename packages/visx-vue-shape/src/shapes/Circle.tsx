import { defineComponent, ref, useAttrs, type PropType } from 'vue'

export type CircleProps = {
  /** className to apply to circle element. */
  className?: string
}

export const Circle = defineComponent({
  name: 'Circle',
  inheritAttrs: false,
  props: {
    className: { type: String as PropType<string>, default: undefined }
  },
  setup(props) {
    const attrs = useAttrs()
    const innerRef = ref<SVGCircleElement | null>(null)

    return () => (
      <circle
        ref={innerRef}
        class={['visx-circle', props.className]}
        {...attrs}
      />
    )
  }
})

export default Circle
