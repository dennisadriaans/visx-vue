import { defineComponent, ref, watch, onBeforeUnmount, type PropType } from "vue";
// @ts-expect-error no types for d3-interpolate-path
import { interpolatePath } from "d3-interpolate-path";
import debounce from "lodash/debounce";

export default defineComponent({
  name: "AnimatedPath",
  inheritAttrs: false,
  props: {
    d: { type: String as PropType<string>, default: undefined },
    stroke: { type: String as PropType<string>, default: "transparent" },
    fill: { type: String as PropType<string>, default: "transparent" },
    className: { type: String as PropType<string>, default: undefined },
  },
  setup(props, { attrs }) {
    const previousD = ref(props.d);
    const currentD = ref(props.d);
    const currentStroke = ref(props.stroke);
    const currentFill = ref(props.fill);
    let animationFrame: number | null = null;

    const setPreviousD = debounce((dValue?: string) => {
      previousD.value = dValue;
    }, 50);

    watch(
      () => props.d,
      (newD) => {
        if (animationFrame != null) {
          cancelAnimationFrame(animationFrame);
        }

        const pathInterpolator = interpolatePath(previousD.value, newD);
        const startTime = performance.now();
        const duration = 300;

        function animate(time: number) {
          const elapsed = time - startTime;
          const t = Math.min(elapsed / duration, 1);
          currentD.value = pathInterpolator(t);

          if (t < 1) {
            animationFrame = requestAnimationFrame(animate);
          } else {
            animationFrame = null;
          }
        }

        animationFrame = requestAnimationFrame(animate);
        setPreviousD(newD);
      },
    );

    // Animate stroke and fill via CSS transitions
    watch(
      () => props.stroke,
      (newStroke) => {
        currentStroke.value = newStroke;
      },
    );
    watch(
      () => props.fill,
      (newFill) => {
        currentFill.value = newFill;
      },
    );

    onBeforeUnmount(() => {
      if (animationFrame != null) {
        cancelAnimationFrame(animationFrame);
      }
      setPreviousD.cancel();
    });

    return () => (
      <path
        class={["visx-path", props.className]}
        d={currentD.value}
        stroke={currentStroke.value}
        fill={currentFill.value}
        style={{ transition: "stroke 0.3s ease, fill 0.3s ease" }}
        {...attrs}
      />
    );
  },
});
