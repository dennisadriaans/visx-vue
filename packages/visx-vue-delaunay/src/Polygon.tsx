import { defineComponent, useAttrs, useSlots, type PropType } from "vue";

export type PolygonProps = {
  /** className to apply to path element. */
  className?: string;
  /** Array of coordinate arrays for the polygon (e.g., [[x,y], [x1,y1], ...]), used to generate polygon path. */
  polygon?: [number, number][];
};

export type PolygonSlotProps = {
  path: string;
  polygon: [number, number][];
};

export const Polygon = defineComponent({
  name: "Polygon",
  props: {
    className: { type: String as PropType<string>, default: undefined },
    polygon: { type: Array as PropType<[number, number][]>, default: undefined },
  },
  setup(props) {
    const attrs = useAttrs();
    const slots = useSlots();

    return () => {
      if (!props.polygon) return null;

      const path = `M${props.polygon.join("L")}Z`;

      if (slots.default) {
        return slots.default({ path, polygon: props.polygon });
      }

      return <path class={["visx-delaunay-polygon", props.className]} d={path} {...attrs} />;
    };
  },
});
