import { defineComponent, useAttrs, useSlots, type PropType } from 'vue'

export type LinearGradientProps = {
  /** Unique id for the gradient. Should be unique across all page elements. */
  id: string
  /** Start color of gradient. */
  from?: string
  /** End color of gradient. */
  to?: string
  /** The x coordinate of the starting point along which the linear gradient is drawn. */
  x1?: string | number
  /** The x coordinate of the ending point along which the linear gradient is drawn. */
  x2?: string | number
  /** The y coordinate of the starting point along which the linear gradient is drawn. */
  y1?: string | number
  /** The y coordinate of the ending point along which the linear gradient is drawn. */
  y2?: string | number
  /** Number or percent defining the where the 'from' starting color is placed along the gradient. */
  fromOffset?: string | number
  /** Opacity of the 'from' starting color. */
  fromOpacity?: string | number
  /** Number or percent defining the where the 'to' ending color is placed along the gradient. */
  toOffset?: string | number
  /** Opacity of the 'to' ending color. */
  toOpacity?: string | number
  /** Rotation to apply to gradient. */
  rotate?: string | number
  /** Transform to apply to linearGradient, overrides rotate. */
  transform?: string
  /** (When no x or y values are passed), will orient the gradient vertically instead of horizontally. */
  vertical?: boolean
}

export const LinearGradient = defineComponent({
  name: 'LinearGradient',
  inheritAttrs: false,
  props: {
    id: { type: String as PropType<string>, required: true },
    from: { type: String as PropType<string>, default: undefined },
    to: { type: String as PropType<string>, default: undefined },
    x1: { type: [String, Number] as PropType<string | number>, default: undefined },
    x2: { type: [String, Number] as PropType<string | number>, default: undefined },
    y1: { type: [String, Number] as PropType<string | number>, default: undefined },
    y2: { type: [String, Number] as PropType<string | number>, default: undefined },
    fromOffset: { type: [String, Number] as PropType<string | number>, default: '0%' },
    fromOpacity: { type: [String, Number] as PropType<string | number>, default: 1 },
    toOffset: { type: [String, Number] as PropType<string | number>, default: '100%' },
    toOpacity: { type: [String, Number] as PropType<string | number>, default: 1 },
    rotate: { type: [String, Number] as PropType<string | number>, default: undefined },
    transform: { type: String as PropType<string>, default: undefined },
    vertical: { type: Boolean as PropType<boolean>, default: true }
  },
  setup(props) {
    const attrs = useAttrs()
    const slots = useSlots()

    return () => {
      let x1 = props.x1
      let x2 = props.x2
      let y1 = props.y1
      let y2 = props.y2
      if (props.vertical && !x1 && !x2 && !y1 && !y2) {
        x1 = '0'
        x2 = '0'
        y1 = '0'
        y2 = '1'
      }

      const hasChildren = !!slots.default

      return (
        <defs>
          <linearGradient
            id={props.id}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            gradientTransform={props.rotate ? `rotate(${props.rotate})` : props.transform}
            {...attrs}
          >
            {hasChildren && slots.default?.()}
            {!hasChildren && (
              <stop
                offset={props.fromOffset}
                stop-color={props.from}
                stop-opacity={props.fromOpacity}
              />
            )}
            {!hasChildren && (
              <stop
                offset={props.toOffset}
                stop-color={props.to}
                stop-opacity={props.toOpacity}
              />
            )}
          </linearGradient>
        </defs>
      )
    }
  }
})
