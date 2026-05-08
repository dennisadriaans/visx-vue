import { describe, test, expect } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { Line } from "../src";

describe("<Line />", () => {
  test("it should be defined", () => {
    expect(Line).toBeDefined();
  });

  test("it should contain a <line />", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    const wrapper = mount(Line, {
      attachTo: svg,
    });
    expect(wrapper.find("line").exists()).toBe(true);
    wrapper.unmount();
    document.body.removeChild(svg);
  });

  test("it should have the .visx-line class", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    const wrapper = mount(Line, {
      attachTo: svg,
    });
    expect(wrapper.find("line").classes()).toContain("visx-line");
    wrapper.unmount();
    document.body.removeChild(svg);
  });

  test("it should expose its ref via an innerRef prop", () => {
    // DEVIATION: Vue uses internal template ref. We verify the line element renders.
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    const wrapper = mount(Line, {
      attachTo: svg,
    });
    expect(wrapper.find("line").exists()).toBe(true);
    wrapper.unmount();
    document.body.removeChild(svg);
  });

  test("it should set shapeRendering to auto if not rectilinear", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    const wrapper = mount(Line, {
      props: {
        to: { x: 50, y: 100 },
      },
      attachTo: svg,
    });
    expect(wrapper.find("line").attributes("shape-rendering")).toBe("auto");
    wrapper.unmount();
    document.body.removeChild(svg);
  });

  test("it should set shapeRendering to crispEdges if rectilinear", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    const wrapper = mount(Line, {
      props: {
        to: { x: 0, y: 100 },
      },
      attachTo: svg,
    });
    expect(wrapper.find("line").attributes("shape-rendering")).toBe("crispEdges");
    wrapper.unmount();
    document.body.removeChild(svg);

    const svg2 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg2);
    const wrapper2 = mount(Line, {
      props: {
        to: { x: 100, y: 0 },
      },
      attachTo: svg2,
    });
    expect(wrapper2.find("line").attributes("shape-rendering")).toBe("crispEdges");
    wrapper2.unmount();
    document.body.removeChild(svg2);
  });
});
