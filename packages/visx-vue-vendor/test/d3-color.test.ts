import * as pkg from "../src/d3-color";
import { describe, it, expect } from "vite-plus/test";

describe("d3-color", () => {
  it("should be defined", () => {
    expect(pkg).toBeDefined();
    expect(Object.keys(pkg).length).toBeGreaterThan(0);
  });
});
