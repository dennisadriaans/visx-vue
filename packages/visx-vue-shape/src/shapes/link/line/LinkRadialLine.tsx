import { defineComponent, ref, useAttrs, useSlots, type PropType } from 'vue'
import { path as d3Path } from '@visx-vue/vendor/d3-path'
import type { AccessorProps } from '../../../types/link'
import { getX, getY, getSource, getTarget } from '../../../util/accessors'

export function pathRadialLine<Link, Node>({
  source,
  target,
  x,
  y
}: Required<AccessorProps<Link, Node>>) {
  return (data: Link) => {
    const sourceData = source(data)
    const targetData = target(data)

    const sa = x(sourceData) - Math.PI / 2
    const sr = y(sourceData)
    const ta = x(targetData) - Math.PI / 2
    const tr = y(targetData)

    const sc = Math.cos(sa)
    const ss = Math.sin(sa)
    const tc = Math.cos(ta)
    const ts = Math.sin(ta)

    const p = d3Path()
    p.moveTo(sr * sc, sr * ss)
    p.lineTo(tr * tc, tr * ts)

    return p.toString()
  }
}

export type LinkRadialLineProps<Link, Node> = AccessorProps<Link, Node> & {
  className?: string
  path?: (link: Link) => string | null
  data: Link
}

export const LinkRadialLine = defineComponent({
  name: 'LinkRadialLine',
  inheritAttrs: false,
  props: {
    className: { type: String as PropType<string>, default: undefined },
    data: { type: null as unknown as PropType<unknown>, required: true },
    path: { type: Function as PropType<(link: unknown) => string | null>, default: undefined },
    x: { type: Function as PropType<(node: unknown) => number>, default: getX },
    y: { type: Function as PropType<(node: unknown) => number>, default: getY },
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
        pathRadialLine({
          source: props.source!,
          target: props.target!,
          x: props.x!,
          y: props.y!
        })
      if (slots.default) return slots.default({ path: pathGen })
      return (
        <path
          ref={innerRef}
          class={['visx-link visx-link-radial-line', props.className]}
          d={pathGen(props.data) || ''}
          {...attrs}
        />
      )
    }
  }
})

export default LinkRadialLine
