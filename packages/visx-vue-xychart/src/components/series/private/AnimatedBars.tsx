import { defineComponent, computed, ref, watch, type PropType } from "vue";
import type { AxisScale } from "@visx-vue/axis";
import { BarRounded } from "@visx-vue/shape";
import type { Bar, BarsProps } from "../../../types";
import { cleanColor } from "../../../utils/cleanColorString";
import getScaleBaseline from "../../../utils/getScaleBaseline";
import AnimatedPath from "./AnimatedPath";

export type { BarsProps };

function getBarTransitionStyle(bar: Bar, _scale: AxisScale, _horizontal?: boolean) {
  return {
    x: bar.x,
    y: bar.y,
    width: bar.width,
    height: bar.height,
    fill: bar.fill,
    opacity: 1,
  };
}

function getBarFromLeaveStyle(bar: Bar, scale: AxisScale, horizontal?: boolean) {
  const shouldAnimateX = !!horizontal;
  const scaleBaseline = getScaleBaseline(scale);
  return {
    x: shouldAnimateX ? (scaleBaseline ?? 0) : bar.x,
    y: shouldAnimateX ? bar.y : (scaleBaseline ?? 0),
    width: shouldAnimateX ? 0 : bar.width,
    height: shouldAnimateX ? bar.height : 0,
    fill: cleanColor(bar.fill),
    opacity: 0,
  };
}

const AnimatedBarsRounded = defineComponent({
  name: "AnimatedBarsRounded",
  inheritAttrs: false,
  props: {
    bars: { type: Array as PropType<Bar[]>, required: true },
    xScale: { type: Function as PropType<AxisScale>, required: true },
    yScale: { type: Function as PropType<AxisScale>, required: true },
    horizontal: { type: Boolean as PropType<boolean>, default: undefined },
    radius: { type: Number as PropType<number>, required: true },
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
    return () => (
      <>
        {props.bars.map(({ key, fill, x, y, width, height }) => (
          <BarRounded
            key={key}
            x={x}
            y={y}
            width={width}
            height={height}
            radius={props.radius}
            all={props.radiusAll}
            top={props.radiusTop}
            right={props.radiusRight}
            bottom={props.radiusBottom}
            left={props.radiusLeft}
          >
            {{
              default: ({ path }: { path: string }) => (
                <AnimatedPath
                  class="visx-bar visx-bar-rounded"
                  d={path}
                  fill={fill}
                  {...({
                    onBlur: props.onBlur,
                    onFocus: props.onFocus,
                    onPointermove: props.onPointerMove,
                    onPointerout: props.onPointerOut,
                    onPointerup: props.onPointerUp,
                  } as any)}
                />
              ),
            }}
          </BarRounded>
        ))}
      </>
    );
  },
});

const AnimatedBarsUnrounded = defineComponent({
  name: "AnimatedBarsUnrounded",
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
    // Track previous bars for enter/leave animation
    const animatedBars = ref<
      Array<{
        key: string;
        style: {
          x: number;
          y: number;
          width: number;
          height: number;
          fill?: string;
          opacity: number;
        };
        removing: boolean;
      }>
    >([]);

    const scale = computed(() => (props.horizontal ? props.xScale : props.yScale));

    watch(
      () => props.bars,
      (newBars) => {
        const newKeys = new Set(newBars.map((b) => b.key));
        const existingKeys = new Set(animatedBars.value.map((b) => b.key));

        // Mark bars that are leaving
        const result = animatedBars.value
          .filter((b) => !b.removing)
          .map((b) => {
            if (!newKeys.has(b.key)) {
              // bar is leaving - get from-leave style
              const originalBar = props.bars.find((nb) => nb.key === b.key) || {
                key: b.key,
                x: b.style.x,
                y: b.style.y,
                width: b.style.width,
                height: b.style.height,
                fill: b.style.fill,
              };
              return {
                key: b.key,
                style: getBarFromLeaveStyle(originalBar, scale.value, props.horizontal),
                removing: true,
              };
            }
            return null;
          })
          .filter(Boolean) as typeof animatedBars.value;

        // Update existing and add new
        newBars.forEach((bar) => {
          const style = getBarTransitionStyle(bar, scale.value, props.horizontal);
          if (existingKeys.has(bar.key)) {
            const existing = result.find((b) => b.key === bar.key);
            if (!existing) {
              result.push({ key: bar.key, style, removing: false });
            }
          } else {
            result.push({ key: bar.key, style, removing: false });
          }
        });

        // Maintain order: new bars first, then leaving
        animatedBars.value = [
          ...newBars.map((bar) => ({
            key: bar.key,
            style: getBarTransitionStyle(bar, scale.value, props.horizontal),
            removing: false,
          })),
          ...result.filter((b) => b.removing),
        ];

        // Remove leaving bars after transition
        setTimeout(() => {
          animatedBars.value = animatedBars.value.filter((b) => !b.removing);
        }, 300);
      },
      { immediate: true },
    );

    return () => {
      const isFocusable = Boolean(props.onFocus || props.onBlur);
      return (
        <>
          {animatedBars.value.map(({ key, style }) => (
            <rect
              key={key}
              tabindex={isFocusable ? 0 : undefined}
              class="visx-bar"
              x={style.x}
              y={style.y}
              width={style.width}
              height={style.height}
              fill={style.fill}
              opacity={style.opacity}
              style={{
                transition:
                  "x 0.3s ease, y 0.3s ease, width 0.3s ease, height 0.3s ease, opacity 0.3s ease",
              }}
              onBlur={props.onBlur}
              onFocus={props.onFocus}
              onPointermove={props.onPointerMove}
              onPointerout={props.onPointerOut}
              onPointerup={props.onPointerUp}
            />
          ))}
        </>
      );
    };
  },
});

/** Wrapper component which renders animated Bars depending on whether it needs rounded corners. */
export default defineComponent({
  name: "AnimatedBars",
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
    return () =>
      props.radius == null ? (
        <AnimatedBarsUnrounded {...props} />
      ) : (
        <AnimatedBarsRounded {...props} radius={props.radius} />
      );
  },
});
