import type { ProjectionProps } from './Projection'
import type { GeoPermissibleObjects } from './types'
import { createPresetProjection } from './createPresetProjection'

export type AlbersUsaProps<Datum extends GeoPermissibleObjects = GeoPermissibleObjects> = Omit<
  ProjectionProps<Datum>,
  'projection'
>

/**
 * All props pass through to `<Projection projection="albersUsa" {...props} />`
 */
export const AlbersUsa = createPresetProjection('AlbersUsa', 'albersUsa')
