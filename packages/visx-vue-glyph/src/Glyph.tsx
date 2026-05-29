import { defineComponent, useSlots, type PropType } from 'vue'
import { Group } from '@visx-vue/group'

export type GlyphProps = {
  /** Top offset to apply to glyph g element container. */
  top?: number
  /** Left offset to apply to glyph g element container. */
  left?: number
  /** classname to apply to glyph g element container. */
  className?: string
}

export const Glyph = defineComponent({
  name: 'Glyph',
  props: {
    top: { type: Number as PropType<number>, default: 0 },
    left: { type: Number as PropType<number>, default: 0 },
    className: { type: String as PropType<string>, default: undefined }
  },
  setup(props) {
    const slots = useSlots()

    return () => (
      <Group
        class={['visx-glyph', props.className]}
        top={props.top}
        left={props.left}
      >
        {slots.default?.()}
      </Group>
    )
  }
})
