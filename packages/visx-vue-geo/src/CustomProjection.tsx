import { defineComponent, type PropType, type VNode, type Ref } from "vue";
import type { ExtendedFeature, GeoProjection } from "@visx-vue/vendor/d3-geo";

import { Projection, type ProjectionProps, type ParsedFeature } from "./Projection";
import type { GraticuleProps } from "./Graticule";
import type { GeoPermissibleObjects, Projection as ProjectionShape } from "./types";

export type CustomProjectionProps<Datum extends GeoPermissibleObjects = GeoPermissibleObjects> =
  ProjectionProps<Datum>;

/**
 * All props pass through to `<Projection projection={customProjection} {...props} />`
 */
export const CustomProjection = defineComponent({
  name: "CustomProjection",
  props: {
    data: { type: Array as PropType<GeoPermissibleObjects[]>, required: true },
    projection: { type: [String, Function] as PropType<ProjectionShape>, default: "mercator" },
    projectionFunc: {
      type: Function as PropType<(projection: GeoProjection) => VNode | VNode[]>,
      default: undefined,
    },
    clipAngle: { type: Number as PropType<number>, default: undefined },
    clipExtent: {
      type: Array as unknown as PropType<[[number, number], [number, number]]>,
      default: undefined,
    },
    scale: { type: Number as PropType<number>, default: undefined },
    translate: { type: Array as unknown as PropType<[number, number]>, default: undefined },
    center: { type: Array as unknown as PropType<[number, number]>, default: undefined },
    rotate: {
      type: Array as unknown as PropType<[number, number] | [number, number, number]>,
      default: undefined,
    },
    precision: { type: Number as PropType<number>, default: undefined },
    fitExtent: {
      type: Array as unknown as PropType<[[[number, number], [number, number]], ExtendedFeature]>,
      default: undefined,
    },
    fitSize: {
      type: Array as unknown as PropType<[[number, number], ExtendedFeature]>,
      default: undefined,
    },
    centroid: {
      type: Function as PropType<
        (
          centroid: [number, number],
          feature: ParsedFeature<GeoPermissibleObjects>,
        ) => VNode | VNode[]
      >,
      default: undefined,
    },
    className: { type: String as PropType<string>, default: undefined },
    innerRef: {
      type: Function as PropType<
        (feature: ParsedFeature<GeoPermissibleObjects>, index: number) => Ref<SVGPathElement>
      >,
      default: undefined,
    },
    graticule: {
      type: Object as PropType<Omit<GraticuleProps, "lines"> & { foreground: boolean }>,
      default: undefined,
    },
    graticuleLines: {
      type: Object as PropType<Omit<GraticuleProps, "lines"> & { foreground: boolean }>,
      default: undefined,
    },
    graticuleOutline: {
      type: Object as PropType<Omit<GraticuleProps, "outline"> & { foreground: boolean }>,
      default: undefined,
    },
    digits: { type: Number as PropType<number>, default: undefined },
    pointRadius: { type: Number as PropType<number>, default: undefined },
  },
  setup(props, { slots }) {
    return () => <Projection {...props} v-slots={slots} />;
  },
});
