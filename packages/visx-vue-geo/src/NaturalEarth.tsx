import type { ProjectionProps } from './Projection'
import type { GeoPermissibleObjects } from './types'
import { createPresetProjection } from './createPresetProjection'

export type NaturalEarthProps<Datum extends GeoPermissibleObjects = GeoPermissibleObjects> = Omit<
  ProjectionProps<Datum>,
  'projection'
>

/**
 * All props pass through to `<Projection projection="naturalEarth" {...props} />`
 */
export const NaturalEarth = createPresetProjection('NaturalEarth', 'naturalEarth')
