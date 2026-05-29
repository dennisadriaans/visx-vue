import { defineComponent, type CSSProperties, type PropType } from 'vue'
import { Group } from '@visx-vue/group'

export type ShapeCircleProps = {
  /** The fill color for the circle. */
  fill?: string
  /** Width of the container. The circle radius is derived from max(width, height). */
  width?: string | number
  /** Height of the container. The circle radius is derived from max(width, height). */
  height?: string | number
  /** Additional CSS styles to apply to the circle. */
  style?: CSSProperties
}

export const CircleShape = defineComponent({
  name: 'CircleShape',
  inheritAttrs: false,
  props: {
    fill: { type: String as PropType<string>, default: undefined },
    width: { type: [String, Number] as PropType<string | number>, default: undefined },
    height: { type: [String, Number] as PropType<string | number>, default: undefined },
    style: { type: Object as PropType<CSSProperties>, default: undefined }
  },
  setup(props) {
    return () => {
      const cleanWidth =
        typeof props.width === 'string' || typeof props.width === 'undefined' ? 0 : props.width
      const cleanHeight =
        typeof props.height === 'string' || typeof props.height === 'undefined' ? 0 : props.height
      const size = Math.max(cleanWidth, cleanHeight)
      const radius = size / 2
      return (
        <svg
          width={size}
          height={size}
        >
          <Group
            top={radius}
            left={radius}
          >
            <circle
              r={radius}
              fill={props.fill}
              style={props.style}
            />
          </Group>
        </svg>
      )
    }
  }
})

export default CircleShape
