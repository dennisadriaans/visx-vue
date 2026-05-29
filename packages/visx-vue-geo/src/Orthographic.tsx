import type { ProjectionProps } from './Projection'
import type { GeoPermissibleObjects } from './types'
import { createPresetProjection } from './createPresetProjection'

export type OrthographicProps<Datum extends GeoPermissibleObjects = GeoPermissibleObjects> = Omit<
  ProjectionProps<Datum>,
  'projection'
>

/**
 * All props pass through to `<Projection projection="orthographic" {...props} />`
 */
export const Orthographic = createPresetProjection('Orthographic', 'orthographic')
