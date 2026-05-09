import { defineComponent, useAttrs, useSlots, type PropType } from "vue";
import { Group } from "@visx-vue/group";
import { geoGraticule } from "@visx-vue/vendor/d3-geo";
import type { LineString, MultiLineString, Polygon } from "geojson";

export type GraticuleProps = {
  /**
   * Render function for graticules which is passed a GeoJSON MultiLineString geometry object
   * representing all meridians and parallels for the graticule.
   */
  graticule?: (multiLineString: MultiLineString) => string;
  /**
   * Render function for graticule lines, which is invoked once for each meridian or parallel for the graticule,
   * and is passed the GeoJSON LineString object representing said meridian or parallel.
   */
  lines?: (lineString: LineString) => string;
  /**
   * Render function for the outline of the graticule (i.e. along the meridians and parallels defining its extent).
   * It is passed a GeoJSON Polygon geometry object representing the outline.
   */
  outline?: (polygon: Polygon) => string;
  /** Sets the major and minor extents of the graticule generator, which defaults to ⟨⟨-180°, -80° - ε⟩, ⟨180°, 80° + ε⟩⟩. */
  extent?: [[number, number], [number, number]];
  /** Sets the major extent of the graticule generator, which defaults to ⟨⟨-180°, -90° + ε⟩, ⟨180°, 90° - ε⟩⟩. */
  extentMajor?: [[number, number], [number, number]];
  /** Sets the major extent of the graticule generator, which defaults to ⟨⟨-180°, -80° - ε⟩, ⟨180°, 80° + ε⟩⟩. */
  extentMinor?: [[number, number], [number, number]];
  /** Sets both the major and minor step of the graticule generator. */
  step?: [number, number];
  /** Sets the major step of the graticule generator, which defaults to ⟨90°, 360°⟩. */
  stepMajor?: [number, number];
  /** Sets the major step of the graticule generator, which defaults to ⟨10°, 10°⟩. */
  stepMinor?: [number, number];
  /** Sets the precision of the graticule generator, which defaults to 2.5°. */
  precision?: number;
};

export const Graticule = defineComponent({
  name: "Graticule",
  props: {
    graticule: {
      type: Function as PropType<(multiLineString: MultiLineString) => string>,
      default: undefined,
    },
    lines: { type: Function as PropType<(lineString: LineString) => string>, default: undefined },
    outline: { type: Function as PropType<(polygon: Polygon) => string>, default: undefined },
    extent: {
      type: Array as unknown as PropType<[[number, number], [number, number]]>,
      default: undefined,
    },
    extentMajor: {
      type: Array as unknown as PropType<[[number, number], [number, number]]>,
      default: undefined,
    },
    extentMinor: {
      type: Array as unknown as PropType<[[number, number], [number, number]]>,
      default: undefined,
    },
    step: { type: Array as unknown as PropType<[number, number]>, default: undefined },
    stepMajor: { type: Array as unknown as PropType<[number, number]>, default: undefined },
    stepMinor: { type: Array as unknown as PropType<[number, number]>, default: undefined },
    precision: { type: Number as PropType<number>, default: undefined },
  },
  setup(props) {
    const attrs = useAttrs();
    const slots = useSlots();

    return () => {
      const currGraticule = geoGraticule();

      if (props.extent) currGraticule.extent(props.extent);
      if (props.extentMajor) currGraticule.extentMajor(props.extentMajor);
      if (props.extentMinor) currGraticule.extentMinor(props.extentMinor);
      if (props.step) currGraticule.step(props.step);
      if (props.stepMajor) currGraticule.stepMajor(props.stepMajor);
      if (props.stepMinor) currGraticule.stepMinor(props.stepMinor);
      if (props.precision) currGraticule.precision(props.precision);

      if (slots.default) return <>{slots.default({ graticule: currGraticule })}</>;

      return (
        <Group className="visx-geo-graticule">
          {props.graticule && (
            <path d={props.graticule(currGraticule())} fill="none" stroke="black" {...attrs} />
          )}
          {props.lines &&
            currGraticule.lines().map((line, i) => (
              <g key={i}>
                <path d={props.lines!(line)} fill="none" stroke="black" {...attrs} />
              </g>
            ))}
          {props.outline && (
            <path
              d={props.outline(currGraticule.outline())}
              fill="none"
              stroke="black"
              {...attrs}
            />
          )}
        </Group>
      );
    };
  },
});
