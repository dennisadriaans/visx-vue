import * as pkg from "../src/d3-geo";
import { describe, it, expect } from "vite-plus/test";

describe("d3-geo", () => {
  it("should be defined", () => {
    expect(pkg).toBeDefined();
    expect(Object.keys(pkg).length).toBeGreaterThan(0);
  });
});
