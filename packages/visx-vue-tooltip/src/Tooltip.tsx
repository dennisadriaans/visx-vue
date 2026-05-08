import { defineComponent, useAttrs, useSlots, ref } from "vue";
import type { CSSProperties, PropType } from "vue";
import { defaultStyles } from "./defaultStyles";

export const Tooltip = defineComponent({
  name: "Tooltip",
  inheritAttrs: false,
  props: {
    className: { type: String as PropType<string>, default: undefined },
    left: { type: Number as PropType<number>, default: undefined },
    top: { type: Number as PropType<number>, default: undefined },
    offsetLeft: { type: Number as PropType<number>, default: 10 },
    offsetTop: { type: Number as PropType<number>, default: 10 },
    style: { type: Object as PropType<CSSProperties>, default: () => defaultStyles },
    unstyled: { type: Boolean as PropType<boolean>, default: false },
    applyPositionStyle: { type: Boolean as PropType<boolean>, default: false },
  },
  setup(props, { expose }) {
    const attrs = useAttrs();
    const slots = useSlots();
    const elRef = ref<HTMLDivElement | null>(null);

    expose({ el: elRef });

    return () => {
      const computedStyle: CSSProperties = {
        top:
          props.top == null || props.offsetTop == null
            ? props.top != null
              ? `${props.top}px`
              : undefined
            : `${props.top + props.offsetTop}px`,
        left:
          props.left == null || props.offsetLeft == null
            ? props.left != null
              ? `${props.left}px`
              : undefined
            : `${props.left + props.offsetLeft}px`,
        ...(props.applyPositionStyle && { position: "absolute" as const }),
        ...(!props.unstyled && props.style),
      };

      return (
        <div ref={elRef} class={["visx-tooltip", props.className]} style={computedStyle} {...attrs}>
          {slots.default?.()}
        </div>
      );
    };
  },
});
