import { defineComponent, type PropType } from 'vue'

export type RectNodeProps = {
  node: { x0: number; x1: number; y0: number; y1: number }
}

export const HierarchyDefaultRectNode = defineComponent({
  name: 'HierarchyDefaultRectNode',
  props: {
    node: {
      type: Object as PropType<{ x0: number; x1: number; y0: number; y1: number }>,
      required: true as const
    }
  },
  setup(props) {
    return () => {
      const { x0, x1, y0, y1 } = props.node
      return (
        <rect
          x={x0}
          y={y0}
          width={Math.abs(x1 - x0)}
          height={Math.abs(y1 - y0)}
          fill="#21D4FD"
        />
      )
    }
  }
})

export default HierarchyDefaultRectNode
