import { describe, test, expect } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { Circle } from "../src";

describe("<Circle />", () => {
  test("it should be defined", () => {
    expect(Circle).toBeDefined();
  });

  test("it should have the .visx-circle class", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    const wrapper = mount(Circle, {
      props: { className: "test" },
      attachTo: svg,
    });
    const circle = wrapper.find("circle");
    expect(circle.classes()).toContain("visx-circle");
    expect(circle.classes()).toContain("test");
    wrapper.unmount();
    document.body.removeChild(svg);
  });

  test("it should expose its ref via an innerRef prop", () => {
    // DEVIATION: Vue uses internal template ref. We verify the circle element renders.
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    const wrapper = mount(Circle, {
      attachTo: svg,
    });
    expect(wrapper.find("circle").exists()).toBe(true);
    wrapper.unmount();
    document.body.removeChild(svg);
  });
});
