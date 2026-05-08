import { describe, test, expect } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { HeatmapRect } from "../src";

const data = [{ bin: 0, bins: [{ bin: 0, count: 1 }] }];

const xScale = () => 50;
const yScale = () => 50;

describe("<HeatmapRect />", () => {
  test("it should be defined", () => {
    expect(HeatmapRect).toBeDefined();
  });

  test("it should have the .visx-heatmap-rects class", () => {
    const wrapper = mount(() => (
      <svg>
        <HeatmapRect data={data} xScale={xScale} yScale={yScale} />
      </svg>
    ));
    expect(wrapper.find(".visx-heatmap-rects").exists()).toBe(true);
  });

  test("it should have the .visx-heatmap-rect class", () => {
    const wrapper = mount(() => (
      <svg>
        <HeatmapRect data={data} xScale={xScale} yScale={yScale} className="test" />
      </svg>
    ));
    const rect = wrapper.find("rect");
    expect(rect.exists()).toBe(true);
    expect(rect.classes()).toContain("visx-heatmap-rect");
    expect(rect.classes()).toContain("test");
  });

  test("it should set <rect /> width & height to bin{Width,Height} - gap", () => {
    const wrapper = mount(() => (
      <svg>
        <HeatmapRect
          data={data}
          xScale={xScale}
          yScale={yScale}
          binWidth={10}
          binHeight={14}
          gap={2}
        />
      </svg>
    ));
    const rect = wrapper.find("rect");
    expect(rect.exists()).toBe(true);
    expect(rect.attributes("width")).toBe("8");
    expect(rect.attributes("height")).toBe("12");
  });
});
