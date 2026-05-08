import type { ProjectionProps } from "./Projection";
import type { GeoPermissibleObjects } from "./types";
import { createPresetProjection } from "./createPresetProjection";

export type MercatorProps<Datum extends GeoPermissibleObjects = GeoPermissibleObjects> = Omit<
  ProjectionProps<Datum>,
  "projection"
>;

/**
 * All props pass through to `<Projection projection="mercator" {...props} />`
 */
export const Mercator = createPresetProjection("Mercator", "mercator");
