import { defineComponent, useAttrs, type PropType, type CSSProperties } from "vue";
import { Group } from "@visx-vue/group";
import type { ScaleInput } from "@visx-vue/scale";
import type { LineProps } from "@visx-vue/shape";
import GridAngle from "./GridAngle";
import GridRadial from "./GridRadial";
import type { CommonGridProps, GridScale } from "../types";

export type GridPolarProps<
  AngleScale extends GridScale,
  RadialScale extends GridScale,
> = CommonGridProps & {
  /**
   * If specified, the arc of each radial grid line will have this thickness, useful for fills.
   */
  arcThickness?: number;
  /**
   * The class name applied to the angle grid group.
   */
  classNameAngle?: string;
  /**
   * The class name applied to the radial grid group.
   */
  classNameRadial?: string;
  /**
   * The end angle of the arc of radial grid lines in radians.
   */
  endAngle?: number;
  /**
   * The color applied to the fill of the radial lines.
   */
  fillRadial?: string;
  /**
   * Radius which determines the start position of angle lines.
   */
  innerRadius?: number;
  /**
   * Classname applied to all angle line paths.
   */
  lineClassNameAngle?: string;
  /**
   * Classname applied to all radial line paths.
   */
  lineClassNameRadial?: string;
  /**
   * Style object set as the angle line path style attribute.
   */
  lineStyleAngle?: CSSProperties;
  /**
   * Style object set as the radius line path style attribute.
   */
  lineStyleRadial?: CSSProperties;
  /**
   * The number of angle ticks wanted for the grid.
   */
  numTicksAngle?: number;
  /**
   * The number of radial ticks wanted for the grid.
   */
  numTicksRadial?: number;
  /**
   * Radius which determines the end position of angle lines.
   */
  outerRadius: number;
  /**
   * Scale function used to generate the angle of angle lines.
   */
  scaleAngle: AngleScale;
  /**
   * Scale function used to generate the radius of radial lines.
   */
  scaleRadial: RadialScale;
  /**
   * The start angle of the arc of radial grid lines in radians.
   */
  startAngle?: number;
  /**
   * The color applied to the stroke of the angle lines.
   */
  strokeAngle?: string;
  /**
   * The color applied to the stroke of the radial lines.
   */
  strokeRadial?: string;
  /**
   * The pattern of dashes for angle line stroke.
   */
  strokeDasharrayAngle?: string;
  /**
   * The pattern of dashes for radial stroke.
   */
  strokeDasharrayRadial?: string;
  /**
   * The pixel value for the width of the angle lines.
   */
  strokeWidthAngle?: string | number;
  /**
   * The pixel value for the width of the radial lines.
   */
  strokeWidthRadial?: string | number;
  /**
   * An array of values that determine the number and values of the angle ticks.
   */
  tickValuesAngle?: ScaleInput<AngleScale>[];
  /**
   * An array of values that determine the number and values of the radial ticks.
   */
  tickValuesRadial?: ScaleInput<RadialScale>[];
};

export const GridPolar = defineComponent({
  name: "GridPolar",
  props: {
    arcThickness: { type: Number as PropType<number>, default: undefined },
    className: { type: String as PropType<string>, default: undefined },
    classNameAngle: { type: String as PropType<string>, default: undefined },
    classNameRadial: { type: String as PropType<string>, default: undefined },
    endAngle: { type: Number as PropType<number>, default: undefined },
    fillRadial: { type: String as PropType<string>, default: undefined },
    innerRadius: { type: Number as PropType<number>, default: undefined },
    left: { type: Number as PropType<number>, default: undefined },
    lineClassNameAngle: { type: String as PropType<string>, default: undefined },
    lineClassNameRadial: { type: String as PropType<string>, default: undefined },
    lineStyleAngle: { type: Object as PropType<CSSProperties>, default: undefined },
    lineStyleRadial: { type: Object as PropType<CSSProperties>, default: undefined },
    numTicksAngle: { type: Number as PropType<number>, default: undefined },
    numTicksRadial: { type: Number as PropType<number>, default: undefined },
    outerRadius: { type: Number as PropType<number>, required: true },
    scaleAngle: { type: Function as PropType<GridScale>, required: true },
    scaleRadial: { type: Function as PropType<GridScale>, required: true },
    startAngle: { type: Number as PropType<number>, default: undefined },
    strokeAngle: { type: String as PropType<string>, default: undefined },
    strokeRadial: { type: String as PropType<string>, default: undefined },
    strokeDasharrayAngle: { type: String as PropType<string>, default: undefined },
    strokeDasharrayRadial: { type: String as PropType<string>, default: undefined },
    strokeWidthAngle: { type: [String, Number] as PropType<string | number>, default: undefined },
    strokeWidthRadial: { type: [String, Number] as PropType<string | number>, default: undefined },
    tickValuesAngle: { type: Array as PropType<unknown[]>, default: undefined },
    tickValuesRadial: { type: Array as PropType<unknown[]>, default: undefined },
    top: { type: Number as PropType<number>, default: undefined },
  },
  setup(props) {
    return () => (
      <Group
        className={["visx-grid-polar", props.className].filter(Boolean).join(" ")}
        top={props.top}
        left={props.left}
      >
        <GridAngle
          className={props.classNameAngle}
          innerRadius={props.innerRadius}
          lineClassName={props.lineClassNameAngle}
          lineStyle={props.lineStyleAngle}
          numTicks={props.numTicksAngle}
          outerRadius={props.outerRadius}
          scale={props.scaleAngle}
          stroke={props.strokeAngle}
          strokeWidth={props.strokeWidthAngle}
          strokeDasharray={props.strokeDasharrayAngle}
          tickValues={props.tickValuesAngle}
        />
        <GridRadial
          arcThickness={props.arcThickness}
          className={props.classNameRadial}
          endAngle={props.endAngle}
          fill={props.fillRadial}
          lineClassName={props.lineClassNameRadial}
          lineStyle={props.lineStyleRadial}
          numTicks={props.numTicksRadial}
          scale={props.scaleRadial}
          startAngle={props.startAngle}
          stroke={props.strokeRadial}
          strokeWidth={props.strokeWidthRadial}
          strokeDasharray={props.strokeDasharrayRadial}
          tickValues={props.tickValuesRadial}
        />
      </Group>
    );
  },
});

export default GridPolar;
