import { describe, test, expect } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { VoronoiPolygon } from "../src";

describe("<VoronoiPolygon />", () => {
  const polygon: [number, number][] = new Array(3).fill(null).map((_, i) => [i, i]);

  const props = { polygon };

  test("it should be defined", () => {
    expect(VoronoiPolygon).toBeDefined();
  });

  test("it should not render without a polygon", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    const wrapper = mount(VoronoiPolygon, { attachTo: svg });
    expect(wrapper.find("path").exists()).toBe(false);
    wrapper.unmount();
  });

  test("it should render a path", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    const wrapper = mount(VoronoiPolygon, { props, attachTo: svg });
    expect(wrapper.find("path").exists()).toBe(true);
    wrapper.unmount();
  });

  test("it should set a d attribute based on the polygon prop", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    const wrapper = mount(VoronoiPolygon, { props, attachTo: svg });
    const path = wrapper.find("path");
    expect(path.attributes("d")).toBe("M0,0L1,1L2,2Z");
    wrapper.unmount();
  });

  test("it should add extra (non-func) props to the path element", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    const wrapper = mount(VoronoiPolygon, {
      props: { ...props, fill: "orange" },
      attachTo: svg,
    });
    const path = wrapper.find("path");
    expect(path.attributes("fill")).toBe("orange");
    wrapper.unmount();
  });
});
