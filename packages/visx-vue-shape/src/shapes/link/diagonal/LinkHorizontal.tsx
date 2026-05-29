import { defineComponent, ref, useAttrs, useSlots, type PropType } from 'vue'
import { linkHorizontal } from '@visx-vue/vendor/d3-shape'
import type { AccessorProps } from '../../../types/link'
import { getY, getX, getSource, getTarget } from '../../../util/accessors'

export function pathHorizontalDiagonal<Link, Node>({
  source,
  target,
  x,
  y
}: Required<AccessorProps<Link, Node>>) {
  return (data: Link) => {
    const link = linkHorizontal<Link, Node>()
    link.x(x)
    link.y(y)
    link.source(source)
    link.target(target)
    return link(data)
  }
}

export type LinkHorizontalDiagonalProps<Link, Node> = AccessorProps<Link, Node> & {
  className?: string
  path?: (link: Link) => string | null
  data: Link
}

export const LinkHorizontal = defineComponent({
  name: 'LinkHorizontal',
  inheritAttrs: false,
  props: {
    className: { type: String as PropType<string>, default: undefined },
    data: { type: null as unknown as PropType<unknown>, required: true },
    path: { type: Function as PropType<(link: unknown) => string | null>, default: undefined },
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
        pathHorizontalDiagonal({
          source: props.source!,
          target: props.target!,
          x: props.x!,
          y: props.y!
        })
      if (slots.default) return slots.default({ path: pathGen })
      return (
        <path
          ref={innerRef}
          class={['visx-link visx-link-horizontal-diagonal', props.className]}
          d={pathGen(props.data) || ''}
          {...attrs}
        />
      )
    }
  }
})

export default LinkHorizontal
