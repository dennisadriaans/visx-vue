import { describe, test, expect, vi } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { scaleBand, scaleLinear } from "@visx-vue/scale";
import { BarGroup } from "../src";

const data = [
  {
    date: new Date(),
    "New York": "63.4",
    "San Francisco": "62.7",
    Austin: "72.2",
  },
  {
    date: new Date(),
    "New York": "58.0",
    "San Francisco": "59.9",
    Austin: "67.7",
  },
];

const defaultProps = {
  data,
  x0: () => 5,
  x0Scale: scaleBand({ domain: [5, 15], range: [0, 100] }),
  x1Scale: scaleBand({ domain: [0, 100], range: [0, 100] }),
  yScale: scaleLinear({ domain: [0, 100], range: [0, 100] }),
  color: () => "skyblue",
  keys: ["New York", "San Francisco", "Austin"],
  height: 1,
};

describe("<BarGroup />", () => {
  test("it should be defined", () => {
    expect(BarGroup).toBeDefined();
  });

  test("it should have className .visx-bar-group", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    const wrapper = mount(BarGroup, {
      props: { ...defaultProps } as any,
      attachTo: svg,
    });
    expect(wrapper.find(".visx-bar-group").exists()).toBe(true);
    wrapper.unmount();
    document.body.removeChild(svg);
  });

  test("it should set className prop", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    const wrapper = mount(BarGroup, {
      props: { ...defaultProps, className: "test" } as any,
      attachTo: svg,
    });
    const element = wrapper.find("g.visx-bar-group");
    expect(element.classes()).toContain("test");
    wrapper.unmount();
    document.body.removeChild(svg);
  });

  test("it should set top & left props", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    const wrapper = mount(BarGroup, {
      props: { ...defaultProps, top: 2, left: 3 } as any,
      attachTo: svg,
    });
    const element = wrapper.find("g.visx-bar-group");
    expect(element.attributes("transform")).toBe("translate(3, 2)");
    wrapper.unmount();
    document.body.removeChild(svg);
  });

  test("it should take a children as function prop", () => {
    // DEVIATION: React children render-prop → Vue scoped slot
    const children = vi.fn(() => null);
    mount(BarGroup, {
      props: { ...defaultProps } as any,
      slots: { default: children },
    });
    expect(children).toHaveBeenCalled();
  });

  test("it should call children function with [barGroups]", () => {
    const children = vi.fn(() => null);
    mount(BarGroup, {
      props: { ...defaultProps } as any,
      slots: { default: children },
    });
    const { barGroups } = children.mock.calls[0][0];
    expect(barGroups.length).toBeGreaterThan(0);
  });

  test("it should create barGroup with shape { index, x0, bars }", () => {
    const children = vi.fn(() => null);
    mount(BarGroup, {
      props: { ...defaultProps } as any,
      slots: { default: children },
    });
    const { barGroups } = children.mock.calls[0][0];
    const group = barGroups[0];

    expect(Object.keys(group)).toEqual(["index", "x0", "bars"]);
    expect(group.index).toBe(0);
    expect(typeof group.index).toBe("number");
    expect(typeof group.x0).toBe("number");
    expect(group.bars).toHaveLength(defaultProps.keys.length);
    expect(Object.keys(group.bars[0])).toEqual([
      "index",
      "key",
      "value",
      "width",
      "x",
      "y",
      "color",
      "height",
    ]);
  });
});
