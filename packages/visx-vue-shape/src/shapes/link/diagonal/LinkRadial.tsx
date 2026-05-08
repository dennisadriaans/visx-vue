import { defineComponent, ref, useAttrs, useSlots, type PropType } from "vue";
import { linkRadial } from "@visx-vue/vendor/d3-shape";
import type { RadialAccessorProps } from "../../../types/link";
import { getX, getY, getSource, getTarget } from "../../../util/accessors";

export function pathRadialDiagonal<Link, Node>({
  source,
  target,
  angle,
  radius,
}: Required<RadialAccessorProps<Link, Node>>) {
  return (data: Link) => {
    const link = linkRadial<Link, Node>();
    link.angle(angle);
    link.radius(radius);
    link.source(source);
    link.target(target);
    return link(data);
  };
}

export type LinkRadialDiagonalProps<Link, Node> = {
  angle: (node: Node) => number;
  radius: (node: Node) => number;
} & RadialAccessorProps<Link, Node> & {
    className?: string;
    path?: (link: Link) => string | null;
    data: Link;
  };

export const LinkRadial = defineComponent({
  name: "LinkRadial",
  inheritAttrs: false,
  props: {
    className: { type: String as PropType<string>, default: undefined },
    data: { type: null as unknown as PropType<unknown>, required: true },
    path: { type: Function as PropType<(link: unknown) => string | null>, default: undefined },
    angle: { type: Function as PropType<(node: unknown) => number>, default: getX },
    radius: { type: Function as PropType<(node: unknown) => number>, default: getY },
    source: { type: Function as PropType<(link: unknown) => unknown>, default: getSource },
    target: { type: Function as PropType<(link: unknown) => unknown>, default: getTarget },
  },
  setup(props) {
    const attrs = useAttrs();
    const slots = useSlots();
    const innerRef = ref<SVGPathElement | null>(null);

    return () => {
      const pathGen =
        props.path ||
        pathRadialDiagonal({
          source: props.source!,
          target: props.target!,
          angle: props.angle!,
          radius: props.radius!,
        });
      if (slots.default) return slots.default({ path: pathGen });
      return (
        <path
          ref={innerRef}
          class={["visx-link visx-link-radial-diagonal", props.className]}
          d={pathGen(props.data) || ""}
          {...attrs}
        />
      );
    };
  },
});

export default LinkRadial;
