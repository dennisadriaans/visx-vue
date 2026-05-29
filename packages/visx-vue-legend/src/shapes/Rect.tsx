import { defineComponent, type CSSProperties, type PropType } from 'vue'

export type ShapeRectProps = {
  /** The fill color for the rectangle. */
  fill?: string
  /** Width of the rectangle. */
  width?: string | number
  /** Height of the rectangle. */
  height?: string | number
  /** Additional CSS styles to apply to the rectangle. */
  style?: CSSProperties
}

export const RectShape = defineComponent({
  name: 'RectShape',
  inheritAttrs: false,
  props: {
    fill: { type: String as PropType<string>, default: undefined },
    width: { type: [String, Number] as PropType<string | number>, default: undefined },
    height: { type: [String, Number] as PropType<string | number>, default: undefined },
    style: { type: Object as PropType<CSSProperties>, default: undefined }
  },
  setup(props) {
    return () => (
      <div
        style={{
          width: props.width,
          height: props.height,
          background: props.fill,
          ...props.style
        }}
      />
    )
  }
})

export default RectShape
