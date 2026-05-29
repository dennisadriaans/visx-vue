import { defineComponent, type PropType, type Component } from 'vue'
import { Group } from '@visx-vue/group'
import DefaultNode from './DefaultNode'

export type NodesProps<Node> = {
  /** Array of nodes to render. */
  nodes?: Node[]
  /** Component for rendering a single node. */
  nodeComponent: Component
  /** Classname to add to each node parent g element. */
  className?: string
  /** Returns the center x coordinate of a node. */
  x?: (d: Node) => number
  /** Returns the center y coordinate of a node. */
  y?: (d: Node) => number
}

export const Nodes = defineComponent({
  name: 'Nodes',
  props: {
    nodes: { type: Array as PropType<unknown[]>, default: () => [] },
    nodeComponent: { type: [Object, Function] as PropType<Component>, default: DefaultNode },
    className: { type: String as PropType<string>, default: undefined },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    x: { type: Function as PropType<(d: any) => number>, default: (d: any) => d?.x || 0 },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y: { type: Function as PropType<(d: any) => number>, default: (d: any) => d?.y || 0 }
  },
  setup(props) {
    return () => (
      <>
        {(props.nodes as unknown[]).map((node, i) => {
          const NodeComponent = props.nodeComponent as any
          return (
            <Group
              key={`network-node-${i}`}
              class={['visx-network-node', props.className]}
              left={props.x(node)}
              top={props.y(node)}
            >
              <NodeComponent node={node} />
            </Group>
          )
        })}
      </>
    )
  }
})

export default Nodes
