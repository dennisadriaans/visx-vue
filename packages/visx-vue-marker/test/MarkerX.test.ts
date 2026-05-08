import { describe, test, expect } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { MarkerX } from "../src";

describe("<MarkerX />", () => {
  test("it should be defined", () => {
    expect(MarkerX).toBeDefined();
  });

  test("it should render marker with 45 degree rotation", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);

    const wrapper = mount(MarkerX, {
      attachTo: svg,
      props: { id: "marker-x-test" },
    });

    const marker = wrapper.find("#marker-x-test");
    expect(marker.exists()).toBe(true);
    expect(marker.attributes("orient")).toBe("45");

    wrapper.unmount();
  });
});
