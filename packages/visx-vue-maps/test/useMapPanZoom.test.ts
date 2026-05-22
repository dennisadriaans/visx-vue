import { describe, expect, test } from "vite-plus/test";
import { useMapPanZoom } from "../src";

describe("useMapPanZoom", () => {
  test("applies zoom bounds and reset", () => {
    const { offset, resetView, scale, zoomIn, zoomOut } = useMapPanZoom({
      minScale: 0.5,
      maxScale: 1.5,
      scaleStep: 0.5,
    });

    zoomIn();
    zoomIn();
    expect(scale.value).toBe(1.5);

    zoomOut();
    zoomOut();
    zoomOut();
    expect(scale.value).toBe(0.5);

    offset.x = 12;
    offset.y = -4;
    resetView(1.25);

    expect(scale.value).toBe(1.25);
    expect(offset).toMatchObject({ x: 0, y: 0 });
  });
});
