/**
 * Converts camelCase SVG attribute names to kebab-case.
 * Vue's JSX doesn't auto-convert like React does, so we need this
 * when passing SVG attributes through component layers to native elements.
 */
export default function toSvgProps(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue
    result[key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)] = value
  }
  return result
}
