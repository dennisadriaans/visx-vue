import { defineComponent, useAttrs, useSlots, type PropType } from 'vue'
import type { Symbol } from '@visx-vue/vendor/d3-shape'
import { symbol, symbolWye } from '@visx-vue/vendor/d3-shape'
import { Glyph } from './Glyph'

export type GlyphWyeProps<Datum> = {
  /** classname to apply to glyph path element. */
  className?: string
  /** Top offset to apply to glyph g element container. */
  top?: number
  /** Left offset to apply to glyph g element container. */
  left?: number
  /** Size of wye glyph in px, or an accessor which takes Datum as input and returns a size. */
  size?: number | ((d: Datum) => number)
}

export const GlyphWye = defineComponent({
  name: 'GlyphWye',
  inheritAttrs: false,
  props: {
    className: { type: String as PropType<string>, default: undefined },
    top: { type: Number as PropType<number>, default: undefined },
    left: { type: Number as PropType<number>, default: undefined },
    size: {
      type: [Number, Function] as PropType<number | ((d: unknown) => number)>,
      default: undefined
    }
  },
  setup(props) {
    const attrs = useAttrs()
    const slots = useSlots()

    return () => {
      const path: Symbol<unknown, unknown> = symbol()
      path.type(symbolWye)

      if (typeof props.size === 'number') path.size(props.size)
      else if (props.size) path.size(props.size as (d: unknown) => number)

      if (slots.default) return slots.default({ path })

      return (
        <Glyph
          top={props.top}
          left={props.left}
        >
          <path
            class={['visx-glyph-wye', props.className]}
            d={path() || ''}
            {...attrs}
          />
        </Glyph>
      )
    }
  }
})
