import { defineComponent, type PropType } from "vue";
import { BarRounded } from "@visx-vue/shape";
import type { AxisScale } from "@visx-vue/axis";
import type { Bar, BarsProps } from "../../../types";

export type { BarsProps };

export default defineComponent({
  name: "Bars",
  inheritAttrs: false,
  props: {
    bars: { type: Array as PropType<Bar[]>, required: true },
    xScale: { type: Function as PropType<AxisScale>, required: true },
    yScale: { type: Function as PropType<AxisScale>, required: true },
    horizontal: { type: Boolean as PropType<boolean>, default: undefined },
    radius: { type: Number as PropType<number>, default: undefined },
    radiusAll: { type: Boolean as PropType<boolean>, default: undefined },
    radiusTop: { type: Boolean as PropType<boolean>, default: undefined },
    radiusRight: { type: Boolean as PropType<boolean>, default: undefined },
    radiusBottom: { type: Boolean as PropType<boolean>, default: undefined },
    radiusLeft: { type: Boolean as PropType<boolean>, default: undefined },
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
      const isFocusable = Boolean(props.onFocus || props.onBlur);
      const eventHandlers = {
        onBlur: props.onBlur,
        onFocus: props.onFocus,
        onPointermove: props.onPointerMove,
        onPointerout: props.onPointerOut,
        onPointerup: props.onPointerUp,
      };

      return (
        <>
          {props.bars.map(({ key, ...barProps }) =>
            props.radius == null ? (
              <rect
                key={key}
                class="visx-bar"
                tabindex={isFocusable ? 0 : undefined}
                {...barProps}
                {...eventHandlers}
              />
            ) : (
              <BarRounded
                key={key}
                class="visx-bar"
                radius={props.radius}
                all={props.radiusAll}
                top={props.radiusTop}
                right={props.radiusRight}
                bottom={props.radiusBottom}
                left={props.radiusLeft}
                {...barProps}
                {...({ tabindex: isFocusable ? 0 : undefined, ...eventHandlers } as any)}
              />
            ),
          )}
        </>
      );
    };
  },
});
