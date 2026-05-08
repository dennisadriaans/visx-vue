import { describe, it, expect } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { scaleLinear } from "@visx-vue/scale";
import { GridRows } from "../src";

describe("<GridRows />", () => {
  it("should be defined", () => {
    expect(GridRows).toBeDefined();
  });

  it("should create grid lines with correct attributes", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    const wrapper = mount(GridRows, {
      props: {
        scale: scaleLinear({ range: [0, 100] }),
        width: 400,
        strokeDasharray: "3,3",
        strokeOpacity: 0.3,
        pointerEvents: "none",
      } as any,
      attachTo: svg,
    });

    const lines = wrapper.findAll(".visx-line");
    expect(lines).toHaveLength(11);

    // Verify line attributes were passed through
    lines.forEach((line) => {
      expect(line.attributes("stroke-dasharray")).toBe("3,3");
      expect(line.attributes("stroke-opacity")).toBe("0.3");
      expect(line.attributes("pointer-events")).toBe("none");
    });

    wrapper.unmount();
    document.body.removeChild(svg);
  });
});
