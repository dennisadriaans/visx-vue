import { describe, expect, test } from "vite-plus/test";
import { createPin, filterPinsByRegion } from "../src";

describe("pins helpers", () => {
  test("createPin merges defaults", () => {
    expect(createPin(1, 2, { city: "Test" })).toMatchObject({
      lat: 1,
      lng: 2,
      data: { city: "Test" },
      svgOptions: { color: "var(--ui-text)", radius: 0.15 },
    });
  });

  test("filterPinsByRegion returns matching pins", () => {
    const pins = [createPin(1, 2, { region: "Europe" }), createPin(3, 4, { region: "Asia" })];

    expect(filterPinsByRegion(pins, "Asia")).toHaveLength(1);
    expect(filterPinsByRegion(pins, "Asia")[0]?.lat).toBe(3);
  });
});
