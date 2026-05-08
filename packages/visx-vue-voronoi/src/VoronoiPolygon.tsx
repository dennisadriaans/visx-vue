import { defineComponent, useAttrs, useSlots, type PropType } from "vue";

export type VoronoiPolygonProps = {
  /** Override render function which is provided polygon and generated path. */
  children?: ({ path, polygon }: { path: string; polygon: [number, number][] }) => void;
  /** className to apply to path element. */
  className?: string;
  /** Array of coordinate arrays for the polygon (e.g., [[x,y], [x1,y1], ...]), used to generate polygon path. */
  polygon?: [number, number][];
};

export type VoronoiPolygonSlotProps = {
  path: string;
  polygon: [number, number][];
};

export const VoronoiPolygon = defineComponent({
  name: "VoronoiPolygon",
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

      return <path class={["visx-voronoi-polygon", props.className]} d={path} {...attrs} />;
    };
  },
});
