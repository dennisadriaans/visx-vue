import { defineComponent, useSlots, type PropType, type Component } from 'vue'
import { Group } from '@visx-vue/group'
import type { HierarchyNode, HierarchyRectangularNode } from 'd3-hierarchy'
import { partition as d3partition } from 'd3-hierarchy'
import DefaultNode from '../HierarchyDefaultRectNode'

export type NodeComponentProps<Datum> = { node: HierarchyRectangularNode<Datum> }

export type PartitionProps<Datum> = {
  /** The root hierarchy node from which to derive the partition layout. */
  root: HierarchyNode<Datum>
  /** top offset applied to the g element container. */
  top?: number
  /** left offset applied to the g element container. */
  left?: number
  /** className applied to the g element container. */
  className?: string
  /** Sets this partition layout's size to the specified two-element array of numbers [width, height]. */
  size?: [number, number]
  /** Whether partition layout rounds values. */
  round?: boolean
  /** Sets padding, used to separate a node's adjacent children. */
  padding?: number
  /** Component which renders a single partition node, passed the node object. */
  nodeComponent?: Component
}

export const Partition = defineComponent({
  name: 'Partition',
  props: {
    root: { type: Object as PropType<HierarchyNode<unknown>>, required: true as const },
    top: { type: Number as PropType<number>, default: undefined },
    left: { type: Number as PropType<number>, default: undefined },
    className: { type: String as PropType<string>, default: undefined },
    size: { type: Array as unknown as PropType<[number, number]>, default: undefined },
    round: { type: Boolean as PropType<boolean>, default: undefined },
    padding: { type: Number as PropType<number>, default: undefined },
    nodeComponent: { type: [Object, Function] as PropType<Component>, default: DefaultNode }
  },
  setup(props) {
    const slots = useSlots()

    return () => {
      const partition = d3partition<unknown>()
      if (props.size) partition.size(props.size)
      if (props.round) partition.round(props.round)
      if (props.padding) partition.padding(props.padding)

      const data = partition(props.root.copy())

      if (slots.default) return slots.default({ data })

      const NodeComp = props.nodeComponent as any

      return (
        <Group
          top={props.top}
          left={props.left}
          class={['visx-partition', props.className]}
        >
          {NodeComp &&
            data.descendants().map((node: any, i: number) => (
              <Group key={`partition-node-${i}`}>
                <NodeComp node={node} />
              </Group>
            ))}
        </Group>
      )
    }
  }
})

export default Partition
