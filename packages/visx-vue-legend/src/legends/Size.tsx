import { defineComponent, useAttrs, useSlots, type PropType } from "vue";
import type { D3Scale } from "@visx-vue/scale";
import type { LegendProps } from "./Legend";
import Legend from "./Legend";
import labelTransformFactory from "../util/labelTransformFactory";
import defaultDomain from "../util/defaultDomain";
import identity from "../util/identity";
import type { LabelFormatterFactory } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySizeScale = D3Scale<number, any, any>;

export type LegendSizeProps<Scale extends AnySizeScale> = {
  /** Number of discrete steps to show in the legend. */
  steps?: number;
} & LegendProps<Scale>;

export const LegendSize = defineComponent({
  name: "LegendSize",
  inheritAttrs: false,
  props: {
    steps: { type: Number as PropType<number>, default: 5 },
    scale: { type: [Object, Function] as PropType<AnySizeScale>, required: true },
    domain: { type: Array as PropType<any[]>, default: undefined },
    labelFormat: { type: Function as PropType<any>, default: identity },
    labelTransform: {
      type: Function as PropType<LabelFormatterFactory<any>>,
      default: labelTransformFactory,
    },
  },
  setup(props) {
    const attrs = useAttrs();
    const slots = useSlots();

    return () => {
      const domain = props.domain || defaultDomain({ steps: props.steps, scale: props.scale });

      return (
        <Legend
          {...(attrs as Record<string, unknown>)}
          scale={props.scale}
          domain={domain}
          labelFormat={props.labelFormat}
          labelTransform={props.labelTransform}
          v-slots={slots}
        />
      );
    };
  },
});

export default LegendSize;
