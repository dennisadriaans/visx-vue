import { describe, it, expect, beforeEach, afterEach } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { scaleLinear } from "@visx-vue/scale";
import { AxisLeft } from "../src";
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
  const wrapper = mount(AxisLeft, {
    props: { ...axisProps, ...props } as any,
    attachTo: svg,
  });
  return { wrapper, svg };
}

function cleanup(wrapper: ReturnType<typeof mount>, svg: SVGSVGElement) {
  wrapper.unmount();
  document.body.removeChild(svg);
}

describe("<AxisLeft />", () => {
  beforeEach(addMock);
  afterEach(removeMock);

  it("should be defined", () => {
    expect(AxisLeft).toBeDefined();
  });

  it("should render with correct class", () => {
    const { wrapper, svg } = mountInSvg();
    expect(wrapper.find(".visx-axis-left").exists()).toBe(true);
    cleanup(wrapper, svg);
  });

  it("should apply custom class names", () => {
    const axisClassName = "axis-test-class";
    const axisLineClassName = "axisline-test-class";
    const labelClassName = "label-test-class";
    const tickClassName = "tick-test-class";

    const { wrapper, svg } = mountInSvg({
      label: "Test Label",
      axisClassName,
      axisLineClassName,
      labelClassName,
      tickClassName,
    });

    expect(wrapper.find(`g.${axisClassName}`).exists()).toBe(true);
    expect(wrapper.find(`line.${axisLineClassName}`).exists()).toBe(true);
    expect(wrapper.find(`text.${labelClassName}`).exists()).toBe(true);
    expect(wrapper.find(`g.${tickClassName}`).exists()).toBe(true);
    cleanup(wrapper, svg);
  });

  it("should rotate label by default", () => {
    const { wrapper, svg } = mountInSvg({ label: "Test Label" });
    const label = wrapper.find("text.visx-axis-label");
    expect(label.attributes("transform")).toBe("rotate(-90)");
    cleanup(wrapper, svg);
  });

  it("should use default labelOffset of 36", () => {
    const { wrapper, svg } = mountInSvg({ label: "Test Label" });
    const label = wrapper.find(".visx-axis-label");
    expect(label.attributes("y")).toBe("-44");
    expect(label.attributes("x")).toBe("-5");
    cleanup(wrapper, svg);
  });

  it("should apply custom labelOffset", () => {
    const labelOffset = 3;
    const { wrapper, svg } = mountInSvg({ label: "Test Label", labelOffset });
    const label = wrapper.find(".visx-axis-label");
    expect(label.attributes("y")).toBe("-11");
    expect(label.attributes("x")).toBe("-5");
    cleanup(wrapper, svg);
  });

  it("should use default tickLength", () => {
    const { wrapper, svg } = mountInSvg();
    const tick = wrapper.find(".visx-axis-tick line");
    expect(tick.attributes("x2")).toBe("-8");
    cleanup(wrapper, svg);
  });

  it("should set custom tickLength", () => {
    const tickLength = 15;
    const { wrapper, svg } = mountInSvg({ tickLength });
    const tick = wrapper.find(".visx-axis-tick line");
    expect(tick.attributes("x2")).toBe(`-${tickLength}`);
    cleanup(wrapper, svg);
  });

  it("should render label text", () => {
    const label = "test";
    const { wrapper, svg } = mountInSvg({ label });
    expect(wrapper.text()).toContain(label);
    cleanup(wrapper, svg);
  });
});
