import { defineComponent, ref, useAttrs, useSlots, type PropType } from 'vue'
import { linkVertical } from '@visx-vue/vendor/d3-shape'
import type { AccessorProps } from '../../../types/link'
import { getX, getY, getSource, getTarget } from '../../../util/accessors'

export function pathVerticalDiagonal<Link, Node>({
  source,
  target,
  x,
  y
}: Required<AccessorProps<Link, Node>>) {
  return (data: Link) => {
    const link = linkVertical<Link, Node>()
    link.x(x)
    link.y(y)
    link.source(source)
    link.target(target)
    return link(data)
  }
}

export type LinkVerticalDiagonalProps<Link, Node> = AccessorProps<Link, Node> & {
  className?: string
  path?: (link: Link) => string | null
  data: Link
}

export const LinkVertical = defineComponent({
  name: 'LinkVertical',
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
        pathVerticalDiagonal({
          source: props.source!,
          target: props.target!,
          x: props.x!,
          y: props.y!
        })
      if (slots.default) return slots.default({ path: pathGen })
      return (
        <path
          ref={innerRef}
          class={['visx-link visx-link-vertical-diagonal', props.className]}
          d={pathGen(props.data) || ''}
          {...attrs}
        />
      )
    }
  }
})

export default LinkVertical
