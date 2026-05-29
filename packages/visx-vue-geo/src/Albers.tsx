import type { ProjectionProps } from './Projection'
import type { GeoPermissibleObjects } from './types'
import { createPresetProjection } from './createPresetProjection'

export type AlbersProps<Datum extends GeoPermissibleObjects = GeoPermissibleObjects> = Omit<
  ProjectionProps<Datum>,
  'projection'
>

/**
 * All props pass through to `<Projection projection="albers" {...props} />`
 */
export const Albers = createPresetProjection('Albers', 'albers')
