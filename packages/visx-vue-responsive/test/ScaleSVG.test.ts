import { describe, test, expect } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import { ScaleSVG } from "../src";

describe("<ScaleSVG />", () => {
  test("it should be defined", () => {
    expect(ScaleSVG).toBeDefined();
  });

  test("it should render an svg within a wrapper div", () => {
    const wrapper = mount(ScaleSVG, {
      props: { width: 100, height: 200 },
    });
    const div = wrapper.find("div");
    expect(div.exists()).toBe(true);
    const svg = wrapper.find("svg");
    expect(svg.exists()).toBe(true);
  });

  test("it should set the viewBox from width/height/xOrigin/yOrigin", () => {
    const wrapper = mount(ScaleSVG, {
      props: { width: 400, height: 300, xOrigin: 10, yOrigin: 20 },
    });
    const svg = wrapper.find("svg");
    // SVG attributes are case-sensitive; use getAttribute directly
    expect(svg.element.getAttribute("viewBox")).toBe("10 20 400 300");
  });

  test("it should use default xOrigin=0 and yOrigin=0", () => {
    const wrapper = mount(ScaleSVG, {
      props: { width: 100, height: 50 },
    });
    const svg = wrapper.find("svg");
    expect(svg.element.getAttribute("viewBox")).toBe("0 0 100 50");
  });

  test("it should set preserveAspectRatio", () => {
    const wrapper = mount(ScaleSVG, {
      props: { width: 100, height: 50, preserveAspectRatio: "xMidYMid meet" },
    });
    const svg = wrapper.find("svg");
    expect(svg.element.getAttribute("preserveAspectRatio")).toBe("xMidYMid meet");
  });

  test('it should default preserveAspectRatio to "xMinYMin meet"', () => {
    const wrapper = mount(ScaleSVG, {
      props: { width: 100, height: 50 },
    });
    const svg = wrapper.find("svg");
    expect(svg.element.getAttribute("preserveAspectRatio")).toBe("xMinYMin meet");
  });

  test("it should expose its ref via an innerRef prop", async () => {
    const fakeRef = ref<SVGSVGElement | null>(null);
    const wrapper = mount(ScaleSVG, {
      props: { innerRef: fakeRef, width: 100, height: 50 },
      attachTo: document.body,
    });
    await nextTick();
    const svgEl = wrapper.find("svg").element;
    expect(fakeRef.value).toBe(svgEl);
  });

  test("it should render slot content inside the svg", () => {
    const wrapper = mount(ScaleSVG, {
      props: { width: 100, height: 50 },
      slots: {
        default: '<rect width="10" height="10" />',
      },
    });
    expect(wrapper.find("svg rect").exists()).toBe(true);
  });
});
