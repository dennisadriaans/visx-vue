import { defineComponent, useAttrs, type PropType } from "vue";
import { Glyph } from "./Glyph";

export type GlyphDotProps = {
  /** classname to apply to glyph path element. */
  className?: string;
  /** Top offset to apply to glyph g element container. */
  top?: number;
  /** Left offset to apply to glyph g element container. */
  left?: number;
  /** Radius of dot. */
  r?: number;
  /** x coordinate of the center of the dot. */
  cx?: number;
  /** y coordinate of the center of the dot. */
  cy?: number;
};

export const GlyphDot = defineComponent({
  name: "GlyphDot",
  inheritAttrs: false,
  props: {
    className: { type: String as PropType<string>, default: undefined },
    top: { type: Number as PropType<number>, default: 0 },
    left: { type: Number as PropType<number>, default: 0 },
    r: { type: Number as PropType<number>, default: undefined },
    cx: { type: Number as PropType<number>, default: undefined },
    cy: { type: Number as PropType<number>, default: undefined },
  },
  setup(props) {
    const attrs = useAttrs();

    return () => (
      <Glyph top={props.top} left={props.left}>
        <circle
          class={["visx-glyph-dot", props.className]}
          r={props.r}
          cx={props.cx}
          cy={props.cy}
          {...attrs}
        />
      </Glyph>
    );
  },
});
