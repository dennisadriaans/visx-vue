import { defineComponent, ref, useAttrs, useSlots, type PropType } from "vue";

export type BarRoundedProps = {
  /** className to apply to path element. */
  className?: string;
  /** left position of the bar */
  x: number;
  /** top position of the bar */
  y: number;
  /** width of the bar starting from x */
  width: number;
  /** height of the bar starting from y */
  height: number;
  /** corner radius of the bar. clamped to center of the shorter side of the bar (Math.min(width,height) / 2) */
  radius: number;
  /** apply corner radius to top left corner, top right corner, bottom right corner, and bottom left corner */
  all?: boolean;
  /** apply corner radius to top left corner, and top right corner */
  top?: boolean;
  /** apply corner radius to bottom right corner, and bottom left corner */
  bottom?: boolean;
  /** apply corner radius to top left corner, and bottom left corner */
  left?: boolean;
  /** apply corner radius to top right corner, and bottom right corner */
  right?: boolean;
  /** apply corner radius to top left corner */
  topLeft?: boolean;
  /** apply corner radius to top right corner */
  topRight?: boolean;
  /** apply corner radius to bottom left corner */
  bottomLeft?: boolean;
  /** apply corner radius to bottom right */
  bottomRight?: boolean;
};

/** Returns a BarRounded path string. */
export function getBarRoundedPath({
  all = false,
  bottom = false,
  bottomLeft: _bottomLeft = false,
  bottomRight: _bottomRight = false,
  height,
  left = false,
  radius,
  right = false,
  top = false,
  topLeft: _topLeft = false,
  topRight: _topRight = false,
  width,
  x,
  y,
}: Pick<
  BarRoundedProps,
  | "all"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "x"
  | "y"
  | "width"
  | "height"
  | "radius"
  | "topLeft"
  | "topRight"
  | "bottomRight"
  | "bottomLeft"
>) {
  const topRight = all || top || right || _topRight;
  const bottomRight = all || bottom || right || _bottomRight;
  const bottomLeft = all || bottom || left || _bottomLeft;
  const topLeft = all || top || left || _topLeft;

  // clamp radius to center of shortest side of the rect
  const r = Math.max(1, Math.min(radius, Math.min(width, height) / 2));

  const diameter = 2 * r;
  const path = `M${x + r},${y} h${width - diameter}
 ${topRight ? `a${r},${r} 0 0 1 ${r},${r}` : `h${r}v${r}`}
 v${height - diameter}
 ${bottomRight ? `a${r},${r} 0 0 1 ${-r},${r}` : `v${r}h${-r}`}
 h${diameter - width}
 ${bottomLeft ? `a${r},${r} 0 0 1 ${-r},${-r}` : `h${-r}v${-r}`}
 v${diameter - height}
 ${topLeft ? `a${r},${r} 0 0 1 ${r},${-r}` : `v${-r}h${r}`}
z`
    .split("\n")
    .join("");

  return path;
}

export const BarRounded = defineComponent({
  name: "BarRounded",
  inheritAttrs: false,
  props: {
    className: { type: String as PropType<string>, default: undefined },
    x: { type: Number as PropType<number>, required: true },
    y: { type: Number as PropType<number>, required: true },
    width: { type: Number as PropType<number>, required: true },
    height: { type: Number as PropType<number>, required: true },
    radius: { type: Number as PropType<number>, required: true },
    all: { type: Boolean as PropType<boolean>, default: false },
    top: { type: Boolean as PropType<boolean>, default: false },
    bottom: { type: Boolean as PropType<boolean>, default: false },
    left: { type: Boolean as PropType<boolean>, default: false },
    right: { type: Boolean as PropType<boolean>, default: false },
    topLeft: { type: Boolean as PropType<boolean>, default: false },
    topRight: { type: Boolean as PropType<boolean>, default: false },
    bottomLeft: { type: Boolean as PropType<boolean>, default: false },
    bottomRight: { type: Boolean as PropType<boolean>, default: false },
  },
  setup(props) {
    const attrs = useAttrs();
    const slots = useSlots();
    const innerRef = ref<SVGPathElement | null>(null);

    return () => {
      const path = getBarRoundedPath({
        x: props.x,
        y: props.y,
        width: props.width,
        height: props.height,
        radius: props.radius,
        all: props.all,
        top: props.top,
        bottom: props.bottom,
        left: props.left,
        right: props.right,
        topLeft: props.topLeft,
        topRight: props.topRight,
        bottomLeft: props.bottomLeft,
        bottomRight: props.bottomRight,
      });

      if (slots.default) return slots.default({ path });

      return (
        <path ref={innerRef} class={["visx-bar-rounded", props.className]} d={path} {...attrs} />
      );
    };
  },
});

export default BarRounded;
