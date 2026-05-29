import { computed, type Ref } from 'vue'

function getSamples(restrictToPath: SVGGeometryElement, transform?: DOMMatrix, precision = 1) {
  if (!restrictToPath) return []
  const samples = []
  const pathLength = restrictToPath.getTotalLength()
  for (let sampleLength = 0; sampleLength <= pathLength; sampleLength += precision) {
    const sample = restrictToPath.getPointAtLength(sampleLength)
    const transformedSample = sample.matrixTransform(transform)
    samples.push(transformedSample)
  }
  return samples
}

/** Return samples along a path, relative to the parent SVG */
export default function useSamplesAlongPath(
  restrictToPath: Ref<SVGGeometryElement | null | undefined>
) {
  const samples = computed(() => {
    const path = restrictToPath.value
    if (!path) return []
    const transform = path.getCTM() || new DOMMatrix()
    return getSamples(path, transform)
  })
  return samples
}
