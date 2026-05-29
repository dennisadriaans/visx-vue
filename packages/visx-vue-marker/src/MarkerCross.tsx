import { defineComponent, useAttrs, type PropType } from 'vue'
import { Marker } from './Marker'

export const MarkerCross = defineComponent({
  name: 'MarkerCross',
  inheritAttrs: false,
  props: {
    id: { type: String as PropType<string>, required: true },
    size: { type: Number as PropType<number>, default: 9 },
    strokeWidth: { type: Number as PropType<number>, default: 1 },
    orient: { type: [String, Number] as PropType<string | number>, default: undefined }
  },
  setup(props) {
    const attrs = useAttrs()

    return () => {
      const bounds = props.size + props.strokeWidth
      const mid = props.size / 2
      const points = `0 ${mid}, ${mid} ${mid}, ${mid} 0, ${mid} ${props.size}, ${mid} ${mid}, ${props.size} ${mid}`

      return (
        <Marker
          id={props.id}
          markerWidth={bounds}
          markerHeight={bounds}
          refX={mid}
          refY={mid}
          orient={props.orient ?? 'auto'}
          markerUnits="strokeWidth"
          fill="none"
          strokeWidth={props.strokeWidth}
          {...attrs}
        >
          <polyline points={points} />
        </Marker>
      )
    }
  }
})
