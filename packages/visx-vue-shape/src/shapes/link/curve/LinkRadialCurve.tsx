import { defineComponent, ref, useAttrs, useSlots, type PropType } from "vue";
import { path as d3Path } from "@visx-vue/vendor/d3-path";
import type { AccessorProps } from "../../../types/link";
import { getX, getY, getSource, getTarget } from "../../../util/accessors";

export function pathRadialCurve<Link, Node>({
  source,
  target,
  x,
  y,
  percent,
}: Required<AccessorProps<Link, Node>> & { percent: number }) {
  return (link: Link) => {
    const sourceData = source(link);
    const targetData = target(link);

    const sa = x(sourceData) - Math.PI / 2;
    const sr = y(sourceData);
    const ta = x(targetData) - Math.PI / 2;
    const tr = y(targetData);

    const sc = Math.cos(sa);
    const ss = Math.sin(sa);
    const tc = Math.cos(ta);
    const ts = Math.sin(ta);

    const sx = sr * sc;
    const sy = sr * ss;
    const tx = tr * tc;
    const ty = tr * ts;

    const dx = tx - sx;
    const dy = ty - sy;
    const ix = percent * (dx + dy);
    const iy = percent * (dy - dx);

    const p = d3Path();
    p.moveTo(sx, sy);
    p.bezierCurveTo(sx + ix, sy + iy, tx + iy, ty - ix, tx, ty);

    return p.toString();
  };
}

export type LinkRadialCurveProps<Link, Node> = {
  percent?: number;
} & AccessorProps<Link, Node> & {
    className?: string;
    path?: (link: Link) => string | null;
    data: Link;
  };

export const LinkRadialCurve = defineComponent({
  name: "LinkRadialCurve",
  inheritAttrs: false,
  props: {
    className: { type: String as PropType<string>, default: undefined },
    data: { type: null as unknown as PropType<unknown>, required: true },
    path: { type: Function as PropType<(link: unknown) => string | null>, default: undefined },
    percent: { type: Number as PropType<number>, default: 0.2 },
    x: { type: Function as PropType<(node: unknown) => number>, default: getX },
    y: { type: Function as PropType<(node: unknown) => number>, default: getY },
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
        pathRadialCurve({
          source: props.source!,
          target: props.target!,
          x: props.x!,
          y: props.y!,
          percent: props.percent,
        });
      if (slots.default) return slots.default({ path: pathGen });
      return (
        <path
          ref={innerRef}
          class={["visx-link visx-link-radial-curve", props.className]}
          d={pathGen(props.data) || ""}
          {...attrs}
        />
      );
    };
  },
});

export default LinkRadialCurve;
