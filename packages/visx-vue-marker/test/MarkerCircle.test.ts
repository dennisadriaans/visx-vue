import { describe, test, expect } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { MarkerCircle } from "../src";

describe("<MarkerCircle />", () => {
  test("it should be defined", () => {
    expect(MarkerCircle).toBeDefined();
  });

  test("it should render a marker containing a circle", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);

    const wrapper = mount(MarkerCircle, {
      attachTo: svg,
      props: { id: "marker-circle-test" },
    });

    const marker = wrapper.find("marker");
    const circle = wrapper.find("circle");

    expect(marker.exists()).toBe(true);
    expect(circle.exists()).toBe(true);

    wrapper.unmount();
  });

  test("it should size correctly", () => {
    const size = 8;
    const strokeWidth = 1;
    const diameter = size * 2;
    const bounds = diameter + strokeWidth;
    const mid = bounds / 2;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);

    const wrapper = mount(MarkerCircle, {
      attachTo: svg,
      props: { id: "marker-circle-test", size, strokeWidth },
    });

    // Check marker attributes
    const marker = wrapper.find("marker");
    expect(marker.attributes("markerwidth")).toBe(bounds.toString());
    expect(marker.attributes("markerheight")).toBe(bounds.toString());
    expect(marker.attributes("refx")).toBe("0");
    expect(marker.attributes("refy")).toBe(mid.toString());

    // Check circle attributes
    const circle = wrapper.find("circle");
    expect(circle.attributes("r")).toBe(size.toString());
    expect(circle.attributes("cx")).toBe(mid.toString());
    expect(circle.attributes("cy")).toBe(mid.toString());

    wrapper.unmount();
  });
});
