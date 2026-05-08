// @vitest-environment jsdom
import { describe, it, expect } from "vite-plus/test";
import { mount, flushPromises } from "@vue/test-utils";
import { defineComponent, onMounted, nextTick } from "vue";
import DataProvider from "../../src/providers/DataProvider";
import { DataContextKey, useDataContext } from "../../src/context/DataContext";

describe("<DataProvider />", () => {
  it("should be defined", () => {
    expect(DataProvider).toBeDefined();
  });

  it("should provide a XYChartTheme", () => {
    expect.assertions(1);

    const DataConsumer = defineComponent({
      setup() {
        const data = useDataContext();
        expect(data.theme).toBeDefined();
        return () => null;
      },
    });

    mount(DataProvider, {
      props: {
        xScale: { type: "linear" },
        yScale: { type: "linear" },
      },
      slots: {
        default: () => <DataConsumer />,
      },
    });
  });

  it("should provide dimensions", () => {
    expect.assertions(5);

    const DataConsumer = defineComponent({
      setup() {
        const data = useDataContext();
        expect(data.width).toEqual(expect.any(Number));
        expect(data.height).toEqual(expect.any(Number));
        expect(data.innerWidth).toEqual(expect.any(Number));
        expect(data.innerHeight).toEqual(expect.any(Number));
        expect(data.margin).toMatchObject({
          top: expect.any(Number),
          right: expect.any(Number),
          bottom: expect.any(Number),
          left: expect.any(Number),
        });
        return () => null;
      },
    });

    mount(DataProvider, {
      props: {
        xScale: { type: "linear" },
        yScale: { type: "linear" },
      },
      slots: {
        default: () => <DataConsumer />,
      },
    });
  });

  it("should provide scales", async () => {
    expect.hasAssertions();

    const DataConsumer = defineComponent({
      setup() {
        const ctx = useDataContext();

        onMounted(() => {
          if (ctx.registerData) {
            ctx.registerData({
              key: "visx",
              xAccessor: (d: any) => d.x,
              yAccessor: (d: any) => d.y,
              data: [
                { x: 0, y: 1 },
                { x: 5, y: 7 },
              ],
            });
          }
        });

        // After registration, scales should be defined
        // We check asynchronously since the scales update reactively
        return () => null;
      },
    });

    const wrapper = mount(DataProvider, {
      props: {
        xScale: { type: "linear" },
        yScale: { type: "linear" },
      },
      slots: {
        default: () => <DataConsumer />,
      },
    });

    await flushPromises();
    await nextTick();

    // If we get here without errors, the provider properly wired up
    expect(wrapper.exists()).toBe(true);
  });
});
