import { defineComponent, useAttrs, useSlots, type PropType } from "vue";
import type { FlexDirection } from "../../types";

export type LegendItemProps = {
  /** Flex direction for the legend item layout. */
  flexDirection?: FlexDirection;
  /** CSS align-items property for vertical alignment. */
  alignItems?: string;
  /** Margin around the legend item. */
  margin?: string | number;
  /** CSS display property for the legend item. */
  display?: string;
};

export const LegendItem = defineComponent({
  name: "LegendItem",
  props: {
    flexDirection: { type: String as PropType<FlexDirection>, default: "row" },
    alignItems: { type: String as PropType<string>, default: "center" },
    margin: { type: [String, Number] as PropType<string | number>, default: "0" },
    display: { type: String as PropType<string>, default: "flex" },
  },
  setup(props) {
    const attrs = useAttrs();
    const slots = useSlots();

    return () => (
      <div
        class="visx-legend-item"
        style={{
          display: props.display,
          alignItems: props.alignItems,
          flexDirection: props.flexDirection,
          margin: props.margin,
        }}
        {...attrs}
      >
        {slots.default?.()}
      </div>
    );
  },
});

export default LegendItem;
