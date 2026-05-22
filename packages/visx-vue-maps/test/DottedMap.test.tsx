// @vitest-environment jsdom
import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, test } from "vite-plus/test";
import { DottedMap } from "../src";
import type { MapData } from "../src/types";

const precomputedMap: MapData = {
  points: {
    "0;0": { x: 0, y: 0, lat: 10, lng: 20, countryId: "AAA" },
    "1;1": { x: 1, y: 1, lat: 15, lng: 25, countryId: "BBB" },
  },
  X_MIN: 0,
  Y_MIN: 0,
  X_MAX: 10,
  Y_MAX: 10,
  X_RANGE: 10,
  Y_RANGE: 10,
  region: {
    lat: { min: 0, max: 20 },
    lng: { min: 0, max: 30 },
  },
  grid: "vertical",
  height: 10,
  width: 10,
  ystep: 1,
};

describe("<DottedMap />", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("renders dots from a precomputed map", () => {
    const wrapper = mount(DottedMap, {
      props: {
        pins: [],
        precomputedMap,
        maxHeight: 320,
      },
    });

    expect(wrapper.findAll("[data-index]")).toHaveLength(2);
  });

  test("emits point-click when a dot is clicked", async () => {
    const wrapper = mount(DottedMap, {
      attachTo: document.body,
      props: {
        pins: [],
        precomputedMap,
      },
    });

    await wrapper.find('[data-index="0"]').trigger("click");

    const events = wrapper.emitted("point-click");
    expect(events).toHaveLength(1);
    expect(events?.[0]?.[1]).toMatchObject({ lat: 10, lng: 20, countryId: "AAA" });
  });

  test("renders the fallback legend component", () => {
    const wrapper = mount(DottedMap, {
      props: {
        legend: [{ color: "#2563eb", label: "Primary" }],
        pins: [],
        precomputedMap,
      },
    });

    expect(wrapper.text()).toContain("Primary");
  });
});
