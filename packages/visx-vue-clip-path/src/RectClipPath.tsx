import { defineComponent, useAttrs, type PropType } from "vue";
import { ClipPath } from "./ClipPath";

export type RectClipPathProps = {
  /** Unique id for the clipPath. */
  id: string;
  /** x position of the ClipPath rect. */
  x?: string | number;
  /** y position of the ClipPath rect. */
  y?: string | number;
  /** width of the ClipPath rect. */
  width?: string | number;
  /** height of the ClipPath rect. */
  height?: string | number;
};

export const RectClipPath = defineComponent({
  name: "RectClipPath",
  inheritAttrs: false,
  props: {
    id: { type: String as PropType<string>, required: true },
    x: { type: [String, Number] as PropType<string | number>, default: 0 },
    y: { type: [String, Number] as PropType<string | number>, default: 0 },
    width: { type: [String, Number] as PropType<string | number>, default: 1 },
    height: { type: [String, Number] as PropType<string | number>, default: 1 },
  },
  setup(props) {
    const attrs = useAttrs();

    return () => (
      <ClipPath id={props.id}>
        <rect x={props.x} y={props.y} width={props.width} height={props.height} {...attrs} />
      </ClipPath>
    );
  },
});
