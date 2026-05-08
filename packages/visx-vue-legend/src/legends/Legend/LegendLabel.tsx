import { defineComponent, useAttrs, useSlots, type PropType } from "vue";

export type LegendLabelOwnProps = {
  /** Horizontal alignment of the label text. Maps to CSS justify-content property. */
  align?: string;
  /** The label content to display. */
  label?: string | number;
  /** CSS flex property controlling how the label grows/shrinks in the legend item. */
  flex?: string | number;
  /** Margin around the label. */
  margin?: string | number;
};

export type LegendLabelProps = LegendLabelOwnProps;

export const LegendLabel = defineComponent({
  name: "LegendLabel",
  props: {
    align: { type: String as PropType<string>, default: "left" },
    label: { type: [String, Number] as PropType<string | number>, default: undefined },
    flex: { type: [String, Number] as PropType<string | number>, default: "1" },
    margin: { type: [String, Number] as PropType<string | number>, default: "5px 0" },
  },
  setup(props) {
    const attrs = useAttrs();
    const slots = useSlots();

    return () => (
      <div
        class="visx-legend-label"
        style={{
          justifyContent: props.align,
          display: "flex",
          flex: props.flex,
          margin: props.margin,
        }}
        {...attrs}
      >
        {slots.default?.() || props.label}
      </div>
    );
  },
});

export default LegendLabel;
