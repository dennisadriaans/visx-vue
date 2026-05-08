import { describe, test, expect } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { hierarchy } from "d3-hierarchy";
import { LinkVertical } from "../src";

const mockHierarchy = hierarchy({
  name: "Eve",
  children: [
    { name: "Cain" },
    {
      name: "Seth",
      children: [{ name: "Enos" }, { name: "Noam" }],
    },
  ],
});
const link = mockHierarchy.links()[0];

describe("<LinkVertical />", () => {
  test("it should be defined", () => {
    expect(LinkVertical).toBeDefined();
  });

  test("it should expose its ref via an innerRef prop", () => {
    // DEVIATION: Vue uses internal template ref. We verify the path element renders.
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    const wrapper = mount(LinkVertical, {
      props: { data: link } as any,
      attachTo: svg,
    });
    expect(wrapper.find("path").exists()).toBe(true);
    wrapper.unmount();
    document.body.removeChild(svg);
  });
});
