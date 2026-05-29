import { defineComponent, useAttrs, type PropType } from 'vue'
import { Marker } from './Marker'

export const MarkerArrow = defineComponent({
  name: 'MarkerArrow',
  inheritAttrs: false,
  props: {
    id: { type: String as PropType<string>, required: true },
    size: { type: Number as PropType<number>, default: 9 },
    strokeWidth: { type: Number as PropType<number>, default: 1 }
  },
  setup(props) {
    const attrs = useAttrs()

    return () => {
      const max = props.size + props.strokeWidth * 2
      const midX = props.size
      const midY = max / 2
      const points = `0 0, ${props.size} ${props.size / 2}, 0 ${props.size}`

      return (
        <Marker
          id={props.id}
          markerWidth={max}
          markerHeight={max}
          refX={midX}
          refY={midY}
          orient="auto"
          markerUnits="strokeWidth"
          fill="none"
          strokeWidth={props.strokeWidth}
          {...attrs}
        >
          <g transform={`translate(${props.strokeWidth}, ${props.strokeWidth})`}>
            <polyline points={points} />
          </g>
        </Marker>
      )
    }
  }
})
