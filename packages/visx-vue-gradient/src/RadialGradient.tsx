import { defineComponent, useAttrs, useSlots, type PropType } from "vue";

export type RadialGradientProps = {
  /** Unique id for the gradient. Should be unique across all page elements. */
  id: string;
  /** Start color of gradient. */
  from?: string;
  /** End color of gradient. */
  to?: string;
  /** Number or percent defining the where the 'from' starting color is placed along the gradient. */
  fromOffset?: string | number;
  /** Opacity of the 'from' starting color. */
  fromOpacity?: string | number;
  /** Number or percent defining the where the 'to' ending color is placed along the gradient. */
  toOffset?: string | number;
  /** Opacity of the 'to' ending color. */
  toOpacity?: string | number;
  /** Rotation to apply to gradient. */
  rotate?: string | number;
  /** Transform to apply to radialGradient, overrides rotate. */
  transform?: string;
};

export const RadialGradient = defineComponent({
  name: "RadialGradient",
  inheritAttrs: false,
  props: {
    id: { type: String as PropType<string>, required: true },
    from: { type: String as PropType<string>, default: undefined },
    to: { type: String as PropType<string>, default: undefined },
    fromOffset: { type: [String, Number] as PropType<string | number>, default: "0%" },
    fromOpacity: { type: [String, Number] as PropType<string | number>, default: 1 },
    toOffset: { type: [String, Number] as PropType<string | number>, default: "100%" },
    toOpacity: { type: [String, Number] as PropType<string | number>, default: 1 },
    rotate: { type: [String, Number] as PropType<string | number>, default: undefined },
    transform: { type: String as PropType<string>, default: undefined },
  },
  setup(props) {
    const attrs = useAttrs();
    const slots = useSlots();

    return () => {
      const hasChildren = !!slots.default;

      return (
        <defs>
          <radialGradient
            id={props.id}
            gradientTransform={props.rotate ? `rotate(${props.rotate})` : props.transform}
            {...attrs}
          >
            {hasChildren && slots.default?.()}
            {!hasChildren && (
              <stop
                offset={props.fromOffset}
                stop-color={props.from}
                stop-opacity={props.fromOpacity}
              />
            )}
            {!hasChildren && (
              <stop offset={props.toOffset} stop-color={props.to} stop-opacity={props.toOpacity} />
            )}
          </radialGradient>
        </defs>
      );
    };
  },
});
