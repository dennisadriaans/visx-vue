import { describe, test, expect } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { scaleBand } from "@visx-vue/scale";
import { BarStackHorizontal } from "../src";

const scale = scaleBand({
  domain: [0, 100],
  range: [0, 100],
  paddingInner: 5,
  paddingOuter: 5,
});

describe("<BarStackHorizontal />", () => {
  test("it should be defined", () => {
    expect(BarStackHorizontal).toBeDefined();
  });

  test("it should have className .visx-bar-stack-horizontal", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    const wrapper = mount(BarStackHorizontal, {
      props: {
        data: [],
        top: 2,
        left: 3,
        y: (d: any) => d,
        xScale: scale,
        yScale: scale,
        color: (d: any) => d,
        keys: [],
      } as any,
      attachTo: svg,
    });
    expect(wrapper.find(".visx-bar-stack-horizontal").exists()).toBe(true);
    wrapper.unmount();
    document.body.removeChild(svg);
  });

  test("it should set className prop", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    const wrapper = mount(BarStackHorizontal, {
      props: {
        className: "test",
        data: [],
        top: 2,
        left: 3,
        y: (d: any) => d,
        xScale: scale,
        yScale: scale,
        color: (d: any) => d,
        keys: [],
      } as any,
      attachTo: svg,
    });
    const element = wrapper.find(".visx-bar-stack-horizontal");
    expect(element.exists()).toBe(true);
    expect(element.classes()).toContain("visx-bar-stack-horizontal");
    expect(element.classes()).toContain("test");
    wrapper.unmount();
    document.body.removeChild(svg);
  });

  test("it should set top & left props", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    const wrapper = mount(BarStackHorizontal, {
      props: {
        className: "test",
        data: [],
        top: 2,
        left: 3,
        y: (d: any) => d,
        xScale: scale,
        yScale: scale,
        color: (d: any) => d,
        keys: [],
      } as any,
      attachTo: svg,
    });
    const element = wrapper.find(".visx-bar-stack-horizontal");
    expect(element.exists()).toBe(true);
    expect(element.attributes("transform")).toBe("translate(3, 2)");
    wrapper.unmount();
    document.body.removeChild(svg);
  });
});
