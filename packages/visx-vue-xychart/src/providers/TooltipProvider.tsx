import { defineComponent, provide, ref, onScopeDispose, type PropType } from "vue";
import debounce from "lodash/debounce";
import { useTooltip } from "@visx-vue/tooltip";
import { TooltipContextKey } from "../context/TooltipContext";
import type { EventHandlerParams, TooltipContextType, TooltipData } from "../types";
import isValidNumber from "../typeguards/isValidNumber";

export type TooltipProviderProps = {
  /** Debounce time for when `hideTooltip` is invoked. */
  hideTooltipDebounceMs?: number;
};

/** Simple wrapper around useTooltip, to provide tooltip data via context. */
const TooltipProvider = defineComponent({
  name: "TooltipProvider",
  props: {
    hideTooltipDebounceMs: {
      type: Number as PropType<number>,
      default: 400,
    },
  },
  setup(props, { slots }) {
    const {
      tooltipOpen,
      tooltipLeft,
      tooltipTop,
      tooltipData,
      updateTooltip,
      hideTooltip: privateHideTooltip,
    } = useTooltip<TooltipData<object>>();

    let debouncedHideTooltip: ReturnType<typeof debounce> | null = null;

    function cancelDebouncedHideTooltip() {
      if (debouncedHideTooltip) {
        debouncedHideTooltip.cancel();
        debouncedHideTooltip = null;
      }
    }

    onScopeDispose(cancelDebouncedHideTooltip);

    function showTooltip({
      svgPoint,
      index,
      key,
      datum,
      distanceX,
      distanceY,
    }: EventHandlerParams<object>) {
      // cancel any hideTooltip calls so it won't hide after invoking the logic below
      cancelDebouncedHideTooltip();
      const cleanDistanceX = isValidNumber(distanceX) ? distanceX : Infinity;
      const cleanDistanceY = isValidNumber(distanceY) ? distanceY : Infinity;
      const distance = Math.sqrt(cleanDistanceX ** 2 + cleanDistanceY ** 2);

      updateTooltip((current) => {
        const currData = current.tooltipData;
        const currNearestDatumDistance =
          currData?.nearestDatum && isValidNumber(currData.nearestDatum.distance)
            ? currData.nearestDatum.distance
            : Infinity;
        return {
          tooltipOpen: true,
          tooltipLeft: svgPoint?.x,
          tooltipTop: svgPoint?.y,
          tooltipData: {
            nearestDatum:
              (currData?.nearestDatum?.key ?? "") !== key && currNearestDatumDistance < distance
                ? currData?.nearestDatum
                : { key, index, datum, distance },
            datumByKey: {
              ...currData?.datumByKey,
              [key]: {
                datum,
                index,
                key,
              },
            },
          },
        };
      });
    }

    function hideTooltip() {
      debouncedHideTooltip = debounce(privateHideTooltip, props.hideTooltipDebounceMs);
      debouncedHideTooltip();
    }

    const contextValue = {
      tooltipOpen,
      tooltipLeft,
      tooltipTop,
      tooltipData,
      updateTooltip,
      showTooltip: showTooltip as TooltipContextType<object>["showTooltip"],
      hideTooltip,
    } satisfies TooltipContextType<object>;

    provide(TooltipContextKey, contextValue);

    return () => slots.default?.();
  },
});

export default TooltipProvider;
