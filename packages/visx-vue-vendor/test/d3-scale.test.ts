import * as pkg from "../src/d3-scale";
import { describe, it, expect } from "vite-plus/test";

describe("d3-scale", () => {
  it("should be defined", () => {
    expect(pkg).toBeDefined();
    expect(Object.keys(pkg).length).toBeGreaterThan(0);
  });
});
