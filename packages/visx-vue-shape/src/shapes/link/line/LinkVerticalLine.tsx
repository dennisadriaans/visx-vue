import { defineComponent, ref, useAttrs, useSlots, type PropType } from 'vue'
import { path as d3Path } from '@visx-vue/vendor/d3-path'
import type { AccessorProps } from '../../../types/link'
import { getX, getY, getSource, getTarget } from '../../../util/accessors'

export function pathVerticalLine<Link, Node>({
  source,
  target,
  x,
  y
}: Required<AccessorProps<Link, Node>>) {
  return (data: Link) => {
    const sourceData = source(data)
    const targetData = target(data)

    const sx = x(sourceData)
    const sy = y(sourceData)
    const tx = x(targetData)
    const ty = y(targetData)

    const p = d3Path()
    p.moveTo(sx, sy)
    p.lineTo(tx, ty)

    return p.toString()
  }
}

export type LinkVerticalLineProps<Link, Node> = AccessorProps<Link, Node> & {
  className?: string
  path?: (link: Link) => string | null
  data: Link
}

export const LinkVerticalLine = defineComponent({
  name: 'LinkVerticalLine',
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
        pathVerticalLine({
          source: props.source!,
          target: props.target!,
          x: props.x!,
          y: props.y!
        })
      if (slots.default) return slots.default({ path: pathGen })
      return (
        <path
          ref={innerRef}
          class={['visx-link visx-link-vertical-line', props.className]}
          d={pathGen(props.data) || ''}
          {...attrs}
        />
      )
    }
  }
})

export default LinkVerticalLine
