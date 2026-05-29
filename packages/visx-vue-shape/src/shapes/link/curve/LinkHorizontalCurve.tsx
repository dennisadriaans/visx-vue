import { defineComponent, ref, useAttrs, useSlots, type PropType } from 'vue'
import { path as d3Path } from '@visx-vue/vendor/d3-path'
import type { AccessorProps } from '../../../types/link'
import { getY, getX, getSource, getTarget } from '../../../util/accessors'

export function pathHorizontalCurve<Link, Node>({
  source,
  target,
  x,
  y,
  percent
}: Required<AccessorProps<Link, Node>> & { percent: number }) {
  return (link: Link) => {
    const sourceData = source(link)
    const targetData = target(link)

    const sx = x(sourceData)
    const sy = y(sourceData)
    const tx = x(targetData)
    const ty = y(targetData)

    const dx = tx - sx
    const dy = ty - sy
    const ix = percent * (dx + dy)
    const iy = percent * (dy - dx)

    const p = d3Path()
    p.moveTo(sx, sy)
    p.bezierCurveTo(sx + ix, sy + iy, tx + iy, ty - ix, tx, ty)

    return p.toString()
  }
}

export type LinkHorizontalCurveProps<Link, Node> = AccessorProps<Link, Node> & {
  className?: string
  path?: (link: Link) => string | null
  data: Link
  percent?: number
}

export const LinkHorizontalCurve = defineComponent({
  name: 'LinkHorizontalCurve',
  inheritAttrs: false,
  props: {
    className: { type: String as PropType<string>, default: undefined },
    data: { type: null as unknown as PropType<unknown>, required: true },
    path: { type: Function as PropType<(link: unknown) => string | null>, default: undefined },
    percent: { type: Number as PropType<number>, default: 0.2 },
    x: { type: Function as PropType<(node: unknown) => number>, default: getY },
    y: { type: Function as PropType<(node: unknown) => number>, default: getX },
    source: { type: Function as PropType<(link: unknown) => unknown>, default: getSource },
    target: { type: Function as PropType<(link: unknown) => unknown>, default: getTarget }
  },
  setup(props) {
    const attrs = useAttrs()
    const slots = useSlots()
    const innerRef = ref<SVGPathElement | null>(null)

    return () => {
      const pathGen =
        props.path ||
        pathHorizontalCurve({
          source: props.source!,
          target: props.target!,
          x: props.x!,
          y: props.y!,
          percent: props.percent
        })
      if (slots.default) return slots.default({ path: pathGen })
      return (
        <path
          ref={innerRef}
          class={['visx-link visx-link-horizontal-curve', props.className]}
          d={pathGen(props.data) || ''}
          {...attrs}
        />
      )
    }
  }
})

export default LinkHorizontalCurve
