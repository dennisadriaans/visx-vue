import { defineComponent, ref, watchEffect, useSlots, type PropType } from "vue";

export interface ScaleSVGProps {
  /** Width of the desired SVG. */
  width?: number | string;
  /** Height of the desired SVG. */
  height?: number | string;
  /** xOrigin of the desired SVG. */
  xOrigin?: number | string;
  /** yOrigin of the desired SVG. */
  yOrigin?: number | string;
  /** Whether to preserve SVG aspect ratio. */
  preserveAspectRatio?: string;
  /** Ref to the parent `<svg />` used for scaling. */
  innerRef?: { value: SVGSVGElement | null };
}

export const ScaleSVG = defineComponent({
  name: "ScaleSVG",
  props: {
    width: { type: [Number, String] as PropType<number | string>, default: undefined },
    height: { type: [Number, String] as PropType<number | string>, default: undefined },
    xOrigin: { type: [Number, String] as PropType<number | string>, default: 0 },
    yOrigin: { type: [Number, String] as PropType<number | string>, default: 0 },
    preserveAspectRatio: { type: String as PropType<string>, default: "xMinYMin meet" },
    innerRef: { type: Object as PropType<{ value: SVGSVGElement | null }>, default: undefined },
  },
  setup(props, { expose }) {
    const slots = useSlots();
    const localRef = ref<SVGSVGElement | null>(null);

    expose({ el: localRef });

    watchEffect(() => {
      if (props.innerRef) props.innerRef.value = localRef.value;
    });

    return () => (
      <div
        style={{
          display: "inline-block",
          position: "relative",
          width: "100%",
          verticalAlign: "top",
          overflow: "hidden",
        }}
      >
        <svg
          preserveAspectRatio={props.preserveAspectRatio}
          viewBox={`${props.xOrigin} ${props.yOrigin} ${props.width} ${props.height}`}
          ref={localRef}
        >
          {slots.default?.()}
        </svg>
      </div>
    );
  },
});
