import { describe, test, expect } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { MarkerCross } from "../src";

describe("<MarkerCross />", () => {
  test("it should be defined", () => {
    expect(MarkerCross).toBeDefined();
  });

  test("it should render a Marker containing a polyline", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);

    const wrapper = mount(MarkerCross, {
      attachTo: svg,
      props: { id: "marker-cross-test" },
    });

    expect(wrapper.find("marker").exists()).toBe(true);
    expect(wrapper.find("polyline").exists()).toBe(true);

    wrapper.unmount();
  });

  test("it should size correctly", () => {
    const size = 8;
    const strokeWidth = 1;
    const bounds = size + strokeWidth;
    const mid = size / 2;
    const points = `0 ${mid}, ${mid} ${mid}, ${mid} 0, ${mid} ${size}, ${mid} ${mid}, ${size} ${mid}`;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);

    const wrapper = mount(MarkerCross, {
      attachTo: svg,
      props: { id: "marker-cross-test", size, strokeWidth },
    });

    const marker = wrapper.find("marker");
    const polyline = wrapper.find("polyline");

    expect(marker.exists()).toBe(true);
    expect(marker.attributes("markerwidth")).toBe(bounds.toString());
    expect(marker.attributes("markerheight")).toBe(bounds.toString());
    expect(marker.attributes("refx")).toBe(mid.toString());
    expect(marker.attributes("refy")).toBe(mid.toString());
    expect(polyline.attributes("points")).toBe(points);

    wrapper.unmount();
  });
});
