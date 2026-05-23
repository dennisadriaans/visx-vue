import { defineComponent, useAttrs, useSlots, type PropType, type Ref, type VNode } from "vue";
import { Group } from "@visx-vue/group";
import type { GeoProjection, ExtendedFeature } from "@visx-vue/vendor/d3-geo";
import {
  geoOrthographic,
  geoAlbers,
  geoAlbersUsa,
  geoMercator,
  geoNaturalEarth1,
  geoEqualEarth,
  geoPath,
} from "@visx-vue/vendor/d3-geo";
import type { LineString, Polygon, MultiLineString } from "geojson";

import type { GraticuleProps } from "./Graticule";
import { Graticule } from "./Graticule";
import type {
  GeoPermissibleObjects,
  ProjectionPreset,
  Projection as ProjectionShape,
} from "./types";

const projectionMapping: { [projection in ProjectionPreset]: () => GeoProjection } = {
  orthographic: () => geoOrthographic(),
  albers: () => geoAlbers(),
  albersUsa: () => geoAlbersUsa(),
  mercator: () => geoMercator(),
  naturalEarth: () => geoNaturalEarth1(),
  equalEarth: () => geoEqualEarth(),
};

export type ProjectionProps<Datum extends GeoPermissibleObjects = GeoPermissibleObjects> = {
  /** Array of features to project. */
  data: Datum[];
  /** Preset projection name, or custom projection function which returns a GeoProjection. */
  projection?: ProjectionShape;
  /** Hook to render above features, passed the configured projectionFunc. */
  projectionFunc?: (projection: GeoProjection) => VNode | VNode[];
  /** Sets the projection's clipping circle radius to the specified angle in degree. */
  clipAngle?: number;
  /**
   * Sets the projection's viewport clip extent to the specified bounds in pixels. extent bounds
   * are specified as an array [[x₀, y₀], [x₁, y₁]], where x₀ is the left-side of the viewport,
   * y₀ is the top, x₁ is the right and y₁ is the bottom.
   */
  clipExtent?: [[number, number], [number, number]];
  /**
   * Sets the projection's scale factor to the specified value. The scale factor corresponds linearly
   * to the distance between projected points; however, absolute scale factors are not equivalent
   * across projections.
   */
  scale?: number;
  /**
   * Sets the projection's translation offset, which determines the pixel coordinates of the
   * projection's center, to the specified two-element array [tx, ty].
   */
  translate?: [number, number];
  /** Sets the projection's center to the specified two-element array of longitude and latitude in degrees. */
  center?: [number, number];
  /** Sets the projection's three-axis spherical rotation to the specified angles [lambda, phi [, gamma]], corresponding to yaw, pitch, and roll. */
  rotate?: [number, number] | [number, number, number];
  /** Sets the threshold for the projection's adaptive resampling to the specified value in pixels. */
  precision?: number;
  /**
   * Sets the projection's scale and translate to fit the specified GeoJSON object in the center of the given extent.
   * The extent is specified as an array [[x₀, y₀], [x₁, y₁]], where x₀ is the left side of the bounding box,
   * y₀ is the top, x₁ is the right and y₁ is the bottom.
   */
  fitExtent?: [[[number, number], [number, number]], ExtendedFeature];
  /** Convenience prop for props.fitExtent where the top-left corner of the extent is [0, 0]. */
  fitSize?: [[number, number], ExtendedFeature];
  /** Hook to render anything at the centroid of a feature. */
  centroid?: (
    centroid: [number, number],
    feature: ParsedFeature<GeoPermissibleObjects>,
  ) => VNode | VNode[];
  /** className to apply to feature path elements. */
  className?: string;
  /** Function invoked for each feature which returns a Ref to the projection path element for that feature. */
  innerRef?: (feature: ParsedFeature<GeoPermissibleObjects>, index: number) => Ref<SVGPathElement>;
  /** If specified, renders a Graticule with the specified props. Specify `graticule.foreground = true` to be rendered on top of features. */
  graticule?: Omit<GraticuleProps, "lines"> & { foreground: boolean };
  /** If specified, renders a Graticule lines with the specified props. Specify `graticuleLines.foreground = true` to be rendered on top of features. */
  graticuleLines?: Omit<GraticuleProps, "lines"> & { foreground: boolean };
  /** If specified, renders a Graticule outline with the specified props. Specify `graticuleOutline.foreground = true` to be rendered on top of features. */
  graticuleOutline?: Omit<GraticuleProps, "outline"> & { foreground: boolean };
  /** Limits the digits for coordinates generated in SVG path strings to the specified number of digits. */
  digits?: number;
  /** Sets the radius used to display Point and MultiPoint geometries to the specified number. */
  pointRadius?: number;
};

