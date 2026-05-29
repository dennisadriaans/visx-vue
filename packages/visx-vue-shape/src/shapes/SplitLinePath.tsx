import { defineComponent, computed, useSlots, type PropType, type SVGAttributes } from 'vue'
import type { GetLineSegmentsConfig, LineSegmentation } from '../util/getSplitLineSegments'
import getSplitLineSegments from '../util/getSplitLineSegments'
import { line } from '../util/D3ShapeFactories'
import type { AccessorForArrayItem, LinePathConfig } from '../types'
import { LinePath } from './LinePath'

interface Point {
  x: number
  y: number
}

const getX = (d: unknown) => (d as Point).x || 0
const getY = (d: unknown) => (d as Point).y || 0

export type SplitLinePathRenderer = (renderProps: {
  index: number
  segment: { x: number; y: number }[]
  styles?: Omit<SVGAttributes, 'x' | 'y'>
}) => any

export type SplitLinePathProps<Datum> = {
  /** Array of data segments, where each segment will be a separate path in the rendered line. */
  segments: Datum[][]
  /** Styles to apply to each segment. If fewer styles are specified than the number of segments, they will be re-used. */
  styles: Omit<SVGAttributes, 'x' | 'y'>[]
  /** className applied to path element. */
  className?: string
} & LinePathConfig<Datum> &
  Pick<GetLineSegmentsConfig, 'segmentation' | 'sampleRate'>

export const SplitLinePath = defineComponent({
  name: 'SplitLinePath',
  props: {
    segments: { type: Array as PropType<unknown[][]>, required: true },
    styles: { type: Array as PropType<Record<string, any>[]>, required: true },
    className: { type: String as PropType<string>, default: undefined },
    curve: { type: Function as PropType<any>, default: undefined },
    defined: {
      type: Function as PropType<AccessorForArrayItem<unknown, boolean>>,
      default: undefined
    },
    segmentation: { type: String as PropType<LineSegmentation>, default: undefined },
    sampleRate: { type: Number as PropType<number>, default: undefined },
    x: {
      type: [Number, Function] as PropType<number | AccessorForArrayItem<unknown, number>>,
      default: undefined
    },
    y: {
      type: [Number, Function] as PropType<number | AccessorForArrayItem<unknown, number>>,
      default: undefined
    }
  },
  setup(props) {
    const slots = useSlots()

    // Convert data in all segments to points.
    const pointsInSegments = computed(() => {
      const xFn =
        typeof props.x === 'number' || typeof props.x === 'undefined' ? () => props.x : props.x
      const yFn =
        typeof props.y === 'number' || typeof props.y === 'undefined' ? () => props.y : props.y
      return props.segments.map((s) =>
        s.map((value, i) => ({ x: (xFn as any)(value, i, s), y: (yFn as any)(value, i, s) }))
      )
    })

    const pathString = computed(() => {
      const path = line({ x: props.x, y: props.y, defined: props.defined, curve: props.curve })
      return path(props.segments.flat()) || ''
    })

    const splitLineSegments = computed(() =>
      getSplitLineSegments({
        path: pathString.value,
        segmentation: props.segmentation || 'x',
        pointsInSegments: pointsInSegments.value,
        sampleRate: props.sampleRate
      })
    )

    return () => (
      <g>
        {splitLineSegments.value.map((segment, index) =>
          slots.default ? (
            slots.default({
              index,
              segment,
              styles: props.styles[index] || props.styles[index % props.styles.length]
            })
          ) : (
            <LinePath
              key={index}
              className={props.className}
              data={segment}
              x={getX}
              y={getY}
              {...(props.styles[index] || props.styles[index % props.styles.length])}
            />
          )
        )}
      </g>
    )
  }
})

export default SplitLinePath
