import { defineComponent, useAttrs, useSlots, type PropType } from "vue";
import type { PickD3Scale } from "@visx-vue/scale";
import type { LegendProps } from "./Legend";
import Legend from "./Legend";
import type { LabelFormatterFactory } from "../types";
import identity from "../util/identity";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyQuantileScale = PickD3Scale<"quantile", any>;

type FactoryProps = {
  /** The delimiter string to use between the min and max values in the label. */
  labelDelimiter?: string;
};

export type LegendQuantileProps<Scale extends AnyQuantileScale> = LegendProps<Scale> & FactoryProps;

function labelFormatterFactoryFactory<Scale extends AnyQuantileScale>({
  labelDelimiter,
}: FactoryProps): LabelFormatterFactory<Scale> {
  return ({ scale, labelFormat }) =>
    (datum, index) => {
      const [x0, x1] = scale.invertExtent(scale(datum));
      return {
        extent: [x0, x1],
        text: `${labelFormat(x0, index)} ${labelDelimiter} ${labelFormat(x1, index)}`,
        value: scale(x0),
        datum,
        index,
      };
    };
}

export const LegendQuantile = defineComponent({
  name: "LegendQuantile",
  inheritAttrs: false,
  props: {
    labelDelimiter: { type: String as PropType<string>, default: "-" },
    scale: { type: [Object, Function] as PropType<AnyQuantileScale>, required: true },
    domain: { type: Array as PropType<any[]>, default: undefined },
    labelFormat: { type: Function as PropType<any>, default: identity },
    labelTransform: { type: Function as PropType<LabelFormatterFactory<any>>, default: undefined },
  },
  setup(props) {
    const attrs = useAttrs();
    const slots = useSlots();

    return () => {
      const domain =
        props.domain ||
        (props.scale as any)
          .range()
          .map((output: any) => (props.scale as any).invertExtent(output)[0]);
      const labelTransform =
        props.labelTransform ||
        labelFormatterFactoryFactory({ labelDelimiter: props.labelDelimiter });

      return (
        <Legend
          {...(attrs as Record<string, unknown>)}
          scale={props.scale}
          domain={domain}
          labelFormat={props.labelFormat}
          labelTransform={labelTransform}
          v-slots={slots}
        />
      );
    };
  },
});

export default LegendQuantile;
