import { describe, test, expect, vi, beforeAll, afterAll } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { scaleBand, scaleLinear } from "@visx-vue/scale";
import { BarGroupHorizontal } from "../src";

interface Datum {
  date: Date;
  "New York": string;
  "San Francisco": string;
  Austin: string;
}

const data: Datum[] = [
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
  y0: () => 5,
  y0Scale: scaleBand({ domain: [0, 100], range: [0, 100] }),
  y1Scale: scaleBand({ domain: [0, 100], range: [0, 100] }),
  xScale: scaleLinear({ domain: [0, 100], range: [0, 100] }),
  color: () => "violet",
  keys: ["New York", "San Francisco", "Austin"],
  width: 1,
};

describe("<BarGroupHorizontal />", () => {
  beforeAll(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("it should be defined", () => {
    expect(BarGroupHorizontal).toBeDefined();
  });

  test("it should have className .visx-bar-group-horizontal", () => {
    const wrapper = mount(BarGroupHorizontal, {
      props: { ...defaultProps } as any,
    });
    expect(wrapper.find(".visx-bar-group-horizontal").exists()).toBe(true);
    wrapper.unmount();
  });

  test("it should set className prop", () => {
    const wrapper = mount(BarGroupHorizontal, {
      props: { ...defaultProps, className: "test" } as any,
    });
    const element = wrapper.find(".visx-bar-group-horizontal.test");
    expect(element.exists()).toBe(true);
    wrapper.unmount();
  });

  test("it should set top & left props", () => {
    const wrapper = mount(BarGroupHorizontal, {
      props: { ...defaultProps, top: 2, left: 3 } as any,
    });
    const group = wrapper.find("g");
    expect(group.attributes("transform")).toBe("translate(3, 2)");
    wrapper.unmount();
  });

  test("it should take a children as function prop", () => {
    // DEVIATION: React children render-prop → Vue scoped slot
    const children = vi.fn(() => null);
    mount(BarGroupHorizontal, {
      props: { ...defaultProps } as any,
      slots: { default: children },
    });
    expect(children).toHaveBeenCalled();
  });

  test("it should call children function with [barGroups]", () => {
    const children = vi.fn(() => null);
    mount(BarGroupHorizontal, {
      props: { ...defaultProps } as any,
      slots: { default: children },
    });
    const { barGroups } = children.mock.calls[0][0];
    expect(barGroups.length > 0).toBe(true);
  });

  test("it should create barGroup with shape { index, y0, bars }", () => {
    const children = vi.fn(() => null);
    mount(BarGroupHorizontal, {
      props: { ...defaultProps } as any,
      slots: { default: children },
    });
    const { barGroups } = children.mock.calls[0][0];
    const group = barGroups[0];

    expect(Object.keys(group)).toEqual(["index", "y0", "bars"]);
    expect(group.index).toBe(0);
    expect(typeof group.index).toBe("number");
    expect(typeof group.y0).toBe("number");
    expect(group.bars).toHaveLength(defaultProps.keys.length);
    expect(Object.keys(group.bars[0])).toEqual([
      "index",
      "key",
      "value",
      "height",
      "x",
      "y",
      "color",
      "width",
    ]);
  });
});
