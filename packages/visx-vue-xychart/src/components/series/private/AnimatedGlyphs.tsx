import { defineComponent, type PropType, type VNode } from "vue";
import type { AxisScale } from "@visx-vue/axis";
import type { GlyphProps } from "../../../types";
import { colorHasUrl } from "../../../utils/cleanColorString";

export default defineComponent({
  name: "AnimatedGlyphs",
  props: {
    renderGlyph: {
      type: Function as PropType<(props: GlyphProps<object>) => VNode>,
      required: true,
    },
    glyphs: { type: Array as PropType<GlyphProps<object>[]>, required: true },
    horizontal: { type: Boolean as PropType<boolean>, default: undefined },
    xScale: { type: Function as PropType<AxisScale>, required: true },
    yScale: { type: Function as PropType<AxisScale>, required: true },
    onBlur: { type: Function as PropType<(event: FocusEvent) => void>, default: undefined },
    onFocus: { type: Function as PropType<(event: FocusEvent) => void>, default: undefined },
    onPointerMove: {
      type: Function as PropType<(event: PointerEvent) => void>,
      default: undefined,
    },
    onPointerOut: { type: Function as PropType<(event: PointerEvent) => void>, default: undefined },
    onPointerUp: { type: Function as PropType<(event: PointerEvent) => void>, default: undefined },
  },
  setup(props) {
    return () => {
      return (
        <>
          {props.glyphs.map((glyph) => (
            <g
              key={glyph.key}
              transform={`translate(${glyph.x}, ${glyph.y})`}
              style={{
                transition: "transform 0.3s ease, opacity 0.3s ease",
                opacity: 1,
              }}
            >
              {props.renderGlyph({
                key: glyph.key,
                datum: glyph.datum,
                index: glyph.index,
                x: 0,
                y: 0,
                size: glyph.size,
                // currentColor doesn't work with url-based colors (pattern, gradient)
                color: colorHasUrl(glyph.color) ? glyph.color : glyph.color,
                onBlur: props.onBlur,
                onFocus: props.onFocus,
                onPointerMove: props.onPointerMove,
                onPointerOut: props.onPointerOut,
                onPointerUp: props.onPointerUp,
              })}
            </g>
          ))}
        </>
      );
    };
  },
});
