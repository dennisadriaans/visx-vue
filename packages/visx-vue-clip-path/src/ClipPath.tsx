import { defineComponent, useAttrs, useSlots, type PropType } from 'vue'

export type ClipPathProps = {
  /** Unique id for the clipPath. */
  id: string
}

/** Handles rendering of <defs> and <clipPath> elements for you, with any children you want. */
export const ClipPath = defineComponent({
  name: 'ClipPath',
  inheritAttrs: false,
  props: {
    id: { type: String as PropType<string>, required: true }
  },
  setup(props) {
    const attrs = useAttrs()
    const slots = useSlots()

    return () => (
      <defs>
        <clipPath
          id={props.id}
          {...attrs}
        >
          {slots.default?.()}
        </clipPath>
      </defs>
    )
  }
})
