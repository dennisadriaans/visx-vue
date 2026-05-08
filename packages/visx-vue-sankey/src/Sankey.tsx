import { defineComponent, useSlots, type PropType } from "vue";
import { Group } from "@visx-vue/group";
import type {
  SankeyExtraProperties,
  SankeyGraph,
  SankeyLink as D3SankeyLink,
  SankeyNode as D3SankeyNode,
} from "d3-sankey";
import { sankey as d3sankey, sankeyLinkHorizontal } from "d3-sankey";
import type { Link } from "@visx-vue/vendor/d3-shape";

const DEFAULT_COLOR = "#000";

type NodeSVGProps = Pick<
  {
    stroke: string;
    strokeOpacity: string | number;
    strokeWidth: string | number;
    fill: string;
    fillOpacity: string | number;
  },
  "stroke" | "strokeOpacity" | "strokeWidth" | "fill" | "fillOpacity"
>;

type LinkSVGProps = Pick<
  {
    fill: string;
    fillOpacity: string | number;
    stroke: string;
    strokeOpacity: string | number;
    strokeWidth: string | number;
    strokeDasharray: string;
    strokeDashoffset: string | number;
  },
  | "fill"
  | "fillOpacity"
  | "stroke"
  | "strokeOpacity"
  | "strokeWidth"
  | "strokeDasharray"
  | "strokeDashoffset"
>;

type CreatePath<
  NodeDatum extends SankeyExtraProperties,
  LinkDatum extends SankeyExtraProperties,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = Link<any, D3SankeyLink<NodeDatum, LinkDatum>, [number, number]>;

type NodeIdAccessor<
  NodeDatum extends SankeyExtraProperties,
  LinkDatum extends SankeyExtraProperties,
> = (node: D3SankeyNode<NodeDatum, LinkDatum>) => string | number;

type SourceAccessor<
  NodeDatum extends SankeyExtraProperties,
  LinkDatum extends SankeyExtraProperties,
> = Exclude<Parameters<CreatePath<NodeDatum, LinkDatum>["source"]>, undefined>[0];

type TargetAccessor<
  NodeDatum extends SankeyExtraProperties,
  LinkDatum extends SankeyExtraProperties,
> = Exclude<Parameters<CreatePath<NodeDatum, LinkDatum>["target"]>, undefined>[0];

type NodeAlignment<
  NodeDatum extends SankeyExtraProperties,
  LinkDatum extends SankeyExtraProperties,
> = (node: D3SankeyNode<NodeDatum, LinkDatum>, n: number) => number;

export type SankeySlotProps<
  NodeDatum extends SankeyExtraProperties,
  LinkDatum extends SankeyExtraProperties,
> = {
  graph: SankeyGraph<NodeDatum, LinkDatum>;
  createPath: CreatePath<NodeDatum, LinkDatum>;
};

export type SankeyProps<
  NodeDatum extends SankeyExtraProperties,
  LinkDatum extends SankeyExtraProperties,
> = {
  /** The root data from which to derive the sankey layout. */
  root: SankeyGraph<NodeDatum, LinkDatum>;
  /** The class name(s) applied to the g element container. */
  className?: string;
  /** Sets the node id accessor. */
  nodeId?: NodeIdAccessor<NodeDatum, LinkDatum>;
  /** Sets the node width. */
  nodeWidth?: number;
  /** Sets the node padding. */
  nodePadding?: number;
  /** Sets the node alignment function. */
  nodeAlign?: NodeAlignment<NodeDatum, LinkDatum>;
  /** Sets the extent of the sankey layout. */
  extent?: [[number, number], [number, number]];
  /** Sets the size of the layout. A convenience method equivalent to using an extent of [[0, 0], [width, height]] */
  size?: [number, number];
  /** Sets the number of relaxation iterations. */
  iterations?: number;
  /** Sets the node comparison function. */
  nodeSort?: (
    a: D3SankeyNode<NodeDatum, LinkDatum>,
    b: D3SankeyNode<NodeDatum, LinkDatum>,
  ) => number | undefined | null;
  /** Sets the link comparison function */
  linkSort?: (
    a: D3SankeyLink<NodeDatum, LinkDatum>,
    b: D3SankeyLink<NodeDatum, LinkDatum>,
  ) => number | undefined | null;
  /** Sets the props for the default rendered node rect. Ignored when children is defined. */
  nodeProps?: NodeSVGProps;
  /** Sets the props for the default rendered link path. Ignored when children is defined. */
  linkProps?: LinkSVGProps;
  /** Sets the source accessor for determining the link path. */
  sourceAccessor?: SourceAccessor<NodeDatum, LinkDatum>;
  /** Sets the target accessor for determining the link path. */
  targetAccessor?: TargetAccessor<NodeDatum, LinkDatum>;
};

