import { defineComponent, computed, useAttrs, useSlots, ref, type PropType } from "vue";

export type GroupProps = {
  /** Top offset applied to `<g/>`. */
  top?: number;
  /** Left offset applied to `<g/>`. */
  left?: number;
  /** Override `top` and `left` to provide the entire `transform` string. */
  transform?: string;
  /** className to apply to `<g/>`. */
  className?: string;
  /** ref to underlying `<g/>`. */
  innerRef?: { value: SVGGElement | null };
};

export const Group = defineComponent({
  name: "Group",
  inheritAttrs: false,
  props: {
    top: { type: Number as PropType<number>, default: 0 },
    left: { type: Number as PropType<number>, default: 0 },
    transform: { type: String as PropType<string>, default: undefined },
    className: { type: String as PropType<string>, default: undefined },
    innerRef: { type: Object as PropType<{ value: SVGGElement | null }>, default: undefined },
  },
  setup(props, { expose }) {
    const attrs = useAttrs();
    const slots = useSlots();
    const localRef = ref<SVGGElement | null>(null);

    const transformAttr = computed(
      () => props.transform || `translate(${props.left}, ${props.top})`,
    );

    expose({ rootElement: localRef });

    return () => (
      <g
        ref={(el: any) => {
          localRef.value = el;
          if (props.innerRef) props.innerRef.value = el;
        }}
        class={["visx-group", props.className]}
        transform={transformAttr.value}
        {...attrs}
      >
        {typeof slots.default === "function" ? slots.default() : slots.default}
      </g>
    );
  },
});
