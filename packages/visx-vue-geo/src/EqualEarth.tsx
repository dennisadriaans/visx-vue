import type { ProjectionProps } from "./Projection";
import type { GeoPermissibleObjects } from "./types";
import { createPresetProjection } from "./createPresetProjection";

export type EqualEarthProps<Datum extends GeoPermissibleObjects = GeoPermissibleObjects> = Omit<
  ProjectionProps<Datum>,
  "projection"
>;

/**
 * All props pass through to `<Projection projection="equalEarth" {...props} />`
 */
export const EqualEarth = createPresetProjection("EqualEarth", "equalEarth");
