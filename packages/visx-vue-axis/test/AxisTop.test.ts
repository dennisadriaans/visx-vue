import { describe, it, expect, beforeEach, afterEach } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { scaleLinear } from "@visx-vue/scale";
import { AxisTop } from "../src";
import { addMock, removeMock } from "./svgMock";

const axisProps = {
  scale: scaleLinear({
    range: [10, 0],
    round: true,
    domain: [0, 10],
  }),
};

function mountInSvg(props: Record<string, unknown> = {}) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  document.body.appendChild(svg);
  const wrapper = mount(AxisTop, {
    props: { ...axisProps, ...props } as any,
    attachTo: svg,
  });
  return { wrapper, svg };
}

function cleanup(wrapper: ReturnType<typeof mount>, svg: SVGSVGElement) {
  wrapper.unmount();
  document.body.removeChild(svg);
}

describe("<AxisTop />", () => {
  beforeEach(addMock);
  afterEach(removeMock);

  it("should be defined", () => {
    expect(AxisTop).toBeDefined();
  });

  it("should render with class .visx-axis-top", () => {
    const { wrapper, svg } = mountInSvg();
    const axis = wrapper.find(".visx-axis");
    expect(axis.classes()).toContain("visx-axis-top");
    cleanup(wrapper, svg);
  });

  it("should set user-specified class names", () => {
    const axisClassName = "axis-test-class";
    const axisLineClassName = "axisline-test-class";
    const labelClassName = "label-test-class";
    const tickClassName = "tick-test-class";

    const { wrapper, svg } = mountInSvg({
      axisClassName,
      axisLineClassName,
      labelClassName,
      tickClassName,
      label: "test",
    });

    const axis = wrapper.find(".visx-axis");
    expect(axis.classes()).toContain("axis-test-class");
    expect(axis.classes()).toContain("visx-axis-top");

    const axisLine = wrapper.find(".visx-axis-line");
    expect(axisLine.classes()).toContain(axisLineClassName);

    const label = wrapper.find(".visx-axis-label");
    expect(label.classes()).toContain(labelClassName);

    const tick = wrapper.find(".visx-axis-tick");
    expect(tick.classes()).toContain(tickClassName);
    cleanup(wrapper, svg);
  });

  it("should render with default labelOffset of 8", () => {
    const { wrapper, svg } = mountInSvg({ label: "test label" });
    const label = wrapper.find(".visx-axis-label");
    expect(label.attributes("y")).toBe("-26");
    cleanup(wrapper, svg);
  });

  it("should render with custom labelOffset", () => {
    const labelOffset = 3;
    const { wrapper, svg } = mountInSvg({ label: "test label", labelOffset });
    const label = wrapper.find(".visx-axis-label");
    expect(label.attributes("y")).toBe("-21");
    cleanup(wrapper, svg);
  });

  it("should render ticks with default length of 8", () => {
    const { wrapper, svg } = mountInSvg();
    const ticks = wrapper.findAll(".visx-axis-tick line.visx-line");
    ticks.forEach((tick) => {
      const y1 = Math.abs(parseFloat(tick.attributes("y1") || "0"));
      const y2 = Math.abs(parseFloat(tick.attributes("y2") || "0"));
      expect(Math.abs(y2 - y1)).toBe(8);
    });
    cleanup(wrapper, svg);
  });

  it("should render ticks with custom length", () => {
    const tickLength = 15;
    const { wrapper, svg } = mountInSvg({ tickLength });
    const ticks = wrapper.findAll(".visx-axis-tick line.visx-line");
    ticks.forEach((tick) => {
      const y1 = Math.abs(parseFloat(tick.attributes("y1") || "0"));
      const y2 = Math.abs(parseFloat(tick.attributes("y2") || "0"));
      expect(Math.abs(y2 - y1)).toBe(tickLength);
    });
    cleanup(wrapper, svg);
  });

  it("should render label text", () => {
    const label = "test";
    const { wrapper, svg } = mountInSvg({ label });
    expect(wrapper.text()).toContain(label);
    cleanup(wrapper, svg);
  });
});
