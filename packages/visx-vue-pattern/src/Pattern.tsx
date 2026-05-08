import { defineComponent, useAttrs, useSlots, type PropType } from "vue";

export type PatternProps = {
  /** Unique id of the pattern element. */
  id: string;
  /** Width of the pattern. */
  width: number;
  /** Height of the pattern. */
  height: number;
};

export const Pattern = defineComponent({
  name: "Pattern",
  inheritAttrs: false,
  props: {
    id: { type: String as PropType<string>, required: true },
    width: { type: Number as PropType<number>, required: true },
    height: { type: Number as PropType<number>, required: true },
  },
  setup(props) {
    const attrs = useAttrs();
    const slots = useSlots();

    return () => (
      <defs>
        <pattern
          id={props.id}
          width={props.width}
          height={props.height}
          patternUnits="userSpaceOnUse"
          {...attrs}
        >
          {slots.default?.()}
        </pattern>
      </defs>
    );
  },
});
