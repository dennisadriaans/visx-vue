// @vitest-environment jsdom
import { describe, it, expect } from "vite-plus/test";
import { mount, flushPromises } from "@vue/test-utils";
import { defineComponent, nextTick } from "vue";
import DataProvider from "../../src/providers/DataProvider";
import useStackedData from "../../src/hooks/useStackedData";
import { useDataContext } from "../../src/context/DataContext";

const seriesAProps = {
  dataKey: "a",
  data: [
    { x: "stack-a", y: 3 },
    { x: "stack-b", y: 7 },
    { x: "stack-c", y: -2 },
  ],
  xAccessor: (d: { x: string }) => d.x,
  yAccessor: (d: { y: number }) => d.y,
};

const seriesBProps = {
  ...seriesAProps,
  dataKey: "b",
  data: [
    { x: "stack-a", y: 0 },
    { x: "stack-b", y: 7 },
    { x: "stack-c", y: 10 },
  ],
};

// DEVIATION: React version wraps children as React elements;
// Vue version passes seriesConfigs directly to useStackedData.

describe("useStackedData", () => {
  it("should be defined", () => {
    expect(useStackedData).toBeDefined();
  });

  it("should return a data stack", () => {
    expect.hasAssertions();

    const Consumer = defineComponent({
      setup() {
        const { stackedData } = useStackedData({
          seriesConfigs: [seriesAProps, seriesBProps],
        });

        // stackedData has arrays with data properties set by d3 which vitest doesn't like
        expect(
          stackedData.value.map((series) => series.map(([min, max]) => [min, max])),
        ).toMatchObject([
          [
            // series a
            [0, 3],
            [0, 7],
            [-2, 0],
          ],
          [
            // series b
            [0, 0],
            [7, 14],
            [0, 10],
          ],
        ]);
        return () => null;
      },
    });

    mount(DataProvider, {
      props: {
        initialDimensions: { width: 10, height: 10 },
        xScale: { type: "band" },
        yScale: { type: "linear" },
      },
      slots: {
        default: () => <Consumer />,
      },
    });
  });

  it("should compute a comprehensive domain based on the total stack value", async () => {
    let yScaleCapture: any;

    const Consumer = defineComponent({
      setup() {
        useStackedData({
          seriesConfigs: [seriesAProps, seriesBProps],
        });
        const ctx = useDataContext();
        yScaleCapture = ctx;
        return () => null;
      },
    });

    mount(DataProvider, {
      props: {
        initialDimensions: { width: 10, height: 10 },
        xScale: { type: "band" },
        yScale: { type: "linear" },
      },
      slots: {
        default: () => <Consumer />,
      },
    });

    await flushPromises();
    await nextTick();
    // yScale domain should span from min stack to max stack
    expect(yScaleCapture?.yScale?.domain()).toEqual([-2, 14]);
  });
});
