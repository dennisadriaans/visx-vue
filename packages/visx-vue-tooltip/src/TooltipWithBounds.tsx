import { defineComponent, ref, computed, useAttrs, useSlots } from "vue";
import type { CSSProperties, PropType } from "vue";
import { useBoundingRects } from "@visx-vue/bounds";
import { defaultStyles } from "./defaultStyles";
import { provideTooltipPosition } from "./TooltipPositionContext";

export const TooltipWithBounds = defineComponent({
  name: "TooltipWithBounds",
  inheritAttrs: false,
  props: {
    className: { type: String as PropType<string>, default: undefined },
    left: { type: Number as PropType<number>, default: 0 },
    top: { type: Number as PropType<number>, default: 0 },
    offsetLeft: { type: Number as PropType<number>, default: 10 },
    offsetTop: { type: Number as PropType<number>, default: 10 },
    style: { type: Object as PropType<CSSProperties>, default: () => defaultStyles },
    unstyled: { type: Boolean as PropType<boolean>, default: false },
    applyPositionStyle: { type: Boolean as PropType<boolean>, default: false },
  },
  setup(props, { expose }) {
    const attrs = useAttrs();
    const slots = useSlots();
    const tooltipRef = ref<HTMLDivElement | null>(null);
    const { rect: ownBounds, parentRect: parentBounds } = useBoundingRects(tooltipRef);

    const positioning = computed(() => {
      let transform: string | undefined;
      let placeTooltipLeft = false;
      let placeTooltipUp = false;

      if (ownBounds.value && parentBounds.value) {
        let left = props.left;
        let top = props.top;

        if (parentBounds.value.width) {
          const rightPlacementClippedPx =
            left + props.offsetLeft + ownBounds.value.width - parentBounds.value.width;
          const leftPlacementClippedPx = ownBounds.value.width - left - props.offsetLeft;
          placeTooltipLeft =
            rightPlacementClippedPx > 0 && rightPlacementClippedPx > leftPlacementClippedPx;
        } else {
          const rightPlacementClippedPx =
            left + props.offsetLeft + ownBounds.value.width - window.innerWidth;
          const leftPlacementClippedPx = ownBounds.value.width - left - props.offsetLeft;
          placeTooltipLeft =
            rightPlacementClippedPx > 0 && rightPlacementClippedPx > leftPlacementClippedPx;
        }

        if (parentBounds.value.height) {
          const bottomPlacementClippedPx =
            top + props.offsetTop + ownBounds.value.height - parentBounds.value.height;
          const topPlacementClippedPx = ownBounds.value.height - top - props.offsetTop;
          placeTooltipUp =
            bottomPlacementClippedPx > 0 && bottomPlacementClippedPx > topPlacementClippedPx;
        } else {
          placeTooltipUp = top + props.offsetTop + ownBounds.value.height > window.innerHeight;
        }

        left = placeTooltipLeft
          ? left - ownBounds.value.width - props.offsetLeft
          : left + props.offsetLeft;
        top = placeTooltipUp
          ? top - ownBounds.value.height - props.offsetTop
          : top + props.offsetTop;

        left = Math.round(left);
        top = Math.round(top);

        transform = `translate(${left}px, ${top}px)`;
      }

      return { transform, placeTooltipLeft, placeTooltipUp };
    });

    const tooltipPosition = computed(() => ({
      isFlippedVertically: !positioning.value.placeTooltipUp,
      isFlippedHorizontally: !positioning.value.placeTooltipLeft,
    }));

    provideTooltipPosition(tooltipPosition);

    expose({ el: tooltipRef });

    return () => {
      const { transform } = positioning.value;

      const computedStyle: CSSProperties = {
        left: 0,
        top: 0,
        transform,
        ...(!props.unstyled && props.style),
      };

      return (
        <div
          ref={tooltipRef}
          class={["visx-tooltip", props.className]}
          style={computedStyle}
          {...attrs}
        >
          {slots.default?.()}
        </div>
      );
    };
  },
});