export const Sankey = defineComponent({
  name: "Sankey",
  props: {
    root: {
      type: Object as PropType<SankeyGraph<SankeyExtraProperties, SankeyExtraProperties>>,
      required: true as const,
    },
    className: { type: String as PropType<string>, default: undefined },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nodeId: { type: Function as PropType<(node: any) => string | number>, default: undefined },
    nodeWidth: { type: Number as PropType<number>, default: 2 },
    nodePadding: { type: Number as PropType<number>, default: undefined },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nodeAlign: { type: Function as PropType<(node: any, n: number) => number>, default: undefined },
    extent: {
      type: Array as unknown as PropType<[[number, number], [number, number]]>,
      default: undefined,
    },
    size: { type: Array as unknown as PropType<[number, number]>, default: undefined },
    iterations: { type: Number as PropType<number>, default: undefined },
    nodeSort: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: Function as PropType<(a: any, b: any) => number | undefined | null>,
      default: undefined,
    },
    linkSort: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: Function as PropType<(a: any, b: any) => number | undefined | null>,
      default: undefined,
    },
    nodeProps: { type: Object as PropType<NodeSVGProps>, default: () => ({}) },
    linkProps: { type: Object as PropType<LinkSVGProps>, default: () => ({}) },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sourceAccessor: { type: Function as PropType<(...args: any[]) => any>, default: undefined },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    targetAccessor: { type: Function as PropType<(...args: any[]) => any>, default: undefined },
  },
  setup(props) {
    const slots = useSlots();

    return () => {
      const sankey = d3sankey();
      if (props.nodeId) sankey.nodeId(props.nodeId);
      if (props.nodeWidth) sankey.nodeWidth(props.nodeWidth);
      if (props.nodePadding) sankey.nodePadding(props.nodePadding);
      if (props.nodeAlign) sankey.nodeAlign(props.nodeAlign);
      if (props.extent) sankey.extent(props.extent);
      if (props.size) sankey.size(props.size);
      if (props.iterations) sankey.iterations(props.iterations);
      if (props.nodeSort) sankey.nodeSort(props.nodeSort as (a: any, b: any) => number);
      if (props.linkSort) sankey.linkSort(props.linkSort as (a: any, b: any) => number);

      const graph = sankey(props.root);
      const createPath = sankeyLinkHorizontal();
      if (props.sourceAccessor)
        createPath.source(props.sourceAccessor as Parameters<typeof createPath.source>[0]);
      if (props.targetAccessor)
        createPath.target(props.targetAccessor as Parameters<typeof createPath.target>[0]);

      if (slots.default) {
        return slots.default({ graph, createPath });
      }

      return (
        <Group class={["visx-sankey", props.className]}>
          <Group className="visx-sankey-links">
            {graph.links.map((link: (typeof graph.links)[number], i: number) => {
              const linkAttrs = Object.assign(
                {
                  fill: "transparent",
                  stroke: DEFAULT_COLOR,
                  "stroke-width": Math.max(1, link.width ?? 0),
                  "stroke-opacity": 0.5,
                },
                props.linkProps,
              );
              return <path key={i} d={createPath(link) ?? ""} {...linkAttrs} />;
            })}
          </Group>
          <Group className="visx-sankey-nodes">
            {graph.nodes.map((node: (typeof graph.nodes)[number], i: number) => {
              const { y0, y1, x0, x1 } = node;
              if (y0 === undefined || y1 === undefined || x0 === undefined || x1 === undefined)
                return null;
              const nodeAttrs = Object.assign({ fill: DEFAULT_COLOR }, props.nodeProps);
              return <rect key={i} {...nodeAttrs} width={x1 - x0} height={y1 - y0} x={x0} y={y0} />;
            })}
          </Group>
        </Group>
      );
    };
  },
});
