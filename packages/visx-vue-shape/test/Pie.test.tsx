import { describe, test, expect, vi, beforeAll, afterAll } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { Pie } from "../src";
import { addMock, removeMock } from "./svgMock";
import type { ProvidedProps } from "../src/shapes/Pie";

interface Datum {
  date: string;
  "Google Chrome": string;
  "Internet Explorer": string;
  Firefox: string;
  Safari: string;
  "Microsoft Edge": string;
  Opera: string;
  Mozilla: string;
  "Other/Unknown": string;
  color: string;
}

const browserUsage: Datum[] = [
  {
    date: "2015 Jun 15",
    "Google Chrome": "48.09",
    "Internet Explorer": "24.14",
    Firefox: "18.82",
    Safari: "7.46",
    "Microsoft Edge": "0.03",
    Opera: "1.32",
    Mozilla: "0.12",
    "Other/Unknown": "0.01",
    color: "blue",
  },
  {
    date: "2015 Jun 16",
    "Google Chrome": "48",
    "Internet Explorer": "24.19",
    Firefox: "18.96",
    Safari: "7.36",
    "Microsoft Edge": "0.03",
    Opera: "1.32",
    Mozilla: "0.12",
    "Other/Unknown": "0.01",
    color: "red",
  },
];

describe("<Pie />", () => {
  beforeAll(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    addMock();
  });

  afterAll(() => {
    vi.restoreAllMocks();
    removeMock();
  });

  test("it should be defined", () => {
    expect(Pie).toBeDefined();
  });

  test("it should not break on sort callbacks", () => {
    expect(() =>
      mount(Pie, {
        props: { data: browserUsage, pieSort: () => 0, pieSortValues: () => 0 } as any,
      }),
    ).not.toThrow();
  });

  test("it should accept null sort callbacks", () => {
    expect.assertions(3);

    const wrapper = mount(Pie, {
      props: { data: browserUsage, pieSort: null, pieSortValues: null } as any,
    });
    expect(wrapper.html()).toBeTruthy();

    const A = 1;
    const B = 20;
    const childrenFn = vi.fn(() => null);

    mount(Pie, {
      props: { data: [A, B], pieSortValues: null } as any,
      slots: { default: childrenFn },
    });

    const args = childrenFn.mock.calls[0][0] as ProvidedProps<Datum>;
    expect(args.arcs[0]).toMatchObject({ value: A, index: 0 });
    expect(args.arcs[1]).toMatchObject({ value: B, index: 1 });
  });

  test("it should render pie chart with correct structure", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    const wrapper = mount(Pie, {
      props: { data: browserUsage } as any,
      attachTo: svg,
    });
    const group = wrapper.find(".visx-pie-arcs-group");
    expect(group.exists()).toBe(true);
    const paths = wrapper.findAll("path");
    expect(paths).toHaveLength(browserUsage.length);
    wrapper.unmount();
    document.body.removeChild(svg);
  });

  test("it should handle children render prop correctly", () => {
    // DEVIATION: React children render-prop → Vue scoped slot
    const childrenFn = vi.fn(() => null);
    mount(Pie, {
      props: { data: browserUsage } as any,
      slots: { default: childrenFn },
    });

    expect(childrenFn).toHaveBeenCalled();
    const args = childrenFn.mock.calls[0][0];
    expect(args).toHaveProperty("path");
    expect(args).toHaveProperty("arcs");
    expect(args).toHaveProperty("pie");
  });

  test("it should accept a custom fill function", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    const wrapper = mount(Pie, {
      props: {
        data: browserUsage,
        fill: (datum: any) => datum.data.color,
      } as any,
      attachTo: svg,
    });

    const paths = wrapper.findAll("path");
    expect(paths[0].attributes("fill")).toBe("blue");
    expect(paths[1].attributes("fill")).toBe("red");
    wrapper.unmount();
    document.body.removeChild(svg);
  });

  test("it should accept a constant string fill value", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg);
    const wrapper = mount(Pie, {
      props: {
        data: browserUsage,
        fill: "purple",
      } as any,
      attachTo: svg,
    });

    const paths = wrapper.findAll("path");
    expect(paths[0].attributes("fill")).toBe("purple");
    expect(paths[1].attributes("fill")).toBe("purple");
    wrapper.unmount();
    document.body.removeChild(svg);
  });
});
