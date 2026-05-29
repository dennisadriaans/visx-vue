import { defineComponent, useSlots, type PropType, type Component } from 'vue'
import { Group } from '@visx-vue/group'
import type { HierarchyNode, HierarchyPointNode, HierarchyPointLink } from 'd3-hierarchy'
import { tree as d3tree } from 'd3-hierarchy'
import DefaultLink from '../HierarchyDefaultLink'
import DefaultNode from '../HierarchyDefaultNode'

export type NodeComponentProps<Datum> = { node: HierarchyPointNode<Datum> }
export type LinkComponentProps<Datum> = { link: HierarchyPointLink<Datum> }

export type TreeProps<Datum> = {
  /** The root hierarchy node from which to derive the tree layout. */
  root: HierarchyNode<Datum>
  /** top offset applied to the g element container. */
  top?: number
  /** left offset applied to the g element container. */
  left?: number
  /** className applied to the g element container. */
  className?: string
  /**
   * Sets this tree layout's size to the specified two-element array of numbers [width, height].
   */
  size?: [number, number]
  /**
   * Sets this tree layout's node size to the specified two-element array of numbers [width, height].
   */
  nodeSize?: [number, number]
  /**
   * Sets the layout's separation accessor used to determine the separation of neighboring nodes.
   */
  separation?: (a: HierarchyPointNode<Datum>, b: HierarchyPointNode<Datum>) => number
  /** Component which renders a single tree link, passed the link object. */
  linkComponent?: Component
  /** Component which renders a single tree node, passed the node object. */
  nodeComponent?: Component
}

export const Tree = defineComponent({
  name: 'Tree',
  props: {
    root: { type: Object as PropType<HierarchyNode<unknown>>, required: true as const },
    top: { type: Number as PropType<number>, default: undefined },
    left: { type: Number as PropType<number>, default: undefined },
    className: { type: String as PropType<string>, default: undefined },
    size: { type: Array as unknown as PropType<[number, number]>, default: undefined },
    nodeSize: { type: Array as unknown as PropType<[number, number]>, default: undefined },
    separation: {
      type: Function as PropType<
        (a: HierarchyPointNode<unknown>, b: HierarchyPointNode<unknown>) => number
      >,
      default: undefined
    },
    linkComponent: { type: [Object, Function] as PropType<Component>, default: DefaultLink },
    nodeComponent: { type: [Object, Function] as PropType<Component>, default: DefaultNode }
  },
  setup(props) {
    const slots = useSlots()

    return () => {
      const tree = d3tree<unknown>()
      if (props.size) tree.size(props.size)
      if (props.nodeSize) tree.nodeSize(props.nodeSize)
      if (props.separation) tree.separation(props.separation)

      const data = tree(props.root.copy())

      if (slots.default) return slots.default({ data })

      const LinkComp = props.linkComponent as any
      const NodeComp = props.nodeComponent as any

      return (
        <Group
          top={props.top}
          left={props.left}
          class={['visx-tree', props.className]}
        >
          {LinkComp &&
            data.links().map((link: any, i: number) => (
              <Group key={`tree-link-${i}`}>
                <LinkComp link={link} />
              </Group>
            ))}
          {NodeComp &&
            data.descendants().map((node: any, i: number) => (
              <Group key={`tree-node-${i}`}>
                <NodeComp node={node} />
              </Group>
            ))}
        </Group>
      )
    }
  }
})

export default Tree
