// @vitest-environment jsdom
import { describe, it, expect } from "vite-plus/test";
import useDimensions from "../../src/hooks/useDimensions";

describe("useDimensions", () => {
  it("should be defined", () => {
    expect(useDimensions).toBeDefined();
  });

  it("should return default dimensions when no initial dims are provided", () => {
    const { width, height, margin } = useDimensions();
    expect(width.value).toBe(0);
    expect(height.value).toBe(0);
    expect(margin.value).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });
  });

  it("should return initial dimensions when provided", () => {
    const { width, height, margin } = useDimensions({
      width: 100,
      height: 200,
      margin: { top: 10, right: 20, bottom: 30, left: 40 },
    });
    expect(width.value).toBe(100);
    expect(height.value).toBe(200);
    expect(margin.value).toEqual({ top: 10, right: 20, bottom: 30, left: 40 });
  });

  it("should update dimensions with setDimensions", () => {
    const { width, height, margin, setDimensions } = useDimensions();
    setDimensions({
      width: 500,
      height: 300,
      margin: { top: 5, right: 10, bottom: 15, left: 20 },
    });
    expect(width.value).toBe(500);
    expect(height.value).toBe(300);
    expect(margin.value).toEqual({ top: 5, right: 10, bottom: 15, left: 20 });
  });
});