export interface ParsedFeature<Datum> {
  feature: Datum;
  type: ProjectionShape;
  projection: GeoProjection;
  index: number;
  centroid: [number, number];
  path: string | null;
}

/**
 * Component for all projections.
 */
export const Projection = defineComponent({
  name: "Projection",
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
  setup(props) {
    const attrs = useAttrs();
    const slots = useSlots();

    return () => {
      const { projection } = props;

      const maybeCustomProjection =
        typeof projection === "string" ? projectionMapping[projection] : projection;

      const currProjection = maybeCustomProjection();

      if (props.clipAngle && currProjection.clipAngle) currProjection.clipAngle(props.clipAngle);
      if (props.clipExtent && currProjection.clipExtent)
        currProjection.clipExtent(props.clipExtent);
      if (props.scale && currProjection.scale) currProjection.scale(props.scale);
      if (props.translate && currProjection.translate) currProjection.translate(props.translate);
      if (props.center && currProjection.center) currProjection.center(props.center);
      if (props.rotate && currProjection.rotate) currProjection.rotate(props.rotate);
      if (props.precision && currProjection.precision) currProjection.precision(props.precision);
      if (props.fitExtent && currProjection.fitExtent) currProjection.fitExtent(...props.fitExtent);
      if (props.fitSize && currProjection.fitSize) currProjection.fitSize(...props.fitSize);

      const path = geoPath().projection(currProjection);

      if (props.digits !== undefined) path.digits(props.digits);
      if (props.pointRadius !== undefined) path.pointRadius(props.pointRadius);

      const features: ParsedFeature<GeoPermissibleObjects>[] = props.data.map((feature, i) => ({
        feature,
        type: projection,
        projection: currProjection,
        index: i,
        centroid: path.centroid(feature),
        path: path(feature),
      }));

      // Scoped slot: children({ path, features, projection })
      if (slots.default) {
        return <>{slots.default({ path, features, projection: currProjection })}</>;
      }

      return (
        <Group className="visx-geo">
          {props.graticule && !props.graticule.foreground && (
            <Graticule graticule={(ml: MultiLineString) => path(ml) || ""} {...props.graticule} />
          )}
          {props.graticuleLines && !props.graticuleLines.foreground && (
            <Graticule lines={(l: LineString) => path(l) || ""} {...props.graticuleLines} />
          )}
          {props.graticuleOutline && !props.graticuleOutline.foreground && (
            <Graticule outline={(p: Polygon) => path(p) || ""} {...props.graticuleOutline} />
          )}

          {features.map((feature, i) => (
            <g key={`${projection}-${i}`}>
              <path
                class={[`visx-geo-${projection}`, props.className]}
                d={feature.path || ""}
                ref={props.innerRef?.(feature, i)}
                {...attrs}
              />
              {props.centroid?.(feature.centroid, feature)}
            </g>
          ))}

          {props.projectionFunc?.(currProjection)}

          {props.graticule?.foreground && (
            <Graticule graticule={(ml: MultiLineString) => path(ml) || ""} {...props.graticule} />
          )}

          {props.graticuleLines?.foreground && (
            <Graticule lines={(l: LineString) => path(l) || ""} {...props.graticuleLines} />
          )}
          {props.graticuleOutline?.foreground && (
            <Graticule outline={(p: Polygon) => path(p) || ""} {...props.graticuleOutline} />
          )}
        </Group>
      );
    };
  },
});
