import { describe, it, expect } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { scaleLinear } from "@visx-vue/scale";
import { GridColumns } from "../src";

describe("<GridColumns />", () => {
  it("should be defined", () => {
    expect(GridColumns).toBeDefined();
  });

  it("should create grid lines", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    const wrapper = mount(GridColumns, {
      props: {
        scale: scaleLinear({ range: [0, 100] }),
        height: 400,
        strokeDasharray: "3,3",
        strokeOpacity: 0.3,
        pointerEvents: "none",
      } as any,
      attachTo: svg,
    });

    const lines = wrapper.findAll(".visx-line");
    expect(lines).toHaveLength(11);

    wrapper.unmount();
    document.body.removeChild(svg);
  });
});
