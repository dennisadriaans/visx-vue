import { describe, test, expect, vi } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { Chord } from "../src";

const matrix = [
  [11975, 5871, 8916, 2868],
  [1951, 10048, 2060, 6171],
  [8010, 16145, 8090, 8045],
  [1013, 990, 940, 6907],
];

describe("<Chord />", () => {
  test("it should be defined", () => {
    expect(Chord).toBeDefined();
  });

  test("it should call children as a function with required args", () => {
    // DEVIATION: React uses render-prop children; Vue uses scoped default slot
    const slotFn = vi.fn(() => <g />);
    mount(Chord, {
      props: { matrix },
      slots: { default: slotFn },
    });
    expect(slotFn).toHaveBeenCalledTimes(1);
  });
});
