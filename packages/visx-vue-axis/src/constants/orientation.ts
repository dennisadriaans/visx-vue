import type { ValueOf } from "@visx-vue/scale";

const Orientation = {
  top: "top",
  left: "left",
  right: "right",
  bottom: "bottom",
} as const;

export type OrientationType = ValueOf<typeof Orientation>;

export default Orientation;
