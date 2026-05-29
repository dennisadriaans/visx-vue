import { defineComponent, ref, useAttrs, useSlots, type PropType } from 'vue'
import { degreesToRadians } from '../util/trigonometry'

const DEFAULT_CENTER = { x: 0, y: 0 }

export const getPoint = ({
  sides = 4,
  size = 25,
  center = DEFAULT_CENTER,
  rotate = 0,
  side
}: { side: number } & NonNullable<Pick<PolygonProps, 'sides' | 'size' | 'center' | 'rotate'>>) => {
  const degrees = (360 / sides) * side - rotate
  const radians = degreesToRadians(degrees)

  return {
    x: center.x + size * Math.cos(radians),
    y: center.y + size * Math.sin(radians)
  }
}

export const getPoints = ({
  sides,
  size,
  center,
  rotate
}: NonNullable<Pick<PolygonProps, 'sides' | 'size' | 'center' | 'rotate'>>) =>
  Array.from({ length: sides }, (_, side) =>
    getPoint({
      sides,
      size,
      center,
      rotate,
      side
    })
  )

export type PolygonProps = {
  /** Number of polygon sides. */
  sides?: number
  /** Size of the shape. */
  size?: number
  /** Points to use to render the polygon. If this is defined, `sides`, `size`, `rotate`, and `center` are ignored. */
  points?: [number, number][]
  /** className to apply to polygon element. */
  className?: string
  /** Rotation transform to apply to polygon. */
  rotate?: number
  /** Polygon center position. */
  center?: {
    x: number
    y: number
  }
}

export const Polygon = defineComponent({
  name: 'Polygon',
  inheritAttrs: false,
  props: {
    sides: { type: Number as PropType<number>, default: 4 },
    size: { type: Number as PropType<number>, default: 25 },
    center: {
      type: Object as PropType<{ x: number; y: number }>,
      default: () => DEFAULT_CENTER
    },
    rotate: { type: Number as PropType<number>, default: 0 },
    className: { type: String as PropType<string>, default: undefined },
    points: { type: Array as PropType<[number, number][]>, default: undefined }
  },
  setup(props) {
    const attrs = useAttrs()
    const slots = useSlots()
    const innerRef = ref<SVGPolygonElement | null>(null)

    return () => {
      const pointsToRender: [number, number][] =
        props.points ||
        getPoints({
          sides: props.sides,
          size: props.size,
          center: props.center,
          rotate: props.rotate
        }).map(({ x, y }) => [x, y])

      if (slots.default) return slots.default({ points: pointsToRender })

      return (
        <polygon
          ref={innerRef}
          class={['visx-polygon', props.className]}
          points={pointsToRender.join(' ')}
          {...attrs}
        />
      )
    }
  }
})

export default Polygon
