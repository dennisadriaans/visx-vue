import type { D3Scale } from "@visx-vue/scale";

export default function defaultDomain<Scale extends D3Scale<number>>({
  steps = 5,
  scale,
}: {
  steps: number;
  scale: Scale;
}) {
  const domain = scale.domain();
  const start = domain[0];
  const end = domain[domain.length - 1];
  if (typeof start === "number" && typeof end === "number") {
    const step = (end - start) / (steps - 1);
    return Array.from({ length: steps }, (_, i) => start + i * step);
  }
  return [];
}
