import * as pkg from "../src/d3-shape";
import { describe, it, expect } from "vite-plus/test";

describe("d3-shape", () => {
  it("should be defined", () => {
    expect(pkg).toBeDefined();
    expect(Object.keys(pkg).length).toBeGreaterThan(0);
  });
});
