import { describe, test, expect } from "vite-plus/test";
import { useTooltip } from "../src";

describe("useTooltip()", () => {
  test("it should be defined", () => {
    expect(useTooltip).toBeDefined();
  });
});
