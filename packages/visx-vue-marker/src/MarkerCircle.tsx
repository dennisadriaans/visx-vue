import { defineComponent, useAttrs, type PropType } from 'vue'
import { Marker } from './Marker'

export const MarkerCircle = defineComponent({
  name: 'MarkerCircle',
  inheritAttrs: false,
  props: {
    id: { type: String as PropType<string>, required: true },
    size: { type: Number as PropType<number>, default: 9 },
    strokeWidth: { type: Number as PropType<number>, default: 1 }
  },
  setup(props) {
    const attrs = useAttrs()

    return () => {
      const diameter = props.size * 2
      const bounds = diameter + props.strokeWidth
      const mid = bounds / 2

      return (
        <Marker
          id={props.id}
          markerWidth={bounds}
          markerHeight={bounds}
          refX={0}
          refY={mid}
          orient="auto-start-reverse"
          markerUnits="strokeWidth"
          strokeWidth={props.strokeWidth}
          {...attrs}
        >
          <circle
            r={props.size}
            cx={mid}
            cy={mid}
          />
        </Marker>
      )
    }
  }
})
