import { defineComponent, ref, useAttrs, useSlots, type PropType } from 'vue'
import { path as d3Path } from '@visx-vue/vendor/d3-path'
import type { AccessorProps } from '../../../types/link'
import { getX, getY, getSource, getTarget } from '../../../util/accessors'

export function pathVerticalStep<Link, Node>({
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

    const p = d3Path()
    p.moveTo(sx, sy)
    p.lineTo(sx, sy + (ty - sy) * percent)
    p.lineTo(tx, sy + (ty - sy) * percent)
    p.lineTo(tx, ty)

    return p.toString()
  }
}

export type LinkVerticalStepProps<Link, Node> = {
  percent?: number
} & AccessorProps<Link, Node> & {
    className?: string
    path?: (link: Link) => string | null
    data: Link
  }

export const LinkVerticalStep = defineComponent({
  name: 'LinkVerticalStep',
  inheritAttrs: false,
  props: {
    className: { type: String as PropType<string>, default: undefined },
    data: { type: null as unknown as PropType<unknown>, required: true },
    path: { type: Function as PropType<(link: unknown) => string | null>, default: undefined },
    percent: { type: Number as PropType<number>, default: 0.5 },
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
        pathVerticalStep({
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
          class={['visx-link visx-link-vertical-step', props.className]}
          d={pathGen(props.data) || ''}
          {...attrs}
        />
      )
    }
  }
})

export default LinkVerticalStep
