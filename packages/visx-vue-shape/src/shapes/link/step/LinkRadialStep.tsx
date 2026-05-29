import { defineComponent, ref, useAttrs, useSlots, type PropType } from 'vue'
import type { AccessorProps } from '../../../types/link'
import { getX, getY, getSource, getTarget } from '../../../util/accessors'

export function pathRadialStep<Link, Node>({
  source,
  target,
  x,
  y
}: Required<AccessorProps<Link, Node>>) {
  return (link: Link) => {
    const sourceData = source(link)
    const targetData = target(link)

    const sx = x(sourceData)
    const sy = y(sourceData)
    const tx = x(targetData)
    const ty = y(targetData)

    const sa = sx - Math.PI / 2
    const sr = sy
    const ta = tx - Math.PI / 2
    const tr = ty

    const sc = Math.cos(sa)
    const ss = Math.sin(sa)
    const tc = Math.cos(ta)
    const ts = Math.sin(ta)
    const sf = Math.abs(ta - sa) > Math.PI ? ta <= sa : ta > sa

    return `
      M${sr * sc},${sr * ss}
      A${sr},${sr},0,0,${sf ? 1 : 0},${sr * tc},${sr * ts}
      L${tr * tc},${tr * ts}
    `
  }
}

export type LinkRadialStepProps<Link, Node> = {
  percent?: number
} & AccessorProps<Link, Node> & {
    className?: string
    path?: (link: Link) => string | null
    data: Link
  }

export const LinkRadialStep = defineComponent({
  name: 'LinkRadialStep',
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
        pathRadialStep({
          source: props.source!,
          target: props.target!,
          x: props.x!,
          y: props.y!
        })
      if (slots.default) return slots.default({ path: pathGen })
      return (
        <path
          ref={innerRef}
          class={['visx-link visx-link-radial-step', props.className]}
          d={pathGen(props.data) || ''}
          {...attrs}
        />
      )
    }
  }
})

export default LinkRadialStep
