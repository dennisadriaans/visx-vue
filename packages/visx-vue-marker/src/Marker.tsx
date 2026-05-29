import { defineComponent, useAttrs, useSlots, type PropType } from 'vue'

export interface MarkerProps {
  /** Unique id for the `<marker>`. Should be unique across all page elements. */
  id: string
  /** A number used to determine the size of the bounding box the marker content. */
  size?: number
  /** The width of the marker viewport */
  markerWidth?: string | number
  /** The height of the marker viewport */
  markerHeight?: string | number
  /** Set the coordinate system for the markerWidth, markerHeight, and `<marker>` contents */
  markerUnits?: string
  /** The x coordinate for the reference point of the maker */
  refX?: string | number
  /** The y coordinate for the reference point of the maker */
  refY?: string | number
  /** The stroke width. constrained to a `number` type due to use in bounding box calculations */
  strokeWidth?: number
}

export type MarkerComponentProps = MarkerProps

export const Marker = defineComponent({
  name: 'Marker',
  inheritAttrs: false,
  props: {
    id: { type: String as PropType<string>, required: true },
    markerWidth: { type: [String, Number] as PropType<string | number>, default: 3 },
    markerHeight: { type: [String, Number] as PropType<string | number>, default: 3 },
    markerUnits: { type: String as PropType<string>, default: 'userSpaceOnUse' },
    refX: { type: [String, Number] as PropType<string | number>, default: undefined },
    refY: { type: [String, Number] as PropType<string | number>, default: undefined },
    strokeWidth: { type: Number as PropType<number>, default: undefined },
    orient: { type: [String, Number] as PropType<string | number>, default: undefined },
    fill: { type: String as PropType<string>, default: undefined },
    stroke: { type: String as PropType<string>, default: undefined }
  },
  setup(props) {
    const attrs = useAttrs()
    const slots = useSlots()

    return () => (
      <defs>
        <marker
          id={props.id}
          markerWidth={props.markerWidth}
          markerHeight={props.markerHeight}
          markerUnits={props.markerUnits}
          refX={props.refX}
          refY={props.refY}
          stroke-width={props.strokeWidth}
          orient={props.orient}
          fill={props.fill}
          stroke={props.stroke}
          {...attrs}
        >
          {slots.default?.()}
        </marker>
      </defs>
    )
  }
})
