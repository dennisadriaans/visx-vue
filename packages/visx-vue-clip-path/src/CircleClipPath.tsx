import { defineComponent, useAttrs, type PropType } from 'vue'
import { ClipPath } from './ClipPath'

export type CircleClipPathProps = {
  /** Unique id for the clipPath. */
  id: string
  /** x position of the center of the ClipPath circle. */
  cx?: string | number
  /** y position of the center of the ClipPath circle. */
  cy?: string | number
  /** radius of the ClipPath circle. */
  r?: string | number
}

/** ClipPath for clipping to the shape of a `<circle />`, pass any `<circle />` props you want. */
export const CircleClipPath = defineComponent({
  name: 'CircleClipPath',
  inheritAttrs: false,
  props: {
    id: { type: String as PropType<string>, required: true },
    cx: { type: [String, Number] as PropType<string | number>, default: undefined },
    cy: { type: [String, Number] as PropType<string | number>, default: undefined },
    r: { type: [String, Number] as PropType<string | number>, default: undefined }
  },
  setup(props) {
    const attrs = useAttrs()

    return () => (
      <ClipPath id={props.id}>
        <circle
          cx={props.cx}
          cy={props.cy}
          r={props.r}
          {...attrs}
        />
      </ClipPath>
    )
  }
})
