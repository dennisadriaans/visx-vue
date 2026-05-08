import { describe, it, expect } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { scaleLinear } from "@visx-vue/scale";
import { Grid } from "../src";

describe("<Grid />", () => {
  it("should be defined", () => {
    expect(Grid).toBeDefined();
  });

  it("should create grid lines", () => {
    const xScale = scaleLinear({
      domain: [0, 10],
      range: [0, 100],
    });

    const yScale = scaleLinear({
      domain: [0, 10],
      range: [0, 100],
    });

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    const wrapper = mount(Grid, {
      props: {
        xScale,
        yScale,
        width: 400,
        height: 400,
        strokeDasharray: "3,3",
        strokeOpacity: 0.3,
        pointerEvents: "none",
      } as any,
      attachTo: svg,
    });

    // Verify grid containers exist
    expect(wrapper.find(".visx-rows").exists()).toBe(true);
    expect(wrapper.find(".visx-columns").exists()).toBe(true);

    // Verify lines are rendered
    const lines = wrapper.findAll("line");
    expect(lines.length).toBeGreaterThan(0);

    // Verify line attributes
    const firstLine = lines[0];
    expect(firstLine.attributes("stroke-dasharray")).toBe("3,3");
    expect(firstLine.attributes("stroke-opacity")).toBe("0.3");
    expect(firstLine.attributes("pointer-events")).toBe("none");

    wrapper.unmount();
    document.body.removeChild(svg);
  });
});
