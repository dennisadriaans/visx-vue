import { describe, it, expect, vi, beforeEach } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { scaleLinear } from "@visx-vue/scale";
import { GridAngle } from "../src";
import * as polarToCartesianModule from "../src/utils/polarToCartesian";

const gridProps = {
  innerRadius: 0,
  outerRadius: 10,
  scale: scaleLinear({
    range: [0, 2 * Math.PI],
    domain: [1, 10],
  }),
};

describe("<GridAngle />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render with class .visx-grid-angle", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    const wrapper = mount(GridAngle, {
      props: { ...gridProps } as any,
      attachTo: svg,
    });
    const element = wrapper.find("g.visx-group");
    expect(element.exists()).toBe(true);
    expect(element.classes()).toContain("visx-grid-angle");
    wrapper.unmount();
    document.body.removeChild(svg);
  });

  it("should set user-specified lineClassName", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    const wrapper = mount(GridAngle, {
      props: { ...gridProps, lineClassName: "test-class" } as any,
      attachTo: svg,
    });
    const lines = wrapper.findAll("line.test-class");
    expect(lines.length).toBeGreaterThan(0);
    wrapper.unmount();
    document.body.removeChild(svg);
  });

  it("should render `numTicks` grid lines", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    const wrapper = mount(GridAngle, {
      props: { ...gridProps, numTicks: 5 } as any,
      attachTo: svg,
    });
    const lines = wrapper.findAll("line");
    expect(lines).toHaveLength(5);
    wrapper.unmount();
    document.body.removeChild(svg);

    const svg2 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg2);
    const wrapper2 = mount(GridAngle, {
      props: { ...gridProps, numTicks: 10 } as any,
      attachTo: svg2,
    });
    const lines2 = wrapper2.findAll("line");
    expect(lines2).toHaveLength(10);
    wrapper2.unmount();
    document.body.removeChild(svg2);
  });

  it("should render grid lines according to tickValues", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    const wrapper = mount(GridAngle, {
      props: { ...gridProps, tickValues: [1, 2, 3] } as any,
      attachTo: svg,
    });
    const lines = wrapper.findAll("line");
    expect(lines).toHaveLength(3);
    wrapper.unmount();
    document.body.removeChild(svg);
  });

  it("should compute radial lines using innerRadius and outerRadius", () => {
    const polarToCartesianSpy = vi.spyOn(polarToCartesianModule, "default");
    const innerRadius = 4;
    const outerRadius = 7;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    mount(GridAngle, {
      props: { ...gridProps, innerRadius, outerRadius } as any,
      attachTo: svg,
    });

    expect(polarToCartesianSpy.mock.calls.length).toBeGreaterThanOrEqual(2);

    const fromPointCall = polarToCartesianSpy.mock.calls[0][0];
    const toPointCall = polarToCartesianSpy.mock.calls[1][0];

    expect(fromPointCall.radius).toBe(innerRadius);
    expect(toPointCall.radius).toBe(outerRadius);

    polarToCartesianSpy.mockRestore();
    document.body.removeChild(svg);
  });
});
