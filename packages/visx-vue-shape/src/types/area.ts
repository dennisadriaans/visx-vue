import type { AreaPathConfig } from "./D3ShapeConfig";

export type BaseAreaProps<Datum> = {
  /** Classname applied to path element. */
  className?: string;
  /** Array of data for which to generate an area shape. */
  data?: Datum[];
} & AreaPathConfig<Datum>;
